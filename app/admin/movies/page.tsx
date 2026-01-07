"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminLayout, AdminTable } from "@/components/admin";
import { Plus, Search, Film, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Movie {
  _id: string;
  title: string;
  description?: string;
  duration?: string;
  releaseYear?: number;
  rating?: number;
  image?: string;
  genre?: string[];
  genres?: string[];
  status?: string;
  type?: string;
  format?: 'Standalone' | 'Episodic';
}

export default function ManageMoviesPage() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await fetch("/api/movie");
      if (res.ok) {
        const data = await res.json();
        setMovies(data.movies || []);
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (movie: Movie) => {
    try {
      const res = await fetch(`/api/movie?id=${movie._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMovies((prev) => prev.filter((m) => m._id !== movie._id));
      }
    } catch (error) {
      console.error("Failed to delete movie:", error);
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: "image",
      label: "Poster",
      className: "col-span-1",
      render: (movie: Movie) => (
        <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 overflow-hidden">
          {movie.image ? (
            <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl">🎬</div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      className: "col-span-3",
      render: (movie: Movie) => (
        <div>
          <p className="font-bold truncate">{movie.title}</p>
          <p className="text-xs text-slate-500 truncate">{movie.description?.slice(0, 50) || "No description"}...</p>
        </div>
      ),
    },
    {
      key: "releaseYear",
      label: "Year",
      className: "col-span-1",
      render: (movie: Movie) => (
        <div className="flex items-center gap-2 text-slate-400">
          <Calendar size={14} />
          <span>{movie.releaseYear || "—"}</span>
        </div>
      )
    },
    {
      key: "duration",
      label: "Length",
      className: "col-span-2",
      render: (movie: Movie) => (
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-slate-500" />
          <span className="font-medium">{movie.duration || "N/A"}</span>
        </div>
      )
    },
    {
      key: "rating",
      label: "Rating",
      className: "col-span-1",
      render: (movie: Movie) =>
        movie.rating ? (
          <span className="px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-bold">
            ⭐ {movie.rating.toFixed(1)}
          </span>
        ) : (
          <span className="text-slate-500">—</span>
        ),
    },
    {
      key: "status",
      label: "Status",
      className: "col-span-1",
      render: (movie: Movie) => (
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-bold",
          movie.status === "Ongoing" ? "bg-green-500/10 text-green-400" :
            movie.status === "Completed" ? "bg-blue-500/10 text-blue-400" :
              "bg-slate-500/10 text-slate-400"
        )}>
          {movie.status || "Released"}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
              <Film size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black">Movies</h1>
              <p className="text-slate-500">{movies.length} movies in library</p>
            </div>
          </div>
          <Link href="/admin/add">
            <Button>
              <Plus size={18} className="mr-2" />
              Add Movie
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies..."
            className="pl-11"
          />
        </div>

        {/* Table */}
        <AdminTable
          data={filteredMovies}
          columns={columns}
          loading={loading}
          onDelete={handleDelete}
          onEdit={(movie) => {
            router.push(`/admin/edit/${movie._id}?type=Movie`);
          }}
          onView={(movie) => window.open(`/anime/${movie._id}`, "_blank")}
          getItemId={(movie) => movie._id}
          getItemTitle={(movie) => movie.title}
          emptyMessage="No movies found. Add your first movie!"
        />
      </div>
    </AdminLayout>
  );
}
