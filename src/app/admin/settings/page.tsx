import { getCurrentBusiness } from "@/lib/tenant";
import { SettingsForm } from "./settings-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ajustes — Reservalo" };

export default async function SettingsPage() {
  const business = await getCurrentBusiness();

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Ajustes del negocio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edita el nombre, zona horaria, moneda y datos de contacto.
        </p>
      </div>

      <SettingsForm
        business={{
          id: business.id,
          name: business.name,
          description: business.description ?? "",
          timezone: business.timezone,
          locale: business.locale,
          currency: business.currency,
          phone: business.phone ?? "",
          email: business.email ?? "",
          address: business.address ?? "",
          brandColor: business.brandColor,
        }}
      />
    </div>
  );
}
