"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout, AnimeForm } from "@/components/admin";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddAnimePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (data: {
    title: string;
    titleJapanese?: string;
    type: string;
    status: string;
    genres: string[];
    synopsis: string;
    releaseYear?: number;
    rating?: number;
    duration?: string;
    posterImage?: string;
    bannerImage?: string;
    videoUrl?: string;
    seasons?: { seasonNumber: number; episodes: { number: number; title: string; streamingUrl?: string }[] }[];
    externalLinks?: { platform: string; url: string }[];
  }) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const isMovie = data.type === "Movie";
      const url = isMovie ? "/api/movie" : "/api/webseries";

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
          type: data.type, // Pass the specific type
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
          type: data.type, // Pass the specific type (OVA, ONA, Special, etc.)
          seasons: data.seasons,
          externalLinks: data.externalLinks,
        };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save anime");
      }

      setMessage({ type: "success", text: `${isMovie ? "Movie" : "Series"} added successfully!` });

      // Redirect after success
      setTimeout(() => {
        router.push(isMovie ? "/admin/movies" : "/admin/series");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setMessage({ type: "error", text: "Failed to save anime. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black">Add New Anime</h1>
            <p className="text-slate-500">Fill in the details below to add a new movie or series.</p>
          </div>
        </div>

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
        <AnimeForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </AdminLayout>
  );
}
