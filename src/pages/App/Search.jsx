import React from "react";
import { Search as SearchIcon, Filter, TrendingUp } from "lucide-react";

const Search = () => {
  return (
    <div className="min-h-screen bg-white font-poppins text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 md:px-20">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Search Apps
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 md:px-20 space-y-10">
        {/* Search Bar */}
        <section className="flex flex-col gap-4">
          <div className="relative">
            <SearchIcon
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search apps, developers, or categories"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-green-500
                         text-gray-800"
            />
          </div>

          {/* Filters (UI only) */}
          <div className="flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-100">
              <Filter size={16} />
              Filters
            </button>

            <span className="text-sm text-gray-500">
              Showing popular & verified apps
            </span>
          </div>
        </section>

        {/* Trending Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-500" />
            Trending Searches
          </h2>

          <div className="flex flex-wrap gap-3">
            {[
              "Chat Apps",
              "Productivity",
              "Open Source",
              "Education",
              "Finance",
              "Utilities",
            ].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full text-sm border border-gray-300
                           text-gray-700 hover:bg-green-50 hover:border-green-400
                           cursor-pointer transition"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Search Results Placeholder */}
        <section className="border-t border-gray-200 pt-8 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Search Results
          </h2>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center text-center py-16 text-gray-500">
            <SearchIcon size={48} className="mb-4 text-gray-300" />
            <p className="text-base font-medium">
              Start typing to search for apps
            </p>
            <p className="text-sm max-w-md">
              Find apps by name, category, or developer. Verified and reviewed
              apps will appear here.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Search;
