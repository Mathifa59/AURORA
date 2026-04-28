import { Sidebar } from "@/components/admin/sidebar";
import { getCurrentBusiness } from "@/lib/tenant";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const business = await getCurrentBusiness().catch(() => null);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <div>
            <p className="text-xs text-muted-foreground">Negocio actual</p>
            <p className="text-sm font-semibold">{business?.name ?? "Sin configurar"}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge bg-emerald-50 text-emerald-700 ring-emerald-200">
              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Online
            </span>
          </div>
        </header>
        <main className="flex-1 bg-muted/10">{children}</main>
      </div>
    </div>
  );
}
