import React from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Bookmark } from "@/types/bookmark";
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  results: Bookmark[];
  onDelete: (id: number) => void;
  onCategoryClick: (categoryId: number) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onDelete,
  onCategoryClick,
}) => {
  if (results.length === 0) {
    return <p className="text-sm text-gray-600">No results found.</p>;
  }

  return (
    <div
      className="absolute z-50 w-full max-w-md mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg overflow-auto"
      style={{ maxHeight: "300px" }} // Constrain the dropdown height
    >
      <div className="space-y-4 p-4">
        {results.map((bookmark) => (
          <div key={bookmark.id} className="border p-4 rounded-md relative">
            <h3 className="text-lg font-semibold pr-8">
              <Link href={`/bookmarks/${bookmark.id}`}>{bookmark.title}</Link>
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {bookmark.content.substring(0, 100)}...
            </p>
            {bookmark.category && (
              <p className="text-xs text-gray-500 mt-2">
                Category:{" "}
                <span
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => onCategoryClick(bookmark.category.id)}
                >
                  {bookmark.category.name}
                </span>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
