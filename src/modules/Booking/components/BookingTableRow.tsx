"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatBookingSlot, formatDate } from "@/lib/format";
import type { Booking } from "@/types/models";

import { BookingStatusBadge } from "./BookingStatusBadge";

interface BookingTableRowProps {
  booking: Booking;
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
}

export function BookingTableRow({
  booking,
  onEdit,
  onDelete,
}: BookingTableRowProps) {
  return (
    <tr className="transition-colors hover:bg-muted/30">
      <td className="px-5 py-4 align-top">
        <p className="font-medium">{booking.name}</p>
        <p className="text-xs text-muted-foreground">{booking.email}</p>
        {booking.phone ? (
          <p className="text-xs text-muted-foreground">{booking.phone}</p>
        ) : null}
      </td>
      <td className="px-5 py-4 align-top">
        <div className="space-y-0.5">
          {booking.scheduledAt.map((date) => (
            <p key={date} className="text-xs text-muted-foreground">
              {formatBookingSlot(date)}
            </p>
          ))}
        </div>
      </td>
      <td className="px-5 py-4 align-top">
        <BookingStatusBadge status={booking.status} />
        {booking.adminNote ? (
          <p className="mt-1.5 max-w-40 truncate text-[11px] text-muted-foreground">
            {booking.adminNote}
          </p>
        ) : null}
      </td>
      <td className="px-5 py-4 align-top text-xs text-muted-foreground">
        {formatDate(booking.createdAt)}
      </td>
      <td className="px-5 py-4 align-top">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(booking)}
            aria-label={`Edit booking from ${booking.name}`}
            title="Edit booking"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(booking)}
            aria-label={`Delete booking from ${booking.name}`}
            title="Delete booking"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
