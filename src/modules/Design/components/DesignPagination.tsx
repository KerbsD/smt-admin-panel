"use client";

import { Pagination } from "@/components/ui/pagination";
import type { Pagination as PaginationMeta } from "@/types/api";

interface DesignPaginationProps {
  pagination: PaginationMeta;
  isFetching: boolean;
  onPageChange: (page: number) => void;
}

export function DesignPagination({
  pagination,
  isFetching,
  onPageChange,
}: DesignPaginationProps) {
  return (
    <Pagination
      pagination={pagination}
      onPageChange={onPageChange}
      disabled={isFetching}
    />
  );
}
