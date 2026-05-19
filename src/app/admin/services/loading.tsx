import { SkeletonCard } from "@/components/ui/skeleton";

export default function ServicesLoading() {
  return (
    <div className="p-6 md:p-8 space-y-4">
      <div className="h-7 w-24 rounded-md bg-muted animate-pulse" />
      <div className="flex justify-end">
        <div className="h-10 w-36 rounded-lg bg-muted animate-pulse" />
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}
