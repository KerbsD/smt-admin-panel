"use client";

import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { PortfolioFormValues } from "@/configs/schemas/portfolio";

interface PortfolioFormPublishingProps {
  control: Control<PortfolioFormValues>;
  register: UseFormRegister<PortfolioFormValues>;
  errors: FieldErrors<PortfolioFormValues>;
}

export function PortfolioFormPublishing({
  control,
  register,
  errors,
}: PortfolioFormPublishingProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Field label="Date" htmlFor="date" error={errors.date?.message} optional>
        <Input
          id="date"
          type="date"
          aria-invalid={Boolean(errors.date)}
          {...register("date")}
        />
      </Field>
      <Field
        label="Sort order"
        htmlFor="sortOrder"
        error={errors.sortOrder?.message}
        hint="Lower comes first."
      >
        <Input
          id="sortOrder"
          type="number"
          min={0}
          step={1}
          aria-invalid={Boolean(errors.sortOrder)}
          {...register("sortOrder", { valueAsNumber: true })}
        />
      </Field>
      <div className="flex items-end">
        <div className="flex w-full items-center justify-between gap-3 rounded-lg border border-border px-3.5 py-2.5">
          <div>
            <p className="text-sm font-medium">Published</p>
            <p className="text-xs text-muted-foreground">Visible publicly</p>
          </div>
          <Controller
            control={control}
            name="published"
            render={({ field }) => (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Publish portfolio item"
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
