"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

import type { PreorderFilter, PublishedFilter } from "../types";

interface MerchFiltersProps {
  search: string;
  published: PublishedFilter;
  preorder: PreorderFilter;
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onPublishedChange: (value: PublishedFilter) => void;
  onPreorderChange: (value: PreorderFilter) => void;
  onClearFilters: () => void;
}

export function MerchFilters({
  search,
  published,
  preorder,
  hasFilters,
  onSearchChange,
  onPublishedChange,
  onPreorderChange,
  onClearFilters,
}: MerchFiltersProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search by name…"
          label="Search merch"
        />
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={published}
            onChange={(event) =>
              onPublishedChange(event.target.value as PublishedFilter)
            }
            aria-label="Filter by publication status"
            className="w-36"
          >
            <option value="all">All products</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </Select>
          <Select
            value={preorder}
            onChange={(event) =>
              onPreorderChange(event.target.value as PreorderFilter)
            }
            aria-label="Filter by preorder"
            className="w-36"
          >
            <option value="all">Any type</option>
            <option value="preorder">Preorder</option>
            <option value="regular">In stock</option>
          </Select>
          {hasFilters ? (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
