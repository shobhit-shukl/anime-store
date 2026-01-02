"use client";

import React, { useState } from 'react';
import { PlusCircle, Trash2, ListPlus, Clapperboard, Info, Upload } from 'lucide-react';

interface Episode { number: number; title: string; }
interface Season { seasonNumber: number; episodes: Episode[]; }

export default function AdminPage() {
  // 1. New state to track if we are adding a Movie or a Web Series
  const [contentType, setContentType] = useState<'movie' | 'series'>('series');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [rating, setRating] = useState('');
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const addSeason = () => {
    setSeasons([...seasons, { seasonNumber: seasons.length + 1, episodes: [] }]);
  };

  const addEpisode = (sIdx: number) => {
    const updatedSeasons = [...seasons];
    const nextEpNum = updatedSeasons[sIdx].episodes.length + 1;
    updatedSeasons[sIdx].episodes.push({ number: nextEpNum, title: '' });
    setSeasons(updatedSeasons);
  };

  const removeSeason = (sIdx: number) => {
    setSeasons(seasons.filter((_, index) => index !== sIdx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      let imageUrl = '';

      // Upload image if provided
      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      }

      // Prepare payload and URL based on selection
      const isMovie = contentType === 'movie';
      const url = isMovie ? '/api/movie' : '/api/webseries';
      const payload = isMovie
        ? { title, description, duration, releaseYear, rating: rating ? parseFloat(rating) : undefined, image: imageUrl }
        : { title, seasons, image: imageUrl };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save");

      setMessage(`${isMovie ? 'Movie' : 'Series'} saved successfully!`);
      setTitle('');
      setDescription('');
      setDuration('');
      setReleaseYear('');
      setRating('');
      setSeasons([]);
      setImage(null);
    } catch (err) {
      console.error("Error:", err);
      setMessage("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="relative z-10 max-w-4xl mx-auto p-6 md:p-12">
        
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black uppercase">Anime <span className="text-blue-500">Studio</span></h1>
        </header>

        {/* Message Display */}
        {message && (
          <div className="mb-8 p-4 bg-blue-600/20 border border-blue-500/50 rounded-xl text-center">
            <p className="text-blue-400 font-bold">{message}</p>
          </div>
        )}

        {/* TYPE SELECTOR - This controls what the user sees */}
        <div className="flex bg-slate-900 p-1 rounded-2xl mb-8 border border-white/5">
          <button
            type="button"
            onClick={() => setContentType('series')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${contentType === 'series' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <ListPlus size={18} /> Web Series
          </button>
          <button
            type="button"
            onClick={() => setContentType('movie')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${contentType === 'movie' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            <Clapperboard size={18} /> Movie
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Common Title Field */}
          <div className="bg-slate-900/90 p-8 rounded-3xl border border-white/10">
            <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">
              {contentType === 'series' ? 'Series Title' : 'Movie Title'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-2xl font-bold outline-none border-b border-slate-700 focus:border-blue-500 pb-2"
              placeholder="Enter name..."
            />
          </div>

          {/* Image Upload Field */}
          <div className="bg-slate-900/90 p-8 rounded-3xl border border-white/10">
            <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 block">
              Poster Image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-blue-500 transition-colors"
              >
                <div className="text-center">
                  <Upload size={24} className="mx-auto mb-2 text-slate-400" />
                  <p className="text-sm text-slate-400">
                    {image ? image.name : 'Click to upload poster image'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* CONDITIONAL SECTION */}
          {contentType === 'series' ? (
            /* --- WEB SERIES VIEW: Show Seasons --- */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Seasons & Episodes</h2>
                <button
                  type="button"
                  onClick={addSeason}
                  className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
                >
                  <PlusCircle size={18} /> Add Season
                </button>
              </div>

              {seasons.map((season, sIdx) => (
                <div key={sIdx} className="bg-slate-900 border border-white/10 rounded-3xl p-6">
                  <div className="flex justify-between mb-4">
                    <span className="text-blue-500 font-black">SEASON {season.seasonNumber}</span>
                    <button type="button" onClick={() => removeSeason(sIdx)}><Trash2 size={18} className="text-slate-500" /></button>
                  </div>
                  <div className="space-y-3 mb-4">
                    {season.episodes.map((ep, eIdx) => (
                      <div key={eIdx} className="flex gap-3 items-center bg-slate-800/50 p-3 rounded-xl">
                        <div className="w-10 h-8 flex items-center justify-center bg-slate-950 rounded-lg text-xs font-bold text-blue-400">
                          EP {ep.number}
                        </div>
                        <input
                          type="text"
                          placeholder="Episode title..."
                          value={ep.title}
                          onChange={(e) => {
                            const updated = [...seasons];
                            updated[sIdx].episodes[eIdx].title = e.target.value;
                            setSeasons(updated);
                          }}
                          className="flex-1 bg-transparent outline-none text-sm"
                        />
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={() => addEpisode(sIdx)} className="w-full py-3 border-2 border-dashed border-slate-800 rounded-xl text-slate-500 text-xs hover:border-blue-500/50 hover:text-blue-500 transition-all">+ ADD EPISODE</button>
                </div>
              ))}
            </div>
          ) : (
            /* --- MOVIE VIEW: Show Simple Form --- */
            <div className="bg-slate-900 p-8 rounded-3xl border border-white/10 space-y-6 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-2 text-blue-500 mb-2">
                <Info size={18} />
                <span className="text-sm font-bold uppercase tracking-tighter">Movie Details</span>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-2">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 rounded-xl p-4 border border-slate-800 focus:border-blue-500 outline-none"
                  placeholder="Enter movie synopsis..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <label className="text-[10px] text-slate-500 block uppercase">Duration</label>
                  <input 
                    type="text" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 120 mins" 
                    className="bg-transparent outline-none w-full font-bold" 
                  />
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <label className="text-[10px] text-slate-500 block uppercase">Release Year</label>
                  <input 
                    type="number" 
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(e.target.value)}
                    placeholder="e.g. 2024" 
                    className="bg-transparent outline-none w-full font-bold" 
                  />
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <label className="text-[10px] text-slate-500 block uppercase">Rating</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="10"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    placeholder="e.g. 8.5" 
                    className="bg-transparent outline-none w-full font-bold" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-black py-4 rounded-2xl text-lg hover:bg-blue-600 hover:text-white transition-all"
          >
            {isLoading ? "SAVING..." : "SAVE TO DATABASE"}
          </button>
        </form>
      </div>
    </div>
  );
}