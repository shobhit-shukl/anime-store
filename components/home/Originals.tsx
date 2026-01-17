
import React from "react";

export function Originals() {
    return (
        <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-10 w-2 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">
                            Slice Originals
                        </h2>
                        <p className="text-slate-400 mt-1 font-medium">Exclusive content from our creators</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Video 1 */}
                    <div className="group relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900 hover:border-red-600/50 transition-all duration-300 hover:shadow-red-600/10 hover:-translate-y-1">
                        <div className="aspect-video w-full">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/Mrym5O58cQ0?si=D8Gk-E5s_V0zS1Q" // Chainsaw Man trailer (Example)
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-red-600 text-white px-2 py-0.5 rounded-md">Trailer</span>
                                <span className="text-xs text-slate-400 font-medium">2 mins ago</span>
                            </div>
                            <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">Official Anime Season Preview 2024</h3>
                        </div>
                    </div>

                    {/* Video 2 */}
                    <div className="group relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-900 hover:border-red-600/50 transition-all duration-300 hover:shadow-red-600/10 hover:-translate-y-1">
                        <div className="aspect-video w-full">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/jNQXAC9IVRw?si=0F-E5g-V0zS1Q" // Me at the zoo (Example) - swapped for fun or keeping general
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-2 py-0.5 rounded-md">Review</span>
                                <span className="text-xs text-slate-400 font-medium">1 day ago</span>
                            </div>
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-500 transition-colors">Top 10 Hidden Gems of the Season</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
