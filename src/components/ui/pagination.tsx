import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Pagination as PaginationMeta } from "@/types/api";

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({ pagination, onPageChange, disabled }: PaginationProps) {
  const { limit, offset, total } = pagination;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(limit, 1)));
  const page = Math.floor(offset / Math.max(limit, 1)) + 1;
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + limit, total);

  return (
    <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        {total === 0
          ? "No results"
          : `Showing ${from}–${to} of ${total}`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>
        <span className="min-w-24 text-center text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
