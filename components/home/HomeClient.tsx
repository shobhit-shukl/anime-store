"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar, Footer } from "@/components/layout";
import { AnimeRow, GenrePill, RatingBadge } from "@/components/anime";
import { Button } from "@/components/ui/button";
import { HeroSkeleton, AnimeRowSkeleton } from "@/components/ui/skeleton";
import { SearchBar, SearchModal } from "@/components/layout/SearchModal";
import { type Anime, type Movie, ANIME_GENRES } from "@/types/anime";

type AnimeData = Anime | Movie;

interface HomeClientProps {
    initialMovies: any[];
    initialWebseries: any[];
}

export default function HomeClient({ initialMovies, initialWebseries }: HomeClientProps) {
    // Use props directly or initialize state if you plan to modify them client-side
    const [movies] = useState<AnimeData[]>(initialMovies);
    const [webseries] = useState<AnimeData[]>(initialWebseries);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Combine for featured carousel
    const featuredAnime = [...movies, ...webseries].slice(0, 5);

    // Loading state removed as data is passed from server. 
    // If you want a loading state while hydrating, you can use one, but usually not needed.

    // Auto-rotate carousel
    useEffect(() => {
        if (featuredAnime.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % featuredAnime.length);
            }, 6000);
            return () => clearInterval(interval);
        }
    }, [featuredAnime.length]);

    const currentFeatured = featuredAnime[currentSlide];

    const handleAnimeSelect = (anime: AnimeData) => {
        console.log("Selected:", anime);
    };

    return (
        <main className="min-h-screen bg-[--background] text-[--foreground] transition-colors">
            <Navbar isLoggedIn={false} />

            {/* Hero Section */}
            {featuredAnime.length > 0 ? (
                <section className="relative h-[85vh] md:h-[90vh] overflow-hidden">
                    {/* Background images with transition */}
                    {featuredAnime.map((anime, index) => (
                        <div
                            key={anime.id || anime._id || index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            <Image
                                src={anime.bannerImage || anime.posterImage || anime.image || "/placeholder-anime.svg"}
                                alt={anime.title}
                                fill
                                className="object-cover"
                                priority={index === 0}
                                sizes="100vw"
                            />
                        </div>
                    ))}

                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(2,6,23,0.8)_100%)]" />

                    {/* Hero content */}
                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-7xl mx-auto px-6 w-full">
                            <div className="max-w-2xl space-y-6">
                                {/* Type badge */}
                                <div className="flex items-center gap-3">
                                    <span className="bg-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg shadow-blue-600/30">
                                        {currentFeatured?.type === "Movie" ? "MOVIE" : "TV SERIES"}
                                    </span>
                                    <RatingBadge rating={currentFeatured?.rating} size="md" />
                                </div>

                                {/* Title */}
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                                    {currentFeatured?.title}
                                </h1>

                                {/* Japanese title */}
                                {currentFeatured?.titleJapanese && (
                                    <p className="text-xl text-slate-400 font-medium">
                                        {currentFeatured.titleJapanese}
                                    </p>
                                )}

                                {/* Genres */}
                                <div className="flex flex-wrap gap-2">
                                    {(currentFeatured?.genres || currentFeatured?.genre || [])
                                        .slice(0, 4)
                                        .map((g: string) => (
                                            <GenrePill key={g} genre={g} size="md" />
                                        ))}
                                </div>

                                {/* Description */}
                                <p className="text-slate-300 text-lg leading-relaxed line-clamp-3 max-w-xl">
                                    {currentFeatured?.synopsis ||
                                        currentFeatured?.description ||
                                        "Discover an incredible anime experience."}
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        size="xl"
                                        className="gap-3 bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all"
                                        onClick={() => window.location.href = `/anime/${currentFeatured._id}`}
                                    >
                                        <Play size={24} fill="currentColor" />
                                        Watch Now
                                    </Button>
                                    <Button
                                        size="xl"
                                        variant="outline"
                                        className="gap-2 bg-white/5 border-white/10 hover:bg-white/10 backdrop-blur-md"
                                        onClick={() => window.location.href = `/anime/${currentFeatured._id}`}
                                    >
                                        <Info size={20} />
                                        More Info
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Carousel navigation */}
                    {featuredAnime.length > 1 && (
                        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-4">
                            <button
                                onClick={() =>
                                    setCurrentSlide(
                                        (prev) => (prev - 1 + featuredAnime.length) % featuredAnime.length
                                    )
                                }
                                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center transition-all"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            {/* Dots */}
                            <div className="flex gap-2">
                                {featuredAnime.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
                                            ? "w-8 bg-blue-500"
                                            : "bg-white/30 hover:bg-white/50"
                                            }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={() =>
                                    setCurrentSlide((prev) => (prev + 1) % featuredAnime.length)
                                }
                                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center transition-all"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}

                    {/* Search bar overlay */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
                        <SearchBar
                            placeholder="Search your collection..."
                            size="lg"
                            className="shadow-2xl"
                            onFocus={() => setIsSearchOpen(true)}
                        />
                    </div>
                </section>
            ) : (
                // Empty state hero
                <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
                    <div className="text-center px-4 max-w-3xl flex flex-col items-center">
                        <div className="relative w-64 h-32 md:w-96 md:h-48 mb-6">
                            <Image
                                src="/Slice Meow Final-log.png"
                                alt="Slice Meow"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <p className="text-slate-400 text-lg mb-8">
                            Your personal sanctuary for anime. Start building your collection.
                        </p>
                        <SearchBar
                            placeholder="Search anime..."
                            size="lg"
                            className="max-w-md mx-auto"
                            onFocus={() => setIsSearchOpen(true)}
                        />
                    </div>
                </section>
            )}

            {/* Content sections based on Visual Wireframe Structure */}
            <div className="space-y-16 pb-20">

                {/* [ SUPPORT THE INDIAN ANIME MOVEMENT ] */}
                <section className="relative py-20 px-6 bg-gradient-to-r from-orange-600/10 via-slate-900 to-slate-950 border-y border-white/5 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10">
                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-orange-500 drop-shadow-[0_2px_10px_rgba(249,115,22,0.3)]">
                                Support The Indian<br />Anime Movement
                            </h2>
                            <p className="text-lg text-slate-400 max-w-xl mx-auto md:mx-0">
                                Join the revolution. We are building the largest community of anime fans in India. Be part of the change.
                            </p>
                            <Button
                                size="xl"
                                className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest shadow-[0_0_20px_rgba(234,88,12,0.4)]"
                                onClick={() => window.location.href = '/community'}
                            >
                                Join Community
                            </Button>
                        </div>
                        <div className="flex-1 w-full max-w-md">
                            <div className="aspect-video rounded-2xl overflow-hidden bg-slate-800 border border-white/10 shadow-2xl relative group cursor-pointer hover:scale-105 transition-transform duration-500">
                                <Image
                                    src="/placeholder-anime.svg"
                                    alt="Community"
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                                        <Play fill="currentColor" className="text-white ml-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-6 space-y-20">

                    {/* [ COMMUNITY VOICE ] */}
                    <section>
                        <h2 className="text-2xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                            Community Voice
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-slate-900/50 border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-colors">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                                            <span className="font-bold text-slate-500">U{i}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-200">AnimeFan_{i}</p>
                                            <p className="text-xs text-slate-500">2 hours ago</p>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        "Finally a platform that understands what Indian anime fans need! The streaming quality is insane and the collection is growing fast."
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* [ TRENDING WORLDS ] - Horizontal Cards */}
                    {webseries.length > 0 && (
                        <AnimeRow
                            title="Trending Worlds"
                            subtitle="Top IPs dominating the charts"
                            animeList={webseries}
                            variant="horizontal"
                            onAnimeSelect={handleAnimeSelect}
                            accentColor="purple"
                        />
                    )}

                    {/* [ SLICE MEOW ORIGINALS ] */}
                    <section>
                        <h2 className="text-2xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-pink-500 rounded-full"></span>
                            Slice Meow Originals
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-900 cursor-pointer">
                                    <Image
                                        src={`/placeholder-anime.svg`}
                                        alt="Original Content"
                                        fill
                                        className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                        <p className="font-bold text-white text-sm line-clamp-2">Behind the scenes of India's Anime Revolution #{i}</p>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                                            <Play size={12} fill="currentColor" />
                                            <span>2.4k views</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recently Added (Bonus, keep it subtle) */}
                    {[...movies, ...webseries].length > 0 && (
                        <AnimeRow
                            title="Latest Arrivals"
                            animeList={[...movies, ...webseries].slice(0, 10)}
                            variant="compact"
                            onAnimeSelect={handleAnimeSelect}
                        />
                    )}
                </div>
            </div>

            <Footer />

            {/* Search Modal */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                onSelect={(item) => {
                    // Navigate to anime detail page
                    window.location.href = `/anime/${item._id || item.id}`;
                }}
            />
        </main>
    );
}
