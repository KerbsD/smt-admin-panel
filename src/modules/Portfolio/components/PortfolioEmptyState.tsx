"use client";

import { Images, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface PortfolioEmptyStateProps {
  hasFilters: boolean;
  onCreate: () => void;
  onClearFilters: () => void;
}

export function PortfolioEmptyState({
  hasFilters,
  onCreate,
  onClearFilters,
}: PortfolioEmptyStateProps) {
  return (
    <EmptyState
      icon={Images}
      title={
        hasFilters ? "No pieces match these filters" : "The gallery is empty"
      }
      description={
        hasFilters
          ? "Try a different status or clear the search."
          : "Add finished work to start building the public portfolio."
      }
      action={
        hasFilters ? (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        ) : (
          <Button size="sm" onClick={onCreate} className="gap-2">
            <Plus className="size-4" />
            Add the first piece
          </Button>
        )
      }
    />
  );
}
