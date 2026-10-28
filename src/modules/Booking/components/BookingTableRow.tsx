"use client";

import { Mail, MailCheck, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  formatBookingSlot,
  formatDate,
  formatDateTime,
} from "@/lib/format";
import type { Booking } from "@/types/models";

import { BookingStatusBadge } from "./BookingStatusBadge";

interface BookingTableRowProps {
  booking: Booking;
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
  onEmail: (booking: Booking) => void;
}

export function BookingTableRow({
  booking,
  onEdit,
  onDelete,
  onEmail,
}: BookingTableRowProps) {
  const emailKind =
    booking.status === "confirmed"
      ? "confirmation"
      : booking.status === "cancelled"
        ? "cancellation"
        : null;
  const emailSentAt =
    emailKind === "confirmation"
      ? booking.confirmationEmailSentAt
      : emailKind === "cancellation"
        ? booking.cancellationEmailSentAt
        : null;
  const emailVerb = emailSentAt ? "Resend" : "Send";
  const emailHistory = [
    { label: "Confirmation", sentAt: booking.confirmationEmailSentAt },
    { label: "Cancellation", sentAt: booking.cancellationEmailSentAt },
  ].filter(
    (entry): entry is { label: string; sentAt: string } =>
      entry.sentAt !== null,
  );

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
        {emailHistory.map(({ label, sentAt }) => (
          <p
            key={label}
            className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground"
            title={`${label} email sent ${formatDateTime(sentAt)}`}
          >
            <MailCheck className="size-3 shrink-0 text-emerald-600" />
            {label} email sent {formatDate(sentAt)}
          </p>
        ))}
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
          {emailKind ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEmail(booking)}
              aria-label={`${emailVerb} ${emailKind} email to ${booking.name}`}
              title={`${emailVerb} ${emailKind} email`}
              className={
                emailSentAt
                  ? "text-emerald-600 hover:text-emerald-700"
                  : undefined
              }
            >
              {emailSentAt ? (
                <MailCheck className="size-4" />
              ) : (
                <Mail className="size-4" />
              )}
            </Button>
          ) : null}
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
