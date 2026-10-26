import {
  CalendarClock,
  CalendarDays,
  Images,
  PenTool,
  ShoppingBag,
} from "lucide-react";

import { useBookings } from "@/modules/Booking/useBookings";

import { useDesigns } from "@/modules/Design/useDesigns";
import { useMerch } from "@/modules/Merch/useMerch";
import { usePortfolio } from "@/modules/Portfolio/usePortfolio";

const RECENT_LIMIT = 6;
const COUNT_ONLY = { limit: 1, offset: 0 } as const;

function useDashboard() {
  const recentBookings = useBookings({
    limit: RECENT_LIMIT,
    offset: 0,
    sort: "createdAt",
    order: "desc",
  });
  const pendingBookings = useBookings({ ...COUNT_ONLY, status: "pending" });
  const publishedPortfolio = usePortfolio({ ...COUNT_ONLY, published: true });
  const publishedMerch = useMerch({ ...COUNT_ONLY, published: true });
  const publishedDesigns = useDesigns({ ...COUNT_ONLY, published: true });

  const totalBookings = recentBookings.data?.pagination.total;
  const bookings = recentBookings.data?.data ?? [];

  const isRefreshing =
    recentBookings.isFetching ||
    pendingBookings.isFetching ||
    publishedPortfolio.isFetching ||
    publishedMerch.isFetching ||
    publishedDesigns.isFetching;

  const refreshAll = () => {
    void Promise.all([
      recentBookings.refetch(),
      pendingBookings.refetch(),
      publishedPortfolio.refetch(),
      publishedMerch.refetch(),
      publishedDesigns.refetch(),
    ]);
  };

  const statCards = [
    {
      label: "Pending bookings",
      value: pendingBookings.data?.pagination.total ?? "—",
      hint: "Awaiting confirmation",
      icon: CalendarClock,
      tone: "amber" as const,
    },
    {
      label: "Total bookings",
      value: totalBookings ?? "—",
      hint: "All time",
      icon: CalendarDays,
      tone: "default" as const,
    },
    {
      label: "Portfolio live",
      value: publishedPortfolio.data?.pagination.total ?? "—",
      hint: "Published pieces",
      icon: Images,
      tone: "emerald" as const,
    },
    {
      label: "Merch live",
      value: publishedMerch.data?.pagination.total ?? "—",
      hint: "Published products",
      icon: ShoppingBag,
      tone: "sky" as const,
    },
    {
      label: "Designs live",
      value: publishedDesigns.data?.pagination.total ?? "—",
      hint: "Published designs",
      icon: PenTool,
      tone: "default" as const,
    },
  ];

  const quickLinks = [
    {
      href: "/bookings",
      label: "Review bookings",
      description: "Confirm dates and leave notes",
      icon: CalendarDays,
    },
    {
      href: "/portfolio",
      label: "Curate portfolio",
      description: "Publish finished work",
      icon: Images,
    },
    {
      href: "/merch",
      label: "Update merch",
      description: "Prices, drops, and preorders",
      icon: ShoppingBag,
    },
    {
      href: "/design",
      label: "Manage designs",
      description: "Flash and original pieces",
      icon: PenTool,
    },
  ];

  return {
    bookings,
    statCards,
    isRefreshing,
    refreshAll,
    recentBookings,
    quickLinks,
  };
}

export default useDashboard;
