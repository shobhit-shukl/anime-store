"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Anime, type Movie } from "@/types/anime";
import { GenrePill } from "./GenrePill";
import { RatingBadge } from "./RatingBadge";

type AnimeCardData = Anime | Movie;

interface AnimeCardProps {
  anime: AnimeCardData;
  variant?: "default" | "compact" | "featured" | "horizontal";
  showHover?: boolean;
  onSelect?: (anime: AnimeCardData) => void;
  onAddToWatchlist?: (anime: AnimeCardData) => void;
  isInWatchlist?: boolean;
  priority?: boolean;
}

// Helper to get image URL
function getImageUrl(anime: AnimeCardData): string {
  return anime.posterImage || anime.image || "/placeholder-anime.svg";
}

// Helper to get total episodes
function getTotalEpisodes(anime: AnimeCardData): number {
  if (anime.totalEpisodes) return anime.totalEpisodes;
  if (anime.seasons) {
    return anime.seasons.reduce((total, season) => total + season.episodes.length, 0);
  }
  return 0;
}

// Helper to get genres
function getGenres(anime: AnimeCardData): string[] {
  return anime.genres || anime.genre || [];
}

// Helper to get type label
function getTypeLabel(anime: AnimeCardData): string {
  if (anime.type === "Movie" || anime.type === "movie") return "MOVIE";
  if (anime.type === "TV") return "TV SERIES";
  if (anime.type === "OVA") return "OVA";
  if (anime.type === "ONA") return "ONA";
  return anime.status || "ANIME";
}

export function AnimeCard({
  anime,
  variant = "default",
  showHover = true,
  onSelect,
  onAddToWatchlist,
  isInWatchlist = false,
  priority = false,
}: AnimeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = getImageUrl(anime);
  const totalEpisodes = getTotalEpisodes(anime);
  const genres = getGenres(anime);
  const typeLabel = getTypeLabel(anime);

  // Compact variant
  if (variant === "compact") {
    return (
      <div
        onClick={() => onSelect?.(anime)}
        className="group relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 group-hover:border-blue-500/50 transition-all duration-300">
          <Image
            src={imageError ? "/placeholder-anime.svg" : imageUrl}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
          
          {/* Rating */}
          <div className="absolute top-2 right-2">
            <RatingBadge rating={anime.rating} size="sm" />
          </div>

          {/* Hover overlay */}
          {showHover && (
            <div
              className={cn(
                "absolute inset-0 bg-slate-950/80 flex items-center justify-center transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            >
              <Play size={48} className="text-blue-500" fill="currentColor" />
            </div>
          )}
        </div>
        <h3 className="mt-2 font-bold text-sm truncate group-hover:text-blue-400 transition-colors">
          {anime.title}
        </h3>
      </div>
    );
  }

  // Horizontal variant
  if (variant === "horizontal") {
    return (
      <div
        onClick={() => onSelect?.(anime)}
        className="group flex gap-4 p-4 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-blue-500/30 cursor-pointer transition-all duration-300"
      >
        <div className="relative w-20 h-28 rounded-xl overflow-hidden shrink-0">
          <Image
            src={imageError ? "/placeholder-anime.svg" : imageUrl}
            alt={anime.title}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
            sizes="80px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg truncate group-hover:text-blue-400 transition-colors">
            {anime.title}
          </h3>
          {anime.titleJapanese && (
            <p className="text-sm text-slate-500 truncate">{anime.titleJapanese}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <RatingBadge rating={anime.rating} size="sm" />
            <span className="text-xs text-slate-500">{typeLabel}</span>
            {totalEpisodes > 0 && (
              <span className="text-xs text-slate-500">{totalEpisodes} eps</span>
            )}
          </div>
          <div className="flex gap-1 mt-2">
            {genres.slice(0, 3).map((g) => (
              <GenrePill key={g} genre={g} size="sm" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Featured variant (larger with more info)
  if (variant === "featured") {
    return (
      <div
        onClick={() => onSelect?.(anime)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative cursor-pointer"
      >
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-white/5 group-hover:border-blue-500/50 transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(37,99,235,0.3)]">
          <Image
            src={anime.bannerImage || imageUrl}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {typeLabel}
              </span>
              <RatingBadge rating={anime.rating} size="md" />
            </div>
            <h3 className="text-3xl font-black tracking-tighter uppercase italic mb-2 group-hover:text-blue-400 transition-colors">
              {anime.title}
            </h3>
            {anime.titleJapanese && (
              <p className="text-slate-400 mb-4">{anime.titleJapanese}</p>
            )}
            <div className="flex gap-2">
              {genres.slice(0, 4).map((g) => (
                <GenrePill key={g} genre={g} size="sm" />
              ))}
            </div>
          </div>

          {/* Play button on hover */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="w-20 h-20 rounded-full bg-blue-600/90 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-blue-600/30">
              <Play size={40} className="text-white ml-1" fill="currentColor" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      onClick={() => onSelect?.(anime)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm rounded-[32px] overflow-hidden border border-slate-200 dark:border-white/5 hover:border-blue-500/50 transition-all duration-500 cursor-pointer hover:shadow-[0_20px_50px_rgba(37,99,235,0.2)] hover:-translate-y-2"
    >
      <div className="relative h-80 w-full overflow-hidden">
        <Image
          src={imageError ? "/placeholder-anime.svg" : imageUrl}
          alt={anime.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          onError={() => setImageError(true)}
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
        
        {/* Bottom info */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <span className="bg-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
            {typeLabel}
          </span>
          <RatingBadge rating={anime.rating} size="sm" />
        </div>

        {/* Hover overlay with buttons */}
        {showHover && (
          <div
            className={cn(
              "absolute inset-0 bg-slate-950/80 flex items-center justify-center gap-3 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            <button className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition-colors">
              <Play size={24} className="text-white ml-1" fill="currentColor" />
            </button>
            {onAddToWatchlist && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToWatchlist(anime);
                }}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                  isInWatchlist
                    ? "bg-green-600 hover:bg-green-500"
                    : "bg-white/10 hover:bg-white/20"
                )}
              >
                {isInWatchlist ? (
                  <Check size={20} className="text-white" />
                ) : (
                  <Plus size={20} className="text-white" />
                )}
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-black text-xl truncate mb-1 tracking-tighter group-hover:text-blue-400 transition-colors uppercase italic">
          {anime.title}
        </h3>
        {anime.titleJapanese && (
          <p className="text-sm text-slate-500 truncate mb-3">{anime.titleJapanese}</p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-slate-500 text-xs font-bold tracking-widest uppercase">
            {anime.type === "Movie" || anime.type === "movie"
              ? `${anime.duration || "N/A"} • ${anime.releaseYear || "N/A"}`
              : `${totalEpisodes} EPISODES`}
          </span>
          <div className="flex gap-1">
            {genres.slice(0, 2).map((g) => (
              <div
                key={g}
                className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeCard;
