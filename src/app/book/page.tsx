import { listServices } from "@/server/services/service";
import { getCurrentBusiness } from "@/lib/tenant";
import { BookWizard } from "./book-wizard";

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const business = await getCurrentBusiness();
  const services = await listServices(business.id, { onlyActive: true });

  return (
    <div className="animate-fade-in">
      <div className="mb-6 text-center sm:mb-10">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Reserva en{" "}
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            {business.name}
          </span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Elige tu servicio, selecciona fecha y hora, y confirma en segundos.
        </p>
      </div>

      <BookWizard
        services={services.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          durationMinutes: s.durationMinutes,
          priceCents: s.priceCents,
          color: s.color,
          capacity: s.capacity,
        }))}
        currency={business.currency}
        locale={business.locale}
      />
    </div>
  );
}
