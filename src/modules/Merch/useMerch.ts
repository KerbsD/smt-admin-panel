"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { listMerch } from "@/api/merch";
import { queryKeys } from "@/lib/query-keys";
import type { MerchListParams } from "@/types/api";

export function useMerch(params: MerchListParams) {
  return useQuery({
    queryKey: queryKeys.merch.list(params),
    queryFn: ({ signal }) => listMerch(params, signal),
    placeholderData: keepPreviousData,
  });
}
