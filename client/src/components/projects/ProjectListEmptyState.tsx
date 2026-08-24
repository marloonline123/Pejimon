import React from "react";
import { FolderOpen } from "lucide-react";

export function ProjectListEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] border rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
      <FolderOpen className="h-12 w-12 text-slate-400 mb-4" />
      <h3 className="text-lg font-medium">No projects found</h3>
      <p className="text-sm text-slate-500 mt-2 max-w-sm">
        We couldn't find any projects matching your criteria. Try adjusting your filters or create a new project.
      </p>
    </div>
  );
}
