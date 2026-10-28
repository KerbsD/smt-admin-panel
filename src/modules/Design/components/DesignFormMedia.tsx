"use client";

import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import { Field } from "@/components/ui/field";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { RemoteImage } from "@/components/ui/remote-image";
import type { DesignFormValues } from "@/configs/schemas/design";

interface DesignFormMediaProps {
  control: Control<DesignFormValues>;
  register: UseFormRegister<DesignFormValues>;
  errors: FieldErrors<DesignFormValues>;
  imageUrl: string;
  isPending: boolean;
  onUploadingChange: (uploading: boolean) => void;
}

export function DesignFormMedia({
  control,
  register,
  errors,
  imageUrl,
  isPending,
  onUploadingChange,
}: DesignFormMediaProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
      <div className="space-y-4">
        <Field label="Title" htmlFor="title" error={errors.title?.message} required>
          <Input
            id="title"
            placeholder="Fine-line serpent"
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
                folder="design"
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
          alt="Design preview"
          className="aspect-square w-full rounded-lg border border-border"
        />
      </div>
    </div>
  );
}
