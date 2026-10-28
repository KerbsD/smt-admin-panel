"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { listDesigns } from "@/api/design";
import { queryKeys } from "@/lib/query-keys";
import type { DesignListParams } from "@/types/api";

export function useDesigns(params: DesignListParams) {
  return useQuery({
    queryKey: queryKeys.design.list(params),
    queryFn: ({ signal }) => listDesigns(params, signal),
    placeholderData: keepPreviousData,
  });
}
