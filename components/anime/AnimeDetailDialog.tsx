"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    X,
    Play,
    Info,
    Calendar,
    Clock,
    Share2,
    Heart
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenrePill } from "./GenrePill";
import { RatingBadge } from "./RatingBadge";
import { EpisodeButton } from "./EpisodeButton";
import { cn } from "@/lib/utils";
import type { Anime, Movie } from "@/types/anime";

type AnimeData = Anime | Movie;

interface AnimeDetailDialogProps {
    item: AnimeData | null;
    isOpen: boolean;
    onClose: () => void;
}

export function AnimeDetailDialog({ item, isOpen, onClose }: AnimeDetailDialogProps) {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [activeSeason, setActiveSeason] = useState("season-1");

    // Reset state when item changes
    useEffect(() => {
        if (isOpen) {
            setShowFullDescription(false);
            // Default to first season if available
            // @ts-ignore
            if (item && item.seasons && item.seasons.length > 0) {
                // @ts-ignore
                setActiveSeason(`season-${item.seasons[0].seasonNumber}`);
            }
        }
    }, [isOpen, item]);

    // Handle hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;
    if (!item) return null;

    // normalize data
    const title = item.title;
    const image = item.posterImage || item.image || "/placeholder-anime.svg";
    const banner = item.bannerImage || image;
    const rating = item.rating;
    const year = item.releaseYear;
    // @ts-ignore - handling both types
    const genres = item.genres || item.genre || [];
    const description = item.synopsis || item.description || "No description available.";
    const type = (item as any).type || "Anime";
    const duration = (item as any).duration;

    // Check for seasons
    const seasons = (item as any).seasons || [];
    const hasSeasons = seasons.length > 0;

    const handlePlayEpisode = (episode: any) => {
        console.log("Playing episode:", episode);
        // Logic to play episode - possibly emit an event or navigate
        if (episode.streamingUrl) {
            window.open(episode.streamingUrl, '_blank');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black border-zinc-800 text-zinc-100 sm:rounded-2xl gap-0 max-h-[90vh] flex flex-col">
                <div className="hidden">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>Details for {title}</DialogDescription>
                </div>

                {/* Scrollable Content Container */}
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    {/* Banner / Header */}
                    <div className="relative h-48 md:h-80 w-full shrink-0">
                        <div className="absolute inset-0">
                            <Image
                                src={banner}
                                alt={title}
                                fill
                                className="object-cover opacity-60"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md transition-colors z-10"
                        >
                            <X className="w-5 h-5 text-slate-200" />
                        </button>
                    </div>

                    {/* Content Body */}
                    <div className="relative px-6 pb-8 -mt-20 md:-mt-32 z-0">
                        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                            {/* Poster Card */}
                            <div className="shrink-0 mx-auto md:mx-0">
                                <div className="relative w-40 h-60 md:w-56 md:h-80 rounded-lg overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-zinc-700/50">
                                    <Image
                                        src={image}
                                        alt={title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 space-y-6 pt-2 md:pt-14">
                                <div>
                                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-2 leading-none">
                                        {title}
                                    </h2>
                                    {item.titleJapanese && (
                                        <p className="text-lg text-slate-400 font-medium">
                                            {item.titleJapanese}
                                        </p>
                                    )}
                                </div>

                                {/* Metadata Row */}
                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-300">
                                    {rating !== undefined && <RatingBadge rating={rating} size="sm" />}

                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4 text-slate-500" />
                                        <span>{year || "N/A"}</span>
                                    </div>

                                    {duration && (
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-slate-500" />
                                            <span>{duration}</span>
                                        </div>
                                    )}

                                    <div className="px-2 py-0.5 rounded-md bg-zinc-800 text-xs font-bold uppercase tracking-wider text-zinc-400 border border-zinc-700">
                                        {type}
                                    </div>
                                </div>

                                {/* Genres */}
                                {genres.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {genres.map((genre: string) => (
                                            <GenrePill key={genre} genre={genre} size="sm" />
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-3 pt-2">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2 rounded-full px-6">
                                        <Play className="w-4 h-4 fill-current" />
                                        {hasSeasons ? "Resume" : "Watch Movie"}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-200 gap-2 rounded-full"
                                        onClick={() => setShowFullDescription(!showFullDescription)}
                                    >
                                        <Info className="w-4 h-4" />
                                        {showFullDescription ? "Less Info" : "More Info"}
                                    </Button>

                                    <div className="flex-1" />

                                    <Button size="icon" variant="ghost" className="text-slate-400 hover:text-pink-500 hover:bg-pink-500/10 rounded-full">
                                        <Heart className="w-5 h-5" />
                                    </Button>
                                    <Button size="icon" variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full">
                                        <Share2 className="w-5 h-5" />
                                    </Button>
                                </div>

                                {/* Description */}
                                <div
                                    className={cn(
                                        "relative bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 transition-all duration-300 ease-in-out",
                                        showFullDescription ? "opacity-100" : "opacity-100"
                                    )}
                                >
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Synopsis</h4>
                                    <p className={cn("text-slate-300 leading-relaxed text-sm md:text-base", !showFullDescription && "line-clamp-3")}>
                                        {description}
                                    </p>
                                </div>

                                {/* Episodes Section - Only for TV/Series */}
                                {hasSeasons && (
                                    <div className="pt-8 pb-8">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                                <Play className="w-5 h-5 text-blue-500 block" /> Episodes
                                            </h3>
                                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                                                {seasons.reduce((acc: number, s: any) => acc + (s.episodes?.length || 0), 0)} TOTAL
                                            </span>
                                        </div>

                                        <Tabs value={activeSeason} onValueChange={setActiveSeason} className="w-full">
                                            {seasons.length > 1 && (
                                                <TabsList className="bg-zinc-900/50 border border-zinc-800 mb-4 w-full justify-start h-auto p-1 flex-wrap">
                                                    {seasons.map((season: any) => (
                                                        <TabsTrigger
                                                            key={season.seasonNumber}
                                                            value={`season-${season.seasonNumber}`}
                                                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-slate-400"
                                                        >
                                                            Season {season.seasonNumber}
                                                        </TabsTrigger>
                                                    ))}
                                                </TabsList>
                                            )}

                                            {seasons.map((season: any) => (
                                                <TabsContent key={season.seasonNumber} value={`season-${season.seasonNumber}`} className="mt-0 space-y-2">
                                                    {season.episodes && season.episodes.length > 0 ? (
                                                        season.episodes.map((episode: any) => (
                                                            <EpisodeButton
                                                                key={episode.number}
                                                                episodeNumber={episode.number}
                                                                title={episode.title}
                                                                duration={episode.duration || "24m"}
                                                                variant="detailed"
                                                                onClick={() => handlePlayEpisode(episode)}
                                                            />
                                                        ))
                                                    ) : (
                                                        <div className="text-zinc-500 py-8 text-center bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                                                            No episodes available for this season.
                                                        </div>
                                                    )}
                                                </TabsContent>
                                            ))}
                                        </Tabs>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
