// components/ui/Pagination.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  total: number;
  basePath?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  total,
  basePath = "",
}: Props) {
  const searchParams = useSearchParams();

  const buildUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) params.delete("page");
    else params.set("page", String(page));
    const query = params.toString();
    return basePath + (query ? `?${query}` : "");
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 2;

    pages.push(1);
    if (currentPage > delta + 2) pages.push("...");
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - delta - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return [...new Set(pages)];
  };

  if (totalPages <= 1) return null;

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col items-center gap-6 mt-12">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Page{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {totalPages}
        </span>
        {" • "} Total: <span className="font-semibold">{total}</span>
      </p>

      <div className="flex items-center gap-2 flex-wrap justify-center">
        <Link
          href={buildUrl(currentPage - 1)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
            currentPage === 1
              ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
          onClick={(e) => currentPage === 1 && e.preventDefault()}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </Link>

        {pages.map((page, i) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${i}`} className="px-3 py-2 text-gray-500">
                ...
              </span>
            );
          }

          const pageNum = page as number;
          return (
            <Link
              key={pageNum}
              href={buildUrl(pageNum)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                pageNum === currentPage
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {pageNum}
            </Link>
          );
        })}

        <Link
          href={buildUrl(currentPage + 1)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all ${
            currentPage === totalPages
              ? "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
          onClick={(e) => currentPage === totalPages && e.preventDefault()}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
