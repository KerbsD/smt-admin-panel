import { z } from "zod";

const MAX_PASSWORD_BYTES = 72;

const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters.")
  .max(128, "Password must be at most 128 characters.")
  .refine(
    (value) => new TextEncoder().encode(value).length <= MAX_PASSWORD_BYTES,
    "Password must be at most 72 bytes.",
  );

export const loginSchema = z.object({
  user: z.string().trim().min(1, "Username is required.").max(64, "Username is too long."),
  pwd: z.string().min(1, "Password is required.").max(128, "Password is too long."),
});

export const registerSchema = z
  .object({
    user: z
      .string()
      .trim()
      .min(3, "Username must be between 3 and 24 characters.")
      .max(24, "Username must be between 3 and 24 characters.")
      .regex(/^[A-Za-z0-9]+$/, "Username must only contain letters and numbers."),
    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .max(254, "Email is too long.")
      .email("Must be a valid email address."),
    pwd: passwordSchema,
    confirmPwd: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.pwd === values.confirmPwd, {
    path: ["confirmPwd"],
    message: "Passwords do not match.",
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(254, "Email is too long.")
    .email("Must be a valid email address."),
});

export const resendVerificationSchema = forgotPasswordSchema;

export const resetPasswordSchema = z
  .object({
    newPwd: passwordSchema,
    confirmPwd: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.newPwd === values.confirmPwd, {
    path: ["confirmPwd"],
    message: "Passwords do not match.",
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
