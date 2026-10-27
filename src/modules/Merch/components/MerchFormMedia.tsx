"use client";

import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { RemoteImage } from "@/components/ui/remote-image";
import type { MerchFormValues } from "@/configs/schemas/merch";

interface MerchFormMediaProps {
  control: Control<MerchFormValues>;
  register: UseFormRegister<MerchFormValues>;
  errors: FieldErrors<MerchFormValues>;
  imageUrl: string;
  isPending: boolean;
  onUploadingChange: (uploading: boolean) => void;
}

export function MerchFormMedia({
  control,
  register,
  errors,
  imageUrl,
  isPending,
  onUploadingChange,
}: MerchFormMediaProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
      <div className="space-y-4">
        <Field label="Name" htmlFor="name" error={errors.name?.message} required>
          <Input
            id="name"
            placeholder="Studio hoodie"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
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
                folder="merch"
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
          alt="Product preview"
          className="aspect-square w-full rounded-lg border border-border"
        />
      </div>
    </div>
  );
}
