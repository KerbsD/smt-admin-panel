"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MerchProduct } from "@/types/models";

import useMerchFormDialog from "../hooks/useMerchFormDialog";

import { MerchFormDetails } from "./MerchFormDetails";
import { MerchFormMedia } from "./MerchFormMedia";
import { MerchFormPublishing } from "./MerchFormPublishing";

interface MerchFormDialogProps {
  product?: MerchProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MerchFormDialog({
  product,
  open,
  onOpenChange,
}: MerchFormDialogProps) {
  const {
    register,
    control,
    errors,
    onSubmit,
    imageUrl,
    isEdit,
    isPending,
    setIsUploading,
  } = useMerchFormDialog({ product, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit product" : "New product"}</DialogTitle>
          <DialogDescription>
            Prices are whole Philippine pesos. Merch is shown on the public
            store page.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <MerchFormMedia
            control={control}
            register={register}
            errors={errors}
            imageUrl={imageUrl}
            isPending={isPending}
            onUploadingChange={setIsUploading}
          />

          <MerchFormDetails register={register} errors={errors} />

          <MerchFormPublishing
            control={control}
            register={register}
            errors={errors}
          />

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
