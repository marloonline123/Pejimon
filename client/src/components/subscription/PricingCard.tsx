"use client";

import React from "react";
import { Zap, Crown, Shield, Layers, Users, FolderGit2, HardDrive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LoadingButton } from "@/components/ui/loading-button";
import { PlanFeatureItem } from "./PlanFeatureItem";
import type { Plan } from "@/types";

interface PricingCardProps {
  plan: Plan;
  isCurrent: boolean;
  isSubscribing: boolean;
  onSubscribe: (plan: Plan) => void;
}

export function PricingCard({
  plan,
  isCurrent,
  isSubscribing,
  onSubscribe,
}: PricingCardProps) {
  const isFree = Number(plan.price) === 0;
  const isPro = plan.name?.toUpperCase() === "PRO" || plan.slug === "pro";
  const price = Number(plan.price);

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-8 transition-all duration-300 ${
        isPro
          ? "bg-card border-2 border-rich-cerulean-500 shadow-xl shadow-rich-cerulean-500/10 scale-100 lg:scale-105 z-10"
          : "bg-card border border-border hover:border-rich-cerulean-500/50 shadow-sm"
      }`}
    >
      {isPro && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-rich-cerulean-600 to-rich-cerulean-500 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
            Most Popular
          </span>
        </div>
      )}

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight">{plan.displayName || plan.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {plan.description || (isFree ? "Perfect for individuals and small teams" : "For growing teams that need power")}
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isPro
                ? "bg-rich-cerulean-500/15 text-rich-cerulean-500"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isPro ? <Crown className="w-5 h-5" /> : isFree ? <Zap className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
          </div>
        </div>

        {/* Price */}
        <div className="my-6 pb-6 border-b border-border">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              ${price === 0 ? "0" : price.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              /{plan.interval || "month"}
            </span>
          </div>
          {isCurrent && (
            <Badge variant="outline" className="mt-3 border-rich-cerulean-500 text-rich-cerulean-500">
              Active Current Plan
            </Badge>
          )}
        </div>

        {/* Feature limits */}
        <div className="space-y-3.5 text-sm mb-8">
          <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
            Included Features
          </p>

          <PlanFeatureItem
            icon={<Layers className="w-4 h-4" />}
            text={
              <span>
                <strong>{(plan as any).maxOrgs ?? (isPro ? 5 : 1)}</strong> Organization{((plan as any).maxOrgs ?? 1) > 1 ? "s" : ""}
              </span>
            }
          />

          <PlanFeatureItem
            icon={<Users className="w-4 h-4" />}
            text={
              <span>
                <strong>{(plan as any).maxTeams ?? (isPro ? 10 : 1)}</strong> Team{((plan as any).maxTeams ?? 1) > 1 ? "s" : ""}
              </span>
            }
          />

          <PlanFeatureItem
            icon={<Users className="w-4 h-4" />}
            text={
              <span>
                Up to <strong>{(plan as any).maxMembers ?? (isPro ? 50 : 5)}</strong> Members
              </span>
            }
          />

          <PlanFeatureItem
            icon={<FolderGit2 className="w-4 h-4" />}
            text={
              <span>
                <strong>{(plan as any).maxProjects ?? (isPro ? 100 : 2)}</strong> Projects
              </span>
            }
          />

          <PlanFeatureItem
            icon={<HardDrive className="w-4 h-4" />}
            text={
              <span>
                <strong>{(plan as any).maxStorage ?? (isPro ? 50 : 2)} GB</strong> Cloud Storage
              </span>
            }
          />

          {isPro && (
            <>
              <PlanFeatureItem text="Custom roles & fine-grained permissions" />
              <PlanFeatureItem text="Priority 24/7 customer support" />
            </>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4">
        <LoadingButton
          size="lg"
          className={`w-full font-semibold shadow-md ${
            isPro
              ? "bg-rich-cerulean-500 hover:bg-rich-cerulean-600 text-white"
              : "bg-secondary text-secondary-foreground hover:bg-muted"
          }`}
          onClick={() => onSubscribe(plan)}
          disabled={isCurrent || isSubscribing}
          isLoading={isSubscribing}
          loadingText="Applying Plan..."
        >
          {isCurrent ? "Current Plan" : isFree ? "Get Started Free" : "Subscribe to Pro"}
        </LoadingButton>
      </div>
    </div>
  );
}
