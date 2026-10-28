"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import type { PortfolioInput } from "@/api/portfolio";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { ImageUpload } from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { RemoteImage } from "@/components/ui/remote-image";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  portfolioSchema,
  type PortfolioFormValues,
} from "@/configs/schemas/portfolio";
import { ApiError } from "@/lib/api/fetcher";
import { applyApiErrors } from "@/lib/form-errors";
import {
  useCreatePortfolio,
  useUpdatePortfolio,
} from "@/modules/Portfolio/usePortfolioMutations";
import type { PortfolioItem } from "@/types/models";
import type { Path } from "react-hook-form";

const KNOWN_FIELDS: Path<PortfolioFormValues>[] = [
  "title",
  "description",
  "imageUrl",
  "style",
  "artist",
  "duration",
  "date",
  "sortOrder",
  "published",
];

interface PortfolioFormDialogProps {
  item?: PortfolioItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PortfolioFormDialog({
  item,
  open,
  onOpenChange,
}: PortfolioFormDialogProps) {
  const create = useCreatePortfolio();
  const update = useUpdatePortfolio();
  const [isUploading, setIsUploading] = useState(false);
  const isEdit = Boolean(item);
  const isPending = create.isPending || update.isPending || isUploading;

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: item?.title ?? "",
      description: item?.description ?? "",
      imageUrl: item?.imageUrl ?? "",
      style: item?.style ?? "",
      artist: item?.artist ?? "",
      duration: item?.duration ?? "",
      date: item?.date ?? "",
      sortOrder: item?.sortOrder ?? 0,
      published: item?.published ?? true,
    },
  });

  const imageUrl = useWatch({ control, name: "imageUrl" });

  const onSubmit = handleSubmit((values) => {
    const input: PortfolioInput = {
      title: values.title,
      description: values.description,
      imageUrl: values.imageUrl,
      style: values.style,
      artist: values.artist,
      duration: values.duration,
      date: values.date === "" ? null : values.date,
      sortOrder: values.sortOrder,
      published: values.published,
    };

    const onError = (error: unknown) => {
      if (error instanceof ApiError && error.status === 400) {
        applyApiErrors<PortfolioFormValues>(error, setError, KNOWN_FIELDS);
        return;
      }
      toast.error(error instanceof Error ? error.message : "Could not save the item.");
    };

    if (item) {
      update.mutate(
        { id: item.id, input },
        {
          onSuccess: () => {
            toast.success("Portfolio item updated.");
            onOpenChange(false);
          },
          onError,
        },
      );
      return;
    }

    create.mutate(input, {
      onSuccess: () => {
        toast.success("Portfolio item added.");
        onOpenChange(false);
      },
      onError,
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit portfolio item" : "New portfolio item"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Changes are published to the public gallery immediately."
              : "Add a finished piece to the public gallery."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
            <div className="space-y-4">
              <Field label="Title" htmlFor="title" error={errors.title?.message} required>
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
                      onUploadingChange={setIsUploading}
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
            <Field label="Style" htmlFor="style" error={errors.style?.message} optional>
              <Input
                id="style"
                placeholder="Fine line"
                aria-invalid={Boolean(errors.style)}
                {...register("style")}
              />
            </Field>
            <Field label="Artist" htmlFor="artist" error={errors.artist?.message} optional>
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isPending}>
              {isEdit ? "Save changes" : "Add item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
