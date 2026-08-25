import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-muted-foreground">
        Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of{" "}
        {total} results
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
