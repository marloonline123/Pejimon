"use client";

import { useAppSelector, useAppDispatch } from "@/state/hooks";
import { collabse } from "@/state/slices/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LayoutDashboard, Users, Settings, Briefcase, Calendar, Command, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Team", href: "/team", icon: Users },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const isCollapsed = useAppSelector((state) => state.sidebar.collabse);
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-ink-black-100/50 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => dispatch(collabse())}
        />
      )}

      <aside
        className={cn(
          "flex flex-col bg-sand-dune-900 dark:bg-ink-black-200 border-e border-sand-dune-600 dark:border-ink-black-500 transition-all duration-300 ease-in-out shrink-0",
          "fixed inset-y-0 left-0 z-50 sm:relative sm:z-auto h-full",
          isCollapsed
            ? "-translate-x-full sm:translate-x-0 w-64 sm:w-[72px]"
            : "translate-x-0 w-64"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-sand-dune-600 dark:border-ink-black-500 px-4">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rich-cerulean-500 text-alice-blue-900 shadow-sm">
              <Command className="h-4 w-4" />
            </div>
            <span
              className={cn(
                "font-semibold text-sm text-ink-black-100 dark:text-alice-blue-900 transition-all duration-300",
                isCollapsed ? "opacity-0 w-0 hidden sm:block" : "opacity-100 w-auto"
              )}
            >
              Project Manager
            </span>
          </div>

          {/* Mobile Close Button */}
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden text-taupe-500 hover:text-ink-black-100 dark:text-taupe-400 dark:hover:text-alice-blue-900"
              onClick={() => dispatch(collabse())}
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-rich-cerulean-500 text-alice-blue-900 dark:bg-rich-cerulean-400 dark:text-ink-black-100"
                    : "text-taupe-500 hover:bg-sand-dune-800 hover:text-ink-black-100 dark:text-taupe-700 dark:hover:bg-ink-black-300 dark:hover:text-alice-blue-900",
                  isCollapsed ? "justify-center px-0" : ""
                )}
                title={isCollapsed ? item.name : undefined}
                onClick={() => {
                  // Optionally close sidebar on mobile when a link is clicked
                  if (!isCollapsed && window.innerWidth < 640) {
                    dispatch(collabse());
                  }
                }}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-alice-blue-900 dark:text-ink-black-100"
                      : "text-taupe-400 group-hover:text-ink-black-100 dark:text-taupe-600 dark:group-hover:text-alice-blue-900"
                  )}
                />
                <span className={cn("truncate transition-all duration-300", isCollapsed ? "opacity-0 w-0 hidden sm:block" : "opacity-100 w-auto")}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
