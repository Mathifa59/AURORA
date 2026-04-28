import { prisma } from "@/lib/prisma";
import { addMinutes } from "@/lib/utils";
import { ReservationSource, ReservationStatus } from "@prisma/client";
import { isSlotAvailable } from "../availability/service";

export class ReservationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
  }
}

export type CreateReservationInput = {
  businessId: string;
  serviceId: string;
  startsAt: Date;
  partySize?: number;
  customer: {
    name: string;
    phone?: string;
    email?: string;
  };
  notes?: string;
  source?: ReservationSource;
};

export async function createReservation(input: CreateReservationInput) {
  const { businessId, serviceId, startsAt, partySize = 1, customer, notes } = input;

  const service = await prisma.service.findFirst({
    where: { id: serviceId, businessId, active: true },
  });
  if (!service) {
    throw new ReservationError("Servicio no encontrado o inactivo.", "SERVICE_NOT_FOUND");
  }

  const endsAt = addMinutes(startsAt, service.durationMinutes);

  const ok = await isSlotAvailable({
    businessId,
    serviceId,
    startsAt,
    endsAt,
    partySize,
  });
  if (!ok) {
    throw new ReservationError(
      "Ese horario ya no está disponible. Por favor elige otro.",
      "SLOT_UNAVAILABLE"
    );
  }

  // Upsert customer by phone (if provided) for the tenant
  let customerId: string | undefined;
  if (customer.phone) {
    const existing = await prisma.customer.findUnique({
      where: { businessId_phone: { businessId, phone: customer.phone } },
    });
    if (existing) {
      customerId = existing.id;
      if (existing.name !== customer.name || (customer.email && existing.email !== customer.email)) {
        await prisma.customer.update({
          where: { id: existing.id },
          data: { name: customer.name, email: customer.email ?? existing.email },
        });
      }
    } else {
      const created = await prisma.customer.create({
        data: {
          businessId,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
        },
      });
      customerId = created.id;
    }
  }

  const reservation = await prisma.reservation.create({
    data: {
      businessId,
      serviceId,
      customerId,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      startsAt,
      endsAt,
      partySize,
      status: "PENDING",
      source: input.source ?? "WEB",
      notes,
    },
    include: { service: true },
  });

  return reservation;
}

export async function cancelReservation(params: {
  businessId: string;
  reservationId: string;
  reason?: string;
}) {
  const { businessId, reservationId, reason } = params;
  const r = await prisma.reservation.findFirst({
    where: { id: reservationId, businessId },
  });
  if (!r) throw new ReservationError("Reserva no encontrada.", "NOT_FOUND");
  if (r.status === "CANCELLED") return r;

  return prisma.reservation.update({
    where: { id: reservationId },
    data: {
      status: "CANCELLED",
      notes: reason ? `${r.notes ? r.notes + "\n" : ""}Cancelada: ${reason}` : r.notes,
    },
  });
}

export async function updateReservationStatus(params: {
  businessId: string;
  reservationId: string;
  status: ReservationStatus;
}) {
  const r = await prisma.reservation.findFirst({
    where: { id: params.reservationId, businessId: params.businessId },
  });
  if (!r) throw new ReservationError("Reserva no encontrada.", "NOT_FOUND");
  return prisma.reservation.update({
    where: { id: params.reservationId },
    data: { status: params.status },
  });
}

export async function updateReservation(params: {
  businessId: string;
  reservationId: string;
  startsAt?: Date;
  partySize?: number;
  notes?: string;
}) {
  const { businessId, reservationId, startsAt, partySize, notes } = params;
  const r = await prisma.reservation.findFirst({
    where: { id: reservationId, businessId },
    include: { service: true },
  });
  if (!r) throw new ReservationError("Reserva no encontrada.", "NOT_FOUND");

  let endsAt = r.endsAt;
  if (startsAt) {
    endsAt = addMinutes(startsAt, r.service.durationMinutes);
    const ok = await isSlotAvailable({
      businessId,
      serviceId: r.serviceId,
      startsAt,
      endsAt,
      partySize: partySize ?? r.partySize,
    });
    if (!ok) {
      throw new ReservationError("Ese horario no está disponible.", "SLOT_UNAVAILABLE");
    }
  }

  return prisma.reservation.update({
    where: { id: reservationId },
    data: {
      startsAt: startsAt ?? r.startsAt,
      endsAt,
      partySize: partySize ?? r.partySize,
      notes: notes ?? r.notes,
    },
  });
}

export async function listReservations(params: {
  businessId: string;
  from?: Date;
  to?: Date;
  status?: ReservationStatus;
  take?: number;
}) {
  const { businessId, from, to, status, take = 100 } = params;
  return prisma.reservation.findMany({
    where: {
      businessId,
      ...(status ? { status } : {}),
      ...(from || to
        ? {
            startsAt: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    },
    include: { service: true },
    orderBy: { startsAt: "asc" },
    take,
  });
}

export async function getReservation(params: { businessId: string; id: string }) {
  return prisma.reservation.findFirst({
    where: { id: params.id, businessId: params.businessId },
    include: { service: true, customer: true },
  });
}
