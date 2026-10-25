import { z } from "zod";

import { imageUrlSchema, sortOrderSchema } from "./shared";

export const merchSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(120, "Name is too long."),
  price: z
    .number({ invalid_type_error: "Price is required." })
    .int("Price must be a whole number of pesos.")
    .min(0, "Price must be at least 0.")
    .max(10_000_000, "Price is too large."),
  slug: z.string().trim().max(160, "Slug is too long."),
  imageUrl: imageUrlSchema,
  category: z
    .string()
    .trim()
    .min(1, "Category is required.")
    .max(60, "Category is too long."),
  preorder: z.boolean(),
  sortOrder: sortOrderSchema,
  published: z.boolean(),
});

export type MerchFormValues = z.infer<typeof merchSchema>;
