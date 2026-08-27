"use client";

import React from "react";
import { Crown, Briefcase, Users, FolderKanban, TrendingUp, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OwnerDashboard() {
  const stats = [
    { label: "Active Projects", value: "8", change: "3 near completion", icon: FolderKanban },
    { label: "Organization Members", value: "32", change: "4 teams active", icon: Users },
    { label: "Client Collaborations", value: "6", change: "2 pending reviews", icon: Briefcase },
    { label: "Team Velocity", value: "94%", change: "+6% vs last sprint", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
            <Crown className="size-4 text-amber-500" />
            Organization Owner
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Organization Executive Hub</h1>
          <p className="text-sm text-muted-foreground">
            Manage your organization, department teams, client engagements, and high-level milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="gap-1.5">
            <UserPlus className="size-4" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="p-5 rounded-xl border border-border bg-card text-card-foreground shadow-xs hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
                <Icon className="size-4 text-primary" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight">{stat.value}</span>
                <span className="text-xs text-muted-foreground font-medium">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Owner Workspace Placeholder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card shadow-xs">
          <h2 className="text-base font-semibold">Project Health & Deliverables</h2>
          <p className="text-xs text-muted-foreground mt-1">Cross-project milestones, status overviews, and progress bars.</p>
          <div className="mt-4 flex items-center justify-center h-48 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
            Portfolio projects summary & health indicators
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-xs">
          <h2 className="text-base font-semibold">Teams & Member Capacity</h2>
          <p className="text-xs text-muted-foreground mt-1">Workload distribution, team allocations, and pending invitations.</p>
          <div className="mt-4 flex items-center justify-center h-48 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
            Team allocation & resource capacity graph
          </div>
        </div>
      </div>
    </div>
  );
}
