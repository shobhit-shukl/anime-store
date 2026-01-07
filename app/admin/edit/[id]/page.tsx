"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { AdminLayout, AnimeForm } from "@/components/admin";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditAnimePage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const typeParam = searchParams.get("type"); // "Movie" or "TV"

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (id && typeParam) {
            fetchAnimeData();
        }
    }, [id, typeParam]);

    const fetchAnimeData = async () => {
        try {
            const url = typeParam === "Movie" ? `/api/movie?id=${id}` : `/api/webseries?id=${id}`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                const anime = typeParam === "Movie" ? data.movie : data.webseries;

                // Transform for form
                setInitialData({
                    ...anime,
                    synopsis: anime.description || "",
                    genres: anime.genres || anime.genre || [],
                    posterImage: anime.image || "",
                    bannerImage: anime.bannerImage || "",
                    releaseYear: anime.releaseYear ? Number(anime.releaseYear) : undefined,
                    type: typeParam,
                });
            } else {
                setMessage({ type: "error", text: "Failed to load anime data." });
            }
        } catch (error) {
            console.error("Error fetching anime:", error);
            setMessage({ type: "error", text: "Error loading anime data." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data: any) => {
        setIsSaving(true);
        setMessage(null);

        try {
            const isMovie = data.type === "Movie";
            const url = isMovie ? `/api/movie?id=${id}` : `/api/webseries?id=${id}`;

            const payload = isMovie
                ? {
                    title: data.title,
                    titleJapanese: data.titleJapanese,
                    description: data.synopsis,
                    duration: data.duration,
                    releaseYear: data.releaseYear?.toString(),
                    rating: data.rating,
                    image: data.posterImage,
                    bannerImage: data.bannerImage,
                    videoUrl: data.videoUrl,
                    genres: data.genres,
                    status: data.status,
                    type: data.type, // Maintain specific type
                    externalLinks: data.externalLinks,
                }
                : {
                    title: data.title,
                    titleJapanese: data.titleJapanese,
                    description: data.synopsis,
                    image: data.posterImage,
                    bannerImage: data.bannerImage,
                    genres: data.genres,
                    status: data.status,
                    type: data.type, // Maintain specific type (OVA, ONA, etc.)
                    seasons: data.seasons,
                    externalLinks: data.externalLinks,
                };

            const response = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Failed to update anime");
            }

            setMessage({ type: "success", text: `${isMovie ? "Movie" : "Series"} updated successfully!` });

            setTimeout(() => {
                router.push(isMovie ? "/admin/movies" : "/admin/series");
            }, 1500);
        } catch (error: any) {
            console.error("Update error:", error);
            setMessage({ type: "error", text: error.message || "Failed to update anime." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href={typeParam === "Movie" ? "/admin/movies" : "/admin/series"}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black">Edit Anime</h1>
                        <p className="text-slate-500">Update the details of this {typeParam === "Movie" ? "movie" : "series"}.</p>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        <p className="text-slate-500">Loading anime data...</p>
                    </div>
                )}

                {/* Message */}
                {message && (
                    <div
                        className={`p-4 rounded-xl border ${message.type === "success"
                            ? "bg-green-500/10 border-green-500/30 text-green-400"
                            : "bg-red-500/10 border-red-500/30 text-red-400"
                            }`}
                    >
                        <p className="font-bold">{message.text}</p>
                    </div>
                )}

                {/* Form */}
                {!isLoading && initialData && (
                    <AnimeForm
                        initialData={initialData}
                        onSubmit={handleSubmit}
                        isLoading={isSaving}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
