"use client";

import React, { useState } from "react";
import AdminDashboard from "@/components/dashboard/admin/AdminDashboard";
import OwnerDashboard from "@/components/dashboard/owner/OwnerDashboard";
import MemberDashboard from "@/components/dashboard/member/MemberDashboard";
import ClientDashboard from "@/components/dashboard/client/ClientDashboard";
import { authClient } from "@/lib/auth-client";
import {
  ShieldCheck,
  Crown,
  Users,
  Sparkles,
  Mail,
  CheckCircle2,
  Calendar,
  LogOut,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type UserRole = "admin" | "owner" | "member" | "client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Role switcher for prototyping/previews (will later be derived dynamically from user session/org context)
  const [activeRole, setActiveRole] = useState<UserRole>("owner");

  const roles = [
    { id: "admin", label: "Site Admin", icon: ShieldCheck },
    { id: "owner", label: "Org Owner", icon: Crown },
    { id: "member", label: "Org Member", icon: Users },
    { id: "client", label: "Org Client", icon: Sparkles },
  ] as const;

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const user = session?.user;

  return (
    <div className="space-y-6">
      {/* Logged-in User Profile Header Card */}
      <div className="p-5 md:p-6 rounded-2xl border border-border bg-card shadow-xs">
        {isPending ? (
          <div className="flex items-center gap-3 text-muted-foreground text-sm py-4">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span>Loading user profile session...</span>
          </div>
        ) : user ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* User Info */}
            <div className="flex items-start sm:items-center gap-4">
              {/* Avatar */}
              <div className="relative flex items-center justify-center size-14 rounded-2xl bg-primary/10 text-primary font-bold text-lg border border-primary/20 shrink-0 overflow-hidden">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <span>
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "U"}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground">
                    {user.name}
                  </h2>
                  {user.emailVerified && (
                    <Badge variant="secondary" className="gap-1 text-[11px] py-0 px-2">
                      <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                      Verified
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-[11px] py-0 px-2 text-primary border-primary/30">
                    ID: #{user.id.slice(0, 8)}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Mail className="size-3.5" />
                    <span>{user.email}</span>
                  </div>

                  {(user as Record<string, any>).username && (
                    <div className="flex items-center gap-1.5">
                      <UserIcon className="size-3.5" />
                      <span>@{(user as Record<string, any>).username}</span>
                    </div>
                  )}

                  {user.createdAt && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      <span>
                        Joined {new Date(user.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Logout Action */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="gap-1.5 text-xs hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
              >
                <LogOut className="size-3.5" />
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Not signed in</span>
            <Button size="sm" onClick={() => router.push("/login")}>
              Go to Login
            </Button>
          </div>
        )}
      </div>

      {/* Role Preview Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg bg-card/60 border border-border text-xs gap-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-muted-foreground">Role Perspective:</span>
          <span className="text-muted-foreground">(Testing preview for role-specific interfaces)</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = activeRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setActiveRole(r.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-3.5" />
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Role-Based View */}
      {activeRole === "admin" && <AdminDashboard />}
      {activeRole === "owner" && <OwnerDashboard />}
      {activeRole === "member" && <MemberDashboard />}
      {activeRole === "client" && <ClientDashboard />}
    </div>
  );
}
