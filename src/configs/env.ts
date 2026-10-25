const rawApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

/** Base URL of the Express API, without a trailing slash. */
export const API_URL = rawApiUrl.replace(/\/+$/, "");
