"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { BOOKING_STATUSES, type BookingStatus } from "@/types/models";

interface BookingFiltersProps {
  search: string;
  status: BookingStatus | "all";
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: BookingStatus | "all") => void;
  onClearFilters: () => void;
}

export function BookingFilters({
  search,
  status,
  hasFilters,
  onSearchChange,
  onStatusChange,
  onClearFilters,
}: BookingFiltersProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search by name or email…"
          label="Search bookings"
        />
        <div className="flex items-center gap-2">
          <Select
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as BookingStatus | "all")
            }
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
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
