"use client";

import React, { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Play } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

function WatchContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const episodeNumber = params.episode as string;
  const seasonNumber = searchParams.get("season") || "1";

  return (
    <div className="min-h-screen bg-[--background] text-[--foreground] pb-20 transition-colors">
      <Navbar />
      
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href={`/anime/${id}?season=${seasonNumber}`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Details
        </Link>

        <div className="aspect-video bg-black rounded-2xl overflow-hidden relative group border border-white/10">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Play size={32} className="ml-1 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Playing Season {seasonNumber} Episode {episodeNumber}</h1>
                    <p className="text-slate-400">Video player placeholder</p>
                </div>
            </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default function WatchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[--background] text-[--foreground] pb-20 transition-colors"><Navbar /><div className="pt-24 max-w-7xl mx-auto px-4"><p>Loading video...</p></div><Footer /></div>}>
      <WatchContent />
    </Suspense>
  );
}
