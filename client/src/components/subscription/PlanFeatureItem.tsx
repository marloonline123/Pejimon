import React from "react";
import { Check } from "lucide-react";

interface PlanFeatureItemProps {
  icon?: React.ReactNode;
  text: React.ReactNode;
}

export function PlanFeatureItem({ icon, text }: PlanFeatureItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-rich-cerulean-500/10 text-rich-cerulean-600 dark:text-rich-cerulean-400 flex items-center justify-center shrink-0">
        <Check className="w-3.5 h-3.5" />
      </div>
      <div className="flex items-center gap-2 text-sm text-foreground">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span>{text}</span>
      </div>
    </div>
  );
}
