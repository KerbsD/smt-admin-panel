import { z } from "zod";

import { imageUrlSchema, optionalText, sortOrderSchema } from "./shared";

export const designSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(120, "Title is too long."),
  description: optionalText(2000, "Description"),
  style: optionalText(60, "Style"),
  placement: optionalText(120, "Placement"),
  imageUrl: imageUrlSchema,
  category: z
    .string()
    .trim()
    .min(1, "Category is required.")
    .max(60, "Category is too long."),
  sortOrder: sortOrderSchema,
  published: z.boolean(),
});

export type DesignFormValues = z.infer<typeof designSchema>;
