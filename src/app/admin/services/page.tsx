import { listServices } from "@/server/services/service";
import { getCurrentBusiness } from "@/lib/tenant";
import { ServicesManager } from "./services-manager";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const business = await getCurrentBusiness();
  const services = await listServices(business.id);

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Servicios</h1>
        <p className="text-sm text-muted-foreground">
          Define qué reservan tus clientes, su duración y capacidad.
        </p>
      </div>
      <ServicesManager
        initial={services.map((s) => ({
          id: s.id,
          name: s.name,
          description: s.description,
          durationMinutes: s.durationMinutes,
          capacity: s.capacity,
          priceCents: s.priceCents,
          color: s.color,
          active: s.active,
        }))}
        currency={business.currency}
        locale={business.locale}
      />
    </div>
  );
}
