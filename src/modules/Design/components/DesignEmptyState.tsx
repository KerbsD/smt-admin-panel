"use client";

import { PenTool, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

interface DesignEmptyStateProps {
  hasFilters: boolean;
  onCreate: () => void;
  onClearFilters: () => void;
}

export function DesignEmptyState({
  hasFilters,
  onCreate,
  onClearFilters,
}: DesignEmptyStateProps) {
  return (
    <EmptyState
      icon={PenTool}
      title={hasFilters ? "No designs match these filters" : "No designs yet"}
      description={
        hasFilters
          ? "Try a different status or clear the search."
          : "Add your first flash piece or original design."
      }
      action={
        hasFilters ? (
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear filters
          </Button>
        ) : (
          <Button size="sm" onClick={onCreate} className="gap-2">
            <Plus className="size-4" />
            Add the first design
          </Button>
        )
      }
    />
  );
}
