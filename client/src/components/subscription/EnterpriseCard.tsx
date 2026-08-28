"use client";

import React from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlanFeatureItem } from "./PlanFeatureItem";
import { toast } from "@/components/ui/toast";

export function EnterpriseCard() {
  return (
    <div className="flex flex-col justify-between rounded-2xl p-6 sm:p-8 bg-card border border-border hover:border-rich-cerulean-500/50 transition-all duration-300 shadow-sm">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Enterprise</h3>
            <p className="text-xs text-muted-foreground mt-1">
              For large-scale organizations with custom needs
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="my-6 pb-6 border-b border-border">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">Custom</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Billed annually or custom terms</p>
        </div>

        <div className="space-y-3.5 text-sm mb-8">
          <p className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
            Enterprise Benefits
          </p>
          <PlanFeatureItem text="Unlimited Organizations & Teams" />
          <PlanFeatureItem text="Unlimited Members & Projects" />
          <PlanFeatureItem text="Dedicated account manager & SLA" />
          <PlanFeatureItem text="Custom SAML SSO & audit logs" />
        </div>
      </div>

      <div className="pt-4">
        <Button
          variant="outline"
          size="lg"
          className="w-full font-semibold border-sand-dune-600 dark:border-ink-black-500"
          onClick={() => {
            toast.add({
              type: "info",
              description: "Please contact sales@pejimon.com for custom enterprise arrangements.",
            });
          }}
        >
          Contact Sales
        </Button>
      </div>
    </div>
  );
}
