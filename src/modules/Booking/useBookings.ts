"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { listBookings } from "@/api/bookings";
import { queryKeys } from "@/lib/query-keys";
import type { BookingListParams } from "@/types/api";

export function useBookings(params: BookingListParams) {
  return useQuery({
    queryKey: queryKeys.bookings.list(params),
    queryFn: ({ signal }) => listBookings(params, signal),
    placeholderData: keepPreviousData,
  });
}
