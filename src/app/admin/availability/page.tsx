import { prisma } from "@/lib/prisma";
import { getCurrentBusiness } from "@/lib/tenant";
import { AvailabilityManager } from "./availability-manager";

export const dynamic = "force-dynamic";

export default async function AvailabilityPage() {
  const business = await getCurrentBusiness();
  const rules = await prisma.availabilityRule.findMany({
    where: { businessId: business.id },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Disponibilidad</h1>
        <p className="text-sm text-muted-foreground">
          Define los horarios de apertura por día. El motor sólo ofrece huecos dentro de estas franjas.
        </p>
      </div>
      <AvailabilityManager
        initial={rules.map((r) => ({
          id: r.id,
          dayOfWeek: r.dayOfWeek,
          startTime: r.startTime,
          endTime: r.endTime,
          active: r.active,
        }))}
      />
    </div>
  );
}
