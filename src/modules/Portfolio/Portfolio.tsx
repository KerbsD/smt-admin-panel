"use client";

import { Images, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
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
import { formatDate } from "@/lib/format";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { PortfolioFormDialog } from "@/modules/Portfolio/PortfolioFormDialog";
import { usePortfolio } from "@/modules/Portfolio/usePortfolio";
import { useDeletePortfolio } from "@/modules/Portfolio/usePortfolioMutations";
import type { PortfolioItem } from "@/types/models";

const PAGE_SIZE = 12;

type PublishedFilter = "all" | "published" | "draft";

export default function Portfolio() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [published, setPublished] = useState<PublishedFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [deleting, setDeleting] = useState<PortfolioItem | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);
  const deleteMutation = useDeletePortfolio();

  const query = usePortfolio({
    published: published === "all" ? undefined : published === "published",
    search: debouncedSearch.trim() || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    sort: "sortOrder",
    order: "asc",
  });

  const items = query.data?.data ?? [];
  const pagination = query.data?.pagination;
  const hasFilters = debouncedSearch.trim() !== "" || published !== "all";

  const clearFilters = () => {
    setSearch("");
    setPublished("all");
    setPage(1);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setEditing(item);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (!deleting) return;

    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success(`"${deleting.title}" deleted.`);
        setDeleting(null);
        if (items.length === 1 && page > 1) setPage(page - 1);
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Could not delete the item.");
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Public gallery"
        title="Portfolio"
        description="Curate finished work for the public portfolio. Drafts stay hidden until published."
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
              New item
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
            placeholder="Search by title…"
            label="Search portfolio"
          />
          <div className="flex items-center gap-2">
            <Select
              value={published}
              onChange={(event) => {
                setPublished(event.target.value as PublishedFilter);
                setPage(1);
              }}
              aria-label="Filter by publication status"
              className="sm:w-44"
            >
              <option value="all">All items</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
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
        <Alert variant="error" title="Could not load the portfolio">
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
              <Skeleton className="aspect-[4/3] w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Images}
          title={hasFilters ? "No pieces match these filters" : "The gallery is empty"}
          description={
            hasFilters
              ? "Try a different status or clear the search."
              : "Add finished work to start building the public portfolio."
          }
          action={
            hasFilters ? (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : (
              <Button size="sm" onClick={openCreate} className="gap-2">
                <Plus className="size-4" />
                Add the first piece
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="relative">
                <RemoteImage
                  src={item.imageUrl}
                  alt={item.title}
                  className="aspect-[4/3] w-full"
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
                    <span className="rounded bg-muted px-1.5 py-0.5">{item.duration}</span>
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
                    onClick={() => openEdit(item)}
                    className="gap-1.5"
                  >
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleting(item)}
                    className="gap-1.5 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
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
        <PortfolioFormDialog
          key={editing?.id ?? "new"}
          item={editing}
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
        title="Delete this portfolio item?"
        description={
          deleting ? (
            <>
              <span className="font-medium text-foreground">{deleting.title}</span> will be
              removed from the public gallery. This cannot be undone.
            </>
          ) : null
        }
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
