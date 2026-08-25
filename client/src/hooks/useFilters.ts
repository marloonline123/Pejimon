import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface UseFiltersOptions {
  initialStatus?: string;
  debounceMs?: number;
}

export function useFilters(options?: UseFiltersOptions) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || options?.initialStatus || "All"
  );
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // Debounce search term to prevent rapid API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== debouncedSearch) {
        setPage(1); // Reset to page 1 on new search
      }
    }, options?.debounceMs || 500);
    return () => clearTimeout(handler);
  }, [searchTerm, debouncedSearch, options?.debounceMs]);

  // Sync state to URL whenever it changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    if (statusFilter !== "All") {
      params.set("status", statusFilter);
    } else {
      params.delete("status");
    }

    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }

    const newQueryString = params.toString();
    if (newQueryString !== searchParams.toString()) {
      router.replace(`${pathname}?${newQueryString}`);
    }
  }, [debouncedSearch, statusFilter, page, pathname, router, searchParams]);

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
  };

  return {
    page,
    setPage,
    searchTerm,
    setSearchTerm: handleSearchChange,
    statusFilter,
    setStatusFilter: handleStatusChange,
    debouncedSearch,
  };
}
