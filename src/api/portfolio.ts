import { request } from "@/lib/api/fetcher";
import type {
  ApiEnvelope,
  MessageEnvelope,
  PaginatedEnvelope,
  PortfolioListParams,
} from "@/types/api";
import type { PortfolioItem } from "@/types/models";

export interface PortfolioInput {
  title: string;
  description: string;
  imageUrl: string;
  style: string;
  artist: string;
  duration: string;
  date: string | null;
  sortOrder: number;
  published: boolean;
}

export function listPortfolio(
  params: PortfolioListParams,
  signal?: AbortSignal,
): Promise<PaginatedEnvelope<PortfolioItem>> {
  return request<PaginatedEnvelope<PortfolioItem>>("/admin/portfolio", {
    query: params,
    signal,
  });
}

export function createPortfolio(input: PortfolioInput): Promise<ApiEnvelope<PortfolioItem>> {
  return request<ApiEnvelope<PortfolioItem>>("/admin/portfolio", {
    method: "POST",
    body: input,
  });
}

export function updatePortfolio(
  id: number,
  input: Partial<PortfolioInput>,
): Promise<ApiEnvelope<PortfolioItem>> {
  return request<ApiEnvelope<PortfolioItem>>(`/admin/portfolio/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function deletePortfolio(id: number): Promise<MessageEnvelope> {
  return request<MessageEnvelope>(`/admin/portfolio/${id}`, { method: "DELETE" });
}
