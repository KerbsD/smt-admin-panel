"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createPortfolio,
  deletePortfolio,
  updatePortfolio,
  type PortfolioInput,
} from "@/api/portfolio";
import { queryKeys } from "@/lib/query-keys";

function useInvalidatePortfolio() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.portfolio.all });
}

export function useCreatePortfolio() {
  const invalidate = useInvalidatePortfolio();

  return useMutation({
    mutationFn: (input: PortfolioInput) => createPortfolio(input),
    onSuccess: () => void invalidate(),
  });
}

export function useUpdatePortfolio() {
  const invalidate = useInvalidatePortfolio();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<PortfolioInput> }) =>
      updatePortfolio(id, input),
    onSuccess: () => void invalidate(),
  });
}

export function useDeletePortfolio() {
  const invalidate = useInvalidatePortfolio();

  return useMutation({
    mutationFn: (id: number) => deletePortfolio(id),
    onSuccess: () => void invalidate(),
  });
}
