import { API_URL } from "@/configs/env";
import { useAuthStore } from "@/store/useAuthStore";
import type { QueryParams } from "@/types/api";

export interface ApiFieldError {
  field: string;
  message: string;
}

/**
 * Error thrown for every non-2xx API response (and for timeouts).
 * `status` is 0 when the request never reached the server.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: ApiFieldError[];
  readonly requestId?: string;
  readonly payload: unknown;

  constructor(message: string, status: number, payload?: unknown, requestId?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
    this.requestId = requestId;
    this.fieldErrors = readFieldErrors(payload);
  }
}

export function isApiError(value: unknown): value is ApiError {
  return value instanceof ApiError;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readFieldErrors(payload: unknown): ApiFieldError[] {
  if (!isRecord(payload) || !Array.isArray(payload.errors)) return [];

  return payload.errors.flatMap((item) => {
    if (!isRecord(item)) return [];
    if (typeof item.field !== "string" || typeof item.message !== "string") return [];
    return [{ field: item.field, message: item.message }];
  });
}

function readMessage(payload: unknown): string | undefined {
  if (typeof payload === "string" && payload.trim() !== "") return payload;
  if (isRecord(payload) && typeof payload.message === "string") return payload.message;
  return undefined;
}

function readRequestId(payload: unknown): string | undefined {
  return isRecord(payload) && typeof payload.requestId === "string"
    ? payload.requestId
    : undefined;
}

function buildUrl(path: string, query?: QueryParams): string {
  const url = new URL(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`);

  for (const [key, raw] of Object.entries(query ?? {})) {
    const values = Array.isArray(raw) ? raw : [raw];
    for (const value of values) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.append(key, String(value));
    }
  }

  return url.toString();
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return undefined;
    }
  }

  try {
    const text = await response.text();
    return text === "" ? undefined : text;
  } catch {
    return undefined;
  }
}

function toApiError(response: Response, payload: unknown): ApiError {
  const requestId = readRequestId(payload);
  const fallback =
    response.status === 401
      ? "Your session has expired. Please sign in again."
      : response.status === 403
        ? "You do not have permission to do that."
        : response.status === 404
          ? "That record could not be found."
          : response.status === 429
            ? "Too many requests. Please wait a moment and try again."
            : `Request failed (${response.status}).`;

  return new ApiError(readMessage(payload) ?? fallback, response.status, payload, requestId);
}

function isAbortError(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "AbortError" || error.name === "TimeoutError")
  );
}

let refreshPromise: Promise<string | null> | null = null;

/**
 * Exchanges the httpOnly refresh cookie for a new access token.
 * Concurrent callers share one request so a burst of 401s can't rotate the
 * refresh token multiple times (the backend revokes token families on reuse).
 */
export function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async (): Promise<string | null> => {
    const tokenAtStart = useAuthStore.getState().accessToken;
    const clearIfUnchanged = () => {
      // Don't wipe a token that a successful login wrote while this refresh
      // was still in flight.
      if (useAuthStore.getState().accessToken === tokenAtStart) {
        useAuthStore.getState().clear();
      }
    };

    try {
      const response = await fetch(buildUrl("/auth/refresh"), {
        method: "POST",
        credentials: "include",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        clearIfUnchanged();
        return null;
      }

      const data = (await response.json()) as unknown;
      const accessToken =
        isRecord(data) && typeof data.accessToken === "string" ? data.accessToken : null;

      if (!accessToken) {
        clearIfUnchanged();
        return null;
      }

      useAuthStore.getState().setAccessToken(accessToken);
      return accessToken;
    } catch {
      clearIfUnchanged();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: QueryParams;
  /** Set false for the auth endpoints that rely on cookies instead of a bearer token. */
  auth?: boolean;
  signal?: AbortSignal;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, auth = true, signal } = options;
  const url = buildUrl(path, query);
  const timeoutSignal = AbortSignal.timeout(20_000);

  const execute = (token: string | null) => {
    const headers = new Headers({ Accept: "application/json" });
    if (body !== undefined) headers.set("Content-Type", "application/json");
    if (auth && token) headers.set("Authorization", `Bearer ${token}`);

    return fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "include",
      cache: "no-store",
      signal: signal ? AbortSignal.any([signal, timeoutSignal]) : timeoutSignal,
    });
  };

  let response: Response;
  try {
    response = await execute(auth ? useAuthStore.getState().accessToken : null);
  } catch (error) {
    if (signal?.aborted) throw error;
    if (isAbortError(error)) {
      throw new ApiError("The request timed out. Check that the API is running.", 0);
    }
    throw error;
  }

  // A 401 on a protected route means the short-lived access token expired.
  // Refresh once, then replay the original request with the new token.
  if (response.status === 401 && auth && !path.startsWith("/auth/")) {
    const nextToken = await refreshAccessToken();
    if (!nextToken) {
      throw new ApiError("Your session has expired. Please sign in again.", 401);
    }

    try {
      response = await execute(nextToken);
    } catch (error) {
      if (signal?.aborted) throw error;
      if (isAbortError(error)) {
        throw new ApiError("The request timed out. Check that the API is running.", 0);
      }
      throw error;
    }
  }

  const payload = await readBody(response);
  if (!response.ok) throw toApiError(response, payload);

  return payload as T;
}
