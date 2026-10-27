"use client";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { DesignItem } from "@/types/models";

interface DesignDeleteDialogProps {
  design: DesignItem | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DesignDeleteDialog({
  design,
  isPending,
  onOpenChange,
  onConfirm,
}: DesignDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={design !== null}
      onOpenChange={onOpenChange}
      title="Delete this design?"
      description={
        design ? (
          <>
            <span className="font-medium text-foreground">{design.title}</span>{" "}
            will be removed from the public catalogue. This cannot be undone.
          </>
        ) : null
      }
      isLoading={isPending}
      onConfirm={onConfirm}
    />
  );
}
