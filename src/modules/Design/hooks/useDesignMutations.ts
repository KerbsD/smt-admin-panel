"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createDesign,
  deleteDesign,
  updateDesign,
  type DesignInput,
} from "@/api/design";
import { queryKeys } from "@/lib/query-keys";

function useInvalidateDesign() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.design.all });
}

export function useCreateDesign() {
  const invalidate = useInvalidateDesign();

  return useMutation({
    mutationFn: (input: DesignInput) => createDesign(input),
    onSuccess: () => void invalidate(),
  });
}

export function useUpdateDesign() {
  const invalidate = useInvalidateDesign();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<DesignInput> }) =>
      updateDesign(id, input),
    onSuccess: () => void invalidate(),
  });
}

export function useDeleteDesign() {
  const invalidate = useInvalidateDesign();

  return useMutation({
    mutationFn: (id: number) => deleteDesign(id),
    onSuccess: () => void invalidate(),
  });
}
