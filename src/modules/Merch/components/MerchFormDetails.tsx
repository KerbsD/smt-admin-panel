"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { MerchFormValues } from "@/configs/schemas/merch";

interface MerchFormDetailsProps {
  register: UseFormRegister<MerchFormValues>;
  errors: FieldErrors<MerchFormValues>;
}

export function MerchFormDetails({
  register,
  errors,
}: MerchFormDetailsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Field
        label="Price (₱)"
        htmlFor="price"
        error={errors.price?.message}
        required
      >
        <Input
          id="price"
          type="number"
          min={0}
          step={1}
          aria-invalid={Boolean(errors.price)}
          {...register("price", { valueAsNumber: true })}
        />
      </Field>
      <Field
        label="Category"
        htmlFor="category"
        error={errors.category?.message}
        required
      >
        <Input
          id="category"
          placeholder="Hoodies"
          aria-invalid={Boolean(errors.category)}
          {...register("category")}
        />
      </Field>
      <Field
        label="Slug"
        htmlFor="slug"
        error={errors.slug?.message}
        hint="Auto-generated if blank."
        optional
      >
        <Input
          id="slug"
          placeholder="studio-hoodie"
          aria-invalid={Boolean(errors.slug)}
          {...register("slug")}
        />
      </Field>
    </div>
  );
}
