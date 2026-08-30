"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Search,
  CheckSquare,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  Folder,
} from "lucide-react";
import { Task, TeamMember, ApiResponse } from "@/types";
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

interface TeamTasksTabProps {
  tasks: Task[];
  teamMembers?: TeamMember[];
  meta?: ApiResponse<any>["meta"];
  isLoading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  priorityFilter: string;
  onPriorityFilterChange: (value: string) => void;
  assigneeFilter: string;
  onAssigneeFilterChange: (value: string) => void;
  page: number;
  onPageChange: (page: number) => void;
}

function getTaskStatusBadge(status: string) {
  switch (status?.toUpperCase()) {
    case "COMPLETED":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </Badge>
      );
    case "IN_PROGRESS":
    case "WORKINPROGRESS":
      return (
        <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30 gap-1">
          <Clock className="w-3 h-3" />
          In Progress
        </Badge>
      );
    case "UNDER_REVIEW":
    case "UNDERREVIEW":
      return (
        <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30 gap-1">
          <Clock className="w-3 h-3" />
          Under Review
        </Badge>
      );
    case "TODO":
      return (
        <Badge variant="outline" className="bg-slate-500/10 text-slate-700 dark:text-slate-300 gap-1">
          To Do
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge variant="outline" className="text-muted-foreground line-through">
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getPriorityBadge(priority: string) {
  switch (priority?.toUpperCase()) {
    case "URGENT":
      return (
        <Badge variant="destructive" className="font-semibold text-xs">
          Urgent
        </Badge>
      );
    case "HIGH":
      return (
        <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 font-medium">
          High
        </Badge>
      );
    case "MEDIUM":
      return (
        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 font-medium">
          Medium
        </Badge>
      );
    case "LOW":
      return (
        <Badge variant="outline" className="text-muted-foreground font-medium">
          Low
        </Badge>
      );
    default:
      return <Badge variant="outline">{priority || "None"}</Badge>;
  }
}

export function TeamTasksTab({
  tasks,
  teamMembers = [],
  meta,
  isLoading,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  assigneeFilter,
  onAssigneeFilterChange,
  page,
  onPageChange,
}: TeamTasksTabProps) {
  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks by name or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              Status:
            </span>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-[130px] h-10">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="TODO">To Do</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              Priority:
            </span>
            <Select value={priorityFilter} onValueChange={onPriorityFilterChange}>
              <SelectTrigger className="w-[120px] h-10">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Member Assignee Filter */}
          {teamMembers.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                Assignee:
              </span>
              <Select value={assigneeFilter} onValueChange={onAssigneeFilterChange}>
                <SelectTrigger className="w-[140px] h-10">
                  <SelectValue placeholder="All Assignees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Members</SelectItem>
                  {teamMembers.map((m) => (
                    <SelectItem key={m.userId} value={m.userId}>
                      {m.user?.name || `User ${m.userId}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Table / Content */}
      {isLoading ? (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-20" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-3 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
            <CheckSquare className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No tasks found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== "All" || priorityFilter !== "All" || assigneeFilter !== "All"
              ? "No tasks matched your search and filter criteria."
              : "No tasks are currently assigned to this team's members."}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow>
                <TableHead className="w-[300px]">Task Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead className="text-right">Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => {
                const assignedUsers = task.taskAssignments?.map((ta) => ta.user).filter(Boolean) || [];

                return (
                  <TableRow key={task.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium text-foreground">
                          {task.name}
                        </div>
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.project ? (
                        <Link
                          href={`/projects/${task.project.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          <Folder className="h-3 w-3" />
                          <span>{task.project.name}</span>
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getTaskStatusBadge(task.status as string)}</TableCell>
                    <TableCell>{getPriorityBadge(task.priority as string)}</TableCell>
                    <TableCell>
                      {assignedUsers.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <div className="h-6 w-6 rounded-full bg-rich-cerulean-500/10 text-rich-cerulean-600 font-semibold text-[10px] flex items-center justify-center border border-rich-cerulean-500/20">
                            {assignedUsers[0]?.name?.[0]?.toUpperCase() || "U"}
                          </div>
                          <span className="text-xs text-foreground truncate max-w-[120px]">
                            {assignedUsers[0]?.name}
                            {assignedUsers.length > 1 && ` +${assignedUsers.length - 1}`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground/60 italic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">
                      {task.dueDate ? (
                        <div className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                        </div>
                      ) : (
                        "-"
                      )}
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
