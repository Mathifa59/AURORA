import { prisma } from "@/lib/prisma";
import { getCurrentBusiness } from "@/lib/tenant";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone")?.trim();

  if (!phone || phone.length < 6) {
    return NextResponse.json(
      { error: "Ingresa un número de teléfono válido (mínimo 6 dígitos)." },
      { status: 400 }
    );
  }

  try {
    const business = await getCurrentBusiness();

    // Find customer by phone (partial match to handle formatting differences)
    const customer = await prisma.customer.findFirst({
      where: {
        businessId: business.id,
        phone: { contains: phone.replace(/\s|-/g, "") },
      },
    });

    if (!customer) {
      return NextResponse.json({ reservations: [] });
    }

    const reservations = await prisma.reservation.findMany({
      where: { customerId: customer.id, businessId: business.id },
      include: {
        service: {
          select: {
            name: true,
            color: true,
            durationMinutes: true,
            priceCents: true,
          },
        },
      },
      orderBy: { startsAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ reservations });
  } catch (e: any) {
    console.error("[/api/mis-reservas] GET error:", e);
    return NextResponse.json({ error: "Error interno." }, { status: 500 });
  }
}
