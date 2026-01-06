// Episode interface for series
export interface Episode {
  id?: string;
  number: number;
  title: string;
  duration?: string;
  thumbnail?: string;
  airDate?: Date;
  streamingUrl?: string;
  externalLinks?: ExternalLink[];
}

// Season interface for series
export interface Season {
  id?: string;
  seasonNumber: number;
  title?: string;
  episodes: Episode[];
  year?: number;
}

// External streaming/watch links
export interface ExternalLink {
  platform: string; // e.g., "Crunchyroll", "Netflix", "Funimation"
  url: string;
  isPrimary?: boolean;
}

// Main Anime interface (covers Movies, TV Series, OVA, etc.)
export interface Anime {
  id?: string;
  _id?: string;

  // Core Info
  title: string;
  titleJapanese?: string;
  titleRomaji?: string;
  slug?: string;

  // Media
  posterImage?: string;
  bannerImage?: string;
  trailerUrl?: string;
  image?: string; // Legacy support

  // Metadata
  type: "TV" | "Movie" | "OVA" | "ONA" | "Special" | "Music";
  status: "Ongoing" | "Completed" | "Upcoming" | "Hiatus";
  rating?: number; // 0-10 scale
  popularity?: number;

  // Categorization
  genres: string[];
  genre?: string[]; // Legacy support
  tags?: string[];
  studio?: string;
  source?: string; // e.g., "Manga", "Light Novel", "Original"

  // Description
  synopsis?: string;
  description?: string;

  // Dates
  releaseYear?: number;
  startDate?: Date;
  endDate?: Date;

  // Content structure
  seasons?: Season[];
  totalEpisodes?: number;
  duration?: string; // For movies: "2h 15m", for series: "24 min/ep"

  // External links
  externalLinks?: ExternalLink[];

  // User interaction (for future features)
  views?: number;
  favorites?: number;

  // Visibility
  isPublished?: boolean;
  isFeatured?: boolean;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

// Legacy Movie type for backwards compatibility (extended)
export interface Movie {
  id?: string;
  _id?: string;
  title: string;
  titleJapanese?: string;
  seasons?: Season[];
  description?: string;
  synopsis?: string;
  duration?: string;
  releaseYear?: number;
  image?: string;
  posterImage?: string;
  bannerImage?: string;
  rating?: number;
  status?: "Ongoing" | "Completed" | "Upcoming" | "Hiatus";
  genre?: string[];
  genres?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  type?: string;
  totalEpisodes?: number;
  popularity?: number;
  externalLinks?: ExternalLink[];
  isFeatured?: boolean;
}

// Utility type for filters
export interface AnimeFilters {
  genre?: string;
  year?: number;
  type?: Anime["type"];
  status?: Anime["status"];
  sortBy?: "popularity" | "rating" | "releaseDate" | "title";
  sortOrder?: "asc" | "desc";
  search?: string;
}

// User watchlist/favorites
export interface UserAnimeEntry {
  animeId: string;
  status: "watching" | "completed" | "plan_to_watch" | "dropped" | "on_hold";
  progress?: number; // Episode number
  rating?: number;
  notes?: string;
  addedAt: Date;
  updatedAt: Date;
}

// For search results
export interface AnimeSearchResult {
  id?: string;
  _id?: string;
  title: string;
  titleJapanese?: string;
  posterImage?: string;
  image?: string;
  type?: Anime["type"] | string;
  releaseYear?: number;
  rating?: number;
}

// Constants
export const ANIME_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Isekai",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
] as const;

export const ANIME_TYPES = ["TV", "Movie", "OVA", "ONA", "Special", "Music"] as const;
export const ANIME_STATUSES = ["Ongoing", "Completed", "Upcoming", "Hiatus"] as const;

export type AnimeGenre = typeof ANIME_GENRES[number];
export type AnimeType = typeof ANIME_TYPES[number];
export type AnimeStatus = typeof ANIME_STATUSES[number];