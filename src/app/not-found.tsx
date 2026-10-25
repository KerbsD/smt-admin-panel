import { Compass } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Compass className="size-6" />
      </div>
      <div className="space-y-1.5">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          404
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          That page doesn&apos;t exist, or it moved somewhere else in the admin console.
        </p>
      </div>
      <Link href="/" className={buttonVariants()}>
        Back to dashboard
      </Link>
    </div>
  );
}
