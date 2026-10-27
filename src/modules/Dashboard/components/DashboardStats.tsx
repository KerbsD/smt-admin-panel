import type { ComponentProps } from "react";

import { StatCard } from "@/components/ui/stat-card";

type DashboardStat = ComponentProps<typeof StatCard>;

interface DashboardStatsProps {
  statCards: DashboardStat[];
}

export function DashboardStats({ statCards }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {statCards.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
