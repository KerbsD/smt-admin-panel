"use client";

import { Package, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface MerchEmptyStateProps {
  hasFilters: boolean;
  onCreate: () => void;
  onClearFilters: () => void;
}

export function MerchEmptyState({
  hasFilters,
  onCreate,
  onClearFilters,
}: MerchEmptyStateProps) {
  return (
    <EmptyState
      icon={Package}
      title={
        hasFilters ? "No products match these filters" : "No products yet"
      }
      description={
        hasFilters
          ? "Try a different status or clear the search."
          : "Add your first product to start building the store."
      }
      action={
        hasFilters ? (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        ) : (
          <Button size="sm" onClick={onCreate} className="gap-2">
            <Plus className="size-4" />
            Add the first product
          </Button>
        )
      }
    />
  );
}
