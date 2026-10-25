import type {
  BookingListParams,
  DesignListParams,
  MerchListParams,
  PortfolioListParams,
} from "@/types/api";

/**
 * Central registry of query keys. Mutations invalidate by prefix, e.g.
 * invalidateQueries({ queryKey: queryKeys.bookings.all }) refreshes every
 * booking list (and the dashboard counters) in one call.
 */
export const queryKeys = {
  auth: {
    session: ["auth", "session"] as const,
  },
  bookings: {
    all: ["bookings"] as const,
    list: (params: BookingListParams) => ["bookings", "list", params] as const,
  },
  portfolio: {
    all: ["portfolio"] as const,
    list: (params: PortfolioListParams) => ["portfolio", "list", params] as const,
  },
  merch: {
    all: ["merch"] as const,
    list: (params: MerchListParams) => ["merch", "list", params] as const,
  },
  design: {
    all: ["design"] as const,
    list: (params: DesignListParams) => ["design", "list", params] as const,
  },
};
