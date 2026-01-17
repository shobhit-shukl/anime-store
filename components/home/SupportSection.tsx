import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export function SupportSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-white/10 shadow-2xl group">

          {/* Dynamic Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-gradient-to-r from-blue-600/20 to-transparent skew-x-12 blur-3xl" />
            <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-gradient-to-l from-purple-600/20 to-transparent -skew-x-12 blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 p-8 md:p-16">

            {/* Logo / Visual */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-start">
              <div className="relative w-48 h-48 md:w-64 md:h-64 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-3">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
                <Image
                  src="/slice-meow-logo-white-color.png"
                  alt="SliceMeow Movement"
                  fill
                  className="object-contain drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]"
                />
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-2/3 space-y-8 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                <Sparkles size={12} />
                <span>The Revolution is Here</span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.9]">
                INDIAN ANIME <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">MOVEMENT</span>
              </h2>

              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
                We're not just building a platform; we're building a home. A place where Indian creators rise, where stories find their soul, and where the anime culture we love finally gets the stage it deserves.
              </p>

              <div className="pt-4">
                <Link href="/community">
                  <button className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-full font-black uppercase tracking-wider transition-all hover:bg-blue-50 hover:pr-10 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                    <span className="relative z-10">Join the Movement</span>
                    <ArrowRight size={20} className="relative z-10 transition-transform group-hover:translate-x-1" />
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
