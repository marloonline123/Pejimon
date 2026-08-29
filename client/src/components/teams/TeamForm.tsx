"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Team } from "@/types";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InputError } from "@/components/ui/input-error";
import { UserSelect } from "@/components/users/UserSelect";

const teamSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().optional(),
  managerId: z.string().min(1, "Team Manager is required"),
});

export type TeamFormValues = z.infer<typeof teamSchema>;

interface TeamFormProps {
  initialData?: Partial<Team>;
  onSubmit: (data: TeamFormValues) => Promise<void> | void;
  isLoading?: boolean;
}

export function TeamForm({ initialData, onSubmit, isLoading }: TeamFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      managerId: initialData?.managerId || "",
    },
  });

  console.log("initial Datat: ", initialData);

  const onFormSubmit = async (data: TeamFormValues) => {
    try {
      await onSubmit(data);
    } catch (error: any) {
      if (error?.data?.errors) {
        const serverErrors = error.data.errors;
        Object.keys(serverErrors).forEach((key) => {
          setError(key as keyof TeamFormValues, {
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
        <Input id="name" placeholder="Team name" {...register("name")} />
        <InputError messages={errors.name?.message} />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Team description"
          rows={3}
          {...register("description")}
        />
        <InputError messages={errors.description?.message} />
      </div>

      {/* Team Manager */}
      <div className="space-y-2">
        <Label>Team Manager</Label>
        <Controller
          control={control}
          name="managerId"
          render={({ field }) => (
            <UserSelect value={field.value} onChange={field.onChange} />
          )}
        />
        <InputError messages={errors.managerId?.message} />
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-4">
        <LoadingButton isLoading={isLoading} type="submit" className="w-full">
          {initialData ? "Save Changes" : "Create Team"}
        </LoadingButton>
      </div>
    </form>
  );
}
