"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import type { Booking } from "@/types/models";

import { useSendBookingStatusEmail } from "./useBookingMutations";

interface UseBookingEmailDialogOptions {
  booking: Booking;
  onOpenChange: (open: boolean) => void;
}

function useBookingEmailDialog({
  booking,
  onOpenChange,
}: UseBookingEmailDialogOptions) {
  const [note, setNote] = useState("");
  const sendEmail = useSendBookingStatusEmail();

  const emailKind =
    booking.status === "confirmed" ? "confirmation" : "cancellation";
  const emailSentAt =
    emailKind === "confirmation"
      ? booking.confirmationEmailSentAt
      : booking.cancellationEmailSentAt;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    sendEmail.mutate(
      { id: booking.id, note: note.trim() || undefined },
      {
        onSuccess: (response) => {
          toast.success(response.message);
          onOpenChange(false);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not send the booking email.",
          );
        },
      },
    );
  };

  return {
    note,
    setNote,
    sendEmail,
    emailKind,
    emailSentAt,
    onSubmit,
  };
}

export default useBookingEmailDialog;
