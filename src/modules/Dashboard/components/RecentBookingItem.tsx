"use client";

import Link from "next/link";

import { formatBookingSlot, formatDate } from "@/lib/format";
import { BookingStatusBadge } from "@/modules/Booking/components/BookingStatusBadge";
import type { Booking } from "@/types/models";

interface RecentBookingItemProps {
  booking: Booking;
}

export function RecentBookingItem({ booking }: RecentBookingItemProps) {
  return (
    <li>
      <Link
        href="/bookings"
        className="flex flex-col gap-2 px-5 py-3.5 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{booking.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {booking.email} · requested{" "}
            {formatBookingSlot(booking.scheduledAt[0])}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="text-[11px] text-muted-foreground">
            {formatDate(booking.createdAt)}
          </span>
          <BookingStatusBadge status={booking.status} />
        </div>
      </Link>
    </li>
  );
}
