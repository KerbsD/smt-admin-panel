import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { Path } from "react-hook-form";
import { toast } from "sonner";

import type { PortfolioInput } from "@/api/portfolio";
import {
  portfolioSchema,
  type PortfolioFormValues,
} from "@/configs/schemas/portfolio";
import { ApiError } from "@/lib/api/fetcher";
import { applyApiErrors } from "@/lib/form-errors";
import type { PortfolioItem } from "@/types/models";

import { useCreatePortfolio, useUpdatePortfolio } from "./usePortfolioMutations";

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

interface UsePortfolioFormDialogOptions {
  item?: PortfolioItem | null;
  onOpenChange: (open: boolean) => void;
}

function usePortfolioFormDialog({
  item,
  onOpenChange,
}: UsePortfolioFormDialogOptions) {
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
      toast.error(
        error instanceof Error ? error.message : "Could not save the item.",
      );
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

export default usePortfolioFormDialog;
