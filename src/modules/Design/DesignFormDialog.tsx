"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import type { DesignInput } from "@/api/design";
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
import { Input } from "@/components/ui/input";
import { RemoteImage } from "@/components/ui/remote-image";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { designSchema, type DesignFormValues } from "@/configs/schemas/design";
import { ApiError } from "@/lib/api/fetcher";
import { applyApiErrors } from "@/lib/form-errors";
import { useCreateDesign, useUpdateDesign } from "@/modules/Design/useDesignMutations";
import type { DesignItem } from "@/types/models";
import type { Path } from "react-hook-form";

const KNOWN_FIELDS: Path<DesignFormValues>[] = [
  "title",
  "description",
  "style",
  "placement",
  "imageUrl",
  "category",
  "sortOrder",
  "published",
];

interface DesignFormDialogProps {
  design?: DesignItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DesignFormDialog({ design, open, onOpenChange }: DesignFormDialogProps) {
  const create = useCreateDesign();
  const update = useUpdateDesign();
  const isEdit = Boolean(design);
  const isPending = create.isPending || update.isPending;

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DesignFormValues>({
    resolver: zodResolver(designSchema),
    defaultValues: {
      title: design?.title ?? "",
      description: design?.description ?? "",
      style: design?.style ?? "",
      placement: design?.placement ?? "",
      imageUrl: design?.imageUrl ?? "",
      category: design?.category ?? "",
      sortOrder: design?.sortOrder ?? 0,
      published: design?.published ?? true,
    },
  });

  const imageUrl = useWatch({ control, name: "imageUrl" });

  const onSubmit = handleSubmit((values) => {
    const input: DesignInput = {
      title: values.title,
      description: values.description,
      style: values.style,
      placement: values.placement,
      imageUrl: values.imageUrl,
      category: values.category,
      sortOrder: values.sortOrder,
      published: values.published,
    };

    const onError = (error: unknown) => {
      if (error instanceof ApiError && error.status === 400) {
        applyApiErrors<DesignFormValues>(error, setError, KNOWN_FIELDS);
        return;
      }
      toast.error(error instanceof Error ? error.message : "Could not save the design.");
    };

    if (design) {
      update.mutate(
        { id: design.id, input },
        {
          onSuccess: () => {
            toast.success("Design updated.");
            onOpenChange(false);
          },
          onError,
        },
      );
      return;
    }

    create.mutate(input, {
      onSuccess: () => {
        toast.success("Design added.");
        onOpenChange(false);
      },
      onError,
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit design" : "New design"}</DialogTitle>
          <DialogDescription>
            Flash and original designs. Published entries appear on the public designs page.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
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
                label="Image URL"
                htmlFor="imageUrl"
                error={errors.imageUrl?.message}
                hint="Site-relative path or an https URL."
                required
              >
                <Input
                  id="imageUrl"
                  placeholder="/designs/serpent.jpg"
                  aria-invalid={Boolean(errors.imageUrl)}
                  {...register("imageUrl")}
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
            <Field label="Category" htmlFor="category" error={errors.category?.message} required>
              <Input
                id="category"
                placeholder="Minimalist"
                aria-invalid={Boolean(errors.category)}
                {...register("category")}
              />
            </Field>
            <Field label="Style" htmlFor="style" error={errors.style?.message} optional>
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
              {isEdit ? "Save changes" : "Add design"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
