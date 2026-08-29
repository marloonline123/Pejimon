"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Plus, ArrowRight, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import Image from "next/image";

export default function SelectOrganizationPage() {
  const router = useRouter();
  const { data: organizations, isPending: isLoading } = authClient.useListOrganizations();
  const [settingActive, setSettingActive] = useState<string | null>(null);

  const handleSelectOrg = async (orgId: string) => {
    setSettingActive(orgId);
    try {
      await authClient.organization.setActive({ organizationId: orgId });
      toast.add({ type: "success", description: "Organization selected successfully" });
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to set active organization", error);
      toast.add({ type: "error", description: "Failed to set active organization" });
      setSettingActive(null);
    }
  };

  const handleCreateNew = () => {
    router.push("/onboarding");
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-alice-blue-900 dark:bg-ink-black-100 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center py-4 px-6 md:px-12 border-b border-sand-dune-200 dark:border-ink-black-300">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold text-ink-black-200 dark:text-alice-blue-900">
            Pejimon
          </span>
        </div>
        <button
          onClick={handleSignOut}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Sign out
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white dark:bg-ink-black-200 border border-sand-dune-200 dark:border-ink-black-300 rounded-2xl shadow-xl overflow-hidden p-8 md:p-12 relative">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-ink-black-200 dark:text-alice-blue-900 mb-3">
              Select an Organization
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose an existing workspace or create a new one to get started.
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading your workspaces...</p>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {organizations && organizations.length > 0 ? (
                <div className="grid gap-4">
                  {organizations?.map((org: any) => (
                    <button
                      key={org.id}
                      onClick={() => handleSelectOrg(org.id)}
                      disabled={settingActive !== null}
                      className="flex items-center justify-between w-full p-4 border border-sand-dune-200 dark:border-ink-black-300 rounded-xl hover:border-primary hover:shadow-md transition-all group bg-card text-left disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-alice-blue-800 dark:bg-ink-black-300 border border-sand-dune-200 dark:border-ink-black-400 flex items-center justify-center overflow-hidden shrink-0">
                          {org.logo ? (
                            <Image src={org.logo} alt={org.name} width={48} height={48} className="object-cover" />
                          ) : (
                            <span className="text-lg font-bold text-ink-black-200 dark:text-alice-blue-900 uppercase">
                              {org.name.substring(0, 2)}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-ink-black-200 dark:text-alice-blue-900 group-hover:text-primary transition-colors">
                            {org.name}
                          </h3>
                          {org.metadata && (
                            <p className="text-sm text-muted-foreground">
                              {org.metadata?.plan || "Workspace"}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">
                        {settingActive === org.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <ArrowRight className="w-5 h-5" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-alice-blue-900 dark:bg-ink-black-300/50 rounded-xl border border-dashed border-sand-dune-300 dark:border-ink-black-400">
                  <p className="text-muted-foreground">You don't belong to any organizations yet.</p>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-center pt-6 border-t border-sand-dune-200 dark:border-ink-black-300">
            <button
              onClick={handleCreateNew}
              disabled={settingActive !== null}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 border-dashed border-primary/30 text-primary font-medium hover:bg-primary/5 hover:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Organization</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
