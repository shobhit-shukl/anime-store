import Link from "next/link";
import { AdminLayout, StatCard } from "@/components/admin";
import { Film, Tv, Plus, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminStats } from "@/app/actions/anime";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const { totalMovies, totalSeries, recentItems } = await getAdminStats();

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
            value={totalMovies}
            change="+3 this week"
            changeType="positive"
            icon={<Film size={24} />}
          />
          <StatCard
            title="Total Series"
            value={totalSeries}
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
                  <p className="text-xs text-slate-500">{totalMovies} movies</p>
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
                  <p className="text-xs text-slate-500">{totalSeries} series</p>
                </div>
              </Link>

              <Link
                href="/"
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

            {recentItems.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Clock size={48} className="mx-auto mb-4 opacity-50" />
                <p>No anime added yet</p>
                <Link href="/admin/add" className="text-blue-400 hover:underline text-sm">
                  Add your first anime →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentItems.map((item: any) => (
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
                      className={`px-3 py-1 rounded-full text-xs font-bold ${item.type === "movie"
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
