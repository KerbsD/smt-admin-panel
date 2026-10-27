"use client";

import { RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";

interface BookingPageHeaderProps {
  total?: number;
  isFetching: boolean;
  onRefresh: () => void;
}

export function BookingPageHeader({
  total,
  isFetching,
  onRefresh,
}: BookingPageHeaderProps) {
  return (
    <PageHeader
      eyebrow="Studio schedule"
      title="Bookings"
      description="Review requests, confirm dates, and keep internal notes on each client."
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
          {total !== undefined ? (
            <Badge variant="outline">{total} total</Badge>
          ) : null}
        </>
      }
    />
  );
}
