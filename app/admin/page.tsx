"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout, StatCard } from "@/components/admin";
import { Film, Tv, Plus, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  totalMovies: number;
  totalSeries: number;
}

interface RecentItem {
  _id: string;
  title: string;
  type: "movie" | "series";
  image?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMovies: 0,
    totalSeries: 0,
  });
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch movies
        const moviesRes = await fetch("/api/movie");
        const moviesData = moviesRes.ok ? await moviesRes.json() : { movies: [] };
        
        // Fetch series
        const seriesRes = await fetch("/api/webseries");
        const seriesData = seriesRes.ok ? await seriesRes.json() : { series: [] };

        // Set stats
        setStats({
          totalMovies: moviesData.movies?.length || 0,
          totalSeries: seriesData.series?.length || 0,
        });

        // Combine and sort recent items
        const movies = (moviesData.movies || []).map((m: { _id: string; title: string; image?: string; createdAt?: string }) => ({
          ...m,
          type: "movie" as const,
        }));
        const series = (seriesData.series || []).map((s: { _id: string; title: string; image?: string; createdAt?: string }) => ({
          ...s,
          type: "series" as const,
        }));
        
        const combined = [...movies, ...series]
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 5);
        
        setRecentItems(combined);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black">Welcome back, Admin! 👋</h1>
            <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening with your anime library.</p>
          </div>
          <Link href="/admin/add">
            <Button>
              <Plus size={18} className="mr-2" />
              Add Anime
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          <StatCard
            title="Total Movies"
            value={loading ? "—" : stats.totalMovies}
            change="+3 this week"
            changeType="positive"
            icon={<Film size={24} />}
          />
          <StatCard
            title="Total Series"
            value={loading ? "—" : stats.totalSeries}
            change="+5 this week"
            changeType="positive"
            icon={<Tv size={24} />}
          />
        </div>

        {/* Quick Actions + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6 transition-colors text-[--foreground]">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-5 bg-blue-500 rounded-full" />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/admin/add"
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-blue-600/10 hover:border-blue-500/30 border border-slate-200 dark:border-transparent transition-all group"
              >
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Plus size={20} />
                </div>
                <div>
                  <p className="font-bold">Add New Anime</p>
                  <p className="text-xs text-slate-500">Movie or Series</p>
                </div>
              </Link>
              
              <Link
                href="/admin/movies"
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-purple-600/10 hover:border-purple-500/30 border border-slate-200 dark:border-transparent transition-all group"
              >
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <Film size={20} />
                </div>
                <div>
                  <p className="font-bold">Manage Movies</p>
                  <p className="text-xs text-slate-500">{stats.totalMovies} movies</p>
                </div>
              </Link>
              
              <Link
                href="/admin/series"
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-green-600/10 hover:border-green-500/30 border border-slate-200 dark:border-transparent transition-all group"
              >
                <div className="p-2 rounded-lg bg-green-500/10 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <Tv size={20} />
                </div>
                <div>
                  <p className="font-bold">Manage Series</p>
                  <p className="text-xs text-slate-500">{stats.totalSeries} series</p>
                </div>
              </Link>
              
              <Link
                href="/UserPage"
                className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-orange-600/10 hover:border-orange-500/30 border border-slate-200 dark:border-transparent transition-all group"
              >
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Eye size={20} />
                </div>
                <div>
                  <p className="font-bold">View Site</p>
                  <p className="text-xs text-slate-500">Open user view</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6 transition-colors text-[--foreground]">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-5 bg-purple-500 rounded-full" />
              Recently Added
            </h2>
            
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse">
                    <div className="w-12 h-16 rounded-lg bg-slate-200 dark:bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-white/10 rounded" />
                      <div className="h-3 w-20 bg-slate-200 dark:bg-white/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentItems.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Clock size={48} className="mx-auto mb-4 opacity-50" />
                <p>No anime added yet</p>
                <Link href="/admin/add" className="text-blue-400 hover:underline text-sm">
                  Add your first anime →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">🎬</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{item.title}</p>
                      <p className="text-xs text-slate-500 capitalize">{item.type}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.type === "movie"
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-blue-500/10 text-blue-400"
                      }`}
                    >
                      {item.type === "movie" ? "Movie" : "Series"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Popular Genres Chart Placeholder */}
        <div className="bg-slate-900 rounded-2xl border border-white/5 p-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-5 bg-green-500 rounded-full" />
            Content by Genre
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { name: "Action", count: 45, color: "bg-red-500" },
              { name: "Romance", count: 38, color: "bg-pink-500" },
              { name: "Comedy", count: 32, color: "bg-yellow-500" },
              { name: "Fantasy", count: 28, color: "bg-purple-500" },
              { name: "Sci-Fi", count: 22, color: "bg-cyan-500" },
              { name: "Drama", count: 19, color: "bg-blue-500" },
              { name: "Horror", count: 15, color: "bg-emerald-500" },
              { name: "Slice of Life", count: 12, color: "bg-orange-500" },
            ].map((genre) => (
              <div
                key={genre.name}
                className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-colors"
              >
                <div
                  className={`w-3 h-3 rounded-full ${genre.color} mx-auto mb-2`}
                />
                <p className="text-sm font-bold">{genre.count}</p>
                <p className="text-xs text-slate-500 truncate">{genre.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
