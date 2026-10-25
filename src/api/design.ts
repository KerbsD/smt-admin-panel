import { request } from "@/lib/api/fetcher";
import type {
  ApiEnvelope,
  DesignListParams,
  MessageEnvelope,
  PaginatedEnvelope,
} from "@/types/api";
import type { DesignItem } from "@/types/models";

export interface DesignInput {
  title: string;
  description: string;
  style: string;
  placement: string;
  imageUrl: string;
  category: string;
  sortOrder: number;
  published: boolean;
}

export function listDesigns(
  params: DesignListParams,
  signal?: AbortSignal,
): Promise<PaginatedEnvelope<DesignItem>> {
  return request<PaginatedEnvelope<DesignItem>>("/admin/design", {
    query: params,
    signal,
  });
}

export function createDesign(input: DesignInput): Promise<ApiEnvelope<DesignItem>> {
  return request<ApiEnvelope<DesignItem>>("/admin/design", {
    method: "POST",
    body: input,
  });
}

export function updateDesign(
  id: number,
  input: Partial<DesignInput>,
): Promise<ApiEnvelope<DesignItem>> {
  return request<ApiEnvelope<DesignItem>>(`/admin/design/${id}`, {
    method: "PATCH",
    body: input,
  });
}

export function deleteDesign(id: number): Promise<MessageEnvelope> {
  return request<MessageEnvelope>(`/admin/design/${id}`, { method: "DELETE" });
}
