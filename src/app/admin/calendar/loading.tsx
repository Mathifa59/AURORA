import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarLoading() {
  return (
    <div className="p-6 md:p-8 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="card-elevated overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
        {/* Day headers */}
        <div className="grid grid-cols-8 border-b border-border">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="m-2 h-10 rounded-md" />
          ))}
        </div>
        {/* Hour grid */}
        <div className="h-[420px] bg-muted/10 animate-pulse" />
      </div>
    </div>
  );
}
