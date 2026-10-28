export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export interface Booking {
  id: number;
  name: string;
  email: string;
  phone: string;
  /** ISO 8601 datetimes, earliest first (1–3 preferred slots). */
  scheduledAt: string[];
  message: string;
  status: BookingStatus;
  adminNote: string;
  confirmationEmailSentAt: string | null;
  cancellationEmailSentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  style: string;
  artist: string;
  duration: string;
  /** Calendar date in YYYY-MM-DD form, or null. */
  date: string | null;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MerchProduct {
  id: number;
  name: string;
  slug: string;
  /** Whole Philippine pesos. */
  price: number;
  imageUrl: string;
  category: string;
  preorder: boolean;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DesignItem {
  id: number;
  title: string;
  description: string;
  style: string;
  placement: string;
  imageUrl: string;
  category: string;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionUser {
  id: number;
  username: string;
}

export interface AuthSession {
  accessToken: string;
  user: SessionUser | null;
}
