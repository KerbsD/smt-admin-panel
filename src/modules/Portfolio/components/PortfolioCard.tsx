"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RemoteImage } from "@/components/ui/remote-image";
import { formatDate } from "@/lib/format";
import type { PortfolioItem } from "@/types/models";

interface PortfolioCardProps {
  item: PortfolioItem;
  onEdit: (item: PortfolioItem) => void;
  onDelete: (item: PortfolioItem) => void;
}

export function PortfolioCard({ item, onEdit, onDelete }: PortfolioCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative">
        <RemoteImage
          src={item.imageUrl}
          alt={item.title}
          className="aspect-4/3 w-full"
          imgClassName="transition-transform duration-300 hover:scale-[1.02]"
        />
        <div className="absolute left-3 top-3">
          <Badge variant={item.published ? "success" : "muted"}>
            {item.published ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold leading-snug">{item.title}</h2>
          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
            #{item.sortOrder}
          </span>
        </div>

        {item.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
          {item.style ? (
            <span className="rounded bg-muted px-1.5 py-0.5">{item.style}</span>
          ) : null}
          {item.artist ? (
            <span className="rounded bg-muted px-1.5 py-0.5">{item.artist}</span>
          ) : null}
          {item.duration ? (
            <span className="rounded bg-muted px-1.5 py-0.5">
              {item.duration}
            </span>
          ) : null}
          {item.date ? (
            <span className="rounded bg-muted px-1.5 py-0.5">
              {formatDate(item.date)}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-end gap-1 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
            className="gap-1.5"
          >
            <Pencil className="size-3.5" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(item)}
            className="gap-1.5 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
