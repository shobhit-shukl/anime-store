"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminLayout, AdminTable } from "@/components/admin";
import { Plus, Search, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Season {
  seasonNumber: number;
  episodes: { number: number; title: string }[];
}

interface Series {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  genre?: string[];
  genres?: string[];
  status?: string;
  seasons?: Season[];
  type?: string;
  format?: 'Standalone' | 'Episodic';
  showInHero?: boolean;
}

export default function ManageSeriesPage() {
  const router = useRouter();
  const [series, setSeries] = useState<Series[]>([]);
  const [viewItem, setViewItem] = useState<Series | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const res = await fetch("/api/webseries");
      if (res.ok) {
        const data = await res.json();
        setSeries(data.webseries || []);
      }
    } catch (error) {
      console.error("Failed to fetch series:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item: Series) => {
    try {
      const res = await fetch(`/api/webseries?id=${item._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSeries((prev) => prev.filter((s) => s._id !== item._id));
      }
    } catch (error) {
      console.error("Failed to delete series:", error);
    }
  };

  const getTotalEpisodes = (s: Series) => {
    return s.seasons?.reduce((acc, season) => acc + (season.episodes?.length || 0), 0) || 0;
  };

  const handleToggleShowInHero = async (item: Series, value: boolean) => {
    try {
      const res = await fetch(`/api/webseries?id=${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showInHero: value }),
      });

      if (res.ok) {
        const data = await res.json();
        const updated = data.webseries || data.series;
        setSeries((prev) => prev.map((s) => (s._id === item._id ? { ...s, showInHero: updated?.showInHero ?? value } : s)));
      }
    } catch (error) {
      console.error("Failed to update showInHero:", error);
    }
  };

  const filteredSeries = series.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const columns = [
    {
      key: "image",
      label: "Poster",
      className: "col-span-1",
      render: (item: Series) => (
        <div className="w-10 h-14 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 overflow-hidden">
          {item.image ? (
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl">📺</div>
          )}
        </div>
      ),
    },
    {
      key: "title",
      label: "Title",
      className: "col-span-3",
      render: (item: Series) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[10px] font-black uppercase tracking-tight text-slate-400 border border-white/5">
              {item.type || "TV"}
            </span>
            <p className="font-bold truncate">{item.title}</p>
          </div>
          <p className="text-xs text-slate-500 truncate">{item.description?.slice(0, 50) || "No description"}...</p>
        </div>
      ),
    },
    {
      key: "seasons",
      label: "Seasons",
      className: "col-span-1",
      render: (item: Series) => (
        <span className="font-bold">{item.seasons?.length || 0}</span>
      ),
    },
    {
      key: "episodes",
      label: "Episodes",
      className: "col-span-1",
      render: (item: Series) => (
        <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold">
          {getTotalEpisodes(item)} eps
        </span>
      ),
    },
    {
      key: "genres",
      label: "Genres",
      className: "col-span-2",
      render: (item: Series) => {
        const displayGenres = item.genres || item.genre || [];
        return (
          <div className="flex flex-wrap gap-1">
            {displayGenres.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="px-2 py-0.5 rounded-full bg-white/5 text-slate-400 text-xs"
              >
                {genre}
              </span>
            ))}
            {displayGenres.length > 2 && <span className="text-xs text-slate-500">+{displayGenres.length - 2}</span>}
            {displayGenres.length === 0 && <span className="text-slate-500">—</span>}
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      className: "col-span-1",
      render: (item: Series) => (
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs font-bold",
            item.status === "Ongoing"
              ? "bg-green-500/10 text-green-400"
              : item.status === "Completed"
                ? "bg-blue-500/10 text-blue-400"
                : "bg-yellow-500/10 text-yellow-400"
          )}
        >
          {item.status || "Unknown"}
        </span>
      ),
    },
    {
      key: "feature",
      label: "Feature",
      className: "col-span-1",
      render: (item: Series) => (
        <div className="flex items-center justify-start">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={item.showInHero !== false}
              onChange={(e) => handleToggleShowInHero(item, e.target.checked)}
            />
            <span className="w-10 h-6 bg-white/5 rounded-full peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-400 transition-colors"></span>
            <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transform peer-checked:translate-x-4 transition-transform shadow-sm" />
          </label>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
              <Tv size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black">Web Series</h1>
              <p className="text-slate-500">{series.length} series in library</p>
            </div>
          </div>
          <Link href="/admin/add">
            <Button>
              <Plus size={18} className="mr-2" />
              Add Series
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search series..."
            className="pl-11"
          />
        </div>

        {/* Table */}
        <AdminTable
          data={filteredSeries}
          columns={columns}
          loading={loading}
          onDelete={handleDelete}
          onEdit={(item) => {
            router.push(`/admin/edit/${item._id}?type=TV`);
          }}
          onView={(item) => setViewItem(item)}
          getItemId={(item) => item._id}
          getItemTitle={(item) => item.title}
          emptyMessage="No series found. Add your first series!"
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
                <div><strong>Seasons:</strong> {viewItem?.seasons?.length || 0}</div>
                <div><strong>Total Episodes:</strong> {viewItem ? viewItem.seasons?.reduce((acc, s) => acc + (s.episodes?.length || 0), 0) : 0}</div>
                <div><strong>Genres:</strong> {(viewItem?.genres || viewItem?.genre || []).join(", ") || "—"}</div>
              </div>

              {viewItem?.seasons && viewItem.seasons.length > 0 && (
                <div className="mt-4 space-y-2">
                  {viewItem.seasons.map((s) => (
                    <div key={s.seasonNumber} className="p-3 bg-white/5 rounded-md">
                      <div className="font-bold">Season {s.seasonNumber}</div>
                      <div className="text-sm text-slate-400">Episodes: {s.episodes?.length || 0}</div>
                    </div>
                  ))}
                </div>
              )}
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
