import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const inputClassName =
  "flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground shadow-xs transition-colors outline-none placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25 disabled:cursor-not-allowed disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-destructive/15";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input ref={ref} type={type} className={cn(inputClassName, className)} {...props} />
  ),
);

Input.displayName = "Input";
