"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Play,
  Calendar,
  Clock,
  ChevronLeft,
  ExternalLink,
  Download,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GenrePill } from "@/components/anime/GenrePill";
import { RatingBadge } from "@/components/anime/RatingBadge";
import { AnimeCard } from "@/components/anime/AnimeCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimeDetailSkeleton } from "@/components/ui/skeleton";
import { cn, truncateText } from "@/lib/utils";

interface Episode {
  number: number;
  title: string;
  duration?: string;
  thumbnail?: string;
}

interface Season {
  seasonNumber: number;
  episodes: Episode[];
}

interface AnimeDetail {
  _id: string;
  title: string;
  titleJapanese?: string;
  description?: string;
  synopsis?: string;
  type?: string;
  status?: string;
  genres?: string[];
  rating?: number;
  releaseYear?: string;
  duration?: string;
  image?: string;
  bannerImage?: string;
  seasons?: Season[];
  format?: 'Standalone' | 'Episodic';
  externalLinks?: { platform: string; url: string }[];
}

export default function AnimeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [similar, setSimilar] = useState<AnimeDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSeason, setActiveSeason] = useState(1);

  const [expandedSynopsis, setExpandedSynopsis] = useState(false);

  useEffect(() => {
    const season = searchParams.get("season");
    if (season) {
      setActiveSeason(parseInt(season));
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchAnime() {
      try {
        // Try to fetch from movies first (Standalone)
        const movieRes = await fetch(`/api/movie?id=${id}`);
        if (movieRes.ok) {
          const data = await movieRes.json();
          if (data.movie) {
            setAnime(data.movie);
            // Fetch some similar movies (optional optimization: dedicated similar API)
            const listRes = await fetch("/api/movie");
            if (listRes.ok) {
              const listData = await listRes.json();
              setSimilar(listData.movies?.filter((m: any) => m._id !== id).slice(0, 6) || []);
            }
            return;
          }
        }

        // Try series (Episodic)
        const seriesRes = await fetch(`/api/webseries?id=${id}`);
        if (seriesRes.ok) {
          const data = await seriesRes.json();
          if (data.webseries) {
            setAnime(data.webseries);
            // Fetch some similar series
            const listRes = await fetch("/api/webseries");
            if (listRes.ok) {
              const listData = await listRes.json();
              setSimilar(listData.webseries?.filter((s: any) => s._id !== id).slice(0, 6) || []);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch anime:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchAnime();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[--background] text-[--foreground] transition-colors">
        <Navbar />
        <AnimeDetailSkeleton />
        <Footer />
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-[--background] text-[--foreground] flex flex-col transition-colors">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <h1 className="text-4xl font-black mb-4">Anime Not Found</h1>
          <p className="text-slate-500 mb-8">
            The anime you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/browse">
            <Button>Browse Anime</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isStandalone = anime.format === "Standalone";
  const synopsis = anime.description || anime.synopsis || "No synopsis available.";
  const totalEpisodes = anime.seasons?.reduce(
    (acc, s) => acc + (s.episodes?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[--background] text-[--foreground] transition-colors">
      <Navbar />

      {/* Banner Section */}
      <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${anime.bannerImage || anime.image || "/placeholder-banner.jpg"})`,
          }}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a2f] via-[#0f1a2f]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1a2f]/85 via-transparent to-transparent" />

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="absolute top-24 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-sm text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-64 lg:-mt-72">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Poster */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-2xl shadow-black/50">
                {anime.image ? (
                  <img
                    src={anime.image}
                    alt={anime.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-8xl">
                    🎬
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-4 flex gap-3">
                <Button className="flex-1" size="lg">
                  <Play size={20} className="mr-2" fill="currentColor" />
                  {isStandalone ? "Watch Now" : "Start Watching"}
                </Button>
              </div>

            </div>
          </div>

          {/* Details */}
          <div className="space-y-8 pb-12">
            {/* Title & Meta */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase">
                  {anime.type || "TV"}
                </span>
                {anime.status && (
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase",
                      anime.status === "Ongoing"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-white/10 text-slate-400"
                    )}
                  >
                    {anime.status}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-2">
                {anime.title}
              </h1>

              {anime.titleJapanese && (
                <p className="text-lg text-slate-500 mb-4">{anime.titleJapanese}</p>
              )}

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {anime.rating && <RatingBadge rating={anime.rating} size="lg" />}
                {anime.releaseYear && (
                  <span className="flex items-center gap-2 text-slate-400">
                    <Calendar size={16} />
                    {anime.releaseYear}
                  </span>
                )}
                {anime.duration && (
                  <span className="flex items-center gap-2 text-slate-400">
                    <Clock size={16} />
                    {anime.duration}
                  </span>
                )}
                {!isStandalone && anime.seasons && (
                  <span className="text-slate-400">
                    {anime.seasons.length} Season{anime.seasons.length !== 1 ? "s" : ""} •{" "}
                    {totalEpisodes} Episodes
                  </span>
                )}
              </div>
            </div>

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <GenrePill key={genre} genre={genre} />
                ))}
              </div>
            )}

            {/* Synopsis */}
            <div>
              <h2 className="text-xl font-bold mb-3">Synopsis</h2>
              <p className="text-slate-400 leading-relaxed">
                {expandedSynopsis ? synopsis : truncateText(synopsis, 400)}
              </p>
              {synopsis.length > 400 && (
                <button
                  onClick={() => setExpandedSynopsis(!expandedSynopsis)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2"
                >
                  {expandedSynopsis ? "Show Less" : "Read More"}
                </button>
              )}
            </div>

            {/* Tabs for Episodes/Info */}
            <Tabs defaultValue={isStandalone ? "info" : "episodes"} className="space-y-6">
              <TabsList>
                {!isStandalone && <TabsTrigger value="episodes">Episodes</TabsTrigger>}
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="streaming">Where to Watch</TabsTrigger>
              </TabsList>

              {/* Episodes Tab */}
              {!isStandalone && (
                <TabsContent value="episodes" className="space-y-6">
                  {/* Season Selector */}
                  {anime.seasons && anime.seasons.length > 1 && (
                    <div className="flex flex-wrap gap-2">
                      {anime.seasons.map((season) => (
                        <Link
                          key={season.seasonNumber}
                          href={`?season=${season.seasonNumber}`}
                          onClick={(e) => {
                            // Optional: prevent default if we want to handle state manually to avoid flicker
                            // But Link is fine. We can also just let it navigate.
                            // For smoother UX, we can update state immediately.
                            setActiveSeason(season.seasonNumber);
                          }}
                          className={cn(
                            "px-4 py-2 rounded-xl font-bold text-sm transition-all",
                            activeSeason === season.seasonNumber
                              ? "bg-blue-600 text-white"
                              : "bg-white/5 text-slate-400 hover:bg-white/10"
                          )}
                        >
                          Season {season.seasonNumber}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Episode Grid */}
                  <div className="grid gap-3">
                    {anime.seasons
                      ?.find((s) => s.seasonNumber === activeSeason)
                      ?.episodes.map((ep) => (
                        <Link
                          key={ep.number}
                          href={`/anime/${id}/watch/${ep.number}?season=${activeSeason}`}
                          className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left group"
                        >
                          <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                            <Play size={20} className="text-slate-400 group-hover:text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold">
                              Episode {ep.number}
                              {ep.title && `: ${ep.title}`}
                            </p>
                            {ep.duration && (
                              <p className="text-sm text-slate-500">{ep.duration}</p>
                            )}
                          </div>
                          <Download
                            size={18}
                            className="text-slate-600 hover:text-white transition-colors"
                          />
                        </Link>
                      )) || (
                        <p className="text-center text-slate-500 py-8">
                          No episodes available for this season.
                        </p>
                      )}
                  </div>
                </TabsContent>
              )}

              {/* Info Tab */}
              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="Type" value={anime.type || "—"} />
                  <InfoItem label="Status" value={anime.status || "—"} />
                  <InfoItem label="Release Year" value={anime.releaseYear || "—"} />
                  <InfoItem label="Duration" value={anime.duration || "—"} />
                  {!isStandalone && (
                    <>
                      <InfoItem
                        label="Seasons"
                        value={anime.seasons?.length?.toString() || "0"}
                      />
                      <InfoItem label="Episodes" value={totalEpisodes?.toString() || "0"} />
                    </>
                  )}
                  <InfoItem
                    label="Genres"
                    value={anime.genres?.join(", ") || "—"}
                    className="col-span-2"
                  />
                </div>
              </TabsContent>

              {/* Streaming Tab */}
              <TabsContent value="streaming" className="space-y-4">
                {anime.externalLinks && anime.externalLinks.length > 0 ? (
                  <div className="grid gap-3">
                    {anime.externalLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                          <ExternalLink size={20} className="text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold">{link.platform}</p>
                          <p className="text-sm text-slate-500 truncate">{link.url}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-400 text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          Watch
                        </span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ExternalLink size={48} className="mx-auto mb-4 text-slate-700" />
                    <p className="text-slate-500">No streaming links available.</p>
                    <p className="text-sm text-slate-600 mt-1">
                      Check back later for updates.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Similar Anime */}
      {similar.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-black mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similar.map((item) => (
              <AnimeCard
                key={item._id}
                anime={{
                  id: item._id,
                  title: item.title,
                  posterImage: item.image || "",
                  rating: item.rating,
                  type: item.type as "TV" | "Movie",
                  genres: item.genres,
                }}
                variant="compact"
                onSelect={(anime) => {
                  router.push(`/anime/${anime._id || anime.id}`);
                }}
              />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

function InfoItem({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("bg-white/5 rounded-xl p-4", className)}>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
