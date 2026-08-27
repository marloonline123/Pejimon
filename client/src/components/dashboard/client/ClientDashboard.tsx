"use client";

import React from "react";
import { Sparkles, FileCheck, Layers, Clock, MessageSquareQuote } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientDashboard() {
  const stats = [
    { label: "Active Project Engagements", value: "2", change: "On schedule", icon: Layers },
    { label: "Pending Approvals", value: "1", change: "Requires your review", icon: FileCheck },
    { label: "Milestones Completed", value: "3/5", change: "60% overall progress", icon: Sparkles },
    { label: "Next Major Deliverable", value: "Sept 15", change: "v1.5 Beta Release", icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
            <Sparkles className="size-4" />
            Client Collaboration Portal
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Project Transparency Hub</h1>
          <p className="text-sm text-muted-foreground">
            Review deliverable progress, review and approve project sign-offs, and communicate with project leads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="gap-1.5">
            <MessageSquareQuote className="size-4" />
            Contact Project Lead
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

      {/* Client Workspace Placeholder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card shadow-xs">
          <h2 className="text-base font-semibold">Deliverable Approvals & Sign-Offs</h2>
          <p className="text-xs text-muted-foreground mt-1">Items submitted by the engineering team for your review.</p>
          <div className="mt-4 flex items-center justify-center h-48 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
            Client approvals list & action buttons
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-xs">
          <h2 className="text-base font-semibold">Project Milestones & Shared Files</h2>
          <p className="text-xs text-muted-foreground mt-1">High-level timeline and approved project deliverables.</p>
          <div className="mt-4 flex items-center justify-center h-48 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
            Milestone roadmap & document download links
          </div>
        </div>
      </div>
    </div>
  );
}
