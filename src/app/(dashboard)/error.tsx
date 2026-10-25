"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-red-100 text-red-700">
        <AlertTriangle className="size-6" />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight">This page failed to load</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred."}
        </p>
        {error.digest ? (
          <p className="font-mono text-[11px] text-muted-foreground">Ref: {error.digest}</p>
        ) : null}
      </div>
      <Button type="button" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
