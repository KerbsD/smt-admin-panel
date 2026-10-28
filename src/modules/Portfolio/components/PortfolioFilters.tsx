"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { Select } from "@/components/ui/select";

import type { PublishedFilter } from "../types";

interface PortfolioFiltersProps {
  search: string;
  published: PublishedFilter;
  hasFilters: boolean;
  onSearchChange: (value: string) => void;
  onPublishedChange: (value: PublishedFilter) => void;
  onClearFilters: () => void;
}

export function PortfolioFilters({
  search,
  published,
  hasFilters,
  onSearchChange,
  onPublishedChange,
  onClearFilters,
}: PortfolioFiltersProps) {
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search by title…"
          label="Search portfolio"
        />
        <div className="flex items-center gap-2">
          <Select
            value={published}
            onChange={(event) =>
              onPublishedChange(event.target.value as PublishedFilter)
            }
            aria-label="Filter by publication status"
            className="sm:w-44"
          >
            <option value="all">All items</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
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
