"use client";

import { CalendarPlus, Plus, Trash2 } from "lucide-react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BookingUpdateValues } from "@/configs/schemas/booking";
import { formatBookingSlot } from "@/lib/format";
import type { Booking } from "@/types/models";

interface BookingScheduleSectionProps {
  booking: Booking;
  reschedule: boolean;
  scheduledAt: string[];
  errors: FieldErrors<BookingUpdateValues>;
  register: UseFormRegister<BookingUpdateValues>;
  setValue: UseFormSetValue<BookingUpdateValues>;
}

export function BookingScheduleSection({
  booking,
  reschedule,
  scheduledAt,
  errors,
  register,
  setValue,
}: BookingScheduleSectionProps) {
  if (!reschedule) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium">Requested dates</p>
        <ul className="space-y-1.5">
          {booking.scheduledAt.map((date) => (
            <li
              key={date}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm"
            >
              <CalendarPlus className="size-4 text-muted-foreground" />
              {formatBookingSlot(date)}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Preferred dates</p>
        <span className="text-xs text-muted-foreground">
          {scheduledAt.length}/3
        </span>
      </div>

      {errors.scheduledAt?.root?.message ? (
        <Alert variant="error">{errors.scheduledAt.root.message}</Alert>
      ) : null}

      <div className="space-y-2">
        {scheduledAt.map((_, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1">
              <Input
                type="datetime-local"
                aria-label={`Preferred date ${index + 1}`}
                aria-invalid={Boolean(errors.scheduledAt?.[index])}
                {...register(`scheduledAt.${index}`)}
              />
              {errors.scheduledAt?.[index]?.message ? (
                <p className="mt-1 text-xs font-medium text-destructive">
                  {errors.scheduledAt[index]?.message}
                </p>
              ) : null}
            </div>
            {scheduledAt.length > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  setValue(
                    "scheduledAt",
                    scheduledAt.filter((__, itemIndex) => itemIndex !== index),
                    { shouldValidate: true },
                  )
                }
                aria-label={`Remove preferred date ${index + 1}`}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            ) : null}
          </div>
        ))}
      </div>

      {scheduledAt.length < 3 ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            setValue("scheduledAt", [...scheduledAt, ""], {
              shouldValidate: true,
            })
          }
          className="gap-2"
        >
          <Plus className="size-4" />
          Add another date
        </Button>
      ) : null}
      <p className="text-xs text-muted-foreground">
        Dates are exclusive. Pending and confirmed bookings hold their slots.
      </p>
    </div>
  );
}
