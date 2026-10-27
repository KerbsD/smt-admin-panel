import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { Path } from "react-hook-form";
import { toast } from "sonner";

import type { DesignInput } from "@/api/design";
import { designSchema, type DesignFormValues } from "@/configs/schemas/design";
import { ApiError } from "@/lib/api/fetcher";
import { applyApiErrors } from "@/lib/form-errors";
import type { DesignItem } from "@/types/models";

import { useCreateDesign, useUpdateDesign } from "./useDesignMutations";

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

interface UseDesignFormDialogOptions {
  design?: DesignItem | null;
  onOpenChange: (open: boolean) => void;
}

function useDesignFormDialog({
  design,
  onOpenChange,
}: UseDesignFormDialogOptions) {
  const create = useCreateDesign();
  const update = useUpdateDesign();
  const [isUploading, setIsUploading] = useState(false);
  const isEdit = Boolean(design);
  const isPending = create.isPending || update.isPending || isUploading;

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
      toast.error(
        error instanceof Error ? error.message : "Could not save the design.",
      );
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

export default useDesignFormDialog;
