import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/fetcher";

/**
 * Maps the backend's `{ errors: [{ field, message }] }` payload onto form
 * fields. Unknown fields (or a plain error message) are surfaced as a toast so
 * nothing is silently swallowed.
 */
export function applyApiErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  knownFields: readonly Path<T>[],
): void {
  if (!(error instanceof ApiError)) {
    toast.error(error instanceof Error ? error.message : "Something went wrong.");
    return;
  }

  if (error.fieldErrors.length === 0) {
    toast.error(error.message);
    return;
  }

  const known = new Set<string>(knownFields.map(String));
  let mapped = 0;

  for (const fieldError of error.fieldErrors) {
    if (known.has(fieldError.field)) {
      setError(fieldError.field as Path<T>, {
        type: "server",
        message: fieldError.message,
      });
      mapped += 1;
    } else {
      toast.error(fieldError.message);
    }
  }

  if (mapped === 0 && error.fieldErrors.length > 0) {
    toast.error(error.message);
  }
}
