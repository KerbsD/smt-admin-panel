import type { ApiEnvelope } from "@/types/api";
import { request } from "@/lib/api/fetcher";

export const UPLOAD_FOLDERS = ["portfolio", "merch", "design", "misc"] as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export interface UploadedImage {
  /** Public Supabase URL, safe to store in `imageUrl`. */
  url: string;
  /** Object path inside the bucket (useful for cleanup later). */
  path: string;
  contentType: string;
  size: number;
}

export function uploadImage(
  file: File,
  folder: UploadFolder,
): Promise<ApiEnvelope<UploadedImage>> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);

  return request<ApiEnvelope<UploadedImage>>("/admin/uploads", {
    method: "POST",
    body: form,
    // Photos can be a few megabytes; keep a longer budget than JSON calls.
    timeoutMs: 60_000,
  });
}
