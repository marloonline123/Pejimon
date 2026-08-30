"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Users2,
  FolderKanban,
  Calendar,
  Crown,
  Edit2,
  Trash2,
  Building2,
} from "lucide-react";
import { Team } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TeamDetailHeaderProps {
  team: Team;
  totalMembers?: number;
  totalProjects?: number;
  onEdit: () => void;
  onDelete: (slug: string) => Promise<void>;
  isDeleting?: boolean;
}

export function TeamDetailHeader({
  team,
  totalMembers,
  totalProjects,
  onEdit,
  onDelete,
  isDeleting,
}: TeamDetailHeaderProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const manager = team.teamMembers?.find(
    (m) => m.role === "MANAGER" || m.userId === team.managerId,
  );

  const handleDelete = async () => {
    await onDelete(team.slug);
    setDeleteDialogOpen(false);
    router.push("/teams");
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" className="-ms-2 text-muted-foreground hover:text-foreground">
          <Link href="/teams" className="flex items-center gap-1.5">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Teams</span>
          </Link>
        </Button>
      </div>

      {/* Main Header Banner */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rich-cerulean-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="p-2.5 bg-rich-cerulean-500/10 text-rich-cerulean-500 dark:text-rich-cerulean-400 rounded-xl">
                <Users2 className="h-6 w-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {team.name}
              </h1>
              <Badge variant="secondary" className="font-mono text-xs px-2.5 py-0.5">
                @{team.slug}
              </Badge>
            </div>

            {team.description ? (
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {team.description}
              </p>
            ) : (
              <p className="text-muted-foreground/60 text-sm italic">
                No description provided for this team.
              </p>
            )}

            {/* Metadata tags */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-muted-foreground">
              {manager?.user && (
                <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded-md font-medium">
                  <Crown className="h-3.5 w-3.5" />
                  <span>Lead: {manager.user.name}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Created {format(new Date(team.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="gap-1.5"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Team</span>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isDeleting}
              className="gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {/* Mini stats counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-border/60">
          <div className="bg-muted/40 rounded-xl p-3.5 border border-border/40">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
              <Users2 className="h-3.5 w-3.5 text-rich-cerulean-500" />
              <span>Team Members</span>
            </div>
            <div className="text-xl font-bold text-foreground mt-1">
              {totalMembers ?? team.teamMembers?.length ?? 0}
            </div>
          </div>

          <div className="bg-muted/40 rounded-xl p-3.5 border border-border/40">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
              <FolderKanban className="h-3.5 w-3.5 text-emerald-500" />
              <span>Projects Assigned</span>
            </div>
            <div className="text-xl font-bold text-foreground mt-1">
              {totalProjects ?? 0}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-muted/40 rounded-xl p-3.5 border border-border/40">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
              <Building2 className="h-3.5 w-3.5 text-indigo-500" />
              <span>Organization</span>
            </div>
            <div className="text-sm font-semibold text-foreground truncate mt-1">
              Workspace Team
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team "{team.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All team member associations will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
