import { getCurrentBusiness } from "@/lib/tenant";
import { CustomersTable } from "./customers-table";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const business = await getCurrentBusiness();

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
        <p className="text-sm text-muted-foreground">
          Base de datos de clientes con historial de reservas.
        </p>
      </div>
      <CustomersTable locale={business.locale} />
    </div>
  );
}
