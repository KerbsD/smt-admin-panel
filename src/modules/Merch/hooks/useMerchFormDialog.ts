import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { Path } from "react-hook-form";
import { toast } from "sonner";

import type { MerchInput } from "@/api/merch";
import { merchSchema, type MerchFormValues } from "@/configs/schemas/merch";
import { ApiError } from "@/lib/api/fetcher";
import { applyApiErrors } from "@/lib/form-errors";
import type { MerchProduct } from "@/types/models";

import { useCreateMerch, useUpdateMerch } from "./useMerchMutations";

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

interface UseMerchFormDialogOptions {
  product?: MerchProduct | null;
  onOpenChange: (open: boolean) => void;
}

function useMerchFormDialog({
  product,
  onOpenChange,
}: UseMerchFormDialogOptions) {
  const create = useCreateMerch();
  const update = useUpdateMerch();
  const [isUploading, setIsUploading] = useState(false);
  const isEdit = Boolean(product);
  const isPending = create.isPending || update.isPending || isUploading;

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
      toast.error(
        error instanceof Error ? error.message : "Could not save the product.",
      );
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

  return {
    register,
    control,
    errors,
    onSubmit,
    imageUrl,
    isEdit,
    isPending,
    isUploading,
    setIsUploading,
  };
}

export default useMerchFormDialog;
