import { getCurrentBusiness } from "@/lib/tenant";
import { createService, listServices } from "@/server/services/service";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const business = await getCurrentBusiness();
  const onlyActive = new URL(req.url).searchParams.get("active") === "true";
  const services = await listServices(business.id, { onlyActive });
  return NextResponse.json({ services });
}

const Body = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  durationMinutes: z.number().int().min(5).max(8 * 60),
  capacity: z.number().int().min(1).max(500),
  priceCents: z.number().int().min(0),
  color: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = Body.parse(await req.json());
  const business = await getCurrentBusiness();
  const service = await createService({ businessId: business.id, ...body });
  return NextResponse.json({ service }, { status: 201 });
}
