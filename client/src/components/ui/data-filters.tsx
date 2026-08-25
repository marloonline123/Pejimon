import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
  value: string;
  label: string;
}

interface DataFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  statusOptions?: FilterOption[];
  searchPlaceholder?: string;
  statusPlaceholder?: string;
}

export function DataFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusOptions = [
    { value: "All", label: "All Statuses" },
    { value: "ToDo", label: "To Do" },
    { value: "WorkInProgress", label: "Work In Progress" },
    { value: "UnderReview", label: "Under Review" },
    { value: "Completed", label: "Completed" },
  ],
  searchPlaceholder = "Search...",
  statusPlaceholder = "Filter by status",
}: DataFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder={statusPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
