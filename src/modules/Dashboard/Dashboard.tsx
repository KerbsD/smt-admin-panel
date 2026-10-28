"use client";

import {
  ArrowRight,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import Link from "next/link";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/ui/stat-card";
import { formatBookingSlot, formatDate } from "@/lib/format";

import { BookingStatusBadge } from "@/modules/Booking/components/BookingStatusBadge";

import useDashboard from "./useDashboard";

export default function Dashboard() {
  const {
    bookings,
    statCards,
    isRefreshing,
    refreshAll,
    recentBookings,
    quickLinks,
  } = useDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Studio overview"
        title="Dashboard"
        description="A quick read on requests, the public catalogue, and what needs attention."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAll}
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold">Recent bookings</h2>
              <p className="text-xs text-muted-foreground">
                Newest requests first
              </p>
            </div>
            <Link
              href="/bookings"
              className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {recentBookings.isError ? (
            <div className="p-5">
              <Alert variant="error" title="Could not load recent bookings">
                {recentBookings.error instanceof Error
                  ? recentBookings.error.message
                  : "Unknown error."}
              </Alert>
            </div>
          ) : recentBookings.isPending ? (
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
                <li key={booking.id}>
                  <Link
                    href="/bookings"
                    className="flex flex-col gap-2 px-5 py-3.5 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {booking.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {booking.email} · requested{" "}
                        {formatBookingSlot(booking.scheduledAt[0])}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-[11px] text-muted-foreground">
                        {formatDate(booking.createdAt)}
                      </span>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold">Manage the studio</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Jump straight into the section you need.
          </p>

          <div className="mt-4 space-y-2">
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-muted/50"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:text-foreground">
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">
                      {item.label}
                    </span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
