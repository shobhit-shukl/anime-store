"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar, Footer } from "@/components/layout";
import { AnimeRow, GenrePill, RatingBadge } from "@/components/anime";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
    const [selectedAnime, setSelectedAnime] = useState<AnimeData | null>(null);

    // Combine for featured carousel and filter by showInHero flag
    const featuredAnime = [...movies, ...webseries].filter(item => item.showInHero !== false).slice(0, 5);

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
        setSelectedAnime(anime);
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

            {/* Content sections */}
            <div className="max-w-7xl mx-auto px-6 space-y-4 pb-20">
                <>
                    {/* Trending Section */}
                    {webseries.length > 0 && (
                        <AnimeRow
                            title="Trending Now"
                            subtitle="Most watched this week"
                            animeList={webseries}
                            onAnimeSelect={handleAnimeSelect}
                            accentColor="purple"
                        />
                    )}

                    {/* Movies Section */}
                    {movies.length > 0 && (
                        <AnimeRow
                            title="Movies"
                            subtitle="Feature-length anime films"
                            animeList={movies}
                            onAnimeSelect={handleAnimeSelect}
                            accentColor="blue"
                            showViewAll
                            onViewAll={() => console.log("View all movies")}
                        />
                    )}

                    {/* Web Series Section */}
                    {webseries.length > 0 && (
                        <AnimeRow
                            title="Web Series"
                            subtitle="Episodic content for binge watching"
                            animeList={webseries}
                            onAnimeSelect={handleAnimeSelect}
                            accentColor="green"
                            showViewAll
                        />
                    )}

                    {/* Genre Quick Access */}
                    <section className="py-12">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-10 w-2 bg-pink-600 rounded-full shadow-[0_0_15px_rgba(219,39,119,0.5)]" />
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">
                                    Browse by Genre
                                </h2>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    Find anime by your favorite categories
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            {ANIME_GENRES.map((genre) => (
                                <GenrePill
                                    key={genre}
                                    genre={genre}
                                    size="lg"
                                    variant="outline"
                                    onClick={() => console.log(`Browse ${genre}`)}
                                />
                            ))}
                        </div>
                    </section>

                    {/* Recently Added */}
                    {[...movies, ...webseries].length > 0 && (
                        <AnimeRow
                            title="Recently Added"
                            subtitle="Fresh content just for you"
                            animeList={[...movies, ...webseries].slice(0, 10)}
                            variant="compact"
                            onAnimeSelect={handleAnimeSelect}
                            accentColor="orange"
                        />
                    )}
                </>
            </div>

            <Footer />

            {/* Details dialog for selected anime */}
            <Dialog open={!!selectedAnime} onOpenChange={() => setSelectedAnime(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedAnime?.title}</DialogTitle>
                        <DialogDescription>{selectedAnime?.titleJapanese}</DialogDescription>
                    </DialogHeader>

                    <div className="mt-4">
                        {selectedAnime && (
                            <img
                                src={selectedAnime.bannerImage || selectedAnime.posterImage || selectedAnime.image || "/placeholder-anime.svg"}
                                alt={selectedAnime.title}
                                className="w-full h-64 object-cover rounded-md mb-4"
                            />
                        )}

                        <div className="text-sm text-slate-400 space-y-2">
                            <p>{selectedAnime?.synopsis || selectedAnime?.description || "No description available."}</p>
                            <p><strong>Type:</strong> {selectedAnime?.type || (selectedAnime && (selectedAnime as any).duration ? 'Movie' : 'TV')}</p>
                            {selectedAnime && (selectedAnime as any).duration && (
                                <p><strong>Duration:</strong> {(selectedAnime as any).duration}</p>
                            )}
                            {selectedAnime && (selectedAnime as any).releaseYear && (
                                <p><strong>Year:</strong> {(selectedAnime as any).releaseYear}</p>
                            )}
                            <p><strong>Genres:</strong> {(selectedAnime?.genres || selectedAnime?.genre || []).join(", ") || "—"}</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button onClick={() => selectedAnime && (window.location.href = `/anime/${(selectedAnime as any)._id || (selectedAnime as any).id}`)}>Open Page</Button>
                        <Button variant="ghost" onClick={() => setSelectedAnime(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
