"use client";

import { Plus, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

interface PortfolioPageHeaderProps {
  isFetching: boolean;
  onRefresh: () => void;
  onCreate: () => void;
}

export function PortfolioPageHeader({
  isFetching,
  onRefresh,
  onCreate,
}: PortfolioPageHeaderProps) {
  return (
    <PageHeader
      eyebrow="Public gallery"
      title="Portfolio"
      description="Curate finished work for the public portfolio. Drafts stay hidden until published."
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
            New item
          </Button>
        </>
      }
    />
  );
}
