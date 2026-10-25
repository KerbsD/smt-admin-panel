import { request } from "@/lib/api/fetcher";
import type { ApiEnvelope, BookingListParams, MessageEnvelope, PaginatedEnvelope } from "@/types/api";
import type { Booking, BookingStatus } from "@/types/models";

export interface BookingUpdateInput {
  status?: BookingStatus;
  scheduledAt?: string[];
  adminNote?: string;
}

export function listBookings(
  params: BookingListParams,
  signal?: AbortSignal,
): Promise<PaginatedEnvelope<Booking>> {
  return request<PaginatedEnvelope<Booking>>("/admin/bookings", { query: params, signal });
}

export function getBooking(id: number): Promise<ApiEnvelope<Booking>> {
  return request<ApiEnvelope<Booking>>(`/admin/bookings/${id}`);
}

export function updateBooking(
  id: number,
  input: BookingUpdateInput,
): Promise<ApiEnvelope<Booking>> {
  return request<ApiEnvelope<Booking>>(`/admin/bookings/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function deleteBooking(id: number): Promise<MessageEnvelope> {
  return request<MessageEnvelope>(`/admin/bookings/${id}`, { method: "DELETE" });
}
