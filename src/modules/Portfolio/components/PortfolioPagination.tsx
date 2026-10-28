"use client";

import { Pagination } from "@/components/ui/pagination";
import type { Pagination as PaginationMeta } from "@/types/api";

interface PortfolioPaginationProps {
  pagination: PaginationMeta;
  isFetching: boolean;
  onPageChange: (page: number) => void;
}

export function PortfolioPagination({
  pagination,
  isFetching,
  onPageChange,
}: PortfolioPaginationProps) {
  return (
    <Pagination
      pagination={pagination}
      onPageChange={onPageChange}
      disabled={isFetching}
    />
  );
}
