"use client";

import { MerchDeleteDialog } from "./components/MerchDeleteDialog";
import { MerchEmptyState } from "./components/MerchEmptyState";
import { MerchFilters } from "./components/MerchFilters";
import { MerchFormDialog } from "./components/MerchFormDialog";
import { MerchGrid } from "./components/MerchGrid";
import { MerchGridSkeleton } from "./components/MerchGridSkeleton";
import { MerchPageHeader } from "./components/MerchPageHeader";
import { MerchPagination } from "./components/MerchPagination";
import { MerchQueryError } from "./components/MerchQueryError";

import useMerchPage from "./hooks/useMerchPage";

export default function Merch() {
  const {
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
  } = useMerchPage();

  return (
    <div className="space-y-6">
      <MerchPageHeader
        isFetching={query.isFetching}
        onRefresh={() => void query.refetch()}
        onCreate={openCreate}
      />

      <MerchFilters
        search={search}
        published={published}
        preorder={preorder}
        hasFilters={hasFilters}
        onSearchChange={changeSearch}
        onPublishedChange={changePublished}
        onPreorderChange={changePreorder}
        onClearFilters={clearFilters}
      />

      {query.isError ? (
        <MerchQueryError
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {query.isPending ? (
        <MerchGridSkeleton />
      ) : products.length === 0 ? (
        <MerchEmptyState
          hasFilters={hasFilters}
          onCreate={openCreate}
          onClearFilters={clearFilters}
        />
      ) : (
        <MerchGrid products={products} onEdit={openEdit} onDelete={setDeleting} />
      )}

      {pagination ? (
        <MerchPagination
          pagination={pagination}
          isFetching={query.isFetching}
          onPageChange={setPage}
        />
      ) : null}

      {formOpen ? (
        <MerchFormDialog
          key={editing?.id ?? "new"}
          product={editing}
          open
          onOpenChange={(open) => {
            if (!open) closeForm();
          }}
        />
      ) : null}

      <MerchDeleteDialog
        product={deleting}
        isPending={deleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
