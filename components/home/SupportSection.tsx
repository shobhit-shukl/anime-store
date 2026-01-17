
import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SupportSection() {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[40px] overflow-hidden bg-gradient-to-r from-blue-900 to-indigo-900 border border-white/10 p-8 md:p-16 text-center shadow-2xl group">
           {/* Background effects */}
           <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
           <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl group-hover:bg-blue-500/40 transition-colors duration-500" />
           <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl group-hover:bg-purple-500/40 transition-colors duration-500" />
            
           <div className="relative z-10 max-w-2xl mx-auto space-y-8">
             <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-white drop-shadow-md">
                Why Slice Meow?
             </h2>
             <p className="text-lg md:text-xl text-blue-100 leading-relaxed font-medium">
               A community-driven sanctuary built for anime enthusiasts by anime enthusiasts. 
               We prioritize premium quality, respecting the art, and connecting fans worldwide.
             </p>
             <div className="flex justify-center">
                 <Link href="/support">
                    <button className="inline-flex items-center gap-3 bg-white text-blue-900 px-8 py-4 rounded-full font-black uppercase tracking-wider hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-900/20">
                    Join the Mission <ArrowRight size={20} className="animate-pulse" />
                    </button>
                 </Link>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
