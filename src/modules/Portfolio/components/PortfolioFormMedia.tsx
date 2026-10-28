"use client";

import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { RemoteImage } from "@/components/ui/remote-image";
import type { PortfolioFormValues } from "@/configs/schemas/portfolio";

interface PortfolioFormMediaProps {
  control: Control<PortfolioFormValues>;
  register: UseFormRegister<PortfolioFormValues>;
  errors: FieldErrors<PortfolioFormValues>;
  imageUrl: string;
  isPending: boolean;
  onUploadingChange: (uploading: boolean) => void;
}

export function PortfolioFormMedia({
  control,
  register,
  errors,
  imageUrl,
  isPending,
  onUploadingChange,
}: PortfolioFormMediaProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
      <div className="space-y-4">
        <Field
          label="Title"
          htmlFor="title"
          error={errors.title?.message}
          required
        >
          <Input
            id="title"
            placeholder="Fine-line botanical sleeve"
            aria-invalid={Boolean(errors.title)}
            {...register("title")}
          />
        </Field>

        <Field
          label="Image"
          htmlFor="imageUrl"
          error={errors.imageUrl?.message}
          hint="Upload a file or paste an image URL."
          required
        >
          <Controller
            control={control}
            name="imageUrl"
            render={({ field }) => (
              <ImageUpload
                id="imageUrl"
                value={field.value}
                onChange={field.onChange}
                folder="portfolio"
                onUploadingChange={onUploadingChange}
                disabled={isPending}
              />
            )}
          />
        </Field>
      </div>

      <div className="space-y-1.5">
        <span className="text-sm font-medium">Preview</span>
        <RemoteImage
          src={imageUrl}
          alt="Portfolio preview"
          className="aspect-[4/3] w-full rounded-lg border border-border"
        />
      </div>
    </div>
  );
}
