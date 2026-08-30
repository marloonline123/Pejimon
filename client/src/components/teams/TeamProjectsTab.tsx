"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Search,
  FolderKanban,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  PauseCircle,
} from "lucide-react";
import { Project, ApiResponse } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "../ui/button";

interface TeamProjectsTabProps {
  projects: Project[];
  meta?: ApiResponse<any>["meta"];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  page: number;
  onPageChange: (page: number) => void;
}

function getStatusBadge(status: string) {
  switch (status.toUpperCase()) {
    case "ACTIVE":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </Badge>
      );
    case "PLANNING":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1"
        >
          <Clock className="w-3 h-3" />
          Planning
        </Badge>
      );
    case "ON_HOLD":
      return (
        <Badge
          variant="secondary"
          className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30 gap-1"
        >
          <PauseCircle className="w-3 h-3" />
          On Hold
        </Badge>
      );
    case "ARCHIVED":
      return (
        <Badge variant="outline" className="text-muted-foreground gap-1">
          <AlertCircle className="w-3 h-3" />
          Archived
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export function TeamProjectsTab({
  projects,
  meta,
  isLoading,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  page,
  onPageChange,
}: TeamProjectsTabProps) {
  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects by name or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            Status:
          </span>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[160px] h-10">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="PLANNING">Planning</SelectItem>
              <SelectItem value="ON_HOLD">On Hold</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table / Content */}
      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3">
              <div className="space-y-1.5">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3.5 w-72" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
            <FolderKanban className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No projects found
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== "All"
              ? "No team projects matched your search or status filter."
              : "This team is currently not assigned to any projects."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[320px]">Project Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead>Tasks</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => {
                const totalTasks = project.tasks?.length || 0;
                const completedTasks =
                  project.tasks?.filter(
                    (t) => t.status === "COMPLETED" || t.status === "Completed",
                  ).length || 0;

                return (
                  <TableRow
                    key={project.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell>
                      <div className="space-y-1">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="font-semibold text-foreground hover:text-rich-cerulean-500 flex items-center gap-1.5 group"
                        >
                          <span>{project.name}</span>
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-rich-cerulean-500" />
                        </Link>
                        {project.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>
                          {project.startDate
                            ? format(new Date(project.startDate), "MMM d")
                            : "TBD"}{" "}
                          –{" "}
                          {project.endDate
                            ? format(new Date(project.endDate), "MMM d, yyyy")
                            : "Ongoing"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium text-muted-foreground">
                        {totalTasks > 0 ? (
                          <span>
                            {completedTasks} / {totalTasks} done
                          </span>
                        ) : (
                          <span className="text-muted-foreground/60">
                            0 tasks
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs font-medium"
                      >
                        <Link href={`/projects/${project.slug}`}>Open</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {meta && (
        <Pagination
          page={page}
          limit={meta.limit}
          total={meta.total}
          totalPages={meta.totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
