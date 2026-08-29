"use client";

import React from "react";
import { Layers, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionHeaderProps {
  currentUser?: {
    name?: string | null;
    email?: string | null;
  } | null;
  onSignOut: () => void;
}

export function SubscriptionHeader({
  currentUser,
  onSignOut,
}: SubscriptionHeaderProps) {
  return (
    <header className="border-b border-sand-dune-600 dark:border-ink-black-500 bg-alice-blue-800/60 dark:bg-ink-black-200/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rich-cerulean-600 to-rich-cerulean-400 flex items-center justify-center text-white shadow-md shadow-rich-cerulean-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-rich-cerulean-600 to-rich-cerulean-400 bg-clip-text text-transparent">
            Pejimon
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {currentUser && (
            <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Signed in as</span>
              <span className="font-medium text-foreground">
                {currentUser.name || currentUser.email}
              </span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onSignOut}
            className="gap-2 border-sand-dune-600 dark:border-ink-black-500 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
