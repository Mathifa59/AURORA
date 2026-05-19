import { getCurrentBusiness } from "@/lib/tenant";
import {
  ReservationError,
  createReservation,
  listReservations,
} from "@/server/reservations/service";
import { ReservationStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const business = await getCurrentBusiness();
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const status = searchParams.get("status");
  const reservations = await listReservations({
    businessId: business.id,
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
    status: status ? (status as ReservationStatus) : undefined,
  });
  return NextResponse.json({ reservations });
}

const CreateBody = z.object({
  serviceId: z.string(),
  startsAt: z.string(),
  partySize: z.number().int().min(1).max(50).optional(),
  notes: z.string().optional(),
  customer: z.object({
    name: z.string().min(2),
    phone: z.string().min(6).optional(),
    email: z.string().email().optional(),
  }),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof CreateBody>;
  try {
    body = CreateBody.parse(await req.json());
  } catch (e: any) {
    return NextResponse.json({ error: "Invalid request", details: e.errors }, { status: 400 });
  }

  try {
    const business = await getCurrentBusiness();
    const reservation = await createReservation({
      businessId: business.id,
      serviceId: body.serviceId,
      startsAt: new Date(body.startsAt),
      partySize: body.partySize,
      customer: body.customer,
      notes: body.notes,
      source: "WEB",
    });
    return NextResponse.json({ reservation }, { status: 201 });
  } catch (e: any) {
    if (e instanceof ReservationError) {
      return NextResponse.json({ error: e.message, code: e.code }, { status: 409 });
    }
    console.error("[/api/reservations] POST error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
