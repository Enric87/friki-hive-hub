import { Skeleton } from "@/components/ui/skeleton";

interface StateSkeletonProps {
  count?: number;
  type?: "card" | "row";
}

const StateSkeleton = ({ count = 3, type = "card" }: StateSkeletonProps) => (
  <div className="space-y-3 animate-fade-in">
    {Array.from({ length: count }).map((_, i) =>
      type === "card" ? (
        <div key={i} className="bg-card rounded-xl p-4 border border-border/50 space-y-3">
          <div className="flex gap-3">
            <Skeleton className="w-16 h-16 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>
          </div>
        </div>
      ) : (
        <div key={i} className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border/50">
          <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      )
    )}
  </div>
);

export default StateSkeleton;
