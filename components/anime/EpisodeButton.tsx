"use client";

import { Play, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface EpisodeButtonProps {
  episodeNumber: number;
  title?: string;
  duration?: string;
  isWatched?: boolean;
  isCurrent?: boolean;
  onClick?: () => void;
  variant?: "default" | "compact" | "detailed";
}

export function EpisodeButton({
  episodeNumber,
  title,
  duration,
  isWatched = false,
  isCurrent = false,
  onClick,
  variant = "default",
}: EpisodeButtonProps) {
  if (variant === "compact") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "inline-flex items-center justify-center w-12 h-12 rounded-xl font-bold text-sm transition-all duration-200",
          isCurrent
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
            : isWatched
            ? "bg-green-600/20 text-green-400 border border-green-500/20"
            : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
        )}
      >
        {episodeNumber.toString().padStart(2, "0")}
      </button>
    );
  }

  if (variant === "detailed") {
    return (
      <button
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group text-left",
          isCurrent
            ? "bg-blue-600/20 border-2 border-blue-500/50"
            : isWatched
            ? "bg-green-600/10 border border-green-500/20 hover:bg-green-600/20"
            : "bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/30"
        )}
      >
        {/* Episode Number */}
        <div
          className={cn(
            "w-14 h-14 flex items-center justify-center rounded-xl font-black text-lg",
            isCurrent
              ? "bg-blue-600 text-white"
              : isWatched
              ? "bg-green-600/30 text-green-400"
              : "bg-white/5 text-slate-400 group-hover:bg-blue-600/20 group-hover:text-blue-400"
          )}
        >
          {episodeNumber.toString().padStart(2, "0")}
        </div>

        {/* Episode Info */}
        <div className="flex-1 min-w-0">
          <h4
            className={cn(
              "font-bold truncate",
              isCurrent ? "text-blue-400" : isWatched ? "text-green-400" : "text-white group-hover:text-blue-400"
            )}
          >
            {title || `Episode ${episodeNumber}`}
          </h4>
          {duration && (
            <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
              <Clock size={12} />
              {duration}
            </div>
          )}
        </div>

        {/* Play Icon */}
        <Play
          size={20}
          className={cn(
            "transition-transform duration-200",
            isCurrent
              ? "text-blue-400"
              : "text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1"
          )}
        />
      </button>
    );
  }

  // Default variant
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-4 rounded-2xl transition-all duration-200 group border",
        isCurrent
          ? "bg-blue-600/20 border-blue-500/50"
          : isWatched
          ? "bg-green-600/10 border-green-500/20 hover:bg-green-600/20"
          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-blue-500/30"
      )}
    >
      <div className="flex items-center gap-4">
        <span
          className={cn(
            "text-sm font-bold",
            isCurrent ? "text-blue-400" : isWatched ? "text-green-400" : "text-slate-500"
          )}
        >
          EP {episodeNumber.toString().padStart(2, "0")}
        </span>
        <span
          className={cn(
            "font-bold",
            isCurrent
              ? "text-blue-400"
              : isWatched
              ? "text-green-400"
              : "text-white group-hover:text-blue-400"
          )}
        >
          {title || `Episode ${episodeNumber}`}
        </span>
      </div>
      <Play
        size={16}
        className={cn(
          "transition-transform duration-200",
          isCurrent
            ? "text-blue-400"
            : "text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1"
        )}
      />
    </button>
  );
}

// Episode Grid for quick navigation
interface EpisodeGridProps {
  totalEpisodes: number;
  watchedEpisodes?: number[];
  currentEpisode?: number;
  onEpisodeClick?: (episode: number) => void;
}

export function EpisodeGrid({
  totalEpisodes,
  watchedEpisodes = [],
  currentEpisode,
  onEpisodeClick,
}: EpisodeGridProps) {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
      {Array.from({ length: totalEpisodes }, (_, i) => i + 1).map((ep) => (
        <EpisodeButton
          key={ep}
          episodeNumber={ep}
          variant="compact"
          isWatched={watchedEpisodes.includes(ep)}
          isCurrent={currentEpisode === ep}
          onClick={() => onEpisodeClick?.(ep)}
        />
      ))}
    </div>
  );
}
