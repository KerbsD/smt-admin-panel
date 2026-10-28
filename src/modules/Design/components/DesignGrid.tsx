"use client";

import type { DesignItem } from "@/types/models";

import { DesignCard } from "./DesignCard";

interface DesignGridProps {
  designs: DesignItem[];
  onEdit: (design: DesignItem) => void;
  onDelete: (design: DesignItem) => void;
}

export function DesignGrid({ designs, onEdit, onDelete }: DesignGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {designs.map((design) => (
        <DesignCard
          key={design.id}
          design={design}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
