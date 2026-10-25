"use client";

import { PenTool, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
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
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { DesignFormDialog } from "@/modules/Design/DesignFormDialog";
import { useDesigns } from "@/modules/Design/useDesigns";
import { useDeleteDesign } from "@/modules/Design/useDesignMutations";
import type { DesignItem } from "@/types/models";

const PAGE_SIZE = 12;

type PublishedFilter = "all" | "published" | "draft";

export default function Design() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [published, setPublished] = useState<PublishedFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DesignItem | null>(null);
  const [deleting, setDeleting] = useState<DesignItem | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);
  const deleteMutation = useDeleteDesign();

  const query = useDesigns({
    published: published === "all" ? undefined : published === "published",
    search: debouncedSearch.trim() || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    sort: "sortOrder",
    order: "asc",
  });

  const designs = query.data?.data ?? [];
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

  const openEdit = (design: DesignItem) => {
    setEditing(design);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (!deleting) return;

    deleteMutation.mutate(deleting.id, {
      onSuccess: () => {
        toast.success(`"${deleting.title}" deleted.`);
        setDeleting(null);
        if (designs.length === 1 && page > 1) setPage(page - 1);
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : "Could not delete the design.",
        );
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Flash and originals"
        title="Designs"
        description="Manage the design catalogue shown to clients — categories, placements, and availability."
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
              New design
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
            label="Search designs"
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
              <option value="all">All designs</option>
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
        <Alert variant="error" title="Could not load designs">
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
      ) : designs.length === 0 ? (
        <EmptyState
          icon={PenTool}
          title={hasFilters ? "No designs match these filters" : "No designs yet"}
          description={
            hasFilters
              ? "Try a different status or clear the search."
              : "Add your first flash piece or original design."
          }
          action={
            hasFilters ? (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear filters
              </Button>
            ) : (
              <Button size="sm" onClick={openCreate} className="gap-2">
                <Plus className="size-4" />
                Add the first design
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {designs.map((design) => (
            <Card
              key={design.id}
              className="flex flex-col overflow-hidden transition-shadow hover:shadow-md"
            >
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
                      onClick={() => openEdit(design)}
                      className="gap-1.5"
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleting(design)}
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
        <DesignFormDialog
          key={editing?.id ?? "new"}
          design={editing}
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
        title="Delete this design?"
        description={
          deleting ? (
            <>
              <span className="font-medium text-foreground">{deleting.title}</span> will be
              removed from the public catalogue. This cannot be undone.
            </>
          ) : null
        }
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}
