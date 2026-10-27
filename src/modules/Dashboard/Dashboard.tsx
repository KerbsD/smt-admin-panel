"use client";

import { DashboardHeader } from "./components/DashboardHeader";
import { DashboardQuickLinks } from "./components/DashboardQuickLinks";
import { DashboardStats } from "./components/DashboardStats";
import { RecentBookingsCard } from "./components/RecentBookingsCard";

import useDashboard from "./hooks/useDashboard";

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
      <DashboardHeader isRefreshing={isRefreshing} onRefresh={refreshAll} />

      <DashboardStats statCards={statCards} />

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <RecentBookingsCard
          bookings={bookings}
          isError={recentBookings.isError}
          isPending={recentBookings.isPending}
          error={recentBookings.error}
        />

        <DashboardQuickLinks quickLinks={quickLinks} />
      </div>
    </div>
  );
}
