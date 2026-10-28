"use client";

import { BookingDeleteDialog } from "./components/BookingDeleteDialog";
import { BookingFilters } from "./components/BookingFilters";
import { BookingFormDialog } from "./components/BookingFormDialog";
import { BookingPageHeader } from "./components/BookingPageHeader";
import { BookingQueryError } from "./components/BookingQueryError";
import { BookingTable } from "./components/BookingTable";

import useHandleBookings from "./hooks/useBooking";

export default function Booking() {
  const {
    setPage,
    search,
    setSearch,
    status,
    setStatus,
    editing,
    setEditing,
    deleting,
    setDeleting,
    deleteMutation,
    PAGE_SIZE,
    query,
    bookings,
    pagination,
    hasFilters,
    clearFilters,
    handleDelete,
  } = useHandleBookings();

  return (
    <div className="space-y-6">
      <BookingPageHeader
        total={pagination?.total}
        isFetching={query.isFetching}
        onRefresh={() => void query.refetch()}
      />

      <BookingFilters
        search={search}
        status={status}
        hasFilters={hasFilters}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onClearFilters={clearFilters}
      />

      {query.isError ? (
        <BookingQueryError
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : null}

      <BookingTable
        bookings={bookings}
        pagination={pagination}
        pageSize={PAGE_SIZE}
        isPending={query.isPending}
        isFetching={query.isFetching}
        hasFilters={hasFilters}
        onEdit={setEditing}
        onDelete={setDeleting}
        onPageChange={setPage}
        onClearFilters={clearFilters}
      />

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

      <BookingDeleteDialog
        booking={deleting}
        isPending={deleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
