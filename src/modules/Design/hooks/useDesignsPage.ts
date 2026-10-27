"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useDebouncedValue } from "@/lib/use-debounced-value";
import type { DesignItem } from "@/types/models";

import type { PublishedFilter } from "../types";
import { useDeleteDesign } from "./useDesignMutations";
import { useDesigns } from "./useDesigns";

const PAGE_SIZE = 6;

function useDesignsPage() {
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

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const changePublished = (value: PublishedFilter) => {
    setPublished(value);
    setPage(1);
  };

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

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
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

  return {
    setPage,
    search,
    published,
    formOpen,
    editing,
    deleting,
    setDeleting,
    deleteMutation,
    query,
    designs,
    pagination,
    hasFilters,
    changeSearch,
    changePublished,
    clearFilters,
    openCreate,
    openEdit,
    closeForm,
    handleDelete,
  };
}

export default useDesignsPage;
