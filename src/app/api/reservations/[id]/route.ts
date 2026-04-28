import { getCurrentBusiness } from "@/lib/tenant";
import {
  cancelReservation,
  getReservation,
  updateReservation,
  updateReservationStatus,
} from "@/server/reservations/service";
import { ReservationStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  const business = await getCurrentBusiness();
  const r = await getReservation({ businessId: business.id, id: ctx.params.id });
  if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ reservation: r });
}

const PatchBody = z.object({
  status: z.nativeEnum(ReservationStatus).optional(),
  startsAt: z.string().optional(),
  partySize: z.number().int().min(1).max(50).optional(),
  notes: z.string().optional(),
});

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const body = PatchBody.parse(await req.json());
  const business = await getCurrentBusiness();
  if (body.status) {
    const r = await updateReservationStatus({
      businessId: business.id,
      reservationId: ctx.params.id,
      status: body.status,
    });
    return NextResponse.json({ reservation: r });
  }
  const r = await updateReservation({
    businessId: business.id,
    reservationId: ctx.params.id,
    startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
    partySize: body.partySize,
    notes: body.notes,
  });
  return NextResponse.json({ reservation: r });
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const business = await getCurrentBusiness();
  const r = await cancelReservation({
    businessId: business.id,
    reservationId: ctx.params.id,
  });
  return NextResponse.json({ reservation: r });
}
