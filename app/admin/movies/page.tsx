"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminLayout, AdminTable } from "@/components/admin";
import { Plus, Search, Film, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
  showInHero?: boolean;
}

export default function ManageMoviesPage() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [viewItem, setViewItem] = useState<Movie | null>(null);
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
    {
      key: "feature",
      label: "Feature",
      className: "col-span-1",
      render: (movie: Movie) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={movie.showInHero !== false}
            onChange={async (e) => {
              const checked = e.target.checked;
              setMovies((prev) => prev.map((m) => m._id === movie._id ? { ...m, showInHero: checked } : m));
              try {
                await fetch(`/api/movie?id=${movie._id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ showInHero: checked }),
                });
              } catch (err) {
                console.error("Failed to update showInHero", err);
                setMovies((prev) => prev.map((m) => m._id === movie._id ? { ...m, showInHero: !checked } : m));
              }
            }}
          />
          <span className="w-10 h-6 bg-white/5 rounded-full peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-400 transition-colors"></span>
          <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transform peer-checked:translate-x-4 transition-transform shadow-sm" />
        </label>
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
          onView={(movie) => setViewItem(movie)}
          getItemId={(movie) => movie._id}
          getItemTitle={(movie) => movie.title}
          emptyMessage="No movies found. Add your first movie!"
        />

        {/* Details dialog */}
        <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{viewItem?.title}</DialogTitle>
              <DialogDescription>{viewItem?.description}</DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              {viewItem?.image && (
                <img src={viewItem.image} alt={viewItem.title} className="w-full h-48 object-cover rounded-md mb-4" />
              )}

              <div className="text-sm text-slate-400 space-y-2">
                <div><strong>Duration:</strong> {viewItem?.duration || "N/A"}</div>
                <div><strong>Year:</strong> {viewItem?.releaseYear || "—"}</div>
                <div><strong>Genres:</strong> {(viewItem?.genres || viewItem?.genre || []).join(", ") || "—"}</div>
                <div><strong>Rating:</strong> {viewItem?.rating ?? "—"}</div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setViewItem(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
