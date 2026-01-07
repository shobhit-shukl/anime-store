"use server";

import { connectDB } from "@/lib/mongodb";
import MovieSchema from "@/models/Movie";
import { type Movie, type Anime } from "@/types/anime";

// Helper to get models safely
async function getModels() {
    const movieConn = await connectDB("movies");
    const seriesConn = await connectDB("webseries");

    const MovieModel = movieConn!.model("Movie", MovieSchema, "movies");
    const SeriesModel = seriesConn!.model("WebSeries", MovieSchema, "webseries"); // Using MovieSchema for both as per current codebase

    return { MovieModel, SeriesModel };
}

export async function getHomeContent() {
    try {
        const { MovieModel, SeriesModel } = await getModels();

        const [moviesData, seriesData] = await Promise.all([
            MovieModel.find({}).sort({ createdAt: -1 }).limit(20).lean(),
            SeriesModel.find({}).sort({ createdAt: -1 }).limit(20).lean(),
        ]);

        // Transform and add types
        const movies = moviesData.map((m: any) => {
            const plain = JSON.parse(JSON.stringify(m));
            return {
                ...plain,
                type: m.type || "Movie",
                format: m.format || "Standalone",
            };
        });

        const webseries = seriesData.map((s: any) => {
            const plain = JSON.parse(JSON.stringify(s));
            return {
                ...plain,
                type: s.type || "TV",
                format: s.format || "Episodic",
            };
        });

        return { movies, webseries };
    } catch (error) {
        console.error("Failed to fetch home content:", error);
        return { movies: [], webseries: [] };
    }
}

export async function getAdminStats() {
    try {
        const { MovieModel, SeriesModel } = await getModels();

        // Fetch counts and recent items in parallel
        const [totalMovies, totalSeries, recentMovies, recentSeries] = await Promise.all([
            MovieModel.countDocuments(),
            SeriesModel.countDocuments(),
            MovieModel.find({}).sort({ createdAt: -1 }).limit(5).select("title image createdAt").lean(),
            SeriesModel.find({}).sort({ createdAt: -1 }).limit(5).select("title image createdAt").lean(),
        ]);

        // Combine and sort recent items
        const combinedRecent = [
            ...recentMovies.map((m: any) => ({ ...JSON.parse(JSON.stringify(m)), type: m.type || "Movie" })),
            ...recentSeries.map((s: any) => ({ ...JSON.parse(JSON.stringify(s)), type: s.type || "TV" }))
        ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

        return {
            totalMovies,
            totalSeries,
            recentItems: combinedRecent,
        };
    } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        return { totalMovies: 0, totalSeries: 0, recentItems: [] };
    }
}
