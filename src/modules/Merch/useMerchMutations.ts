"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createMerch, deleteMerch, updateMerch, type MerchInput } from "@/api/merch";
import { queryKeys } from "@/lib/query-keys";

function useInvalidateMerch() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.merch.all });
}

export function useCreateMerch() {
  const invalidate = useInvalidateMerch();

  return useMutation({
    mutationFn: (input: MerchInput) => createMerch(input),
    onSuccess: () => void invalidate(),
  });
}

export function useUpdateMerch() {
  const invalidate = useInvalidateMerch();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<MerchInput> }) =>
      updateMerch(id, input),
    onSuccess: () => void invalidate(),
  });
}

export function useDeleteMerch() {
  const invalidate = useInvalidateMerch();

  return useMutation({
    mutationFn: (id: number) => deleteMerch(id),
    onSuccess: () => void invalidate(),
  });
}
