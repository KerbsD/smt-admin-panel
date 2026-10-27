"use client";

import { RefreshCw, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

interface DesignPageHeaderProps {
  isFetching: boolean;
  onRefresh: () => void;
  onCreate: () => void;
}

export function DesignPageHeader({
  isFetching,
  onRefresh,
  onCreate,
}: DesignPageHeaderProps) {
  return (
    <PageHeader
      eyebrow="Flash and originals"
      title="Designs"
      description="Manage the design catalogue shown to clients — categories, placements, and availability."
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw
              className={isFetching ? "size-4 animate-spin" : "size-4"}
            />
            Refresh
          </Button>
          <Button size="sm" onClick={onCreate} className="gap-2">
            <Plus className="size-4" />
            New design
          </Button>
        </>
      }
    />
  );
}
