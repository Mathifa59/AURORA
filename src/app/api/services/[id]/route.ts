import { getCurrentBusiness } from "@/lib/tenant";
import { deleteService, updateService } from "@/server/services/service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const Body = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  durationMinutes: z.number().int().min(5).max(8 * 60).optional(),
  capacity: z.number().int().min(1).max(500).optional(),
  priceCents: z.number().int().min(0).optional(),
  color: z.string().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const body = Body.parse(await req.json());
  const business = await getCurrentBusiness();
  const service = await updateService({
    businessId: business.id,
    id: ctx.params.id,
    data: body,
  });
  return NextResponse.json({ service });
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const business = await getCurrentBusiness();
  const service = await deleteService({ businessId: business.id, id: ctx.params.id });
  return NextResponse.json({ service });
}
