"use client";

import React, { useState } from "react";
import { MailPlus, UserPlus, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InviteItem } from "./InviteItem";
import { toast } from "@/components/ui/toast";

interface StepInvitationsProps {
  orgName?: string;
  invites: { email: string; role: string }[];
  isSubmitting: boolean;
  onAddInvite: (invite: { email: string; role: string }) => void;
  onRemoveInvite: (email: string) => void;
  onBack: () => void;
  onFinish: () => Promise<void>;
}

export function StepInvitations({
  orgName,
  invites,
  isSubmitting,
  onAddInvite,
  onRemoveInvite,
  onBack,
  onFinish,
}: StepInvitationsProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  const handleAdd = () => {
    if (!email.trim() || !email.includes("@")) {
      toast.add({ type: "error", description: "Please enter a valid email address." });
      return;
    }

    if (invites.some((i) => i.email.toLowerCase() === email.trim().toLowerCase())) {
      toast.add({ type: "info", description: "This email is already added to the list." });
      return;
    }

    onAddInvite({
      email: email.trim().toLowerCase(),
      role,
    });
    setEmail("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rich-cerulean-500/10 text-rich-cerulean-500 mb-2">
          <MailPlus className="w-3 h-3" /> Step 4 of 4
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Invite Collaborators</h2>
        <p className="text-sm text-muted-foreground">
          Send email invites to team members so they can join <strong>{orgName || "your workspace"}</strong>.
        </p>
      </div>

      {/* Add Invite Form */}
      <div className="bg-muted/40 border border-border rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="inviteEmail">Colleague&apos;s Email</Label>
            <Input
              id="inviteEmail"
              type="email"
              placeholder="teammate@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Assigned Role</Label>
            <Select
              value={role}
              onValueChange={(val) => setRole(val || "member")}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            size="sm"
            className="bg-rich-cerulean-500 hover:bg-rich-cerulean-600 text-white gap-1.5"
            onClick={handleAdd}
            disabled={!email.trim()}
          >
            <UserPlus className="w-4 h-4" />
            Add to Invite List
          </Button>
        </div>
      </div>

      {/* Pending Invites List */}
      {invites.length > 0 ? (
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Invites Ready to Send ({invites.length})
          </Label>
          <div className="space-y-2">
            {invites.map((item) => (
              <InviteItem
                key={item.email}
                email={item.email}
                role={item.role}
                onRemove={onRemoveInvite}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-xs text-muted-foreground">
          No invites added yet. You can invite collaborators later from workspace settings.
        </div>
      )}

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
          <LoadingButton
            size="lg"
            className="bg-rich-cerulean-500 hover:bg-rich-cerulean-600 text-white font-semibold gap-2 shadow-md"
            onClick={onFinish}
            isLoading={isSubmitting}
            loadingText="Finishing Setup..."
          >
            <span>Finish & Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
