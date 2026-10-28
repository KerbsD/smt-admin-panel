"use client";

import { Pagination } from "@/components/ui/pagination";
import type { Pagination as PaginationMeta } from "@/types/api";

interface MerchPaginationProps {
  pagination: PaginationMeta;
  isFetching: boolean;
  onPageChange: (page: number) => void;
}

export function MerchPagination({
  pagination,
  isFetching,
  onPageChange,
}: MerchPaginationProps) {
  return (
    <Pagination
      pagination={pagination}
      onPageChange={onPageChange}
      disabled={isFetching}
    />
  );
}
