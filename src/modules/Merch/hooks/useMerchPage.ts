"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useDebouncedValue } from "@/lib/use-debounced-value";
import type { MerchProduct } from "@/types/models";

import type { PreorderFilter, PublishedFilter } from "../types";
import { useDeleteMerch } from "./useMerchMutations";
import { useMerch } from "./useMerch";

const PAGE_SIZE = 12;

function useMerchPage() {
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

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const changePublished = (value: PublishedFilter) => {
    setPublished(value);
    setPage(1);
  };

  const changePreorder = (value: PreorderFilter) => {
    setPreorder(value);
    setPage(1);
  };

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

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
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
          error instanceof Error
            ? error.message
            : "Could not delete the product.",
        );
      },
    });
  };

  return {
    setPage,
    search,
    published,
    preorder,
    formOpen,
    editing,
    deleting,
    setDeleting,
    deleteMutation,
    query,
    products,
    pagination,
    hasFilters,
    changeSearch,
    changePublished,
    changePreorder,
    clearFilters,
    openCreate,
    openEdit,
    closeForm,
    handleDelete,
  };
}

export default useMerchPage;
