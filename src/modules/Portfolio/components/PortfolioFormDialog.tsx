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
import type { PortfolioItem } from "@/types/models";

import usePortfolioFormDialog from "../hooks/usePortfolioFormDialog";

import { PortfolioFormDetails } from "./PortfolioFormDetails";
import { PortfolioFormMedia } from "./PortfolioFormMedia";
import { PortfolioFormPublishing } from "./PortfolioFormPublishing";

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
  const {
    register,
    control,
    errors,
    onSubmit,
    imageUrl,
    isEdit,
    isPending,
    setIsUploading,
  } = usePortfolioFormDialog({ item, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit portfolio item" : "New portfolio item"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Changes are published to the public gallery immediately."
              : "Add a finished piece to the public gallery."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <PortfolioFormMedia
            control={control}
            register={register}
            errors={errors}
            imageUrl={imageUrl}
            isPending={isPending}
            onUploadingChange={setIsUploading}
          />

          <PortfolioFormDetails register={register} errors={errors} />

          <PortfolioFormPublishing
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
              {isEdit ? "Save changes" : "Add item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
