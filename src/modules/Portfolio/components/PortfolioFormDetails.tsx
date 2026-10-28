"use client";

import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PortfolioFormValues } from "@/configs/schemas/portfolio";

interface PortfolioFormDetailsProps {
  register: UseFormRegister<PortfolioFormValues>;
  errors: FieldErrors<PortfolioFormValues>;
}

export function PortfolioFormDetails({
  register,
  errors,
}: PortfolioFormDetailsProps) {
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
          placeholder="A short note about the piece, placement, and process."
          aria-invalid={Boolean(errors.description)}
          {...register("description")}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
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
          label="Artist"
          htmlFor="artist"
          error={errors.artist?.message}
          optional
        >
          <Input
            id="artist"
            placeholder="Mia"
            aria-invalid={Boolean(errors.artist)}
            {...register("artist")}
          />
        </Field>
        <Field
          label="Duration"
          htmlFor="duration"
          error={errors.duration?.message}
          optional
        >
          <Input
            id="duration"
            placeholder="3.5 hours"
            aria-invalid={Boolean(errors.duration)}
            {...register("duration")}
          />
        </Field>
      </div>
    </>
  );
}
