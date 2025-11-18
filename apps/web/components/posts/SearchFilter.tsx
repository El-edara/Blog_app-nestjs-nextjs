"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [published, setPublished] = useState(
    searchParams.get("published") || "all"
  );

  // Update URL when filters change
  const handleFilterChange = () => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (published !== "all") params.set("published", published);

    const queryString = params.toString();
    router.push(`/posts${queryString ? `?${queryString}` : ""}`);
  };

  // Clear all filters
  const handleClear = () => {
    setSearch("");
    setPublished("all");
    router.push("/posts");
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (searchParams.get("search") || "")) {
        handleFilterChange();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const hasFilters = search || published !== "all";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium mb-2">
            Search Posts
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter by Published Status */}
        <div>
          <label htmlFor="published" className="block text-sm font-medium mb-2">
            Status
          </label>
          <select
            id="published"
            value={published}
            onChange={(e) => {
              setPublished(e.target.value);
              // Immediate update for select
              const params = new URLSearchParams();
              if (search) params.set("search", search);
              if (e.target.value !== "all")
                params.set("published", e.target.value);
              router.push(`/posts?${params.toString()}`);
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Posts</option>
            <option value="true">Published Only</option>
            <option value="false">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasFilters && (
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Clear Filters
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {search && `Searching for "${search}"`}
            {search && published !== "all" && " • "}
            {published === "true" && "Published only"}
            {published === "false" && "Drafts only"}
          </span>
        </div>
      )}
    </div>
  );
}
