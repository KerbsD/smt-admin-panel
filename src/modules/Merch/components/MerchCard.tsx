"use client";

import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RemoteImage } from "@/components/ui/remote-image";
import { formatPeso } from "@/lib/format";
import type { MerchProduct } from "@/types/models";

interface MerchCardProps {
  product: MerchProduct;
  onEdit: (product: MerchProduct) => void;
  onDelete: (product: MerchProduct) => void;
}

export function MerchCard({ product, onEdit, onDelete }: MerchCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative">
        <RemoteImage
          src={product.imageUrl}
          alt={product.name}
          className="aspect-square w-full"
          imgClassName="transition-transform duration-300 hover:scale-[1.02]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge variant={product.published ? "success" : "muted"}>
            {product.published ? "Published" : "Draft"}
          </Badge>
          {product.preorder ? <Badge variant="warning">Preorder</Badge> : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold leading-snug">{product.name}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {product.category} · /{product.slug}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold tabular-nums">
            {formatPeso(product.price)}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="font-mono text-[10px] text-muted-foreground">
            sort #{product.sortOrder}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
              className="gap-1.5"
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(product)}
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
