import { Skeleton, SkeletonRow } from "@/components/ui/skeleton";

export default function CustomersLoading() {
  return (
    <div className="p-6 md:p-8 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-10 w-64 rounded-lg" />
      <div className="card-elevated overflow-hidden">
        <div className="bg-muted/40 px-5 py-3 flex gap-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-16" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
      </div>
    </div>
  );
}
