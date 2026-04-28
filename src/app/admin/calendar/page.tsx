import { CalendarView } from "./calendar-view";
import { prisma } from "@/lib/prisma";
import { getCurrentBusiness } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: { week?: string };
}) {
  const business = await getCurrentBusiness();
  const baseDate = searchParams.week ? new Date(searchParams.week) : new Date();
  const weekStart = startOfWeek(baseDate);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const reservations = await prisma.reservation.findMany({
    where: {
      businessId: business.id,
      startsAt: { gte: weekStart, lt: weekEnd },
      status: { not: "CANCELLED" },
    },
    include: { service: true },
    orderBy: { startsAt: "asc" },
  });

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Calendario</h1>
        <p className="text-sm text-muted-foreground">
          Vista semanal de todas las reservas activas.
        </p>
      </div>
      <CalendarView
        weekStart={weekStart.toISOString()}
        events={reservations.map((r) => ({
          id: r.id,
          title: `${r.customerName} · ${r.service.name}`,
          color: r.service.color,
          startsAt: r.startsAt.toISOString(),
          endsAt: r.endsAt.toISOString(),
          status: r.status,
          phone: r.customerPhone,
        }))}
        locale={business.locale}
      />
    </div>
  );
}

function startOfWeek(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // Monday-start
  x.setDate(x.getDate() + diff);
  return x;
}
