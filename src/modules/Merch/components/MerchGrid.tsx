"use client";

import type { MerchProduct } from "@/types/models";

import { MerchCard } from "./MerchCard";

interface MerchGridProps {
  products: MerchProduct[];
  onEdit: (product: MerchProduct) => void;
  onDelete: (product: MerchProduct) => void;
}

export function MerchGrid({ products, onEdit, onDelete }: MerchGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <MerchCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
