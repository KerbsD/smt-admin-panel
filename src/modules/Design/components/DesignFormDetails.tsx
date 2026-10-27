"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { DesignFormValues } from "@/configs/schemas/design";

interface DesignFormDetailsProps {
  register: UseFormRegister<DesignFormValues>;
  errors: FieldErrors<DesignFormValues>;
}

export function DesignFormDetails({
  register,
  errors,
}: DesignFormDetailsProps) {
  return (
    <>
      <Field
        label="Description"
        htmlFor="description"
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          rows={3}
          placeholder="A short note on the concept, sizing, and ideal placement."
          aria-invalid={Boolean(errors.description)}
          {...register("description")}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field
          label="Category"
          htmlFor="category"
          error={errors.category?.message}
          required
        >
          <Input
            id="category"
            placeholder="Minimalist"
            aria-invalid={Boolean(errors.category)}
            {...register("category")}
          />
        </Field>
        <Field
          label="Style"
          htmlFor="style"
          error={errors.style?.message}
          optional
        >
          <Input
            id="style"
            placeholder="Fine line"
            aria-invalid={Boolean(errors.style)}
            {...register("style")}
          />
        </Field>
        <Field
          label="Placement"
          htmlFor="placement"
          error={errors.placement?.message}
          optional
        >
          <Input
            id="placement"
            placeholder="Forearm"
            aria-invalid={Boolean(errors.placement)}
            {...register("placement")}
          />
        </Field>
      </div>
    </>
  );
}
