"use client";

import { Movie } from "@/types/anime";
import { useState, useEffect } from "react";
import { X, Play, Star, Info } from "lucide-react";

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [webseries, setWebseries] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBg, setCurrentBg] = useState(0);
  const [selectedAnime, setSelectedAnime] = useState<Movie | null>(null);

  // Fetch movies and webseries data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieResponse, webseriesResponse] = await Promise.all([
          fetch('/api/movie'),
          fetch('/api/webseries')
        ]);
        const movieData = await movieResponse.json();
        const webseriesData = await webseriesResponse.json();
        setMovies((movieData.movies || []).map((item: any) => ({ ...item, type: 'movie' })));
        setWebseries((webseriesData.webseries || []).map((item: any) => ({ ...item, type: 'webseries' })));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cycle background image every 5 seconds
  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        setCurrentBg((prev) => (prev + 1) % movies.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [movies]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedAnime) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [selectedAnime]);

  return (
    <main className="min-h-screen bg-slate-950 text-white relative font-sans">
      
      {/* --- DYNAMIC HERO BACKGROUND --- */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {movies.map((movie, index) => (
          <div
            key={movie.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentBg ? "opacity-50" : "opacity-0"
            }`}
          >
            <img
              src={movie.image || 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1200'}
              alt="background"
              className="w-full h-full object-cover scale-105 blur-[2px]"
            />
          </div>
        ))}
        
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020617_90%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950"></div>

        <div className="text-center z-10 px-4 max-w-3xl">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter drop-shadow-2xl italic">
            OTAKU<span className="text-blue-500">VAULT</span>
          </h1>
          <p className="text-slate-200 text-lg md:text-xl mb-10 font-medium max-w-xl mx-auto leading-relaxed">
            Your personal sanctuary for tracking seasons, episodes, and the finest animation.
          </p>
          <div className="max-w-md mx-auto relative group">
            <input 
              type="text" 
              placeholder="Search your collection..." 
              className="w-full px-8 py-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 focus:outline-none focus:border-blue-500 focus:bg-white/20 transition-all text-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* --- MOVIES SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-10 w-2 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Movies</h2>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-slate-400 text-lg">Loading your movie collection...</div>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-slate-400 text-lg">No movies in your collection yet.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {movies.map((movie) => (
              <div key={movie.id || movie.title} onClick={() => setSelectedAnime(movie)}>
                <AnimeCard anime={movie} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- WEBSERIES SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-10 w-2 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
          <h2 className="text-4xl font-black tracking-tighter uppercase">Web Series</h2>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-slate-400 text-lg">Loading your web series collection...</div>
          </div>
        ) : webseries.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-slate-400 text-lg">No web series in your collection yet.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {webseries.map((series) => (
              <div key={series.id || series.title} onClick={() => setSelectedAnime(series)}>
                <AnimeCard anime={series} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- ANIME DETAIL DIALOG (MODAL) --- */}
      {selectedAnime && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            onClick={() => setSelectedAnime(null)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-slate-900 border border-white/10 w-full max-w-6xl h-full max-h-[85vh] rounded-[40px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedAnime(null)}
              className="absolute top-6 right-6 z-[110] p-3 bg-black/40 backdrop-blur-md rounded-full hover:bg-red-500 transition-all active:scale-90"
            >
              <X size={24} />
            </button>

            {/* Left: Big Movie Poster */}
            <div className="w-full md:w-[40%] relative">
              <img 
                src={selectedAnime.image || 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1200'} 
                alt={selectedAnime.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r"></div>
            </div>

            {/* Right: Info and Episodes */}
            <div className="w-full md:w-[60%] p-8 md:p-14 overflow-y-auto custom-scrollbar">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-sm font-black">
                  <Star size={16} fill="currentColor" />
                  {selectedAnime.rating || 'N/A'}
                </div>
                <span className="text-slate-500 font-bold text-sm uppercase tracking-widest">{selectedAnime.status || 'Ongoing'}</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter leading-none">{selectedAnime.title}</h2>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {(selectedAnime.genre || []).map(g => (
                  <span key={g} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-300">
                    {g}
                  </span>
                ))}
              </div>

              <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-xl">
                {selectedAnime.type === 'movie' 
                  ? (selectedAnime.description || 'No description available.')
                  : `Experience the world of ${selectedAnime.title}. Dive into a breathtaking story with ${selectedAnime.seasons?.reduce((total, season) => total + season.episodes.length, 0) || 0} episodes across ${selectedAnime.seasons?.length || 0} seasons of pure adrenaline and emotion.`
                }
              </p>

              {/* Movie Info or Seasons and Episodes */}
              {selectedAnime.type === 'movie' ? (
                <div className="mb-10">
                  <div className="space-y-4">
                    {selectedAnime.duration && (
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500 font-bold uppercase text-sm">Duration:</span>
                        <span className="text-white">{selectedAnime.duration}</span>
                      </div>
                    )}
                    {selectedAnime.releaseYear && (
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500 font-bold uppercase text-sm">Release Year:</span>
                        <span className="text-white">{selectedAnime.releaseYear}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mb-10">
                  {selectedAnime.seasons?.map((season) => (
                    <div key={season.seasonNumber} className="mb-8">
                      <h4 className="text-sm font-black uppercase text-blue-500 tracking-widest mb-4">
                        Season {season.seasonNumber} ({season.episodes.length} episodes)
                      </h4>
                      <div className="space-y-3">
                        {season.episodes.map((episode) => (
                          <div key={episode.number} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                              <span className="text-slate-500 font-bold">
                                {episode.number.toString().padStart(2, '0')}
                              </span>
                              <span className="font-bold group-hover:text-blue-400">{episode.title || `Episode ${episode.number}`}</span>
                            </div>
                            <Play size={16} className="text-slate-600 group-hover:text-blue-500" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 sticky bottom-0 bg-slate-900 pt-4 pb-2">
                <button className="flex-[2] bg-blue-600 hover:bg-blue-500 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-blue-600/20">
                  <Play size={24} fill="currentColor" /> START WATCHING
                </button>
                <button className="flex-1 bg-white/10 hover:bg-white/20 py-5 rounded-2xl font-black flex items-center justify-center gap-2 transition-all">
                  <Info size={20} /> DETAILS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function AnimeCard({ anime }: { anime: Movie }) {
  const totalEpisodes = anime.seasons?.reduce((total, season) => total + season.episodes.length, 0) || 0;

  return (
    <div className="group bg-slate-900/40 backdrop-blur-sm rounded-[32px] overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-500 cursor-pointer hover:shadow-[0_20px_50px_rgba(37,99,235,0.2)] hover:-translate-y-2">
      <div className="relative h-80 w-full overflow-hidden">
        <img
          src={anime.image || 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=400'}
          alt={anime.title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
        
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="bg-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
               {anime.type === 'movie' ? 'Movie' : (anime.status || 'Ongoing')}
            </div>
            <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-yellow-400 border border-white/10">
                ★ {anime.rating || 'N/A'}
            </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-black text-2xl truncate mb-3 tracking-tighter group-hover:text-blue-400 transition-colors uppercase italic">
            {anime.title}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 text-xs font-bold tracking-widest uppercase">
            {anime.type === 'movie' 
              ? `${anime.duration || 'N/A'} • ${anime.releaseYear || 'N/A'}`
              : `${totalEpisodes} EPISODES • ${anime.seasons?.length || 0} SEASONS`
            }
          </span>
          <div className="flex -space-x-2">
            {(anime.genre || []).slice(0, 2).map(g => (
                <div key={g} className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}