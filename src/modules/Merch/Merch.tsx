"use client";

import { Package, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { RemoteImage } from "@/components/ui/remote-image";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPeso } from "@/lib/format";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { MerchFormDialog } from "@/modules/Merch/MerchFormDialog";
import { useMerch } from "@/modules/Merch/useMerch";
import { useDeleteMerch } from "@/modules/Merch/useMerchMutations";
import type { MerchProduct } from "@/types/models";

const PAGE_SIZE = 12;

type PublishedFilter = "all" | "published" | "draft";
type PreorderFilter = "all" | "preorder" | "regular";

export default function Merch() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [published, setPublished] = useState<PublishedFilter>("all");
  const [preorder, setPreorder] = useState<PreorderFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MerchProduct | null>(null);
  const [deleting, setDeleting] = useState<MerchProduct | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);
  const deleteMutation = useDeleteMerch();

  const query = useMerch({
    published: published === "all" ? undefined : published === "published",
    preorder: preorder === "all" ? undefined : preorder === "preorder",
    search: debouncedSearch.trim() || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    sort: "sortOrder",
    order: "asc",
  });

  const products = query.data?.data ?? [];
  const pagination = query.data?.pagination;
  const hasFilters =
    debouncedSearch.trim() !== "" || published !== "all" || preorder !== "all";

  const clearFilters = () => {
    setSearch("");
    setPublished("all");
    setPreorder("all");
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (product: MerchProduct) => {
    setEditing(product);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (!deleting) return;

    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success(`"${deleting.name}" deleted.`);
        setDeleting(null);
        if (products.length === 1 && page > 1) setPage(page - 1);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Could not delete the product.",
        );
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Public store"
        title="Merch"
        description="Manage products, prices, and preorder drops for the public merch page."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void query.refetch()}
              disabled={query.isFetching}
              className="gap-2"
            >
              <RefreshCw className={query.isFetching ? "size-4 animate-spin" : "size-4"} />
              Refresh
            </Button>
            <Button size="sm" onClick={openCreate} className="gap-2">
              <Plus className="size-4" />
              New product
            </Button>
          </>
        }
      />

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search by name…"
            label="Search merch"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={published}
              onChange={(event) => {
                setPublished(event.target.value as PublishedFilter);
                setPage(1);
              }}
              aria-label="Filter by publication status"
              className="w-36"
            >
              <option value="all">All products</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </Select>
            <Select
              value={preorder}
              onChange={(event) => {
                setPreorder(event.target.value as PreorderFilter);
                setPage(1);
              }}
              aria-label="Filter by preorder"
              className="w-36"
            >
              <option value="all">Any type</option>
              <option value="preorder">Preorder</option>
              <option value="regular">In stock</option>
            </Select>
            {hasFilters ? (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      {query.isError ? (
        <Alert variant="error" title="Could not load merch">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span>{query.error instanceof Error ? query.error.message : "Unknown error."}</span>
            <Button variant="outline" size="sm" onClick={() => void query.refetch()}>
              Try again
            </Button>
          </div>
        </Alert>
      ) : null}

      {query.isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="aspect-square w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </Card>
          ))}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title={hasFilters ? "No products match these filters" : "No products yet"}
          description={
            hasFilters
              ? "Try a different status or clear the search."
              : "Add your first product to start building the store."
          }
          action={
            hasFilters ? (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : (
              <Button size="sm" onClick={openCreate} className="gap-2">
                <Plus className="size-4" />
                Add the first product
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className="flex flex-col overflow-hidden transition-shadow hover:shadow-md"
            >
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
                      onClick={() => openEdit(product)}
                      className="gap-1.5"
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleting(product)}
                      className="gap-1.5 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {pagination ? (
        <Pagination pagination={pagination} onPageChange={setPage} disabled={query.isFetching} />
      ) : null}

      {formOpen ? (
        <MerchFormDialog
          key={editing?.id ?? "new"}
          product={editing}
          open
          onOpenChange={(open) => {
            if (!open) {
              setFormOpen(false);
              setEditing(null);
            }
          }}
        />
      ) : null}

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        title="Delete this product?"
        description={
          deleting ? (
            <>
              <span className="font-medium text-foreground">{deleting.name}</span> will be
              removed from the public store. This cannot be undone.
            </>
          ) : null
        }
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
