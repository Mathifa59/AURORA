import { prisma } from "@/lib/prisma";
import { formatMoney, isoDate, zonedTimeToUtc } from "@/lib/utils";
import {
  getAvailableSlots,
  suggestNextSlots,
} from "../availability/service";
import {
  ReservationError,
  cancelReservation as cancelReservationSvc,
  createReservation as createReservationSvc,
} from "../reservations/service";
import type { ChatCompletionTool } from "openai/resources/chat/completions";

/**
 * Tool catalog exposed to the model. Each tool has:
 *  - a JSON-Schema definition for OpenAI function calling
 *  - a server-side handler that runs with tenant scoping
 *
 * All handlers receive { businessId, sessionId } from the runtime —
 * the model never controls those.
 */

export const toolDefinitions: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "listarServicios",
      description:
        "Lista los servicios activos del negocio con duración, precio y descripción. Úsalo cuando el cliente pregunte qué servicios hay o no sepa cuál elegir.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "consultarDisponibilidad",
      description:
        "Devuelve horarios disponibles para un servicio. Si se pasa una fecha, devuelve los huecos de ese día. Si no se pasa fecha, sugiere los próximos huecos disponibles desde hoy.",
      parameters: {
        type: "object",
        properties: {
          servicio: {
            type: "string",
            description: "Nombre exacto o aproximado del servicio.",
          },
          fecha: {
            type: "string",
            description: "Fecha en formato YYYY-MM-DD. Opcional.",
          },
          personas: {
            type: "integer",
            description: "Número de personas / capacidad solicitada. Por defecto 1.",
            minimum: 1,
          },
        },
        required: ["servicio"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "crearReserva",
      description:
        "Crea una reserva. Requiere servicio, fecha+hora exactas, nombre del cliente y teléfono. Falla si el horario ya no está disponible.",
      parameters: {
        type: "object",
        properties: {
          servicio: { type: "string", description: "Nombre del servicio." },
          fechaHora: {
            type: "string",
            description: "Fecha y hora ISO local: YYYY-MM-DDTHH:mm. Ej: 2026-05-03T19:00",
          },
          nombre: { type: "string", description: "Nombre completo del cliente." },
          telefono: { type: "string", description: "Teléfono de contacto." },
          email: { type: "string", description: "Email del cliente. Opcional." },
          personas: { type: "integer", minimum: 1, description: "Personas. Default 1." },
          notas: { type: "string", description: "Notas o requerimientos especiales. Opcional." },
        },
        required: ["servicio", "fechaHora", "nombre", "telefono"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "cancelarReserva",
      description:
        "Cancela una reserva existente. Puedes buscar por teléfono del cliente (cancela su próxima reserva activa) o por reservaId si se conoce.",
      parameters: {
        type: "object",
        properties: {
          telefono: { type: "string", description: "Teléfono del cliente." },
          reservaId: { type: "string", description: "ID de la reserva (opcional)." },
          motivo: { type: "string", description: "Motivo de cancelación. Opcional." },
        },
        required: [],
        additionalProperties: false,
      },
    },
  },
];

type ToolContext = {
  businessId: string;
  sessionId: string;
};

type ToolHandler = (args: any, ctx: ToolContext) => Promise<unknown>;

async function findServiceByName(businessId: string, name: string) {
  const services = await prisma.service.findMany({
    where: { businessId, active: true },
  });
  const lower = name.trim().toLowerCase();
  return (
    services.find((s) => s.name.toLowerCase() === lower) ??
    services.find((s) => s.name.toLowerCase().includes(lower)) ??
    services.find((s) => lower.includes(s.name.toLowerCase()))
  );
}

const handlers: Record<string, ToolHandler> = {
  async listarServicios(_args, { businessId }) {
    const services = await prisma.service.findMany({
      where: { businessId, active: true },
      orderBy: { name: "asc" },
    });
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    return {
      services: services.map((s) => ({
        nombre: s.name,
        descripcion: s.description,
        duracionMin: s.durationMinutes,
        precio: formatMoney(s.priceCents, business?.currency, business?.locale),
        capacidad: s.capacity,
      })),
    };
  },

  async consultarDisponibilidad(args, { businessId }) {
    const service = await findServiceByName(businessId, args.servicio);
    if (!service) {
      return { error: `No encontré el servicio "${args.servicio}".` };
    }
    const partySize = args.personas ?? 1;

    if (args.fecha) {
      const slots = await getAvailableSlots({
        businessId,
        serviceId: service.id,
        date: args.fecha,
        partySize,
      });
      return {
        servicio: service.name,
        fecha: args.fecha,
        huecos: slots.map((s) => ({
          inicio: s.startsAt.toISOString(),
          etiqueta: s.label,
        })),
      };
    }

    const slots = await suggestNextSlots({
      businessId,
      serviceId: service.id,
      count: 6,
    });
    return {
      servicio: service.name,
      sugerencias: slots.map((s) => ({
        fecha: isoDate(s.startsAt),
        hora: s.label,
        inicio: s.startsAt.toISOString(),
      })),
    };
  },

  async crearReserva(args, { businessId }) {
    const service = await findServiceByName(businessId, args.servicio);
    if (!service) {
      return { error: `No encontré el servicio "${args.servicio}".` };
    }
    const business = await prisma.business.findUnique({ where: { id: businessId } });
    if (!business) return { error: "Negocio no encontrado." };
    let startsAt: Date;
    try {
      startsAt = zonedTimeToUtc(args.fechaHora, business.timezone);
    } catch {
      return { error: "La fecha/hora no es válida. Usa formato YYYY-MM-DDTHH:mm." };
    }
    if (Number.isNaN(startsAt.getTime())) {
      return { error: "La fecha/hora no es válida. Usa formato YYYY-MM-DDTHH:mm." };
    }

    try {
      const r = await createReservationSvc({
        businessId,
        serviceId: service.id,
        startsAt,
        partySize: args.personas ?? 1,
        customer: { name: args.nombre, phone: args.telefono, email: args.email },
        notes: args.notas,
        source: "AI_AGENT",
      });
      return {
        ok: true,
        reservaId: r.id,
        servicio: service.name,
        inicio: r.startsAt.toISOString(),
        fin: r.endsAt.toISOString(),
        estado: r.status,
      };
    } catch (e) {
      if (e instanceof ReservationError) {
        return { error: e.message, code: e.code };
      }
      throw e;
    }
  },

  async cancelarReserva(args, { businessId }) {
    let reservation;
    if (args.reservaId) {
      reservation = await prisma.reservation.findFirst({
        where: { id: args.reservaId, businessId },
      });
    } else if (args.telefono) {
      reservation = await prisma.reservation.findFirst({
        where: {
          businessId,
          customerPhone: args.telefono,
          status: { in: ["PENDING", "CONFIRMED"] },
          startsAt: { gte: new Date() },
        },
        orderBy: { startsAt: "asc" },
      });
    }
    if (!reservation) {
      return { error: "No encontré una reserva activa con esos datos." };
    }
    const updated = await cancelReservationSvc({
      businessId,
      reservationId: reservation.id,
      reason: args.motivo,
    });
    return { ok: true, reservaId: updated.id, estado: updated.status };
  },
};

export async function executeTool(
  name: string,
  args: any,
  ctx: ToolContext
): Promise<{ output: unknown; error?: string; durationMs: number }> {
  const started = Date.now();
  const handler = handlers[name];
  if (!handler) {
    return {
      output: { error: `Tool desconocida: ${name}` },
      error: "unknown_tool",
      durationMs: Date.now() - started,
    };
  }
  try {
    const output = await handler(args, ctx);
    const durationMs = Date.now() - started;
    await prisma.agentLog.create({
      data: {
        businessId: ctx.businessId,
        sessionId: ctx.sessionId,
        tool: name,
        input: args,
        output: output as any,
        status: "ok",
        durationMs,
      },
    });
    return { output, durationMs };
  } catch (e: any) {
    const durationMs = Date.now() - started;
    await prisma.agentLog.create({
      data: {
        businessId: ctx.businessId,
        sessionId: ctx.sessionId,
        tool: name,
        input: args,
        status: "error",
        error: String(e?.message ?? e),
        durationMs,
      },
    });
    return { output: { error: String(e?.message ?? e) }, error: "exception", durationMs };
  }
}
