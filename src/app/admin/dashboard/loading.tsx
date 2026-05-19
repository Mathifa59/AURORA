import { SkeletonRow, SkeletonStat } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="space-y-2">
        <div className="h-7 w-32 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-48 rounded-md bg-muted animate-pulse" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => <SkeletonStat key={i} />)}
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <div className="h-5 w-36 rounded-md bg-muted animate-pulse" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
      </div>
    </div>
  );
}
