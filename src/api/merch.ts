import { request } from "@/lib/api/fetcher";
import type {
  ApiEnvelope,
  MerchListParams,
  MessageEnvelope,
  PaginatedEnvelope,
} from "@/types/api";
import type { MerchProduct } from "@/types/models";

export interface MerchInput {
  name: string;
  price: number;
  slug?: string;
  imageUrl: string;
  category: string;
  preorder: boolean;
  sortOrder: number;
  published: boolean;
}

export function listMerch(
  params: MerchListParams,
  signal?: AbortSignal,
): Promise<PaginatedEnvelope<MerchProduct>> {
  return request<PaginatedEnvelope<MerchProduct>>("/admin/merch", {
    query: params,
    signal,
  });
}

export function createMerch(input: MerchInput): Promise<ApiEnvelope<MerchProduct>> {
  return request<ApiEnvelope<MerchProduct>>("/admin/merch", {
    method: "POST",
    body: input,
  });
}

export function updateMerch(
  id: number,
  input: Partial<MerchInput>,
): Promise<ApiEnvelope<MerchProduct>> {
  return request<ApiEnvelope<MerchProduct>>(`/admin/merch/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function deleteMerch(id: number): Promise<MessageEnvelope> {
  return request<MessageEnvelope>(`/admin/merch/${id}`, { method: "DELETE" });
}
