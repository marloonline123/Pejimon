"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeamForm, TeamFormValues } from "./TeamForm";
import { Team } from "@/types";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<Team>;
  onSubmit: (data: TeamFormValues) => void;
  isLoading?: boolean;
}

export function TeamModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
  isLoading,
}: TeamModalProps) {
  const isEditing = !!initialData;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Team" : "Create New Team"}</DialogTitle>
        </DialogHeader>
        <TeamForm
          initialData={initialData}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
