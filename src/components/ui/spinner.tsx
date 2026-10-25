import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-hidden className={cn("size-4 animate-spin", className)} />;
}

export function FullPageLoader({ label = "Loading your workspace" }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <span className="font-mono text-sm font-bold tracking-tight">SMT</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner />
        {label}…
      </div>
    </div>
  );
}
