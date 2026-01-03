"use client";

import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimeCard } from "./AnimeCard";
import { AnimeCardSkeleton } from "@/components/ui/skeleton";
import { type Anime, type Movie } from "@/types/anime";

type AnimeData = Anime | Movie;

interface AnimeRowProps {
  title: string;
  subtitle?: string;
  animeList: AnimeData[];
  loading?: boolean;
  variant?: "default" | "compact" | "featured";
  showViewAll?: boolean;
  onViewAll?: () => void;
  onAnimeSelect?: (anime: AnimeData) => void;
  accentColor?: string;
}

export function AnimeRow({
  title,
  subtitle,
  animeList,
  loading = false,
  variant = "default",
  showViewAll = false,
  onViewAll,
  onAnimeSelect,
  accentColor = "blue",
}: AnimeRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  const colorClasses: Record<string, string> = {
    blue: "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]",
    purple: "bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]",
    pink: "bg-pink-600 shadow-[0_0_15px_rgba(219,39,119,0.5)]",
    green: "bg-green-600 shadow-[0_0_15px_rgba(22,163,74,0.5)]",
    orange: "bg-orange-600 shadow-[0_0_15px_rgba(234,88,12,0.5)]",
    red: "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]",
  };

  const skeletonCount = variant === "featured" ? 3 : 5;

  return (
    <section className="relative py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-6 md:px-0">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "h-10 w-2 rounded-full",
              colorClasses[accentColor] || colorClasses.blue
            )}
          />
          <div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Scroll buttons */}
          {animeList.length > 4 && (
            <>
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  canScrollLeft
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-white/5 text-slate-600 cursor-not-allowed"
                )}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                  canScrollRight
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-white/5 text-slate-600 cursor-not-allowed"
                )}
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          
          {showViewAll && (
            <button
              onClick={onViewAll}
              className="ml-4 text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors"
            >
              View All →
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-6 md:px-0">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <AnimeCardSkeleton key={i} />
          ))}
        </div>
      ) : animeList.length === 0 ? (
        <div className="text-center py-12 px-6">
          <p className="text-slate-500">No anime found in this category.</p>
        </div>
      ) : (
        // Scrollable row
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-6 md:px-0 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {animeList.map((anime, index) => (
            <div
              key={anime.id || anime._id || index}
              className={cn(
                "shrink-0 snap-start",
                variant === "featured" ? "w-[500px]" : variant === "compact" ? "w-40" : "w-64"
              )}
            >
              <AnimeCard
                anime={anime}
                variant={variant === "featured" ? "featured" : variant === "compact" ? "compact" : "default"}
                onSelect={onAnimeSelect}
                priority={index < 4}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AnimeRow;
