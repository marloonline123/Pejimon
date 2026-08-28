"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useGetPlansQuery, useSubscribeMutation, useGetMeQuery } from "@/state/api";
import { authClient } from "@/lib/auth-client";
import { toast } from "@/components/ui/toast";
import {
  SubscriptionHeader,
  PricingCard,
  EnterpriseCard,
} from "@/components/subscription";
import type { Plan } from "@/types";

export default function SubscriptionPage() {
  const router = useRouter();
  const { data: plansResponse, isLoading: isLoadingPlans } = useGetPlansQuery();
  const { data: meResponse, refetch: refetchMe } = useGetMeQuery();
  const [subscribeMutation, { isLoading: isSubscribing }] = useSubscribeMutation();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const currentUser = meResponse?.data;
  const currentPlanId = currentUser?.plan?.id;
  const plans = plansResponse?.data || [];

  const handleSubscribe = async (plan: Plan) => {
    setSelectedPlanId(plan.id);
    try {
      const res = await subscribeMutation({ planId: plan.id }).unwrap();
      if (res.success) {
        toast.add({
          type: "success",
          description: res.message || `Subscribed to ${plan.displayName} successfully!`,
        });
        await refetchMe();

        if (currentUser?.needsOnboarding !== false) {
          router.push("/onboarding");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      toast.add({
        type: "error",
        description: err?.data?.message || "Failed to process subscription. Please try again.",
      });
    } finally {
      setSelectedPlanId(null);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-alice-blue-900 dark:bg-ink-black-100 text-ink-black-200 dark:text-alice-blue-900 flex flex-col justify-between">
      <SubscriptionHeader currentUser={currentUser} onSignOut={handleSignOut} />

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rich-cerulean-500/10 text-rich-cerulean-600 dark:text-rich-cerulean-400 border border-rich-cerulean-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Select Your Plan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Supercharge Your Team&apos;s Productivity
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Choose the perfect plan for your project management needs. Upgrade, downgrade, or switch at any time.
          </p>
        </div>

        {/* Plans Grid */}
        {isLoadingPlans ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-card border border-border animate-pulse p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-24 h-6 bg-muted rounded-full" />
                  <div className="w-32 h-10 bg-muted rounded-lg" />
                  <div className="space-y-2 pt-4">
                    <div className="w-full h-4 bg-muted rounded" />
                    <div className="w-3/4 h-4 bg-muted rounded" />
                    <div className="w-5/6 h-4 bg-muted rounded" />
                  </div>
                </div>
                <div className="w-full h-10 bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {plans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                isCurrent={currentPlanId === plan.id}
                isSubscribing={isSubscribing && selectedPlanId === plan.id}
                onSubscribe={handleSubscribe}
              />
            ))}

            <EnterpriseCard />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-sand-dune-600 dark:border-ink-black-500 py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Pejimon Project Management. All rights reserved.</p>
      </footer>
    </div>
  );
}
