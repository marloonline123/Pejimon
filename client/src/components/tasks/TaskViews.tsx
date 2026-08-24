import React, { useState } from "react";
import { Task } from "@/types";
import { format } from "date-fns";
import { MoreVertical, Edit2, Trash2, Calendar, Clock } from "lucide-react";
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

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TaskViewsProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskSlug: string) => void;
}

const statusColors: Record<string, string> = {
  "ToDo": "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  "WorkInProgress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "UnderReview": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "Completed": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

const priorityColors: Record<string, string> = {
  "Urgent": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  "High": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  "Medium": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  "Low": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Backlog": "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
};

function TaskActions({ task, onEdit, onDelete }: { task: Task; onEdit: (t: Task) => void; onDelete: (slug: string) => void }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground outline-none">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(task)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-red-600 focus:text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task
              &quot;{task.name}&quot; and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                onDelete(task.slug);
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

export function TaskBoardView({ tasks, onEdit, onDelete }: TaskViewsProps) {
  const statuses = ["ToDo", "WorkInProgress", "UnderReview", "Completed"];
  
  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {statuses.map((status) => {
        const statusTasks = tasks.filter(t => t.status === status);
        return (
          <div key={status} className="flex-1 min-w-[300px] bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-4 border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", statusColors[status] || statusColors["ToDo"])}>
                  {status}
                </span>
                <span className="text-muted-foreground text-sm">({statusTasks.length})</span>
              </h3>
            </div>
            
            <div className="space-y-4">
              {statusTasks.map((task) => (
                <div key={task.id} className="bg-white dark:bg-slate-950 p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-primary line-clamp-1 cursor-pointer hover:underline" onClick={() => onEdit(task)}>
                      {task.name}
                    </span>
                    <TaskActions task={task} onEdit={onEdit} onDelete={onDelete} />
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="outline" className={cn("border-none", priorityColors[task.priority] || priorityColors["Medium"])}>
                      {task.priority}
                    </Badge>
                    {task.points && (
                      <Badge variant="outline">{task.points} pts</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center text-xs text-muted-foreground gap-4">
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {statusTasks.length === 0 && (
                <div className="text-center p-4 border-2 border-dashed rounded-lg text-muted-foreground text-sm">
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function TaskListView({ tasks, onEdit, onDelete }: TaskViewsProps) {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border bg-card hover:shadow-sm transition-shadow">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold cursor-pointer hover:underline text-primary" onClick={() => onEdit(task)}>
                {task.name}
              </span>
              <div className="sm:hidden">
                <TaskActions task={task} onEdit={onEdit} onDelete={onDelete} />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {task.description || "No description provided."}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", statusColors[task.status] || statusColors["ToDo"])}>
                {task.status}
              </span>
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", priorityColors[task.priority] || priorityColors["Medium"])}>
                {task.priority}
              </span>
              
              {(task.startDate || task.dueDate) && (
                <div className="flex items-center text-muted-foreground gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {task.startDate ? format(new Date(task.startDate), "MMM d") : "TBD"} - {" "}
                    {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "TBD"}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="hidden sm:flex items-start">
            <TaskActions task={task} onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TaskTableView({ tasks, onEdit, onDelete }: TaskViewsProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="hidden md:table-cell">Due Date</TableHead>
            <TableHead className="hidden md:table-cell">Points</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">
                <span className="cursor-pointer hover:underline text-primary" onClick={() => onEdit(task)}>
                  {task.name}
                </span>
              </TableCell>
              <TableCell>
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap", statusColors[task.status] || statusColors["ToDo"])}>
                  {task.status}
                </span>
              </TableCell>
              <TableCell>
                <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap", priorityColors[task.priority] || priorityColors["Medium"])}>
                  {task.priority}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "-"}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground">
                {task.points || "-"}
              </TableCell>
              <TableCell className="text-right">
                <TaskActions task={task} onEdit={onEdit} onDelete={onDelete} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function TaskTimelineView({ tasks, onEdit, onDelete }: TaskViewsProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  return (
    <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-6 pl-6 py-4 space-y-8">
      {sortedTasks.map((task) => (
        <div key={task.id} className="relative">
          <div className="absolute -left-[35px] top-1.5 h-4 w-4 rounded-full bg-primary ring-4 ring-background" />
          
          <div className="bg-card border rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-primary">
                    {task.startDate ? format(new Date(task.startDate), "MMMM d, yyyy") : "Date TBD"}
                  </span>
                  <span className="text-muted-foreground text-xs">&bull;</span>
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider", statusColors[task.status] || statusColors["ToDo"])}>
                    {task.status}
                  </span>
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider", priorityColors[task.priority] || priorityColors["Medium"])}>
                    {task.priority}
                  </span>
                </div>
                <span className="text-xl font-semibold cursor-pointer hover:underline" onClick={() => onEdit(task)}>
                  {task.name}
                </span>
              </div>
              
              <TaskActions task={task} onEdit={onEdit} onDelete={onDelete} />
            </div>
            
            {task.description && (
              <p className="text-muted-foreground text-sm mt-2">
                {task.description}
              </p>
            )}
            
            {task.dueDate && (
              <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                <Clock className="h-4 w-4" />
                <span>Due: {format(new Date(task.dueDate), "MMMM d, yyyy")}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
