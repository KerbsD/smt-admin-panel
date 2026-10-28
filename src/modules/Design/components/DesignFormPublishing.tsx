"use client";

import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { DesignFormValues } from "@/configs/schemas/design";

interface DesignFormPublishingProps {
  control: Control<DesignFormValues>;
  register: UseFormRegister<DesignFormValues>;
  errors: FieldErrors<DesignFormValues>;
}

export function DesignFormPublishing({
  control,
  register,
  errors,
}: DesignFormPublishingProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
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

      <Controller
        control={control}
        name="published"
        render={({ field }) => (
          <div className="flex items-end">
            <div className="flex h-[66px] w-full items-center justify-between gap-3 rounded-lg border border-border px-3.5 py-2.5">
              <div>
                <p className="text-sm font-medium">Published</p>
                <p className="text-xs text-muted-foreground">Visible publicly</p>
              </div>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Publish design"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
