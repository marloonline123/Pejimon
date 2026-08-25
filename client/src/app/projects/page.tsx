"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { ProjectListEmptyState } from "@/components/projects/ProjectListEmptyState";
import { ProjectListLoadingState } from "@/components/projects/ProjectListLoadingState";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { ProjectFormValues } from "@/components/projects/ProjectForm";
import { ProjectTableView } from "@/components/projects/ProjectViews";
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/state/api";
import { Project } from "@/types";

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "All");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | undefined>(
    undefined,
  );

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

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

    const newQueryString = params.toString();
    if (newQueryString !== searchParams.toString()) {
      router.replace(`${pathname}?${newQueryString}`);
    }
  }, [debouncedSearch, statusFilter, page, pathname, router, searchParams]);

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

  const {
    data: projectsResponse,
    isLoading: isProjectsLoading,
  } = useGetProjectsQuery({
    search: debouncedSearch,
    status: statusFilter,
    page,
    limit: 10,
  });

  const projects = projectsResponse?.data || [];
  const meta = projectsResponse?.meta;

  const handleCreateOrUpdate = async (data: ProjectFormValues) => {
    if (projectToEdit) {
      await updateProject({ slug: projectToEdit.slug, project: data }).unwrap();
    } else {
      await createProject(data).unwrap();
    }
    setIsModalOpen(false);
    setProjectToEdit(undefined);
  };

  const handleEdit = (project: Project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (slug: string) => {
    await deleteProject(slug);
  };

  const openCreateModal = () => {
    setProjectToEdit(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your team&apos;s projects.
          </p>
        </div>
        <Button onClick={openCreateModal} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <ProjectFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">All Projects</h2>
        <div className="text-sm text-muted-foreground">
          {meta?.total || 0} {meta?.total === 1 ? "project" : "projects"} found
        </div>
      </div>

      {isProjectsLoading ? (
        <ProjectListLoadingState />
      ) : projects.length === 0 ? (
        <ProjectListEmptyState />
      ) : (
        <>
          <ProjectTableView
            projects={projects}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-muted-foreground">
                Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
                results
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

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={projectToEdit}
        onSubmit={handleCreateOrUpdate}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}
