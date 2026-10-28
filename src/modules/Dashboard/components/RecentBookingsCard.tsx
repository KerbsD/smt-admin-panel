"use client";

import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";

import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { Booking } from "@/types/models";

import { RecentBookingItem } from "./RecentBookingItem";

interface RecentBookingsCardProps {
  bookings: Booking[];
  isError: boolean;
  isPending: boolean;
  error: unknown;
}

export function RecentBookingsCard({
  bookings,
  isError,
  isPending,
  error,
}: RecentBookingsCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold">Recent bookings</h2>
          <p className="text-xs text-muted-foreground">Newest requests first</p>
        </div>
        <Link
          href="/bookings"
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          View all
          <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {isError ? (
        <div className="p-5">
          <Alert variant="error" title="Could not load recent bookings">
            {error instanceof Error ? error.message : "Unknown error."}
          </Alert>
        </div>
      ) : isPending ? (
        <div className="divide-y divide-border">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 px-5 py-4">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-5">
          <EmptyState
            icon={CalendarDays}
            title="No bookings yet"
            description="Requests from the public site will show up here."
          />
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {bookings.map((booking) => (
            <RecentBookingItem key={booking.id} booking={booking} />
          ))}
        </ul>
      )}
    </Card>
  );
}
