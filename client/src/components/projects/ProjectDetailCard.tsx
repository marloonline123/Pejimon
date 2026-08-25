import { Calendar, LayoutGrid, Plus } from "lucide-react";
import { format } from "date-fns";

import React from "react";
import { Button } from "../ui/button";
import { Project } from "@/types";

type Props = {
  projectData: Project;
  openCreateModal: () => void;
};

const statusColors: Record<string, string> = {
  ToDo: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  WorkInProgress:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  UnderReview:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Completed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

export default function ProjectDetailCard({
  projectData,
  openCreateModal,
}: Props) {
  return (
    <div className="bg-card border rounded-xl p-6 sm:p-8 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${statusColors[projectData.status] || statusColors["ToDo"]}`}
            >
              {projectData.status}
            </span>
            <span className="text-muted-foreground text-sm flex items-center gap-1">
              <LayoutGrid className="h-4 w-4" />
              Project
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {projectData.name}
          </h1>
        </div>
        <Button onClick={openCreateModal} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-6">
        <div className="md:col-span-2">
          <p className="text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
            {projectData.description ||
              "No description provided for this project."}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Timeline</p>
                <p className="text-muted-foreground text-xs">
                  {projectData.startDate
                    ? format(new Date(projectData.startDate), "MMM d, yyyy")
                    : "Not set"}
                  {" - "}
                  {projectData.endDate
                    ? format(new Date(projectData.endDate), "MMM d, yyyy")
                    : "Not set"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
