"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteBooking,
  updateBooking,
  type BookingUpdateInput,
} from "@/api/bookings";
import { queryKeys } from "@/lib/query-keys";

export function useUpdateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: BookingUpdateInput }) =>
      updateBooking(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteBooking(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });
}
