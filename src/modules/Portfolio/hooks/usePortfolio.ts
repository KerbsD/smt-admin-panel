"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { listPortfolio } from "@/api/portfolio";
import { queryKeys } from "@/lib/query-keys";
import type { PortfolioListParams } from "@/types/api";

export function usePortfolio(params: PortfolioListParams) {
  return useQuery({
    queryKey: queryKeys.portfolio.list(params),
    queryFn: ({ signal }) => listPortfolio(params, signal),
    placeholderData: keepPreviousData,
  });
}
