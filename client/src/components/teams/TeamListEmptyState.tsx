import React from "react";
import { Users } from "lucide-react";

export function TeamListEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg border-dashed bg-card/50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
        <Users className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No teams found</h3>
      <p className="text-muted-foreground max-w-sm">
        We couldn't find any teams matching your current filters. Try adjusting
        your search or create a new team.
      </p>
    </div>
  );
}
