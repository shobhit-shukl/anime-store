"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Grid, List, SlidersHorizontal, X } from "lucide-react";
import { Navbar, Footer } from "@/components/layout";
import { AnimeCard, GenrePill } from "@/components/anime";
import { Button } from "@/components/ui/button";
import { AnimeCardSkeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  type Anime,
  type Movie,
  type AnimeFilters,
  ANIME_GENRES,
  ANIME_TYPES,
  ANIME_STATUSES,
} from "@/types/anime";

type AnimeData = Anime | Movie;

export default function BrowsePage() {
  const [allAnime, setAllAnime] = useState<AnimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filters, setFilters] = useState<AnimeFilters>({
    genre: undefined,
    type: undefined,
    status: undefined,
    year: undefined,
    sortBy: "popularity",
    sortOrder: "desc",
    search: "",
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const type = searchParams.get("type");
    if (type) {
      setFilters(prev => ({ ...prev, type: type as any }));
    }
  }, [searchParams]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, seriesRes] = await Promise.all([
          fetch("/api/movie"),
          fetch("/api/webseries"),
        ]);
        const movieData = await movieRes.json();
        const seriesData = await seriesRes.json();

        const combined: AnimeData[] = [
          ...(movieData.movies || []).map((item: Movie) => ({
            ...item,
            type: "Movie" as const,
          })),
          ...(seriesData.webseries || []).map((item: Movie) => ({
            ...item,
            type: "TV" as const,
          })),
        ];

        setAllAnime(combined);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort anime
  const filteredAnime = useMemo(() => {
    let result = [...allAnime];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (anime) =>
          anime.title.toLowerCase().includes(searchLower) ||
          anime.titleJapanese?.toLowerCase().includes(searchLower)
      );
    }

    // Genre filter
    if (filters.genre) {
      result = result.filter((anime) =>
        (anime.genres || anime.genre || []).includes(filters.genre!)
      );
    }

    // Type filter
    if (filters.type) {
      result = result.filter((anime) => anime.type === filters.type);
    }

    // Status filter
    if (filters.status) {
      result = result.filter((anime) => anime.status === filters.status);
    }

    // Year filter
    if (filters.year) {
      result = result.filter((anime) => anime.releaseYear === filters.year);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case "rating":
          comparison = (b.rating || 0) - (a.rating || 0);
          break;
        case "releaseDate":
          comparison = (b.releaseYear || 0) - (a.releaseYear || 0);
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "popularity":
        default:
          comparison = (b.views || b.popularity || 0) - (a.views || a.popularity || 0);
          break;
      }

      return filters.sortOrder === "asc" ? -comparison : comparison;
    });

    return result;
  }, [allAnime, filters]);

  // Get unique years from data
  const availableYears = useMemo(() => {
    const years = allAnime
      .map((a) => a.releaseYear)
      .filter((y): y is number => y !== undefined);
    return [...new Set(years)].sort((a, b) => b - a);
  }, [allAnime]);

  const clearFilters = () => {
    setFilters({
      genre: undefined,
      type: undefined,
      status: undefined,
      year: undefined,
      sortBy: "popularity",
      sortOrder: "desc",
      search: "",
    });
  };

  const hasActiveFilters =
    filters.genre || filters.type || filters.status || filters.year || filters.search;

  return (
    <main className="min-h-screen bg-[--background] text-[--foreground] transition-colors">
      <Navbar />

      {/* Header */}
      <div className="pt-24 pb-8 px-6 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">
          Browse <span className="text-blue-500">Anime</span>
        </h1>
        <p className="text-slate-400">
          Discover from our collection of {allAnime.length} titles
        </p>
      </div>

      {/* Filters bar */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/85 dark:bg-[#0f1a2f]/90 backdrop-blur-xl border-y border-slate-200 dark:border-white/5 mb-8 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search anime..."
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full h-11 px-4 rounded-xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "md:hidden h-11 px-4 rounded-xl flex items-center gap-2 font-medium transition-colors",
                showFilters
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-slate-400 hover:text-white"
              )}
            >
              <SlidersHorizontal size={18} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-blue-400" />
              )}
            </button>

            {/* Desktop filters */}
            <div className="hidden md:flex items-center gap-3">
              {/* Genre */}
              <Select
                value={filters.genre || "all"}
                onValueChange={(value) =>
                  setFilters({ ...filters, genre: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {ANIME_GENRES.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Type */}
              <Select
                value={filters.type || "all"}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    type: value === "all" ? undefined : (value as Anime["type"]),
                  })
                }
              >
                <SelectTrigger className="w-[120px] bg-white/5 border-white/10">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {ANIME_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status */}
              <Select
                value={filters.status || "all"}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    status: value === "all" ? undefined : (value as Anime["status"]),
                  })
                }
              >
                <SelectTrigger className="w-[130px] bg-white/5 border-white/10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {ANIME_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Year */}
              <Select
                value={filters.year?.toString() || "all"}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    year: value === "all" ? undefined : parseInt(value),
                  })
                }
              >
                <SelectTrigger className="w-[110px] bg-white/5 border-white/10">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select
                value={filters.sortBy || "popularity"}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    sortBy: value as AnimeFilters["sortBy"],
                  })
                }
              >
                <SelectTrigger className="w-[140px] bg-white/5 border-white/10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="releaseDate">Release Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="h-11 px-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 font-medium flex items-center gap-2 transition-colors"
              >
                <X size={16} />
                Clear
              </button>
            )}

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "grid" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                )}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "list" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                )}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* Mobile filters (expandable) */}
          {showFilters && (
            <div className="md:hidden pt-4 mt-4 border-t border-white/5 space-y-4 animate-in slide-in-from-top duration-200">
              <div className="grid grid-cols-2 gap-3">
                <Select
                  value={filters.genre || "all"}
                  onValueChange={(value) =>
                    setFilters({ ...filters, genre: value === "all" ? undefined : value })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {ANIME_GENRES.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.type || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      type: value === "all" ? undefined : (value as Anime["type"]),
                    })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {ANIME_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      status: value === "all" ? undefined : (value as Anime["status"]),
                    })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {ANIME_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.sortBy || "popularity"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      sortBy: value as AnimeFilters["sortBy"],
                    })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="releaseDate">Release Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active filters pills */}
      {hasActiveFilters && (
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-500">Active filters:</span>
            {filters.genre && (
              <GenrePill
                genre={filters.genre}
                size="sm"
                variant="neon"
                onClick={() => setFilters({ ...filters, genre: undefined })}
              />
            )}
            {filters.type && (
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold flex items-center gap-2">
                {filters.type}
                <X
                  size={12}
                  className="cursor-pointer"
                  onClick={() => setFilters({ ...filters, type: undefined })}
                />
              </span>
            )}
            {filters.status && (
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold flex items-center gap-2">
                {filters.status}
                <X
                  size={12}
                  className="cursor-pointer"
                  onClick={() => setFilters({ ...filters, status: undefined })}
                />
              </span>
            )}
            {filters.year && (
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-bold flex items-center gap-2">
                {filters.year}
                <X
                  size={12}
                  className="cursor-pointer"
                  onClick={() => setFilters({ ...filters, year: undefined })}
                />
              </span>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-slate-500">
            Showing {filteredAnime.length} result{filteredAnime.length !== 1 && "s"}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <AnimeCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredAnime.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg mb-4">No anime found matching your criteria</p>
            <Button variant="secondary" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
                : "space-y-4"
            )}
          >
            {filteredAnime.map((anime, index) => (
              <AnimeCard
                key={anime.id || anime._id || index}
                anime={anime}
                variant={viewMode === "list" ? "horizontal" : "default"}
                onSelect={(a) => router.push(`/anime/${a._id || a.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
