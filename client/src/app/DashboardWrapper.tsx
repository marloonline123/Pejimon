"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import React from "react";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { Toaster } from "@/components/ui/toast";

type Props = {
  children: React.ReactNode;
};

export default function DashboardWrapper({ children }: Props) {
  useThemeToggle(); // Initializes theme sync on mount

  return (
    <div className="flex w-full h-screen bg-alice-blue-900 text-ink-black-200 dark:bg-ink-black-100 dark:text-alice-blue-900">
      {/* Sidebar */}
      <Sidebar />

      <main className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        <div className="flex-1 overflow-auto p-4 md:p-6">{children}</div>
      </main>

      <Toaster />
    </div>
  );
}
