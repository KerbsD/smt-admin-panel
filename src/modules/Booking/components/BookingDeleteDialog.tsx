"use client";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatDate } from "@/lib/format";
import type { Booking } from "@/types/models";

interface BookingDeleteDialogProps {
  booking: Booking | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function BookingDeleteDialog({
  booking,
  isPending,
  onOpenChange,
  onConfirm,
}: BookingDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={booking !== null}
      onOpenChange={onOpenChange}
      title="Delete this booking?"
      description={
        booking ? (
          <>
            The request from{" "}
            <span className="font-medium text-foreground">{booking.name}</span>{" "}
            on {formatDate(booking.createdAt)} will be permanently removed. This
            cannot be undone.
          </>
        ) : null
      }
      isLoading={isPending}
      onConfirm={onConfirm}
    />
  );
}
