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

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 p-8 md:p-16">

            {/* Logo / Visual */}
            <div className="w-full md:w-2/5 flex justify-center md:justify-start">
              <div className="relative group/logo w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 to-blue-600/30 blur-3xl rounded-full transition-all duration-700 group-hover/logo:opacity-100 opacity-70 scale-110" />
                <Image
                  src="/Slice Meow Final-log.png"
                  alt="SliceMeow Movement"
                  width={500}
                  height={300}
                  className="relative z-10 w-full h-auto md:h-auto max-h-[300px] object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            </div>

            {/* Content */}
            <div className="w-full md:w-3/5 space-y-8 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg shadow-orange-900/10">
                <Sparkles size={12} className="text-orange-400" />
                <span>The Revolution is Here</span>
              </div>

              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9]">
                INDIAN ANIME <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600">MOVEMENT</span>
              </h2>

              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl font-medium">
                We're not just building a platform; we're building a home. A place where Indian creators rise, where stories find their soul, and where the anime culture we love finally gets the stage it deserves.
              </p>

              <div className="pt-6">
                <Link href="/community">
                  <button className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-950 rounded-full font-black uppercase tracking-wider transition-all hover:bg-orange-50 hover:pr-12 hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:-translate-y-1">
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
