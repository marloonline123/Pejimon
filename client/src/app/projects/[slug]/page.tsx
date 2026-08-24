"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  useGetProjectBySlugQuery,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/state/api";
import {
  Calendar,
  Clock,
  LayoutGrid,
  ArrowLeft,
  Plus,
  Kanban,
  List as ListIcon,
  Table as TableIcon,
  GitCommit,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskFilters } from "@/components/tasks/TaskFilters";
import {
  TaskBoardView,
  TaskListView,
  TaskTableView,
  TaskTimelineView,
} from "@/components/tasks/TaskViews";
import { TaskModal } from "@/components/tasks/TaskModal";
import { TaskFormValues } from "@/components/tasks/TaskForm";
import { Task } from "@/types";

const statusColors: Record<string, string> = {
  ToDo: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
  WorkInProgress:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  UnderReview:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Completed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

export default function SingleProjectPage() {
  const params = useParams();
  const slug = params.slug as string;

  // Project Data
  const {
    data: projectResponse,
    isLoading: isProjectLoading,
    isError,
  } = useGetProjectBySlugQuery(slug);
  const projectData = Array.isArray(projectResponse?.data)
    ? projectResponse?.data[0]
    : projectResponse?.data;

  // Task state
  const [activeTab, setActiveTab] = useState("board");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  // Mutations
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // Debounce search term to prevent rapid API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Tasks Query
  const { data: tasksResponse, isLoading: isTasksLoading } = useGetTasksQuery(
    {
      projectSlug: slug,
      search: debouncedSearch,
      status: statusFilter,
      page,
      limit: 20, // Using 20 as default limit for tasks for better view on board
    },
    { skip: !projectData },
  );

  const tasks = tasksResponse?.data || [];
  const meta = tasksResponse?.meta;

  const handleCreateOrUpdate = async (data: TaskFormValues) => {
    if (!projectData) return;

    const taskPayload = {
      ...data,
      projectId: projectData.id,
      authorId: 1, // Hardcoded for now
      assignedUserId: 1, // Hardcoded for now
    };

    if (taskToEdit) {
      await updateTask({ slug: taskToEdit.slug, task: taskPayload });
    } else {
      await createTask(taskPayload);
    }
    setIsModalOpen(false);
    setTaskToEdit(undefined);
  };

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (slug: string) => {
    await deleteTask(slug);
  };

  const openCreateModal = () => {
    setTaskToEdit(undefined);
    setIsModalOpen(true);
  };

  if (isProjectLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl space-y-8">
        <Skeleton className="h-8 w-24" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !projectData) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl text-center space-y-4">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <p className="text-muted-foreground">
          The project you are looking for does not exist or has been removed.
        </p>
        <Button variant="outline" className="-ms-4">
          <Link href="/projects" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span>Back to Projects</span>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <Button variant="ghost" className="mb-6 -ms-4">
        <Link href="/projects" className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span>Back to Projects</span>
        </Link>
      </Button>

      {/* Project Details Card */}
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

      {/* Tasks Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Tasks</h2>
        <TaskFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6 overflow-x-auto pb-2">
          <TabsList>
            <TabsTrigger value="board" className="flex items-center gap-2">
              <Kanban className="h-4 w-4" />
              <span className="hidden sm:inline">Board</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <ListIcon className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <TableIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Table</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <GitCommit className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
          </TabsList>

          <div className="text-sm text-muted-foreground whitespace-nowrap ml-4">
            {meta?.total || 0} {meta?.total === 1 ? "task" : "tasks"} found
          </div>
        </div>

        <div className="min-h-[400px]">
          {isTasksLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
              <Kanban className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-semibold mb-1">No tasks found</h3>
              <p className="text-muted-foreground mb-4">
                Create a task to get started.
              </p>
              <Button onClick={openCreateModal} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          ) : (
            <>
              <TabsContent value="board" className="mt-0">
                <TaskBoardView
                  tasks={tasks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </TabsContent>
              <TabsContent value="list" className="mt-0">
                <TaskListView
                  tasks={tasks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </TabsContent>
              <TabsContent value="table" className="mt-0">
                <TaskTableView
                  tasks={tasks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </TabsContent>
              <TabsContent value="timeline" className="mt-0">
                <TaskTimelineView
                  tasks={tasks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </TabsContent>

              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                    {Math.min(meta.page * meta.limit, meta.total)} of{" "}
                    {meta.total} results
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((p) => Math.min(meta.totalPages, p + 1))
                      }
                      disabled={page === meta.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Tabs>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={taskToEdit}
        onSubmit={handleCreateOrUpdate}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}
