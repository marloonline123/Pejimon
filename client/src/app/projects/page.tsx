"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DataFilters } from "@/components/ui/data-filters";
import { ProjectListEmptyState } from "@/components/projects/ProjectListEmptyState";
import { ProjectListLoadingState } from "@/components/projects/ProjectListLoadingState";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { ProjectFormValues } from "@/components/projects/ProjectForm";
import { ProjectTableView } from "@/components/projects/ProjectViews";
import { Pagination } from "@/components/ui/pagination";
import { useFilters } from "@/hooks/useFilters";
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/state/api";
import { Project } from "@/types";

export default function ProjectsPage() {
  const {
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    debouncedSearch,
  } = useFilters();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | undefined>(
    undefined,
  );

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();



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

      <DataFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={[
          { value: "All", label: "All Statuses" },
          { value: "ToDo", label: "To Do" },
          { value: "WorkInProgress", label: "Work In Progress" },
          { value: "UnderReview", label: "Under Review" },
          { value: "Completed", label: "Completed" },
        ]}
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

          {meta && (
            <Pagination
              page={page}
              limit={meta.limit}
              total={meta.total}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
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
