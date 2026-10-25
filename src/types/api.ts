import type { BookingStatus } from "./models";

export interface Pagination {
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
}

export interface ApiEnvelope<T> {
  success: true;
  data: T;
}

export interface PaginatedEnvelope<T> {
  success: true;
  data: T[];
  pagination: Pagination;
}

export interface MessageEnvelope {
  success: boolean;
  message: string;
}

export type BookingListParams = {
  status?: BookingStatus;
  from?: string;
  to?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sort?: "createdAt" | "scheduledAt";
  order?: "asc" | "desc";
};

export type PortfolioListParams = {
  published?: boolean;
  style?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sort?: "sortOrder" | "date" | "createdAt" | "title";
  order?: "asc" | "desc";
};

export type MerchListParams = {
  published?: boolean;
  preorder?: boolean;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sort?: "sortOrder" | "name" | "price" | "createdAt";
  order?: "asc" | "desc";
};

export type DesignListParams = {
  published?: boolean;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sort?: "sortOrder" | "title" | "createdAt";
  order?: "asc" | "desc";
};

export type QueryValue = string | number | boolean | null | undefined;

export type QueryParams = Record<string, QueryValue | QueryValue[]>;
