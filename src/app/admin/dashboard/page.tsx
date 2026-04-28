import { StatusBadge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { getCurrentBusiness } from "@/lib/tenant";
import { endOfDay, formatDateTime, formatMoney, startOfDay } from "@/lib/utils";
import {
  CalendarCheck,
  CalendarX,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const business = await getCurrentBusiness();

  const today = new Date();
  const start = startOfDay(today);
  const end = endOfDay(today);
  const weekFromNow = new Date(start);
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  const [todayCount, todayConfirmed, weekCount, todayRevenue, upcoming, totalCustomers] =
    await Promise.all([
      prisma.reservation.count({
        where: {
          businessId: business.id,
          startsAt: { gte: start, lte: end },
          status: { not: "CANCELLED" },
        },
      }),
      prisma.reservation.count({
        where: {
          businessId: business.id,
          startsAt: { gte: start, lte: end },
          status: "CONFIRMED",
        },
      }),
      prisma.reservation.count({
        where: {
          businessId: business.id,
          startsAt: { gte: start, lt: weekFromNow },
          status: { not: "CANCELLED" },
        },
      }),
      prisma.reservation.findMany({
        where: {
          businessId: business.id,
          startsAt: { gte: start, lte: end },
          status: { in: ["CONFIRMED", "ATTENDED"] },
        },
        include: { service: true },
      }),
      prisma.reservation.findMany({
        where: {
          businessId: business.id,
          startsAt: { gte: today },
          status: { in: ["PENDING", "CONFIRMED"] },
        },
        orderBy: { startsAt: "asc" },
        take: 8,
        include: { service: true },
      }),
      prisma.customer.count({ where: { businessId: business.id } }),
    ]);

  const revenue = todayRevenue.reduce((acc, r) => acc + r.service.priceCents, 0);

  const stats = [
    {
      label: "Reservas hoy",
      value: todayCount,
      icon: CalendarCheck,
      tone: "indigo",
    },
    {
      label: "Confirmadas",
      value: todayConfirmed,
      icon: CalendarX,
      tone: "emerald",
    },
    {
      label: "Esta semana",
      value: weekCount,
      icon: TrendingUp,
      tone: "violet",
    },
    {
      label: "Ingresos hoy",
      value: formatMoney(revenue, business.currency, business.locale),
      icon: TrendingUp,
      tone: "fuchsia",
    },
    {
      label: "Clientes",
      value: totalCustomers,
      icon: Users,
      tone: "sky",
    },
  ];

  const toneMap: Record<string, string> = {
    indigo: "from-indigo-500/15 to-indigo-500/5 text-indigo-600",
    emerald: "from-emerald-500/15 to-emerald-500/5 text-emerald-600",
    violet: "from-violet-500/15 to-violet-500/5 text-violet-600",
    fuchsia: "from-fuchsia-500/15 to-fuchsia-500/5 text-fuchsia-600",
    sky: "from-sky-500/15 to-sky-500/5 text-sky-600",
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Resumen de hoy y próximas reservas.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="card-elevated p-5">
            <div
              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${toneMap[s.tone]}`}
            >
              <s.icon className="h-4 w-4" />
            </div>
            <p className="mt-3 text-xs font-medium text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="card-elevated">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-semibold">Próximas reservas</h2>
            <p className="text-xs text-muted-foreground">Las siguientes 8 citas</p>
          </div>
          <Link
            href="/admin/reservations"
            className="text-xs font-medium text-primary hover:underline"
          >
            Ver todas →
          </Link>
        </div>
        <div className="divide-y divide-border">
          {upcoming.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              <Clock className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-3">No hay reservas próximas.</p>
            </div>
          ) : (
            upcoming.map((r) => (
              <div key={r.id} className="flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                <div
                  className="h-10 w-10 shrink-0 rounded-lg flex items-center justify-center font-semibold text-white"
                  style={{ backgroundColor: r.service.color }}
                >
                  {r.customerName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.customerName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {r.service.name} · {r.customerPhone ?? "Sin teléfono"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatDateTime(r.startsAt, business.locale)}</p>
                  <div className="mt-1">
                    <StatusBadge status={r.status} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
