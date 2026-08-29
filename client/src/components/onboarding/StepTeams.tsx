"use client";

import React, { useState } from "react";
import { Users2, Plus, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TeamItem } from "./TeamItem";
import { toast } from "@/components/ui/toast";

interface StepTeamsProps {
  teams: { name: string; description: string; id?: string }[];
  isLoading: boolean;
  onAddTeam: (team: { name: string; description?: string }) => Promise<void>;
  onBack: () => void;
  onContinue: () => void;
  onSkip: () => void;
}

export function StepTeams({
  teams,
  isLoading,
  onAddTeam,
  onBack,
  onContinue,
  onSkip,
}: StepTeamsProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) return;
    await onAddTeam({
      name: name.trim(),
      description: description.trim() || undefined,
    });
    setName("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rich-cerulean-500/10 text-rich-cerulean-500 mb-2">
          <Users2 className="w-3 h-3" /> Step 3 of 4
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Create Teams</h2>
        <p className="text-sm text-muted-foreground">
          Group your members into departments or squads (e.g. Frontend, Design, Product).
        </p>
      </div>

      {/* Add Team Form */}
      <div className="bg-muted/40 border border-border rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              placeholder="e.g. Core Engineering"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="teamDesc">Description (Optional)</Label>
            <Input
              id="teamDesc"
              placeholder="e.g. Handles API & platform infrastructure"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <LoadingButton
            type="button"
            size="sm"
            className="bg-rich-cerulean-500 hover:bg-rich-cerulean-600 text-white gap-1.5"
            onClick={handleAdd}
            disabled={!name.trim()}
            isLoading={isLoading}
            loadingText="Adding..."
          >
            <Plus className="w-4 h-4" />
            Add Team
          </LoadingButton>
        </div>
      </div>

      {/* Created Teams List */}
      {teams.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Added Teams ({teams.length})
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {teams.map((team, idx) => (
              <TeamItem key={idx} name={team.name} description={team.description} />
            ))}
          </div>
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
            <span>Continue to Invitations</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
