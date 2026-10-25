import { Skeleton } from "@/components/ui/skeleton";

export function AuthCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-7 w-40" />
      <Skeleton className="mt-2 h-4 w-56" />
      <div className="mt-8 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
