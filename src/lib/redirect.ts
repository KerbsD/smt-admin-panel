/**
 * Only allow same-app redirects. Blocks `https://evil.example` and protocol
 * relative `//evil.example` values that could be smuggled in through ?next=.
 */
export function safeNextPath(value: string | null | undefined, fallback = "/"): string {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}
