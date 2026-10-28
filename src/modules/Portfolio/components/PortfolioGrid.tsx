"use client";

import type { PortfolioItem } from "@/types/models";

import { PortfolioCard } from "./PortfolioCard";

interface PortfolioGridProps {
  items: PortfolioItem[];
  onEdit: (item: PortfolioItem) => void;
  onDelete: (item: PortfolioItem) => void;
}

export function PortfolioGrid({
  items,
  onEdit,
  onDelete,
}: PortfolioGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <PortfolioCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
