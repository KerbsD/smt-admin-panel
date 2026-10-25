"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button, buttonVariants } from "@/components/ui/button";

export default function GlobalError({
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
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-red-100 text-red-700">
            <AlertTriangle className="size-6" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
            <p className="max-w-md text-sm text-muted-foreground">
              An unexpected error broke this page. Try again — if it keeps happening, check
              that the API is running and reachable.
            </p>
            {error.digest ? (
              <p className="font-mono text-[11px] text-muted-foreground">Ref: {error.digest}</p>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={reset}>
              Try again
            </Button>
            <Link href="/" className={buttonVariants({ variant: "outline" })}>
              Back to dashboard
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
