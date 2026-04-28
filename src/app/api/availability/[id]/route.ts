import { prisma } from "@/lib/prisma";
import { getCurrentBusiness } from "@/lib/tenant";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const Body = z.object({
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  active: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, ctx: { params: { id: string } }) {
  const body = Body.parse(await req.json());
  const business = await getCurrentBusiness();
  const found = await prisma.availabilityRule.findFirst({
    where: { id: ctx.params.id, businessId: business.id },
  });
  if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const rule = await prisma.availabilityRule.update({
    where: { id: ctx.params.id },
    data: body,
  });
  return NextResponse.json({ rule });
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const business = await getCurrentBusiness();
  const found = await prisma.availabilityRule.findFirst({
    where: { id: ctx.params.id, businessId: business.id },
  });
  if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.availabilityRule.delete({ where: { id: ctx.params.id } });
  return NextResponse.json({ ok: true });
}
