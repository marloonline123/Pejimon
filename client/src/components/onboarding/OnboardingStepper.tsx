import React from "react";
import { CheckCircle2, LucideIcon } from "lucide-react";

export interface OnboardingStep {
  id: number;
  title: string;
  desc: string;
  icon: LucideIcon;
}

interface OnboardingStepperProps {
  steps: OnboardingStep[];
  currentStep: number;
}

export function OnboardingStepper({ steps, currentStep }: OnboardingStepperProps) {
  return (
    <div className="mb-10">
      <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCompleted
                    ? "bg-rich-cerulean-500 text-white shadow-md shadow-rich-cerulean-500/20"
                    : isCurrent
                    ? "bg-rich-cerulean-500/20 text-rich-cerulean-500 border-2 border-rich-cerulean-500 shadow-sm"
                    : "bg-card border border-border text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <span
                className={`mt-2 text-xs sm:text-sm font-semibold ${
                  isCurrent
                    ? "text-rich-cerulean-500"
                    : isCompleted
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
              <span className="hidden sm:inline text-[11px] text-muted-foreground truncate max-w-[100px]">
                {step.desc}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 w-full bg-border h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-rich-cerulean-500 h-full transition-all duration-500 ease-out rounded-full"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
