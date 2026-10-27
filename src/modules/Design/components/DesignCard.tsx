"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RemoteImage } from "@/components/ui/remote-image";
import type { DesignItem } from "@/types/models";

interface DesignCardProps {
  design: DesignItem;
  onEdit: (design: DesignItem) => void;
  onDelete: (design: DesignItem) => void;
}

export function DesignCard({ design, onEdit, onDelete }: DesignCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative">
        <RemoteImage
          src={design.imageUrl}
          alt={design.title}
          className="aspect-square w-full"
          imgClassName="transition-transform duration-300 hover:scale-[1.02]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge variant={design.published ? "success" : "muted"}>
            {design.published ? "Published" : "Draft"}
          </Badge>
          <Badge variant="secondary">{design.category}</Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-semibold leading-snug">{design.title}</h2>

        {design.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {design.description}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
          {design.style ? (
            <span className="rounded bg-muted px-1.5 py-0.5">
              Style · {design.style}
            </span>
          ) : null}
          {design.placement ? (
            <span className="rounded bg-muted px-1.5 py-0.5">
              Placement · {design.placement}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="font-mono text-[10px] text-muted-foreground">
            sort #{design.sortOrder}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(design)}
              className="gap-1.5"
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(design)}
              className="gap-1.5 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
