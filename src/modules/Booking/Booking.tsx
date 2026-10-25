"use client";

import { CalendarX, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatBookingSlot, formatDate } from "@/lib/format";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { BookingFormDialog } from "@/modules/Booking/BookingFormDialog";
import { BookingStatusBadge } from "@/modules/Booking/BookingStatusBadge";
import { useDeleteBooking } from "@/modules/Booking/useBookingMutations";
import { useBookings } from "@/modules/Booking/useBookings";
import { BOOKING_STATUSES, type Booking, type BookingStatus } from "@/types/models";

const PAGE_SIZE = 20;

export default function Booking() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [editing, setEditing] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState<Booking | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);
  const deleteMutation = useDeleteBooking();

  const query = useBookings({
    status: status === "all" ? undefined : status,
    search: debouncedSearch.trim() || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    sort: "createdAt",
    order: "desc",
  });

  const bookings = query.data?.data ?? [];
  const pagination = query.data?.pagination;
  const hasFilters = debouncedSearch.trim() !== "" || status !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setPage(1);
  };

  const handleDelete = () => {
    if (!deleting) return;

    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success(`Booking #${deleting.id} deleted.`);
        setDeleting(null);
        if (bookings.length === 1 && page > 1) setPage(page - 1);
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Could not delete booking.");
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Studio schedule"
        title="Bookings"
        description="Review requests, confirm dates, and keep internal notes on each client."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void query.refetch()}
              disabled={query.isFetching}
              className="gap-2"
            >
              <RefreshCw className={query.isFetching ? "size-4 animate-spin" : "size-4"} />
              Refresh
            </Button>
            {pagination ? (
              <Badge variant="outline">{pagination.total} total</Badge>
            ) : null}
          </>
        }
      />

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search by name or email…"
            label="Search bookings"
          />
          <div className="flex items-center gap-2">
            <Select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as BookingStatus | "all");
                setPage(1);
              }}
              aria-label="Filter by status"
              className="sm:w-44"
            >
              <option value="all">All statuses</option>
              {BOOKING_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </option>
              ))}
            </Select>
            {hasFilters ? (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      {query.isError ? (
        <Alert variant="error" title="Could not load bookings">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>{query.error instanceof Error ? query.error.message : "Unknown error."}</span>
            <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
              Try again
            </Button>
          </div>
        </Alert>
      ) : null}

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">All requests</h2>
            <p className="text-xs text-muted-foreground">
              Newest first · up to {PAGE_SIZE} per page
            </p>
          </div>
          {query.isFetching && !query.isPending ? (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <RefreshCw className="size-3 animate-spin" />
              Syncing
            </span>
          ) : null}
        </div>

        {query.isPending ? (
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
              title={hasFilters ? "No bookings match these filters" : "No bookings yet"}
              description={
                hasFilters
                  ? "Try a different status or clear the search."
                  : "New requests from the public site will appear here."
              }
              action={
                hasFilters ? (
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear filters
                  </Button>
                ) : null
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
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
                  <tr key={booking.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-4 align-top">
                      <p className="font-medium">{booking.name}</p>
                      <p className="text-xs text-muted-foreground">{booking.email}</p>
                      {booking.phone ? (
                        <p className="text-xs text-muted-foreground">{booking.phone}</p>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="space-y-0.5">
                        {booking.scheduledAt.map((date) => (
                          <p key={date} className="text-xs text-muted-foreground">
                            {formatBookingSlot(date)}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <BookingStatusBadge status={booking.status} />
                      {booking.adminNote ? (
                        <p className="mt-1.5 max-w-40 truncate text-[11px] text-muted-foreground">
                          {booking.adminNote}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 align-top text-xs text-muted-foreground">
                      {formatDate(booking.createdAt)}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditing(booking)}
                          aria-label={`Edit booking from ${booking.name}`}
                          title="Edit booking"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleting(booking)}
                          aria-label={`Delete booking from ${booking.name}`}
                          title="Delete booking"
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination ? (
          <div className="px-5 py-4">
            <Pagination pagination={pagination} onPageChange={setPage} disabled={query.isFetching} />
          </div>
        ) : null}
      </Card>

      {editing ? (
        <BookingFormDialog
          key={editing.id}
          booking={editing}
          open
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        />
      ) : null}

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Delete this booking?"
        description={
          deleting ? (
            <>
              The request from <span className="font-medium text-foreground">{deleting.name}</span>{" "}
              on {formatDate(deleting.createdAt)} will be permanently removed. This
              cannot be undone.
            </>
          ) : null
        }
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
