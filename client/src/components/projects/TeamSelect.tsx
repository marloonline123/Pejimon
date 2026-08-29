"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useGetTeamsQuery } from "@/state/api";
import { Team } from "@/types";

interface TeamSelectProps {
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
}

export function TeamSelect({ value = [], onChange }: TeamSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [teams, setTeams] = useState<Team[]>([]);

  const { data, isFetching } = useGetTeamsQuery({ search, page, limit: 10 });

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setTeams(data.data);
      } else {
        setTeams((prev) => {
          const newTeams = data.data.filter(
            (t) => !prev.some((p) => p.id === t.id),
          );
          return [...prev, ...newTeams];
        });
      }
    }
  }, [data, page]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = (node: HTMLDivElement) => {
    if (isFetching) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        data?.meta &&
        page < data.meta.totalPages
      ) {
        setPage((prev) => prev + 1);
      }
    });
    if (node) observerRef.current.observe(node);
  };

  const handleSelect = (teamId: string | number) => {
    if (value.includes(teamId)) {
      onChange(value.filter((id) => id !== teamId));
    } else {
      onChange([...value, teamId]);
    }
  };

  const selectedTeams = teams.filter((t) => value.includes(t.id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-between min-h-[2.5rem] h-auto p-2",
        )}
        role="combobox"
        aria-expanded={open}
      >
        {value.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedTeams.map((team) => (
              <Badge variant="secondary" key={team.id} className="mr-1">
                {team.name}
              </Badge>
            ))}
            {value.length > selectedTeams.length && (
              <Badge variant="secondary" className="mr-1">
                +{value.length - selectedTeams.length} more
              </Badge>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">Select teams...</span>
        )}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        {/* </Button> */}
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search teams..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              {isFetching ? "Loading..." : "No teams found."}
            </CommandEmpty>
            <CommandGroup>
              {teams.map((team, index) => (
                <CommandItem
                  key={team.id}
                  value={team.name}
                  onSelect={() => handleSelect(team.id)}
                  ref={index === teams.length - 1 ? lastElementRef : null}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(team.id) ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {team.name}
                </CommandItem>
              ))}
              {isFetching && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
