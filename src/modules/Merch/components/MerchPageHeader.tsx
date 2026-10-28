"use client";

import { Plus, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

interface MerchPageHeaderProps {
  isFetching: boolean;
  onRefresh: () => void;
  onCreate: () => void;
}

export function MerchPageHeader({
  isFetching,
  onRefresh,
  onCreate,
}: MerchPageHeaderProps) {
  return (
    <PageHeader
      eyebrow="Public store"
      title="Merch"
      description="Manage products, prices, and preorder drops for the public merch page."
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
            New product
          </Button>
        </>
      }
    />
  );
}
