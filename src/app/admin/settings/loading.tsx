import { SkeletonCard } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div className="space-y-1">
        <div className="h-7 w-48 rounded-lg bg-muted animate-pulse" />
        <div className="h-4 w-72 rounded-lg bg-muted animate-pulse" />
      </div>
      <SkeletonCard className="h-52" />
      <SkeletonCard className="h-44" />
      <SkeletonCard className="h-40" />
    </div>
  );
}
