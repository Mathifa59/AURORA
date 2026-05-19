import { LogoutButton } from "@/components/admin/logout-button";
import { MobileHeader } from "@/components/admin/mobile-header";
import { Sidebar } from "@/components/admin/sidebar";
import { getCurrentBusiness } from "@/lib/tenant";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [business, supabase] = await Promise.all([
    getCurrentBusiness().catch(() => null),
    createSupabaseServerClient(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const businessName = business?.name ?? "Sin configurar";
  const userEmail = user?.email ?? "";

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Desktop sidebar */}
      <Sidebar />

      <div className="flex flex-1 flex-col">
        {/* Mobile header (hamburger) */}
        <MobileHeader businessName={businessName} />

        {/* Desktop top bar */}
        <header className="hidden h-16 items-center justify-between border-b border-border bg-background px-6 md:flex">
          <div>
            <p className="text-xs text-muted-foreground">Negocio actual</p>
            <p className="text-sm font-semibold">{businessName}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="badge bg-emerald-50 text-emerald-700 ring-emerald-200">
              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Online
            </span>
            {userEmail && (
              <span className="text-xs text-muted-foreground hidden lg:block">
                {userEmail}
              </span>
            )}
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 bg-muted/10">{children}</main>
      </div>
    </div>
  );
}
