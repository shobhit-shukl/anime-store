"use client";

import React from "react";
import Image from "next/image";
import { Play, Plus, Star, Calendar, Tv, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Anime, type Movie } from "@/types/anime";
import { GenrePill } from "./GenrePill";

type AnimeData = Anime | Movie;

interface PosterHoverPreviewProps {
  anime: AnimeData;
  isVisible: boolean;
  position?: "left" | "right";
  onPlay?: () => void;
  onAddToList?: () => void;
}

// Helper functions
function getImageUrl(anime: AnimeData): string {
  return anime.posterImage || anime.image || "/placeholder-anime.svg";
}

function getGenres(anime: AnimeData): string[] {
  return anime.genres || anime.genre || [];
}

function getTotalEpisodes(anime: AnimeData): number {
  if (anime.totalEpisodes) return anime.totalEpisodes;
  if (anime.seasons) {
    return anime.seasons.reduce((total, season) => total + season.episodes.length, 0);
  }
  return 0;
}

function getDescription(anime: AnimeData): string {
  return anime.synopsis || anime.description || "No description available.";
}

export function PosterHoverPreview({
  anime,
  isVisible,
  position = "right",
  onPlay,
  onAddToList,
}: PosterHoverPreviewProps) {
  const imageUrl = getImageUrl(anime);
  const genres = getGenres(anime);
  const totalEpisodes = getTotalEpisodes(anime);
  const description = getDescription(anime);
  const isMovie = anime.type === "Movie" || anime.type === "movie";

  return (
    <div
      className={cn(
        "absolute z-50 w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 transform",
        position === "right" ? "left-full ml-4" : "right-full mr-4",
        isVisible
          ? "opacity-100 translate-x-0 scale-100"
          : "opacity-0 translate-x-4 scale-95 pointer-events-none"
      )}
      style={{ top: "-20px" }}
    >
      {/* Preview Image */}
      <div className="relative h-44 w-full">
        <Image
          src={anime.bannerImage || imageUrl}
          alt={anime.title}
          fill
          className="object-cover"
          sizes="320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
            className="w-14 h-14 rounded-full bg-blue-600/90 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition-all hover:scale-110"
          >
            <Play size={24} className="text-white ml-1" fill="currentColor" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <div>
          <h3 className="font-black text-lg tracking-tighter line-clamp-1">{anime.title}</h3>
          {anime.titleJapanese && (
            <p className="text-sm text-slate-500 line-clamp-1">{anime.titleJapanese}</p>
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star size={14} fill="currentColor" />
            <span className="font-bold">{anime.rating?.toFixed(1) || "N/A"}</span>
          </div>
          
          {anime.releaseYear && (
            <div className="flex items-center gap-1 text-slate-400">
              <Calendar size={14} />
              <span>{anime.releaseYear}</span>
            </div>
          )}
          
          {isMovie ? (
            <div className="flex items-center gap-1 text-slate-400">
              <Film size={14} />
              <span>{anime.duration || "Movie"}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-slate-400">
              <Tv size={14} />
              <span>{totalEpisodes} eps</span>
            </div>
          )}
        </div>

        {/* Genres */}
        <div className="flex flex-wrap gap-1">
          {genres.slice(0, 4).map((g) => (
            <GenrePill key={g} genre={g} size="sm" />
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.();
            }}
            className="flex-1 flex items-center justify-center gap-2 h-10 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-colors"
          >
            <Play size={16} fill="currentColor" />
            Watch Now
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToList?.();
            }}
            className="h-10 w-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PosterHoverPreview;
