"use client";

import { Menu, Search, Settings, Moon, Sun } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import { useAppDispatch } from "@/state/hooks";
import { collabse } from "@/state/slices/sidebar";
import { useThemeToggle } from "@/hooks/useThemeToggle";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { isDarkMode, toggleTheme } = useThemeToggle();

  return (
    <nav className="flex justify-between px-5 py-3 items-center bg-sand-dune-900 dark:bg-ink-black-200 border-b border-sand-dune-600 dark:border-ink-black-500">
      <div className="flex gap-4 items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(collabse())}
          className="text-taupe-400 hover:text-ink-black-100 dark:text-taupe-700 dark:hover:text-alice-blue-900"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-taupe-400 dark:text-taupe-700" />
          <Input
            className="ps-9 w-64 bg-sand-dune-800 border-sand-dune-700 dark:bg-ink-black-300 dark:border-ink-black-400 text-sm placeholder:text-taupe-500 dark:placeholder:text-taupe-600 focus-visible:ring-rich-cerulean-600"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Link
          href="#"
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "text-taupe-400 hover:text-ink-black-100 dark:text-taupe-700 dark:hover:text-alice-blue-900")}
        >
          <Settings className="w-5 h-5" />
        </Link>

        <Separator
          orientation="vertical"
          className="h-6 hidden md:inline-block bg-sand-dune-800 dark:bg-ink-black-300"
        />

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-taupe-400 hover:text-ink-black-100 dark:text-taupe-700 dark:hover:text-alice-blue-900"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>
    </nav>
  );
}
