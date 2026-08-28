"use client";

import React from "react";
import { ShieldCheck, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleCard } from "./RoleCard";

const DEFAULT_ROLES = [
  {
    name: "Admin",
    badge: "Full Access",
    desc: "Can manage organization settings, projects, billing, and all members.",
    permissions: ["Org Manage", "Project Full", "Team Full", "Member Full"],
  },
  {
    name: "Member",
    badge: "Standard",
    desc: "Can create and manage assigned projects, tasks, and view teams.",
    permissions: ["Project Create/Edit", "Task Full", "Team View", "Member View"],
  },
  {
    name: "Viewer",
    badge: "Read Only",
    desc: "Can view projects, tasks, and discussions without edit privileges.",
    permissions: ["Project View", "Task View", "Team View"],
  },
];

interface StepRolesProps {
  orgName?: string;
  onBack: () => void;
  onContinue: () => void;
  onSkip: () => void;
}

export function StepRoles({
  orgName,
  onBack,
  onContinue,
  onSkip,
}: StepRolesProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rich-cerulean-500/10 text-rich-cerulean-500 mb-2">
          <ShieldCheck className="w-3 h-3" /> Step 2 of 4
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Organization Roles & Permissions</h2>
        <p className="text-sm text-muted-foreground">
          Default roles have been initialized for <strong>{orgName || "your organization"}</strong>. You can customize them anytime in Settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {DEFAULT_ROLES.map((role) => (
          <RoleCard key={role.name} role={role} />
        ))}
      </div>

      <div className="pt-6 flex items-center justify-between border-t border-border">
        <Button
          variant="ghost"
          onClick={onBack}
          className="gap-2 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onSkip}
            className="border-border text-muted-foreground hover:text-foreground"
          >
            Skip
          </Button>
          <Button
            onClick={onContinue}
            className="bg-rich-cerulean-500 hover:bg-rich-cerulean-600 text-white font-semibold gap-2 shadow-md"
          >
            <span>Continue to Teams</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
