"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface DesignQueryErrorProps {
  error: unknown;
  onRetry: () => void;
}

export function DesignQueryError({ error, onRetry }: DesignQueryErrorProps) {
  return (
    <Alert variant="error" title="Could not load designs">
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
