import { z } from "zod";

import { BOOKING_STATUSES } from "@/types/models";

export const bookingUpdateSchema = z
  .object({
    status: z.enum(BOOKING_STATUSES),
    adminNote: z.string().trim().max(2000, "Admin note is too long."),
    reschedule: z.boolean(),
    scheduledAt: z.array(z.string()).max(3, "At most 3 preferred dates."),
  })
  .superRefine((values, ctx) => {
    if (!values.reschedule) return;

    if (values.scheduledAt.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["scheduledAt"],
        message: "Add at least one preferred date.",
      });
      return;
    }

    values.scheduledAt.forEach((value, index) => {
      const date = new Date(value);

      if (value === "" || Number.isNaN(date.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["scheduledAt", index],
          message: "Enter a valid date and time.",
        });
        return;
      }

      if (date.getTime() <= Date.now()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["scheduledAt", index],
          message: "Dates must be in the future.",
        });
      }
    });
  });

export type BookingUpdateValues = z.infer<typeof bookingUpdateSchema>;
