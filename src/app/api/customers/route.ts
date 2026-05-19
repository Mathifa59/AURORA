import { prisma } from "@/lib/prisma";
import { getCurrentBusiness } from "@/lib/tenant";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const business = await getCurrentBusiness();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  const customers = await prisma.customer.findMany({
    where: {
      businessId: business.id,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { phone: { contains: q } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      _count: { select: { reservations: true } },
      reservations: {
        where: { status: { in: ["PENDING", "CONFIRMED"] }, startsAt: { gte: new Date() } },
        orderBy: { startsAt: "asc" },
        take: 1,
        select: { startsAt: true, service: { select: { name: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ customers });
}
