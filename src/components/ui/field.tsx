import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface FieldProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  optional,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <div className="flex items-center justify-between gap-2">
          <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
            {label}
            {required ? <span className="ml-0.5 text-destructive">*</span> : null}
          </label>
          {optional ? (
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Optional
            </span>
          ) : null}
        </div>
      ) : null}
      {children}
      {error ? (
        <p role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
