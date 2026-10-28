"use client";

import { Mail, MailCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { formatBookingSlot, formatDateTime } from "@/lib/format";
import type { Booking } from "@/types/models";

import { BookingStatusBadge } from "./BookingStatusBadge";

import useBookingEmailDialog from "../hooks/useBookingEmailDialog";

interface BookingEmailDialogProps {
  booking: Booking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingEmailDialog({
  booking,
  open,
  onOpenChange,
}: BookingEmailDialogProps) {
  const { note, setNote, sendEmail, emailKind, emailSentAt, onSubmit } =
    useBookingEmailDialog({ booking, onOpenChange });
  const emailVerb = emailSentAt ? "Resend" : "Send";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {emailVerb} {emailKind} email
          </DialogTitle>
          <DialogDescription>
            {emailSentAt
              ? `This ${emailKind} email was already sent on ${formatDateTime(emailSentAt)}. Sending it again will deliver another copy to the customer.`
              : emailKind === "confirmation"
                ? "Let the customer know their booking is confirmed."
                : "Let the customer know their booking has been cancelled."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="size-4" />
          </span>
          <div className="min-w-0 space-y-1">
            <p className="truncate text-sm font-medium">{booking.name}</p>
            <p className="break-all text-xs text-muted-foreground">
              {booking.email}
            </p>
            <p className="text-xs text-muted-foreground">
              {booking.scheduledAt.map(formatBookingSlot).join(" · ")}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <BookingStatusBadge status={booking.status} />
              <span className="text-xs text-muted-foreground">
                Booking #{booking.id}
              </span>
            </div>
            {emailSentAt ? (
              <p className="flex items-center gap-1 text-xs font-medium text-emerald-700">
                <MailCheck className="size-3.5 shrink-0" />
                Email sent {formatDateTime(emailSentAt)}
              </p>
            ) : null}
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <Field
            label="Message to customer"
            htmlFor="customerNote"
            optional
            hint="Added to the email. Your internal admin note is never sent."
          >
            <Textarea
              id="customerNote"
              rows={4}
              maxLength={1000}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Anything the customer should know…"
            />
          </Field>

          <p className="text-xs text-muted-foreground">
            The email includes the booking dates and reference number.
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={sendEmail.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={sendEmail.isPending}>
              {emailSentAt ? (
                <MailCheck className="size-4" />
              ) : (
                <Mail className="size-4" />
              )}
              {emailVerb} email
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
