"use client";

import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { BookingUpdateValues } from "@/configs/schemas/booking";

interface BookingUpdateControlsProps {
  control: Control<BookingUpdateValues>;
  register: UseFormRegister<BookingUpdateValues>;
  errors: FieldErrors<BookingUpdateValues>;
}

export function BookingUpdateControls({
  control,
  register,
  errors,
}: BookingUpdateControlsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_1.2fr]">
      <Field
        label="Status"
        htmlFor="status"
        error={errors.status?.message}
        required
      >
        <Select
          id="status"
          aria-invalid={Boolean(errors.status)}
          {...register("status")}
        >
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
  );
}
