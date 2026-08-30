"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  useParams,
  useRouter,
  useSearchParams,
  usePathname,
} from "next/navigation";
import {
  Users2,
  FolderKanban,
  CheckSquare,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  useGetTeamBySlugQuery,
  useGetTeamMembersQuery,
  useGetTeamProjectsQuery,
  useGetTeamTasksQuery,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} from "@/state/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamDetailHeader } from "@/components/teams/TeamDetailHeader";
import { TeamMembersTab } from "@/components/teams/TeamMembersTab";
import { TeamProjectsTab } from "@/components/teams/TeamProjectsTab";
import { TeamTasksTab } from "@/components/teams/TeamTasksTab";
import { TeamModal } from "@/components/teams/TeamModal";
import { TeamFormValues } from "@/components/teams/TeamForm";
import { toast } from "@/components/ui/toast";

export default function TeamDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  // Tab State
  const activeTab = searchParams.get("tab") || "members";

  // Members Tab State
  const membersPage = Number(searchParams.get("membersPage")) || 1;
  const membersSearch = searchParams.get("membersSearch") || "";
  const membersRole = searchParams.get("membersRole") || "All";

  // Projects Tab State
  const projectsPage = Number(searchParams.get("projectsPage")) || 1;
  const projectsSearch = searchParams.get("projectsSearch") || "";
  const projectsStatus = searchParams.get("projectsStatus") || "All";

  // Tasks Tab State
  const tasksPage = Number(searchParams.get("tasksPage")) || 1;
  const tasksSearch = searchParams.get("tasksSearch") || "";
  const tasksStatus = searchParams.get("tasksStatus") || "All";
  const tasksPriority = searchParams.get("tasksPriority") || "All";
  const tasksAssignee = searchParams.get("tasksAssignee") || "All";

  // Local search inputs for debouncing
  const [localMembersSearch, setLocalMembersSearch] = useState(membersSearch);
  const [localProjectsSearch, setLocalProjectsSearch] = useState(projectsSearch);
  const [localTasksSearch, setLocalTasksSearch] = useState(tasksSearch);

  // Edit Team modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Queries
  const {
    data: teamResponse,
    isLoading: isTeamLoading,
    isError: isTeamError,
    refetch: refetchTeam,
  } = useGetTeamBySlugQuery(slug, { skip: !slug });
  const team = teamResponse?.data;

  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();

  // Tab Queries
  const {
    data: membersResponse,
    isLoading: isMembersLoading,
  } = useGetTeamMembersQuery(
    {
      teamSlug: slug,
      search: membersSearch || undefined,
      role: membersRole,
      page: membersPage,
      limit: 10,
    },
    { skip: !team || activeTab !== "members" },
  );

  const {
    data: projectsResponse,
    isLoading: isProjectsLoading,
  } = useGetTeamProjectsQuery(
    {
      teamSlug: slug,
      search: projectsSearch || undefined,
      status: projectsStatus,
      page: projectsPage,
      limit: 10,
    },
    { skip: !team || activeTab !== "projects" },
  );

  const {
    data: tasksResponse,
    isLoading: isTasksLoading,
  } = useGetTeamTasksQuery(
    {
      teamSlug: slug,
      search: tasksSearch || undefined,
      status: tasksStatus,
      priority: tasksPriority,
      userId: tasksAssignee,
      page: tasksPage,
      limit: 10,
    },
    { skip: !team || activeTab !== "tasks" },
  );

  // Helper to update URL params cleanly
  const updateUrlParams = (updates: Record<string, string | number | null>) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "" || value === "All") {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    const newQueryString = nextParams.toString();
    startTransition(() => {
      router.replace(`${pathname}${newQueryString ? `?${newQueryString}` : ""}`, {
        scroll: false,
      });
    });
  };

  // Debounced search for Members
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localMembersSearch !== membersSearch) {
        updateUrlParams({
          membersSearch: localMembersSearch,
          membersPage: 1,
        });
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [localMembersSearch, membersSearch]);

  // Debounced search for Projects
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localProjectsSearch !== projectsSearch) {
        updateUrlParams({
          projectsSearch: localProjectsSearch,
          projectsPage: 1,
        });
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [localProjectsSearch, projectsSearch]);

  // Debounced search for Tasks
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localTasksSearch !== tasksSearch) {
        updateUrlParams({
          tasksSearch: localTasksSearch,
          tasksPage: 1,
        });
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [localTasksSearch, tasksSearch]);

  // Handle Tab Switch
  const handleTabChange = (newTab: string) => {
    updateUrlParams({ tab: newTab === "members" ? null : newTab });
  };

  // Handle Edit Team
  const handleUpdateTeam = async (formData: TeamFormValues) => {
    if (!team) return;
    try {
      await updateTeam({
        slug: team.slug,
        team: formData,
      }).unwrap();
      toast.add({
        type: "success",
        description: `Team "${formData.name}" updated successfully!`,
      });
      setIsEditModalOpen(false);
      refetchTeam();
    } catch (err: any) {
      toast.add({
        type: "error",
        description: err?.data?.message || "Failed to update team.",
      });
    }
  };

  // Handle Delete Team
  const handleDeleteTeam = async (teamSlug: string) => {
    try {
      await deleteTeam(teamSlug).unwrap();
      toast.add({
        type: "success",
        description: "Team deleted successfully.",
      });
    } catch (err: any) {
      toast.add({
        type: "error",
        description: err?.data?.message || "Failed to delete team.",
      });
    }
  };

  if (isTeamLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-12 w-80 rounded-lg" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isTeamError || !team) {
    return (
      <div className="container mx-auto py-16 px-4 max-w-7xl text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Team not found</h1>
        <p className="text-muted-foreground">
          The team you are looking for does not exist or has been removed.
        </p>
        <Button variant="outline" className="mt-2">
          <Link href="/teams" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Teams</span>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header Banner & Stats */}
      <TeamDetailHeader
        team={team}
        totalMembers={membersResponse?.meta?.total ?? team.teamMembers?.length}
        totalProjects={projectsResponse?.meta?.total}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={handleDeleteTeam}
        isDeleting={isDeleting}
      />

      {/* Tabs Navigation Section */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full space-y-6"
      >
        <div className="border-b border-border/80 pb-px">
          <TabsList className="bg-muted/60 p-1 rounded-xl h-11">
            <TabsTrigger
              value="members"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <Users2 className="h-4 w-4" />
              <span>Users / Members</span>
              {membersResponse?.meta?.total !== undefined && (
                <span className="ml-1 text-xs bg-muted-foreground/15 px-1.5 py-0.5 rounded-full font-semibold">
                  {membersResponse.meta.total}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="projects"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <FolderKanban className="h-4 w-4" />
              <span>Projects</span>
              {projectsResponse?.meta?.total !== undefined && (
                <span className="ml-1 text-xs bg-muted-foreground/15 px-1.5 py-0.5 rounded-full font-semibold">
                  {projectsResponse.meta.total}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="tasks"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <CheckSquare className="h-4 w-4" />
              <span>Assigned Tasks</span>
              {tasksResponse?.meta?.total !== undefined && (
                <span className="ml-1 text-xs bg-muted-foreground/15 px-1.5 py-0.5 rounded-full font-semibold">
                  {tasksResponse.meta.total}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Members */}
        <TabsContent value="members" className="focus-visible:outline-none focus-visible:ring-0">
          <TeamMembersTab
            members={membersResponse?.data || []}
            meta={membersResponse?.meta}
            isLoading={isMembersLoading}
            searchTerm={localMembersSearch}
            onSearchChange={setLocalMembersSearch}
            roleFilter={membersRole}
            onRoleFilterChange={(role) =>
              updateUrlParams({ membersRole: role, membersPage: 1 })
            }
            page={membersPage}
            onPageChange={(page) => updateUrlParams({ membersPage: page })}
          />
        </TabsContent>

        {/* Tab 2: Projects */}
        <TabsContent value="projects" className="focus-visible:outline-none focus-visible:ring-0">
          <TeamProjectsTab
            projects={projectsResponse?.data || []}
            meta={projectsResponse?.meta}
            isLoading={isProjectsLoading}
            searchTerm={localProjectsSearch}
            onSearchChange={setLocalProjectsSearch}
            statusFilter={projectsStatus}
            onStatusFilterChange={(status) =>
              updateUrlParams({ projectsStatus: status, projectsPage: 1 })
            }
            page={projectsPage}
            onPageChange={(page) => updateUrlParams({ projectsPage: page })}
          />
        </TabsContent>

        {/* Tab 3: Tasks */}
        <TabsContent value="tasks" className="focus-visible:outline-none focus-visible:ring-0">
          <TeamTasksTab
            tasks={tasksResponse?.data || []}
            teamMembers={team.teamMembers || []}
            meta={tasksResponse?.meta}
            isLoading={isTasksLoading}
            searchTerm={localTasksSearch}
            onSearchChange={setLocalTasksSearch}
            statusFilter={tasksStatus}
            onStatusFilterChange={(status) =>
              updateUrlParams({ tasksStatus: status, tasksPage: 1 })
            }
            priorityFilter={tasksPriority}
            onPriorityFilterChange={(priority) =>
              updateUrlParams({ tasksPriority: priority, tasksPage: 1 })
            }
            assigneeFilter={tasksAssignee}
            onAssigneeFilterChange={(assignee) =>
              updateUrlParams({ tasksAssignee: assignee, tasksPage: 1 })
            }
            page={tasksPage}
            onPageChange={(page) => updateUrlParams({ tasksPage: page })}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Team Modal */}
      <TeamModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={team}
        onSubmit={handleUpdateTeam}
        isLoading={isUpdating}
      />
    </div>
  );
}
