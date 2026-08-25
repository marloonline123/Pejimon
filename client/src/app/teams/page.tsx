"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataFilters } from "@/components/ui/data-filters";
import { TeamListEmptyState } from "@/components/teams/TeamListEmptyState";
import { TeamListLoadingState } from "@/components/teams/TeamListLoadingState";
import { TeamModal } from "@/components/teams/TeamModal";
import { TeamFormValues } from "@/components/teams/TeamForm";
import { TeamList } from "@/components/teams/TeamList";
import { Pagination } from "@/components/ui/pagination";
import { useFilters } from "@/hooks/useFilters";
import {
  useGetTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} from "@/state/api";
import { Team } from "@/types";

export default function TeamsPage() {
  const {
    page,
    setPage,
    searchTerm,
    setSearchTerm,
    debouncedSearch,
  } = useFilters();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState<Team | undefined>(undefined);

  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();
  const [deleteTeam] = useDeleteTeamMutation();

  const {
    data: teamsResponse,
    isLoading: isTeamsLoading,
  } = useGetTeamsQuery({
    search: debouncedSearch,
    page,
    limit: 10,
  });

  const teams = teamsResponse?.data || [];
  const meta = teamsResponse?.meta;

  const handleCreateOrUpdate = async (data: TeamFormValues) => {
    if (teamToEdit) {
      await updateTeam({ slug: teamToEdit.slug, team: data }).unwrap();
    } else {
      await createTeam(data).unwrap();
    }
    setIsModalOpen(false);
    setTeamToEdit(undefined);
  };

  const handleEdit = (team: Team) => {
    setTeamToEdit(team);
    setIsModalOpen(true);
  };

  const handleDelete = async (slug: string) => {
    await deleteTeam(slug);
  };

  const openCreateModal = () => {
    setTeamToEdit(undefined);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground mt-1">
            Manage your teams and assign managers.
          </p>
        </div>
        <Button onClick={openCreateModal} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          New Team
        </Button>
      </div>

      <DataFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter=""
        onStatusFilterChange={() => {}}
        showStatusFilter={false}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">All Teams</h2>
        <div className="text-sm text-muted-foreground">
          {meta?.total || 0} {meta?.total === 1 ? "team" : "teams"} found
        </div>
      </div>

      {isTeamsLoading ? (
        <TeamListLoadingState />
      ) : teams.length === 0 ? (
        <TeamListEmptyState />
      ) : (
        <>
          <TeamList
            teams={teams}
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

      <TeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={teamToEdit}
        onSubmit={handleCreateOrUpdate}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}
