import React, { useState } from "react";
import { Project } from "@/types";
import { format } from "date-fns";
import {
  MoreVertical,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  LayoutGrid,
  List,
  Table as TableIcon,
  GitCommit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ProjectViewsProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (projectSlug: string) => void;
}

const statusColors: Record<string, string> = {
  ToDo: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  WorkInProgress:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  UnderReview:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Completed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

function ProjectActions({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (slug: string) => void;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground outline-none">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(project)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project "{project.name}" and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                onDelete(project.slug);
                setDeleteDialogOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function ProjectBoardView({
  projects,
  onEdit,
  onDelete,
}: ProjectViewsProps) {
  const statuses = ["ToDo", "WorkInProgress", "UnderReview", "Completed"];

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {statuses.map((status) => {
        const statusProjects = projects.filter((p) => p.status === status);
        return (
          <div
            key={status}
            className="flex-1 min-w-[300px] bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-4 border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-medium",
                    statusColors[status] || statusColors["ToDo"],
                  )}
                >
                  {status}
                </span>
                <span className="text-muted-foreground text-sm">
                  ({statusProjects.length})
                </span>
              </h3>
            </div>

            <div className="space-y-4">
              {statusProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white dark:bg-slate-950 p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="font-medium hover:underline text-primary line-clamp-1"
                    >
                      {project.name}
                    </Link>
                    <ProjectActions
                      project={project}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-muted-foreground gap-4">
                    {project.startDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(project.startDate), "MMM d, yyyy")}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {statusProjects.length === 0 && (
                <div className="text-center p-4 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                  No projects
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ProjectListView({
  projects,
  onEdit,
  onDelete,
}: ProjectViewsProps) {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow"
        >
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <Link
                href={`/projects/${project.slug}`}
                className="text-lg font-semibold hover:underline text-primary"
              >
                {project.name}
              </Link>
              <div className="sm:hidden">
                <ProjectActions
                  project={project}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {project.description || "No description provided."}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-medium",
                  statusColors[project.status] || statusColors["ToDo"],
                )}
              >
                {project.status}
              </span>

              {(project.startDate || project.endDate) && (
                <div className="flex items-center text-muted-foreground gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {project.startDate
                      ? format(new Date(project.startDate), "MMM d, yyyy")
                      : "TBD"}{" "}
                    -{" "}
                    {project.endDate
                      ? format(new Date(project.endDate), "MMM d, yyyy")
                      : "TBD"}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="hidden sm:flex items-start">
            <ProjectActions
              project={project}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProjectTableView({
  projects,
  onEdit,
  onDelete,
}: ProjectViewsProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Start Date</TableHead>
            <TableHead className="hidden md:table-cell">End Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/projects/${project.slug}`}
                  className="hover:underline text-primary"
                >
                  {project.name}
                </Link>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
                    statusColors[project.status] || statusColors["ToDo"],
                  )}
                >
                  {project.status}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {project.startDate
                  ? format(new Date(project.startDate), "MMM d, yyyy")
                  : "-"}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {project.endDate
                  ? format(new Date(project.endDate), "MMM d, yyyy")
                  : "-"}
              </TableCell>
              <TableCell className="text-right">
                <ProjectActions
                  project={project}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ProjectTimelineView({
  projects,
  onEdit,
  onDelete,
}: ProjectViewsProps) {
  // Sort projects by start date for timeline view
  const sortedProjects = [...projects].sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  return (
    <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-6 pl-6 py-4 space-y-8">
      {sortedProjects.map((project, index) => (
        <div key={project.id} className="relative">
          {/* Timeline Node */}
          <div className="absolute -left-[35px] top-1.5 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />

          <div className="bg-card border rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-primary">
                    {project.startDate
                      ? format(new Date(project.startDate), "MMMM d, yyyy")
                      : "Date TBD"}
                  </span>
                  <span className="text-muted-foreground text-xs">&bull;</span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider",
                      statusColors[project.status] || statusColors["ToDo"],
                    )}
                  >
                    {project.status}
                  </span>
                </div>
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-xl font-semibold hover:underline"
                >
                  {project.name}
                </Link>
              </div>

              <ProjectActions
                project={project}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>

            {project.description && (
              <p className="text-muted-foreground text-sm mt-2">
                {project.description}
              </p>
            )}

            {project.endDate && (
              <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                <Clock className="h-4 w-4" />
                <span>
                  Due: {format(new Date(project.endDate), "MMMM d, yyyy")}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
