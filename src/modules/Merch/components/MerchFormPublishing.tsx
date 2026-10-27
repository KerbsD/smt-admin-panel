"use client";

import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { MerchFormValues } from "@/configs/schemas/merch";

interface MerchFormPublishingProps {
  control: Control<MerchFormValues>;
  register: UseFormRegister<MerchFormValues>;
  errors: FieldErrors<MerchFormValues>;
}

export function MerchFormPublishing({
  control,
  register,
  errors,
}: MerchFormPublishingProps) {
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
        name="preorder"
        render={({ field }) => (
          <div className="flex items-end">
            <div className="flex h-[66px] w-full items-center justify-between gap-3 rounded-lg border border-border px-3.5 py-2.5">
              <div>
                <p className="text-sm font-medium">Preorder</p>
                <p className="text-xs text-muted-foreground">Show badge</p>
              </div>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label="Mark as preorder"
              />
            </div>
          </div>
        )}
      />

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
                aria-label="Publish product"
              />
            </div>
          </div>
        )}
      />
    </div>
  );
}
