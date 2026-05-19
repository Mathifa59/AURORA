import { prisma } from "@/lib/prisma";
import { getCurrentBusiness } from "@/lib/tenant";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET() {
  const business = await getCurrentBusiness();
  return NextResponse.json({ business });
}

const PatchBody = z.object({
  name: z.string().min(2).optional(),
  description: z.string().nullable().optional(),
  timezone: z.string().optional(),
  locale: z.string().optional(),
  currency: z.string().length(3).optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  address: z.string().nullable().optional(),
  brandColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export async function PATCH(req: NextRequest) {
  let body: z.infer<typeof PatchBody>;
  try {
    body = PatchBody.parse(await req.json());
  } catch (e: any) {
    return NextResponse.json({ error: "Invalid request", details: e.errors }, { status: 400 });
  }

  try {
    const business = await getCurrentBusiness();
    const updated = await prisma.business.update({
      where: { id: business.id },
      data: body,
    });
    return NextResponse.json({ business: updated });
  } catch (e: any) {
    console.error("[/api/business] PATCH error:", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
