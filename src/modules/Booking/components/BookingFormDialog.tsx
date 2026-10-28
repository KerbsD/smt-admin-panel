"use client";

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
import { formatDate } from "@/lib/format";
import type { Booking } from "@/types/models";

import { BookingContactSummary } from "./BookingContactSummary";
import { BookingScheduleSection } from "./BookingScheduleSection";
import { BookingUpdateControls } from "./BookingUpdateControls";

import useBookingFormDialog from "../hooks/useBookingFormDialog";

interface BookingFormDialogProps {
  booking: Booking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookingFormDialog({
  booking,
  open,
  onOpenChange,
}: BookingFormDialogProps) {
  const {
    register,
    control,
    errors,
    onSubmit,
    reschedule,
    scheduledAt,
    update,
    setValue,
  } = useBookingFormDialog({
    booking,
    onOpenChange,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Booking #{booking.id}</DialogTitle>
          <DialogDescription>
            Requested by {booking.name} · received{" "}
            {formatDate(booking.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <BookingContactSummary booking={booking} />

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <BookingUpdateControls
            control={control}
            register={register}
            errors={errors}
          />

          <BookingScheduleSection
            booking={booking}
            reschedule={reschedule}
            scheduledAt={scheduledAt}
            errors={errors}
            register={register}
            setValue={setValue}
          />

          <Field
            label="Admin note"
            htmlFor="adminNote"
            error={errors.adminNote?.message}
            hint="Internal only — never shown on the public site."
          >
            <Textarea
              id="adminNote"
              rows={3}
              placeholder="Deposit received, design brief sent…"
              aria-invalid={Boolean(errors.adminNote)}
              {...register("adminNote")}
            />
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={update.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={update.isPending}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
