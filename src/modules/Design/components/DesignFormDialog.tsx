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
import type { DesignItem } from "@/types/models";

import useDesignFormDialog from "../hooks/useDesignFormDialog";

import { DesignFormDetails } from "./DesignFormDetails";
import { DesignFormMedia } from "./DesignFormMedia";
import { DesignFormPublishing } from "./DesignFormPublishing";

interface DesignFormDialogProps {
  design?: DesignItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DesignFormDialog({
  design,
  open,
  onOpenChange,
}: DesignFormDialogProps) {
  const {
    register,
    control,
    errors,
    onSubmit,
    imageUrl,
    isEdit,
    isPending,
    setIsUploading,
  } = useDesignFormDialog({ design, onOpenChange });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit design" : "New design"}</DialogTitle>
          <DialogDescription>
            Flash and original designs. Published entries appear on the public
            designs page.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <DesignFormMedia
            control={control}
            register={register}
            errors={errors}
            imageUrl={imageUrl}
            isPending={isPending}
            onUploadingChange={setIsUploading}
          />

          <DesignFormDetails register={register} errors={errors} />

          <DesignFormPublishing
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
              {isEdit ? "Save changes" : "Add design"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
