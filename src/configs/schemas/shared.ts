import { z } from "zod";

// Mirrors the server's acceptance rules (site-relative path or http(s) URL).
export const imageUrlSchema = z
  .string()
  .trim()
  .min(1, "Image URL is required.")
  .max(2048, "Image URL is too long.")
  .refine(
    (value) => /^\/(?!\/)/.test(value) || /^https?:\/\/[^\s]+$/i.test(value),
    "Use a site-relative path (/images/a.jpg) or an http(s) URL.",
  );

export const sortOrderSchema = z
  .number({ invalid_type_error: "Sort order must be a number." })
  .int("Sort order must be a whole number.")
  .min(0, "Sort order must be at least 0.");

export const optionalText = (max: number, label: string) =>
  z.string().trim().max(max, `${label} is too long.`);

export const calendarDateSchema = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value),
    "Use a calendar date (YYYY-MM-DD).",
  );
