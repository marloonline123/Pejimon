"use client";

import React from "react";
import { CheckCircle2, Clock, ListTodo, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MemberDashboard() {
  const stats = [
    { label: "My Assigned Tasks", value: "6", change: "2 due this week", icon: ListTodo },
    { label: "Completed This Sprint", value: "14", change: "+4 vs last sprint", icon: CheckCircle2 },
    { label: "Hours Tracked Today", value: "5.5h", change: "Target: 8h", icon: Clock },
    { label: "Urgent Priority Tasks", value: "1", change: "Immediate attention", icon: AlertCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
            <ListTodo className="size-4" />
            Organization Member
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Personal Workspace</h1>
          <p className="text-sm text-muted-foreground">
            Track your ongoing tasks, log work hours, view project discussions, and collaborate with your team.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" />
            Log Time Entry
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

      {/* Member Workspace Placeholder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card shadow-xs">
          <h2 className="text-base font-semibold">My Active Tasks & Milestones</h2>
          <p className="text-xs text-muted-foreground mt-1">Directly assigned items across all active projects.</p>
          <div className="mt-4 flex items-center justify-center h-48 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
            Task checklist & quick status actions
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-xs">
          <h2 className="text-base font-semibold">Team Activity & Recent Comments</h2>
          <p className="text-xs text-muted-foreground mt-1">Live updates on threads you participate in.</p>
          <div className="mt-4 flex items-center justify-center h-48 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
            Activity stream & conversation replies
          </div>
        </div>
      </div>
    </div>
  );
}
