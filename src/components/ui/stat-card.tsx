import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "amber" | "emerald" | "sky";
}

const tones = {
  default: "bg-primary/5 text-primary",
  amber: "bg-amber-100 text-amber-700",
  emerald: "bg-emerald-100 text-emerald-700",
  sky: "bg-sky-100 text-sky-700",
} as const;

export function StatCard({ label, value, hint, icon: Icon, tone = "default" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
        </div>
        <div className={cn("flex size-10 items-center justify-center rounded-lg", tones[tone])}>
          <Icon className="size-5" />
        </div>
      </div>
      {hint ? <p className="mt-3 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
