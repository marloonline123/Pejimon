"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  ShieldCheck,
  Users2,
  MailPlus,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  useCreateOrganizationMutation,
  useCreateTeamMutation,
  useGetMeQuery,
} from "@/state/api";
import { toast } from "@/components/ui/toast";
import {
  OnboardingHeader,
  OnboardingStepper,
  StepOrganization,
  StepRoles,
  StepTeams,
  StepInvitations,
  type OnboardingStep,
} from "@/components/onboarding";

const STEPS: OnboardingStep[] = [
  { id: 1, title: "Organization", desc: "Create your workspace", icon: Building2 },
  { id: 2, title: "Roles", desc: "Configure permissions", icon: ShieldCheck },
  { id: 3, title: "Teams", desc: "Organize your people", icon: Users2 },
  { id: 4, title: "Invite", desc: "Bring in collaborators", icon: MailPlus },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { refetch: refetchMe } = useGetMeQuery();
  const [createOrgMutation, { isLoading: isCreatingOrg }] = useCreateOrganizationMutation();
  const [createTeamMutation, { isLoading: isCreatingTeam }] = useCreateTeamMutation();

  const [currentStep, setCurrentStep] = useState(1);
  const [createdOrg, setCreatedOrg] = useState<{ id: string; name: string; slug: string } | null>(null);

  // Step 3: Teams state
  const [teamsList, setTeamsList] = useState<{ name: string; description: string; id?: string }[]>([]);

  // Step 4: Invitations state
  const [inviteEmails, setInviteEmails] = useState<{ email: string; role: string }[]>([]);
  const [isSendingInvites, setIsSendingInvites] = useState(false);

  // Step 1: Submit Organization
  const handleCreateOrg = async ({
    name,
    description,
    logoFile,
  }: {
    name: string;
    description: string;
    logoFile: File | null;
  }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (description) {
        formData.append("description", description);
      }
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const res = await createOrgMutation(formData).unwrap();
      if (res.success && res.data) {
        setCreatedOrg({
          id: res.data.id,
          name: res.data.name,
          slug: res.data.slug,
        });

        // Set active organization in better-auth session
        try {
          await authClient.organization.setActive({
            organizationId: res.data.id,
          });
        } catch (err) {
          console.warn("Could not setActive org immediately:", err);
        }

        toast.add({
          type: "success",
          description: `Organization "${res.data.name}" created successfully!`,
        });

        setCurrentStep(2);
      }
    } catch (err: any) {
      toast.add({
        type: "error",
        description: err?.data?.message || "Failed to create organization. Please try again.",
      });
    }
  };

  // Step 3: Add Team
  const handleAddTeam = async ({
    name,
    description,
  }: {
    name: string;
    description?: string;
  }) => {
    if (!createdOrg?.id) {
      toast.add({ type: "error", description: "Please complete organization creation first." });
      return;
    }

    try {
      const res = await createTeamMutation({
        name,
        description,
        organizationId: createdOrg.id,
      } as any).unwrap();

      if (res.success && res.data) {
        setTeamsList((prev) => [
          ...prev,
          {
            id: res.data.id ? String(res.data.id) : undefined,
            name,
            description: description || "",
          },
        ]);
        toast.add({ type: "success", description: `Team "${name}" created!` });
      }
    } catch (err: any) {
      toast.add({
        type: "error",
        description: err?.data?.message || "Failed to create team.",
      });
    }
  };

  // Step 4: Add / Remove Invites
  const handleAddInvite = (invite: { email: string; role: string }) => {
    setInviteEmails((prev) => [...prev, invite]);
  };

  const handleRemoveInvite = (emailToRemove: string) => {
    setInviteEmails((prev) => prev.filter((i) => i.email !== emailToRemove));
  };

  // Final completion: Send invites & redirect to Dashboard
  const handleFinishOnboarding = async () => {
    if (inviteEmails.length > 0 && createdOrg?.id) {
      setIsSendingInvites(true);
      try {
        for (const item of inviteEmails) {
          try {
            await authClient.organization.inviteMember({
              email: item.email,
              role: item.role as any,
              organizationId: createdOrg.id,
            });
          } catch (err) {
            console.warn(`Failed to send invite to ${item.email}`, err);
          }
        }
        toast.add({
          type: "success",
          description: `Invitations sent to ${inviteEmails.length} member(s)!`,
        });
      } finally {
        setIsSendingInvites(false);
      }
    }

    await refetchMe();
    toast.add({
      type: "success",
      description: "Welcome to Pejimon! Your workspace is ready.",
    });
    router.push("/dashboard");
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-alice-blue-900 dark:bg-ink-black-100 text-ink-black-200 dark:text-alice-blue-900 flex flex-col justify-between">
      <OnboardingHeader onSignOut={handleSignOut} />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        <OnboardingStepper steps={STEPS} currentStep={currentStep} />

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-lg relative backdrop-blur-sm">
          {currentStep === 1 && (
            <StepOrganization
              isLoading={isCreatingOrg}
              onSubmit={handleCreateOrg}
            />
          )}

          {currentStep === 2 && (
            <StepRoles
              orgName={createdOrg?.name}
              onBack={() => setCurrentStep(1)}
              onContinue={() => setCurrentStep(3)}
              onSkip={() => setCurrentStep(3)}
            />
          )}

          {currentStep === 3 && (
            <StepTeams
              teams={teamsList}
              isLoading={isCreatingTeam}
              onAddTeam={handleAddTeam}
              onBack={() => setCurrentStep(2)}
              onContinue={() => setCurrentStep(4)}
              onSkip={() => setCurrentStep(4)}
            />
          )}

          {currentStep === 4 && (
            <StepInvitations
              orgName={createdOrg?.name}
              invites={inviteEmails}
              isSubmitting={isSendingInvites}
              onAddInvite={handleAddInvite}
              onRemoveInvite={handleRemoveInvite}
              onBack={() => setCurrentStep(3)}
              onFinish={handleFinishOnboarding}
            />
          )}
        </div>
      </main>

      <footer className="border-t border-sand-dune-600 dark:border-ink-black-500 py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Pejimon Project Management. Workspace Onboarding.</p>
      </footer>
    </div>
  );
}
