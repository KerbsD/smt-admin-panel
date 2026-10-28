"use client";

import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

interface DashboardHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({
  isRefreshing,
  onRefresh,
}: DashboardHeaderProps) {
  return (
    <PageHeader
      eyebrow="Studio overview"
      title="Dashboard"
      description="A quick read on requests, the public catalogue, and what needs attention."
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw
            className={isRefreshing ? "size-4 animate-spin" : "size-4"}
          />
          Refresh
        </Button>
      }
    />
  );
}
