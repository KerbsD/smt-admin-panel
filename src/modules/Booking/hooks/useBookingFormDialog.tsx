import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import type { Path } from "react-hook-form";

import type { BookingUpdateInput } from "@/api/bookings";

import {
  bookingUpdateSchema,
  type BookingUpdateValues,
} from "@/configs/schemas/booking";
import { ApiError } from "@/lib/api/fetcher";

import {
  formatDateTime,
  fromDateTimeLocal,
  toDateTimeLocal,
} from "@/lib/format";

import { applyApiErrors } from "@/lib/form-errors";
import { useUpdateBooking } from "./useBookingMutations";

import type { Booking } from "@/types/models";

interface UseBookingFormDialogOptions {
  booking: Booking;
  onOpenChange: (open: boolean) => void;
}

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

function useBookingFormDialog({
  booking,
  onOpenChange,
}: UseBookingFormDialogOptions) {
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
            toast.error(
              `Already taken: ${taken.map(formatDateTime).join(", ")}`,
            );
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

  return {
    register,
    control,
    errors,
    onSubmit,
    reschedule,
    scheduledAt,
    update,
    setValue,
  };
}

export default useBookingFormDialog;
