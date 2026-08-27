"use client";

import React from "react";
import { ShieldCheck, Users, Building2, Server, Activity } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Total Organizations", value: "24", change: "+12% this month", icon: Building2 },
    { label: "Total Platform Users", value: "1,420", change: "+8% this month", icon: Users },
    { label: "Active Servers & Nodes", value: "99.98%", change: "Healthy uptime", icon: Server },
    { label: "Total Operations Today", value: "84.2k", change: "Peak throughput", icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary font-semibold text-xs tracking-wider uppercase">
          <ShieldCheck className="size-4" />
          Site Administration
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">System Control Center</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide metrics, tenant organizations, server health, and administrative tools.
        </p>
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
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Modules Placeholder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card shadow-xs">
          <h2 className="text-base font-semibold">Tenant Organizations Management</h2>
          <p className="text-xs text-muted-foreground mt-1">Audit active tenants, license limits, and storage quotas.</p>
          <div className="mt-4 flex items-center justify-center h-48 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
            Organizations list & management table view
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card shadow-xs">
          <h2 className="text-base font-semibold">Security & Audit Logs</h2>
          <p className="text-xs text-muted-foreground mt-1">System authentication events, API keys, and rate limits.</p>
          <div className="mt-4 flex items-center justify-center h-48 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
            Security audit logs & system activity feed
          </div>
        </div>
      </div>
    </div>
  );
}
