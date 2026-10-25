"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, Plus, Trash2 } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import type { BookingUpdateInput } from "@/api/bookings";
import { Alert } from "@/components/ui/alert";
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
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  bookingUpdateSchema,
  type BookingUpdateValues,
} from "@/configs/schemas/booking";
import { ApiError } from "@/lib/api/fetcher";
import {
  formatBookingSlot,
  formatDate,
  formatDateTime,
  fromDateTimeLocal,
  toDateTimeLocal,
} from "@/lib/format";
import { applyApiErrors } from "@/lib/form-errors";
import { useUpdateBooking } from "@/modules/Booking/useBookingMutations";
import type { Booking } from "@/types/models";
import type { Path } from "react-hook-form";

const KNOWN_FIELDS: Path<BookingUpdateValues>[] = [
  "status",
  "adminNote",
  "reschedule",
  "scheduledAt",
  "scheduledAt.0",
  "scheduledAt.1",
  "scheduledAt.2",
];

function takenDatesFromError(error: unknown): string[] {
  if (!(error instanceof ApiError)) return [];
  const payload = error.payload;
  if (typeof payload !== "object" || payload === null) return [];

  const value = (payload as { takenDates?: unknown }).takenDates;
  if (!Array.isArray(value)) return [];

  return value.filter((item): item is string => typeof item === "string");
}

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
  const update = useUpdateBooking();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<BookingUpdateValues>({
    resolver: zodResolver(bookingUpdateSchema),
    defaultValues: {
      status: booking.status,
      adminNote: booking.adminNote,
      reschedule: false,
      scheduledAt: booking.scheduledAt.map(toDateTimeLocal),
    },
  });

  const reschedule = useWatch({ control, name: "reschedule" });
  const scheduledAt = useWatch({ control, name: "scheduledAt" });

  const onSubmit = handleSubmit((values) => {
    const input: BookingUpdateInput = {
      status: values.status,
      adminNote: values.adminNote,
    };

    if (values.reschedule) {
      input.scheduledAt = values.scheduledAt
        .filter((value) => value.trim() !== "")
        .map(fromDateTimeLocal);
    }

    update.mutate(
      { id: booking.id, input },
      {
        onSuccess: () => {
          toast.success(`Booking #${booking.id} updated.`);
          onOpenChange(false);
        },
        onError: (error) => {
          const taken = takenDatesFromError(error);
          if (taken.length > 0) {
            toast.error(`Already taken: ${taken.map(formatDateTime).join(", ")}`);
          }

          if (error instanceof ApiError && error.status === 400) {
            applyApiErrors<BookingUpdateValues>(error, setError, KNOWN_FIELDS);
            return;
          }

          if (taken.length === 0 && error instanceof Error) {
            toast.error(error.message);
          }
        },
      },
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Booking #{booking.id}</DialogTitle>
          <DialogDescription>
            Requested by {booking.name} · received {formatDate(booking.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 rounded-lg border border-border bg-muted/40 p-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Email</p>
            <p className="mt-0.5 break-all font-medium">{booking.email}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Phone</p>
            <p className="mt-0.5 font-medium">{booking.phone || "—"}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Message</p>
            <p className="mt-0.5 whitespace-pre-wrap text-muted-foreground">
              {booking.message || "No message included."}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-[1fr_1.2fr]">
            <Field label="Status" htmlFor="status" error={errors.status?.message} required>
              <Select id="status" aria-invalid={Boolean(errors.status)} {...register("status")}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </Field>

            <div className="flex items-end">
              <div className="flex w-full items-center justify-between gap-3 rounded-lg border border-border px-3.5 py-2.5">
                <div>
                  <p className="text-sm font-medium">Reschedule</p>
                  <p className="text-xs text-muted-foreground">
                    Change the requested dates
                  </p>
                </div>
                <Controller
                  control={control}
                  name="reschedule"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label="Reschedule booking"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {reschedule ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Preferred dates</p>
                <span className="text-xs text-muted-foreground">{scheduledAt.length}/3</span>
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
                Dates are exclusive. Pending and confirmed bookings hold their
                slots.
              </p>
            </div>
          ) : (
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
          )}

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
