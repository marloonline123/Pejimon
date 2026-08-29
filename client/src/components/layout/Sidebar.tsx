"use client";

import { useState } from "react";
import { useAppSelector, useAppDispatch } from "@/state/hooks";
import { collabse } from "@/state/slices/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Settings,
  Briefcase,
  Calendar,
  Command,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { useGetProjectsQuery } from "@/state/api";
import OrganizationSwitcher from "./OrganizationSwitcher";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Team", href: "/teams", icon: Users },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const isCollapsed = useAppSelector((state) => state.sidebar.collabse);
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [projectsLimit, setProjectsLimit] = useState(5);

  const { data: projectsData, isLoading: isLoadingProjects } =
    useGetProjectsQuery({
      page: 1,
      limit: projectsLimit,
    });

  const projects = projectsData?.data || [];
  const totalProjects = projectsData?.meta?.total || 0;
  const hasMoreProjects = projects.length < totalProjects;

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
            : "translate-x-0 w-64",
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
                isCollapsed
                  ? "opacity-0 w-0 hidden sm:block"
                  : "opacity-100 w-auto",
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
          {/* Org Switcher */}
          <OrganizationSwitcher isCollapsed={isCollapsed} />

          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.name === "Projects" && pathname.startsWith("/projects"));

            if (item.name === "Projects") {
              return (
                <div key={item.name} className="flex flex-col">
                  <div
                    className={cn(
                      "group flex items-center justify-between rounded-md text-sm font-medium transition-colors cursor-pointer",
                      isActive && !isProjectsOpen
                        ? "bg-rich-cerulean-500 text-alice-blue-900 dark:bg-rich-cerulean-400 dark:text-ink-black-100"
                        : "text-taupe-500 hover:bg-sand-dune-800 hover:text-ink-black-100 dark:text-taupe-700 dark:hover:bg-ink-black-300 dark:hover:text-alice-blue-900",
                      isCollapsed ? "justify-center" : "",
                    )}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <Link
                        href={item.href}
                        className="px-3 py-2 flex items-center h-full hover:opacity-80 transition-opacity shrink-0"
                        title={isCollapsed ? item.name : undefined}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isCollapsed && window.innerWidth < 640) {
                            dispatch(collabse());
                          }
                        }}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 transition-colors",
                            isActive && !isProjectsOpen
                              ? "text-alice-blue-900 dark:text-ink-black-100"
                              : "text-taupe-400 group-hover:text-ink-black-100 dark:text-taupe-600 dark:group-hover:text-alice-blue-900",
                          )}
                        />
                      </Link>

                      {!isCollapsed && (
                        <div
                          className="flex-1 px-2 py-2 truncate h-full flex items-center select-none"
                          onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                        >
                          {item.name}
                        </div>
                      )}
                    </div>

                    {!isCollapsed && (
                      <div
                        className="px-3 py-2 flex items-center h-full"
                        onClick={() => setIsProjectsOpen(!isProjectsOpen)}
                      >
                        {isProjectsOpen ? (
                          <ChevronDown className="h-4 w-4 opacity-70" />
                        ) : (
                          <ChevronRight className="h-4 w-4 opacity-70" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Projects Dropdown Menu */}
                  {!isCollapsed && isProjectsOpen && (
                    <div className="ml-9 mt-1 space-y-1">
                      {projects.map((project) => (
                        <Link
                          key={project.id}
                          href={`/projects/${project.slug}`}
                          className={cn(
                            "block px-3 py-1.5 rounded-md text-sm transition-colors truncate",
                            pathname === `/projects/${project.slug}`
                              ? "bg-rich-cerulean-500/20 text-rich-cerulean-600 dark:text-rich-cerulean-300 font-medium"
                              : "text-taupe-500 hover:text-ink-black-100 hover:bg-sand-dune-800 dark:text-taupe-500 dark:hover:text-alice-blue-900 dark:hover:bg-ink-black-300",
                          )}
                          onClick={() => {
                            if (window.innerWidth < 640) {
                              dispatch(collabse());
                            }
                          }}
                        >
                          {project.name}
                        </Link>
                      ))}

                      {isLoadingProjects && projects.length === 0 && (
                        <div className="px-3 py-1.5 text-xs text-taupe-400 dark:text-taupe-600">
                          Loading...
                        </div>
                      )}

                      {hasMoreProjects && (
                        <button
                          onClick={() => setProjectsLimit((prev) => prev + 5)}
                          disabled={isLoadingProjects}
                          className="w-full text-left px-3 py-1.5 text-xs font-medium text-rich-cerulean-600 hover:text-rich-cerulean-700 dark:text-rich-cerulean-400 dark:hover:text-rich-cerulean-300 transition-colors disabled:opacity-50"
                        >
                          {isLoadingProjects ? "Loading..." : "Load more"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-rich-cerulean-500 text-alice-blue-900 dark:bg-rich-cerulean-400 dark:text-ink-black-100"
                    : "text-taupe-500 hover:bg-sand-dune-800 hover:text-ink-black-100 dark:text-taupe-700 dark:hover:bg-ink-black-300 dark:hover:text-alice-blue-900",
                  isCollapsed ? "justify-center px-0" : "",
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
                      : "text-taupe-400 group-hover:text-ink-black-100 dark:text-taupe-600 dark:group-hover:text-alice-blue-900",
                  )}
                />
                <span
                  className={cn(
                    "truncate transition-all duration-300",
                    isCollapsed
                      ? "opacity-0 w-0 hidden sm:block"
                      : "opacity-100 w-auto",
                  )}
                >
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
