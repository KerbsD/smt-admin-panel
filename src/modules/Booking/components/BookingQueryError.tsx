"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface BookingQueryErrorProps {
  error: unknown;
  onRetry: () => void;
}

export function BookingQueryError({
  error,
  onRetry,
}: BookingQueryErrorProps) {
  return (
    <Alert variant="error" title="Could not load bookings">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>
          {error instanceof Error ? error.message : "Unknown error."}
        </span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      </div>
    </Alert>
  );
}
