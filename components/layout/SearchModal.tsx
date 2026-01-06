"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { RatingBadge } from "@/components/anime/RatingBadge";
import { type Anime, type Movie, type AnimeSearchResult } from "@/types/anime";

type SearchableItem = Anime | Movie | AnimeSearchResult;

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (item: SearchableItem) => void;
}

export function SearchModal({ isOpen, onClose, onSelect }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchableItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }

    // Load recent searches from localStorage
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Search function
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Fetch from both endpoints
      const [movieRes, seriesRes] = await Promise.all([
        fetch("/api/movie"),
        fetch("/api/webseries"),
      ]);

      const movieData = await movieRes.json();
      const seriesData = await seriesRes.json();

      const allItems: SearchableItem[] = [
        ...(movieData.movies || []).map((m: Movie) => ({ ...m, type: "Movie" as const })),
        ...(seriesData.webseries || []).map((s: Movie) => ({ ...s, type: "TV" as const })),
      ];

      // Filter by query
      const filtered = allItems.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.titleJapanese?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setResults(filtered);

      // Save to recent searches
      if (searchQuery.trim().length > 2) {
        const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [recentSearches]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const handleSelect = (item: SearchableItem) => {
    onSelect?.(item);
    onClose();
    setQuery("");
    setResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-white/90 dark:bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Search input */}
        <div className="flex items-center gap-4 p-5 border-b border-slate-200 dark:border-white/5">
          <Search size={24} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime, movies, series..."
            className="flex-1 bg-transparent text-xl font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
          {loading && <Loader2 size={20} className="text-blue-500 animate-spin" />}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results / Recent searches */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* No query - show recent searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Recent Searches
              </h3>
              <div className="space-y-2">
                {recentSearches.map((search, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(search)}
                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 transition-colors text-left"
                  >
                    <Search size={16} className="text-slate-500" />
                    <span className="text-slate-300">{search}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {query && !loading && results.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-500">No results found for &quot;{query}&quot;</p>
              <p className="text-sm text-slate-600 mt-2">Try a different search term</p>
            </div>
          )}

          {/* Results list */}
          {results.length > 0 && (
            <div className="p-2">
              {results.map((item, i) => (
                <button
                  key={item.id || item._id || i}
                  onClick={() => handleSelect(item)}
                  className="flex items-center gap-4 w-full p-3 rounded-2xl hover:bg-white/5 transition-colors text-left group"
                >
                  <div className="relative w-14 h-20 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <Image
                      src={item.posterImage || item.image || "/placeholder-anime.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                      {item.title}
                    </h4>
                    {item.titleJapanese && (
                      <p className="text-sm text-slate-500 truncate">{item.titleJapanese}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1">
                      <RatingBadge rating={item.rating} size="sm" />
                      <span className="text-xs text-slate-500 uppercase">
                        {item.type || "Anime"}
                      </span>
                      {item.releaseYear && (
                        <span className="text-xs text-slate-500">{item.releaseYear}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Keyboard hints */}
          <div className="flex items-center justify-center gap-4 p-4 border-t border-white/5 text-xs text-slate-500">
            <span>
              <kbd className="px-2 py-1 bg-white/5 rounded-md mr-1">↑↓</kbd>
              Navigate
            </span>
            <span>
              <kbd className="px-2 py-1 bg-white/5 rounded-md mr-1">Enter</kbd>
              Select
            </span>
            <span>
              <kbd className="px-2 py-1 bg-white/5 rounded-md mr-1">Esc</kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline search bar component
interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onFocus?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SearchBar({
  placeholder = "Search anime...",
  onSearch,
  onFocus,
  className,
  size = "md",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const sizeClasses = {
    sm: "h-10 text-sm px-4",
    md: "h-12 text-base px-5",
    lg: "h-14 text-lg px-6",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-2xl bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-white/20 transition-all pr-12",
          sizeClasses[size]
        )}
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-white/10 transition-colors"
      >
        <Search size={size === "lg" ? 24 : size === "md" ? 20 : 16} className="text-slate-400" />
      </button>
    </form>
  );
}

export default SearchModal;
