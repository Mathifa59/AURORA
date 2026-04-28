import { ReservationsTable } from "./reservations-table";
import { listReservations } from "@/server/reservations/service";
import { getCurrentBusiness } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  const business = await getCurrentBusiness();
  const reservations = await listReservations({ businessId: business.id, take: 200 });

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Reservas</h1>
        <p className="text-sm text-muted-foreground">
          Todas las reservas en orden cronológico.
        </p>
      </div>
      <ReservationsTable
        initialReservations={reservations.map((r) => ({
          id: r.id,
          customerName: r.customerName,
          customerPhone: r.customerPhone,
          serviceName: r.service.name,
          serviceColor: r.service.color,
          startsAt: r.startsAt.toISOString(),
          endsAt: r.endsAt.toISOString(),
          partySize: r.partySize,
          status: r.status,
          source: r.source,
        }))}
        locale={business.locale}
      />
    </div>
  );
}
