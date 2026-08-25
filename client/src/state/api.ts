import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { Project, Task, Team, ApiResponse } from "../types";
import { baseQueryWithToast } from "./base-query";

export const api = createApi({
  baseQuery: baseQueryWithToast,
  reducerPath: "api",
  tagTypes: ["Project", "Projects", "Team", "Teams"],
  endpoints: (builder) => ({
    getProjects: builder.query<
      ApiResponse<Project[]>,
      { search?: string; status?: string; page?: number; limit?: number } | void
    >({
      query: (params) => {
        let url = `/projects`;
        if (params) {
          const queryParams = new URLSearchParams();
          if (params.search) queryParams.append("search", params.search);
          if (params.status) queryParams.append("status", params.status);
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit)
            queryParams.append("limit", params.limit.toString());
          url += `?${queryParams.toString()}`;
        }
        return url;
      },
      providesTags: ["Projects"],
    }),
    getProjectBySlug: builder.query<ApiResponse<Project>, string>({
      query: (projectSlug: string) => `/projects?slug=${projectSlug}`,
      providesTags: ["Projects"],
    }),
    createProject: builder.mutation<ApiResponse<Project>, Partial<Project>>({
      query: (project: Partial<Project>) => ({
        url: `/projects`,
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    updateProject: builder.mutation<
      ApiResponse<Project>,
      { slug: string; project: Partial<Project> }
    >({
      query: ({ slug, project }) => ({
        url: `/projects/${slug}`,
        method: "PUT",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),
    deleteProject: builder.mutation<ApiResponse<Project>, string>({
      query: (slug: string) => ({
        url: `/projects/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),
    getTasks: builder.query<
      ApiResponse<Task[]>,
      {
        projectSlug: string;
        search?: string;
        status?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: (params) => {
        let url = `/tasks`;
        if (params) {
          const queryParams = new URLSearchParams();
          if (params.projectSlug)
            queryParams.append("projectSlug", params.projectSlug);
          if (params.search) queryParams.append("search", params.search);
          if (params.status && params.status !== "All")
            queryParams.append("status", params.status);
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit)
            queryParams.append("limit", params.limit.toString());
          url += `?${queryParams.toString()}`;
        }
        return url;
      },
    }),
    getTaskBySlug: builder.query<ApiResponse<Task>, string>({
      query: (taskSlug: string) => `/tasks?slug=${taskSlug}`,
    }),
    createTask: builder.mutation<ApiResponse<Task>, Partial<Task>>({
      query: (task: Partial<Task>) => ({
        url: `/tasks`,
        method: "POST",
        body: task,
      }),
    }),
    updateTask: builder.mutation<
      ApiResponse<Task>,
      { slug: string; task: Partial<Task> }
    >({
      query: ({ slug, task }) => ({
        url: `/tasks/${slug}`,
        method: "PUT",
        body: task,
      }),
    }),
    deleteTask: builder.mutation<ApiResponse<Task>, string>({
      query: (slug: string) => ({
        url: `/tasks/${slug}`,
        method: "DELETE",
      }),
    }),
    getTeams: builder.query<
      ApiResponse<Team[]>,
      { search?: string; page?: number; limit?: number } | void
    >({
      query: (params) => {
        let url = `/teams`;
        if (params) {
          const queryParams = new URLSearchParams();
          if (params.search) queryParams.append("search", params.search);
          if (params.page) queryParams.append("page", params.page.toString());
          if (params.limit)
            queryParams.append("limit", params.limit.toString());
          url += `?${queryParams.toString()}`;
        }
        return url;
      },
      providesTags: ["Teams"],
    }),
    getTeamBySlug: builder.query<ApiResponse<Team>, string>({
      query: (teamSlug: string) => `/teams/${teamSlug}`,
      providesTags: ["Teams"],
    }),
    createTeam: builder.mutation<ApiResponse<Team>, Partial<Team>>({
      query: (team: Partial<Team>) => ({
        url: `/teams`,
        method: "POST",
        body: team,
      }),
      invalidatesTags: ["Teams"],
    }),
    updateTeam: builder.mutation<
      ApiResponse<Team>,
      { slug: string; team: Partial<Team> }
    >({
      query: ({ slug, team }) => ({
        url: `/teams/${slug}`,
        method: "PUT",
        body: team,
      }),
      invalidatesTags: ["Teams"],
    }),
    deleteTeam: builder.mutation<ApiResponse<Team>, string>({
      query: (slug: string) => ({
        url: `/teams/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teams"],
    }),
    getUsers: builder.query<ApiResponse<any[]>, void>({
      query: () => `/users`,
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectBySlugQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetTasksQuery,
  useGetTaskBySlugQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTeamsQuery,
  useGetTeamBySlugQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useGetUsersQuery,
} = api;
