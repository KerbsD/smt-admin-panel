import { z } from "zod";

import {
  calendarDateSchema,
  imageUrlSchema,
  optionalText,
  sortOrderSchema,
} from "./shared";

export const portfolioSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(120, "Title is too long."),
  description: optionalText(2000, "Description"),
  imageUrl: imageUrlSchema,
  style: optionalText(60, "Style"),
  artist: optionalText(120, "Artist"),
  duration: optionalText(60, "Duration"),
  date: calendarDateSchema,
  sortOrder: sortOrderSchema,
  published: z.boolean(),
});

export type PortfolioFormValues = z.infer<typeof portfolioSchema>;
