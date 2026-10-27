"use client";

import { CalendarX, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import type { Pagination as PaginationMeta } from "@/types/api";
import type { Booking } from "@/types/models";

import { BookingTableRow } from "./BookingTableRow";

interface BookingTableProps {
  bookings: Booking[];
  pagination?: PaginationMeta;
  pageSize: number;
  isPending: boolean;
  isFetching: boolean;
  hasFilters: boolean;
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
  onPageChange: (page: number) => void;
  onClearFilters: () => void;
}

export function BookingTable({
  bookings,
  pagination,
  pageSize,
  isPending,
  isFetching,
  hasFilters,
  onEdit,
  onDelete,
  onPageChange,
  onClearFilters,
}: BookingTableProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold">All requests</h2>
          <p className="text-xs text-muted-foreground">
            Newest first · up to {pageSize} per page
          </p>
        </div>
        {isFetching && !isPending ? (
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <RefreshCw className="size-3 animate-spin" />
            Syncing
          </span>
        ) : null}
      </div>

      {isPending ? (
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
              <Skeleton className="hidden h-4 w-32 sm:block" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="hidden h-4 w-24 md:block" />
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={CalendarX}
            title={
              hasFilters ? "No bookings match these filters" : "No bookings yet"
            }
            description={
              hasFilters
                ? "Try a different status or clear the search."
                : "New requests from the public site will appear here."
            }
            action={
              hasFilters ? (
                <Button variant="outline" size="sm" onClick={onClearFilters}>
                  Clear filters
                </Button>
              ) : null
            }
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3 font-semibold">Client</th>
                <th className="px-5 py-3 font-semibold">Requested dates</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Received</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((booking) => (
                <BookingTableRow
                  key={booking.id}
                  booking={booking}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination ? (
        <div className="px-5 py-4">
          <Pagination
            pagination={pagination}
            onPageChange={onPageChange}
            disabled={isFetching}
          />
        </div>
      ) : null}
    </Card>
  );
}
