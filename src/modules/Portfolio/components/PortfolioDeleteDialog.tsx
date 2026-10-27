"use client";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { PortfolioItem } from "@/types/models";

interface PortfolioDeleteDialogProps {
  item: PortfolioItem | null;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function PortfolioDeleteDialog({
  item,
  isPending,
  onOpenChange,
  onConfirm,
}: PortfolioDeleteDialogProps) {
  return (
    <ConfirmDialog
      open={item !== null}
      onOpenChange={onOpenChange}
      title="Delete this portfolio item?"
      description={
        item ? (
          <>
            <span className="font-medium text-foreground">{item.title}</span>{" "}
            will be removed from the public gallery. This cannot be undone.
          </>
        ) : null
      }
      isLoading={isPending}
      onConfirm={onConfirm}
    />
  );
}
