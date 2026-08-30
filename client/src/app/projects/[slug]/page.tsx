"use client";

import React, { useState, useEffect } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import {
  useGetProjectBySlugQuery,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/state/api";
import {
  ArrowLeft,
  Plus,
  Kanban,
  List as ListIcon,
  Table as TableIcon,
  GitCommit,
} from "lucide-react";
import Link from "next/link";
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
import ProjectDetailCard from "@/components/projects/ProjectDetailCard";

export default function SingleProjectPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

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
  const [activeTab, setActiveTab] = useState(
    searchParams.get("view") || "board",
  );
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "All",
  );
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  // Mutations
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // Sync state to URL whenever it changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    if (statusFilter !== "All") {
      params.set("status", statusFilter);
    } else {
      params.delete("status");
    }

    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }

    if (activeTab !== "board") {
      params.set("view", activeTab);
    } else {
      params.delete("view");
    }

    const newQueryString = params.toString();
    if (newQueryString !== searchParams.toString()) {
      router.replace(`${pathname}?${newQueryString}`);
    }
  }, [
    debouncedSearch,
    statusFilter,
    page,
    activeTab,
    pathname,
    router,
    searchParams,
  ]);

  // Debounce search term to prevent rapid API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== debouncedSearch) {
        setPage(1); // Reset to page 1 on new search
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, debouncedSearch]);

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
    const taskPayload = {
      ...data,
      projectId: projectData.id,
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
      <ProjectDetailCard
        projectData={projectData}
        openCreateModal={openCreateModal}
      />

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
