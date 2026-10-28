"use client";

import { PortfolioDeleteDialog } from "./components/PortfolioDeleteDialog";
import { PortfolioEmptyState } from "./components/PortfolioEmptyState";
import { PortfolioFilters } from "./components/PortfolioFilters";
import { PortfolioFormDialog } from "./components/PortfolioFormDialog";
import { PortfolioGrid } from "./components/PortfolioGrid";
import { PortfolioGridSkeleton } from "./components/PortfolioGridSkeleton";
import { PortfolioPageHeader } from "./components/PortfolioPageHeader";
import { PortfolioPagination } from "./components/PortfolioPagination";
import { PortfolioQueryError } from "./components/PortfolioQueryError";

import usePortfolioPage from "./hooks/usePortfolioPage";

export default function Portfolio() {
  const {
    setPage,
    search,
    published,
    formOpen,
    editing,
    deleting,
    setDeleting,
    deleteMutation,
    query,
    items,
    pagination,
    hasFilters,
    changeSearch,
    changePublished,
    clearFilters,
    openCreate,
    openEdit,
    closeForm,
    handleDelete,
  } = usePortfolioPage();

  return (
    <div className="space-y-6">
      <PortfolioPageHeader
        isFetching={query.isFetching}
        onRefresh={() => void query.refetch()}
        onCreate={openCreate}
      />

      <PortfolioFilters
        search={search}
        published={published}
        hasFilters={hasFilters}
        onSearchChange={changeSearch}
        onPublishedChange={changePublished}
        onClearFilters={clearFilters}
      />

      {query.isError ? (
        <PortfolioQueryError
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {query.isPending ? (
        <PortfolioGridSkeleton />
      ) : items.length === 0 ? (
        <PortfolioEmptyState
          hasFilters={hasFilters}
          onCreate={openCreate}
          onClearFilters={clearFilters}
        />
      ) : (
        <PortfolioGrid items={items} onEdit={openEdit} onDelete={setDeleting} />
      )}

      {pagination ? (
        <PortfolioPagination
          pagination={pagination}
          isFetching={query.isFetching}
          onPageChange={setPage}
        />
      ) : null}

      {formOpen ? (
        <PortfolioFormDialog
          key={editing?.id ?? "new"}
          item={editing}
          open
          onOpenChange={(open) => {
            if (!open) closeForm();
          }}
        />
      ) : null}

      <PortfolioDeleteDialog
        item={deleting}
        isPending={deleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
