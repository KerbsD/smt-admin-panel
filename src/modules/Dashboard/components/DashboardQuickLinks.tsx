import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";

interface DashboardQuickLink {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface DashboardQuickLinksProps {
  quickLinks: DashboardQuickLink[];
}

export function DashboardQuickLinks({
  quickLinks,
}: DashboardQuickLinksProps) {
  return (
    <Card className="p-5">
      <h2 className="text-sm font-semibold">Manage the studio</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Jump straight into the section you need.
      </p>

      <div className="mt-4 space-y-2">
        {quickLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-muted/50"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:text-foreground">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">{item.label}</span>
                <span className="block truncate text-[11px] text-muted-foreground">
                  {item.description}
                </span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
