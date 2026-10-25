import type { SessionUser } from "@/types/models";

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Reads the display identity out of the access token.
 * This is NOT a security check: the API remains the source of truth. It only
 * saves a `/me` round-trip for showing the username in the sidebar.
 */
export function getSessionUser(accessToken: string): SessionUser | null {
  try {
    const [, payload] = accessToken.split(".");
    if (!payload) return null;

    const parsed = JSON.parse(base64UrlDecode(payload)) as unknown;
    if (typeof parsed !== "object" || parsed === null) return null;

    const { sub, username } = parsed as { sub?: unknown; username?: unknown };
    const id = typeof sub === "string" ? Number(sub) : NaN;

    if (!Number.isInteger(id) || id <= 0) return null;
    if (typeof username !== "string" || username === "") return null;

    return { id, username };
  } catch {
    return null;
  }
}
