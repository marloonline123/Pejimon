import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function TeamListLoadingState() {
  return (
    <div className="space-y-4">
      {/* Table header skeleton */}
      <div className="flex gap-4 p-4 border rounded-t-lg bg-muted/20">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-[120px]" />
        <Skeleton className="h-6 w-[70px] ml-auto" />
      </div>

      {/* Table rows skeleton */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex gap-4 p-4 border-x border-b first:border-t-0 last:rounded-b-lg items-center"
        >
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-[120px]" />
          <div className="ml-auto">
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
