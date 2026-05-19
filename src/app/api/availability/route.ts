import { getCurrentBusiness } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { getAvailableSlots } from "@/server/availability/service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const business = await getCurrentBusiness();
  const { searchParams } = new URL(req.url);
  const serviceId = searchParams.get("serviceId");
  const date = searchParams.get("date");

  if (serviceId && date) {
    const slots = await getAvailableSlots({
      businessId: business.id,
      serviceId,
      date,
    });
    return NextResponse.json({ slots });
  }

  const rules = await prisma.availabilityRule.findMany({
    where: { businessId: business.id },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
  return NextResponse.json({ rules });
}

const Body = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  active: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const body = Body.parse(await req.json());
  const business = await getCurrentBusiness();
  const rule = await prisma.availabilityRule.create({
    data: { businessId: business.id, ...body },
  });
  return NextResponse.json({ rule }, { status: 201 });
}
