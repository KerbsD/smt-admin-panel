"use client";

import { useState } from "react";
import { toast } from "sonner";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { listBookings } from "@/api/bookings";
import { queryKeys } from "@/lib/query-keys";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import type { BookingListParams } from "@/types/api";
import type { Booking, BookingStatus } from "@/types/models";

import { useDeleteBooking } from "./useBookingMutations";

export function useBookings(params: BookingListParams) {
  return useQuery({
    queryKey: queryKeys.bookings.list(params),
    queryFn: ({ signal }) => listBookings(params, signal),
    placeholderData: keepPreviousData,
  });
}

const PAGE_SIZE = 10;

function useHandleBookings() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [editing, setEditing] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState<Booking | null>(null);
  const [emailing, setEmailing] = useState<Booking | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);
  const deleteMutation = useDeleteBooking();

  const query = useBookings({
    status: status === "all" ? undefined : status,
    search: debouncedSearch.trim() || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    sort: "createdAt",
    order: "desc",
  });

  const bookings = query.data?.data ?? [];
  const pagination = query.data?.pagination;
  const hasFilters = debouncedSearch.trim() !== "" || status !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setPage(1);
  };

  const handleDelete = () => {
    if (!deleting) return;

    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success(`Booking #${deleting.id} deleted.`);
        setDeleting(null);
        if (bookings.length === 1 && page > 1) setPage(page - 1);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Could not delete booking.",
        );
      },
    });
  };

  return {
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    editing,
    setEditing,
    deleting,
    setDeleting,
    emailing,
    setEmailing,
    deleteMutation,
    PAGE_SIZE,
    query,
    bookings,
    pagination,
    hasFilters,
    clearFilters,
    handleDelete,
  };
}

export default useHandleBookings;
