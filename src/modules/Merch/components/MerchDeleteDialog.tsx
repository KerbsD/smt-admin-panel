"use client";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { MerchProduct } from "@/types/models";

interface MerchDeleteDialogProps {
  product: MerchProduct | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function MerchDeleteDialog({
  product,
  isPending,
  onOpenChange,
  onConfirm,
}: MerchDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={product !== null}
      onOpenChange={onOpenChange}
      title="Delete this product?"
      description={
        product ? (
          <>
            <span className="font-medium text-foreground">{product.name}</span>{" "}
            will be removed from the public store. This cannot be undone.
          </>
        ) : null
      }
      isLoading={isPending}
      onConfirm={onConfirm}
    />
  );
}
