"use client";

import React, { useState } from "react";
import { Upload, X, Plus, Trash2, GripVertical } from "lucide-react";
import { useEdgeStore } from "@/lib/edgestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ANIME_GENRES, ANIME_TYPES, ANIME_STATUSES, type Season, type Episode } from "@/types/anime";

interface AnimeFormData {
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
  seasons?: Season[];
  externalLinks?: { platform: string; url: string }[];
}

interface AnimeFormProps {
  initialData?: Partial<AnimeFormData>;
  onSubmit: (data: AnimeFormData) => Promise<void>;
  isLoading?: boolean;
}

export function AnimeForm({ initialData, onSubmit, isLoading = false }: AnimeFormProps) {
  const { edgestore } = useEdgeStore();

  const [formData, setFormData] = useState<AnimeFormData>({
    title: initialData?.title || "",
    titleJapanese: initialData?.titleJapanese || "",
    type: initialData?.type || "TV",
    status: initialData?.status || "Ongoing",
    genres: initialData?.genres || [],
    synopsis: initialData?.synopsis || "",
    releaseYear: initialData?.releaseYear || new Date().getFullYear(),
    rating: initialData?.rating,
    duration: initialData?.duration || "",
    posterImage: initialData?.posterImage || "",
    bannerImage: initialData?.bannerImage || "",
    videoUrl: initialData?.videoUrl || "",
    seasons: initialData?.seasons || [],
    externalLinks: initialData?.externalLinks || [],
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (field: keyof AnimeFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleGenre = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  // Season management
  const addSeason = () => {
    setFormData((prev) => ({
      ...prev,
      seasons: [
        ...(prev.seasons || []),
        { seasonNumber: (prev.seasons?.length || 0) + 1, episodes: [] },
      ],
    }));
  };

  const removeSeason = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      seasons: prev.seasons?.filter((_, i) => i !== index) || [],
    }));
  };

  const addEpisode = (seasonIndex: number) => {
    setFormData((prev) => {
      const newSeasons = [...(prev.seasons || [])];
      const nextEpNum = newSeasons[seasonIndex].episodes.length + 1;
      newSeasons[seasonIndex].episodes.push({
        number: nextEpNum,
        title: "",
      });
      return { ...prev, seasons: newSeasons };
    });
  };

  const updateEpisode = (seasonIndex: number, episodeIndex: number, field: string, value: any) => {
    setFormData((prev) => {
      const newSeasons = [...(prev.seasons || [])];
      // @ts-ignore
      newSeasons[seasonIndex].episodes[episodeIndex][field] = value;
      return { ...prev, seasons: newSeasons };
    });
  };

  const removeEpisode = (seasonIndex: number, episodeIndex: number) => {
    setFormData((prev) => {
      const newSeasons = [...(prev.seasons || [])];
      newSeasons[seasonIndex].episodes = newSeasons[seasonIndex].episodes.filter(
        (_, i) => i !== episodeIndex
      );
      return { ...prev, seasons: newSeasons };
    });
  };

  // External links management
  const addExternalLink = () => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: [...(prev.externalLinks || []), { platform: "", url: "" }],
    }));
  };

  const updateExternalLink = (index: number, field: "platform" | "url", value: string) => {
    setFormData((prev) => {
      const newLinks = [...(prev.externalLinks || [])];
      newLinks[index][field] = value;
      return { ...prev, externalLinks: newLinks };
    });
  };

  const removeExternalLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: prev.externalLinks?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let posterUrl = formData.posterImage;
      let bannerUrl = formData.bannerImage;

      // Upload poster if new file
      if (posterFile) {
        const res = await edgestore.anime.upload({ file: posterFile });
        posterUrl = res.url;
      }

      // Upload banner if new file
      if (bannerFile) {
        const res = await edgestore.anime.upload({ file: bannerFile });
        bannerUrl = res.url;
      }

      await onSubmit({
        ...formData,
        posterImage: posterUrl,
        bannerImage: bannerUrl,
        seasons: formData.type === "Movie" ? [] : formData.seasons,
      });
    } finally {
      setUploading(false);
    }
  };

  const isMovie = formData.type === "Movie";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6 space-y-6 transition-colors">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-500 rounded-full" />
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">English Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter anime title..."
              required
            />
          </div>

          {/* Japanese Title */}
          <div className="space-y-2">
            <Label htmlFor="titleJapanese">Japanese Title</Label>
            <Input
              id="titleJapanese"
              value={formData.titleJapanese}
              onChange={(e) => handleInputChange("titleJapanese", e.target.value)}
              placeholder="日本語タイトル"
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {ANIME_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {ANIME_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Release Year */}
          <div className="space-y-2">
            <Label htmlFor="releaseYear">Release Year</Label>
            <Input
              id="releaseYear"
              type="number"
              value={formData.releaseYear || ""}
              onChange={(e) => handleInputChange("releaseYear", parseInt(e.target.value) || undefined)}
              placeholder="2024"
              min={1900}
              max={2100}
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Rating (0-10)</Label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              value={formData.rating || ""}
              onChange={(e) => handleInputChange("rating", parseFloat(e.target.value) || undefined)}
              placeholder="8.5"
              min={0}
              max={10}
            />
          </div>

          {/* Duration */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={formData.duration}
              onChange={(e) => handleInputChange("duration", e.target.value)}
              placeholder={isMovie ? "2h 15m" : "24 min/ep"}
            />
          </div>
        </div>

        {/* Synopsis */}
        <div className="space-y-2">
          <Label htmlFor="synopsis">Synopsis</Label>
          <Textarea
            id="synopsis"
            value={formData.synopsis}
            onChange={(e) => handleInputChange("synopsis", e.target.value)}
            placeholder="Enter anime synopsis..."
            rows={4}
          />
        </div>
      </section>

      {/* Genres */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6 space-y-4 transition-colors">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="w-2 h-6 bg-purple-500 rounded-full" />
          Genres
        </h2>
        <div className="flex flex-wrap gap-2">
          {ANIME_GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => toggleGenre(genre)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                formData.genres.includes(genre)
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              )}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* Images */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6 space-y-6 transition-colors">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="w-2 h-6 bg-green-500 rounded-full" />
          Media
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Poster */}
          <div className="space-y-2">
            <Label>Poster Image</Label>
            <div
              className={cn(
                "relative border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer",
                posterFile || formData.posterImage
                  ? "border-blue-500/50 bg-blue-500/5"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {posterFile ? (
                <p className="text-sm text-blue-400">{posterFile.name}</p>
              ) : formData.posterImage ? (
                <p className="text-sm text-green-400">Image uploaded ✓</p>
              ) : (
                <div className="space-y-2">
                  <Upload size={32} className="mx-auto text-slate-500" />
                  <p className="text-sm text-slate-500">Click to upload poster (2:3 ratio)</p>
                </div>
              )}
            </div>
          </div>

          {/* Banner */}
          <div className="space-y-2">
            <Label>Banner Image</Label>
            <div
              className={cn(
                "relative border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer",
                bannerFile || formData.bannerImage
                  ? "border-blue-500/50 bg-blue-500/5"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {bannerFile ? (
                <p className="text-sm text-blue-400">{bannerFile.name}</p>
              ) : formData.bannerImage ? (
                <p className="text-sm text-green-400">Image uploaded ✓</p>
              ) : (
                <div className="space-y-2">
                  <Upload size={32} className="mx-auto text-slate-500" />
                  <p className="text-sm text-slate-500">Click to upload banner (16:9 ratio)</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Video Link (for movies) OR Seasons & Episodes (for series) */}
      {isMovie ? (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6 space-y-4 transition-colors">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="w-2 h-6 bg-orange-500 rounded-full" />
            Movie Source
          </h2>
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video Link (m3u8 / mp4 / embed URL)</Label>
            <Input
              id="videoUrl"
              value={formData.videoUrl}
              onChange={(e) => handleInputChange("videoUrl", e.target.value)}
              placeholder="https://example.com/video.m3u8"
            />
            <p className="text-xs text-slate-500">Enter the direct streaming link for this movie</p>
          </div>
        </section>
      ) : (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6 space-y-6 transition-colors">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="w-2 h-6 bg-orange-500 rounded-full" />
              Seasons & Episodes
            </h2>
            <Button type="button" variant="secondary" size="sm" onClick={addSeason}>
              <Plus size={16} className="mr-2" />
              Add Season
            </Button>
          </div>

          <div className="space-y-6">
            {formData.seasons?.map((season, sIdx) => (
              <div key={sIdx} className="bg-white/5 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-blue-400">Season {season.seasonNumber}</h3>
                  <button
                    type="button"
                    onClick={() => removeSeason(sIdx)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-2">
                  {season.episodes.map((ep, eIdx) => (
                    <div key={eIdx} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl">
                      <GripVertical size={16} className="text-slate-600" />
                      <span className="w-12 text-xs font-bold text-blue-400">
                        EP {ep.number.toString().padStart(2, "0")}
                      </span>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <Input
                          value={ep.title}
                          onChange={(e) => updateEpisode(sIdx, eIdx, "title", e.target.value)}
                          placeholder="Episode title..."
                          className="h-9 bg-transparent border-white/10"
                        />
                        <Input
                          value={ep.streamingUrl || ""}
                          onChange={(e) => updateEpisode(sIdx, eIdx, "streamingUrl", e.target.value)}
                          placeholder="Video Link (Optional)"
                          className="h-9 bg-transparent border-white/10"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEpisode(sIdx, eIdx)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addEpisode(sIdx)}
                  className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl text-slate-500 text-sm font-medium hover:border-blue-500/50 hover:text-blue-400 transition-all"
                >
                  + Add Episode
                </button>
              </div>
            ))}

            {(!formData.seasons || formData.seasons.length === 0) && (
              <p className="text-center text-slate-500 py-8">
                No seasons added yet. Click &quot;Add Season&quot; to get started.
              </p>
            )}
          </div>
        </section>
      )}

      {/* External Links */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/5 p-6 space-y-6 transition-colors">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="w-2 h-6 bg-pink-500 rounded-full" />
            Streaming Links
          </h2>
          <Button type="button" variant="secondary" size="sm" onClick={addExternalLink}>
            <Plus size={16} className="mr-2" />
            Add Link
          </Button>
        </div>

        <div className="space-y-3">
          {formData.externalLinks?.map((link, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Input
                value={link.platform}
                onChange={(e) => updateExternalLink(idx, "platform", e.target.value)}
                placeholder="Platform (e.g., Crunchyroll)"
                className="w-48"
              />
              <Input
                value={link.url}
                onChange={(e) => updateExternalLink(idx, "url", e.target.value)}
                placeholder="https://..."
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeExternalLink(idx)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {(!formData.externalLinks || formData.externalLinks.length === 0) && (
            <p className="text-center text-slate-500 py-4">
              No streaming links added yet.
            </p>
          )}
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-end gap-4">
        <Button type="button" variant="ghost">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || uploading} size="lg">
          {isLoading || uploading ? "Saving..." : "Save Anime"}
        </Button>
      </div>
    </form>
  );
}

export default AnimeForm;
