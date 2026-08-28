import { authClient } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronDown, Command } from "lucide-react";

type Props = {
  isCollapsed: boolean;
};

export default function OrganizationSwitcher({ isCollapsed }: Props) {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  const handleSetOrg = async (orgId: string) => {
    try {
      await authClient.organization.setActive({ organizationId: orgId });
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="px-1 mb-4">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex items-center gap-2 overflow-hidden whitespace-nowrap hover:opacity-80 transition-opacity w-full text-left outline-none cursor-pointer rounded-md border border-sand-dune-600 dark:border-ink-black-500 bg-sand-dune-800/50 dark:bg-ink-black-300/50 hover:bg-sand-dune-800 dark:hover:bg-ink-black-300",
            isCollapsed ? "p-2 justify-center" : "px-3 py-2",
          )}
          title={activeOrganization?.name || "Select Org"}
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-rich-cerulean-500/20 text-rich-cerulean-600 dark:text-rich-cerulean-400 overflow-hidden">
            {activeOrganization?.logo ? (
              <img
                src={activeOrganization.logo}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[10px] font-bold uppercase">
                {activeOrganization
                  ? activeOrganization.name.substring(0, 2)
                  : "OR"}
              </span>
            )}
          </div>
          <div
            className={cn(
              "flex flex-col overflow-hidden transition-all duration-300 flex-1",
              isCollapsed
                ? "opacity-0 w-0 hidden sm:block"
                : "opacity-100 w-auto",
            )}
          >
            <span className="font-medium text-xs text-ink-black-100 dark:text-alice-blue-900 truncate">
              {activeOrganization ? activeOrganization.name : "Select Org..."}
            </span>
          </div>
          {!isCollapsed && (
            <ChevronDown className="w-3 h-3 ml-auto text-taupe-500 shrink-0" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {organizations?.map((org: any) => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => handleSetOrg(org.id)}
              className={cn(
                "cursor-pointer",
                activeOrganization?.id === org.id &&
                  "bg-rich-cerulean-500/10 text-rich-cerulean-600 font-medium",
              )}
            >
              <div className="flex items-center gap-2 w-full">
                <div className="w-6 h-6 rounded-md bg-alice-blue-800 dark:bg-ink-black-300 flex items-center justify-center shrink-0 overflow-hidden">
                  {org.logo ? (
                    <img
                      src={org.logo}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-bold uppercase">
                      {org.name.substring(0, 2)}
                    </span>
                  )}
                </div>
                <span className="truncate flex-1">{org.name}</span>
              </div>
            </DropdownMenuItem>
          ))}
          <div className="h-px bg-sand-dune-200 dark:bg-ink-black-300 my-1" />
          <DropdownMenuItem>
            <Link
              href="/select-organization"
              className="w-full cursor-pointer flex items-center text-taupe-500 dark:text-taupe-400"
            >
              <Command className="w-4 h-4 mr-2" />
              Manage Orgs
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
