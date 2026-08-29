"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Project } from "@/types";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InputError } from "@/components/ui/input-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { TeamSelect } from "./TeamSelect";

const projectSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  status: z.string().min(1, "Status is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  teamIds: z.array(z.number()).optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSubmit: (data: ProjectFormValues) => Promise<void> | void;
  isLoading?: boolean;
}

export function ProjectForm({
  initialData,
  onSubmit,
  isLoading,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      status: initialData?.status || "Planning",
      startDate: initialData?.startDate
        ? format(new Date(initialData.startDate), "yyyy-MM-dd")
        : "",
      endDate: initialData?.endDate
        ? format(new Date(initialData.endDate), "yyyy-MM-dd")
        : "",
      teamIds: initialData?.projectTeams?.map((pt) => pt.teamId) || [],
    },
  });

  const onFormSubmit = async (data: ProjectFormValues) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      if (error?.data?.errors) {
        const serverErrors = error.data.errors;
        Object.keys(serverErrors).forEach((key) => {
          setError(key as keyof ProjectFormValues, {
            type: "server",
            message: serverErrors[key][0],
          });
        });
      } else {
        setError("root", {
          type: "server",
          message: "Something went wrong. Please try again Later.",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {errors.root && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errors.root.message}
        </div>
      )}
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="Project name" {...register("name")} />
        <InputError
          messages={errors.name?.message ? [errors.name.message] : undefined}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Project description"
          {...register("description")}
        />
        <InputError
          messages={
            errors.description?.message
              ? [errors.description.message]
              : undefined
          }
        />
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLANNING">Planning</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="ON_HOLD">On Hold</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <InputError
          messages={
            errors.status?.message ? [errors.status.message] : undefined
          }
        />
      </div>

      {/* Teams */}
      <div className="space-y-2">
        <Label>Teams</Label>
        <Controller
          control={control}
          name="teamIds"
          render={({ field }) => (
            <TeamSelect value={field.value || []} onChange={field.onChange} />
          )}
        />
        <InputError
          messages={
            errors.teamIds?.message ? [errors.teamIds.message] : undefined
          }
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
          <InputError
            messages={
              errors.startDate?.message ? [errors.startDate.message] : undefined
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input id="endDate" type="date" {...register("endDate")} />
          <InputError
            messages={
              errors.endDate?.message ? [errors.endDate.message] : undefined
            }
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText="Saving..."
        >
          {initialData ? "Save Changes" : "Create Project"}
        </LoadingButton>
      </div>
    </form>
  );
}
