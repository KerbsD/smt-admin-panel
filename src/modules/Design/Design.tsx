"use client";

import { DesignDeleteDialog } from "./components/DesignDeleteDialog";
import { DesignEmptyState } from "./components/DesignEmptyState";
import { DesignFilters } from "./components/DesignFilters";
import { DesignFormDialog } from "./components/DesignFormDialog";
import { DesignGrid } from "./components/DesignGrid";
import { DesignGridSkeleton } from "./components/DesignGridSkeleton";
import { DesignPageHeader } from "./components/DesignPageHeader";
import { DesignPagination } from "./components/DesignPagination";
import { DesignQueryError } from "./components/DesignQueryError";

import useDesignsPage from "./hooks/useDesignsPage";

export default function Design() {
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
  } = useDesignsPage();

  return (
    <div className="space-y-6">
      <DesignPageHeader
        isFetching={query.isFetching}
        onRefresh={() => void query.refetch()}
        onCreate={openCreate}
      />

      <DesignFilters
        search={search}
        published={published}
        hasFilters={hasFilters}
        onSearchChange={changeSearch}
        onPublishedChange={changePublished}
        onClearFilters={clearFilters}
      />

      {query.isError ? (
        <DesignQueryError
          error={query.error}
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {query.isPending ? (
        <DesignGridSkeleton />
      ) : designs.length === 0 ? (
        <DesignEmptyState
          hasFilters={hasFilters}
          onCreate={openCreate}
          onClearFilters={clearFilters}
        />
      ) : (
        <DesignGrid designs={designs} onEdit={openEdit} onDelete={setDeleting} />
      )}

      {pagination ? (
        <DesignPagination
          pagination={pagination}
          isFetching={query.isFetching}
          onPageChange={setPage}
        />
      ) : null}

      {formOpen ? (
        <DesignFormDialog
          key={editing?.id ?? "new"}
          design={editing}
          open
          onOpenChange={(open) => {
            if (!open) closeForm();
          }}
        />
      ) : null}

      <DesignDeleteDialog
        design={deleting}
        isPending={deleteMutation.isPending}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
