"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import type { MerchInput } from "@/api/merch";
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
import { merchSchema, type MerchFormValues } from "@/configs/schemas/merch";
import { ApiError } from "@/lib/api/fetcher";
import { applyApiErrors } from "@/lib/form-errors";
import { useCreateMerch, useUpdateMerch } from "@/modules/Merch/useMerchMutations";
import type { MerchProduct } from "@/types/models";
import type { Path } from "react-hook-form";

const KNOWN_FIELDS: Path<MerchFormValues>[] = [
  "name",
  "price",
  "slug",
  "imageUrl",
  "category",
  "preorder",
  "sortOrder",
  "published",
];

interface MerchFormDialogProps {
  product?: MerchProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MerchFormDialog({ product, open, onOpenChange }: MerchFormDialogProps) {
  const create = useCreateMerch();
  const update = useUpdateMerch();
  const isEdit = Boolean(product);
  const isPending = create.isPending || update.isPending;

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<MerchFormValues>({
    resolver: zodResolver(merchSchema),
    defaultValues: {
      name: product?.name ?? "",
      price: product?.price ?? 0,
      slug: product?.slug ?? "",
      imageUrl: product?.imageUrl ?? "",
      category: product?.category ?? "",
      preorder: product?.preorder ?? false,
      sortOrder: product?.sortOrder ?? 0,
      published: product?.published ?? true,
    },
  });

  const imageUrl = useWatch({ control, name: "imageUrl" });

  const onSubmit = handleSubmit((values) => {
    const input: MerchInput = {
      name: values.name,
      price: values.price,
      imageUrl: values.imageUrl,
      category: values.category,
      preorder: values.preorder,
      sortOrder: values.sortOrder,
      published: values.published,
    };

    if (values.slug.trim() !== "") input.slug = values.slug;

    const onError = (error: unknown) => {
      if (error instanceof ApiError && error.status === 400) {
        applyApiErrors<MerchFormValues>(error, setError, KNOWN_FIELDS);
        return;
      }
      toast.error(error instanceof Error ? error.message : "Could not save the product.");
    };

    if (product) {
      update.mutate(
        { id: product.id, input },
        {
          onSuccess: () => {
            toast.success("Product updated.");
            onOpenChange(false);
          },
          onError,
        },
      );
      return;
    }

    create.mutate(input, {
      onSuccess: () => {
        toast.success("Product added.");
        onOpenChange(false);
      },
      onError,
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit product" : "New product"}</DialogTitle>
          <DialogDescription>
            Prices are whole Philippine pesos. Merch is shown on the public store page.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
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
                label="Image URL"
                htmlFor="imageUrl"
                error={errors.imageUrl?.message}
                hint="Site-relative path or an https URL."
                required
              >
                <Input
                  id="imageUrl"
                  placeholder="/merch/hoodie.png"
                  aria-invalid={Boolean(errors.imageUrl)}
                  {...register("imageUrl")}
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

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Price (₱)" htmlFor="price" error={errors.price?.message} required>
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
              {isEdit ? "Save changes" : "Add product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
