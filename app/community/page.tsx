import React from "react";
import Image from "next/image";
import { Navbar, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Instagram, MessageCircle, Mail, Sparkles, User } from "lucide-react";

export default function CommunityPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-200">
            <Navbar isLoggedIn={false} />

            {/* Hero Section: Why SliceMeow Exists */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950/50 to-slate-950 -z-10" />

                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                        <Sparkles size={16} />
                        <span>The Revolution Begins</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6">
                        WHY <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">SLICEMEOW</span> EXISTS
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
                        We are building the definitive home for Indian anime culture.
                        SliceMeow isn't just a platform; it's a sanctuary for fans,
                        a canvas for creators, and a bridge connecting the vibrant world of anime
                        to the heart of India.
                    </p>
                </div>
            </section>

            {/* Indian Anime Creators Vision */}
            <section className="py-20 px-6 bg-slate-900/50">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative h-[400px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl skew-y-1">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-900 to-black p-8 flex items-center justify-center">
                            {/* <h3 className="text-4xl font-black text-white/10 uppercase rotate-12">Indian Anime</h3> */}
                        </div>
                        <Image
                            src="/indian-anime-vision.png"
                            alt="Creators Vision"
                            fill
                            className="object-cover opacity-80 mix-blend-overlay hover:opacity-100 transition-opacity duration-700"
                        />
                    </div>

                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                            THE VISION OF <br />
                            <span className="text-purple-400">INDIAN CREATORS</span>
                        </h2>

                        <div className="space-y-6 text-lg text-slate-300">
                            <p>
                                India is brimming with untold stories and artistic talent waiting to be unleashed.
                                Our vision is to empower Indian creators to tell their own stories through the
                                medium of anime.
                            </p>
                            <p>
                                We believe that the next global anime phenomenon won't just come from Tokyo—it
                                could come from Mumbai, Delhi, or anywhere in our diverse nation. SliceMeow
                                is the launchpad for this new wave of storytelling.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Socials & Community */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto text-center space-y-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Join the Community</h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Instagram - Active */}
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative p-8 rounded-2xl bg-gradient-to-b from-pink-500/10 to-transparent border border-pink-500/20 hover:border-pink-500/50 transition-all hover:transform hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-pink-500/5 blur-xl group-hover:bg-pink-500/10 transition-colors" />
                            <Instagram className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Instagram</h3>
                            <p className="text-slate-400 text-sm">Follow for daily updates and art</p>
                            <Button variant="ghost" className="mt-6 text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 w-full">
                                Follow Now
                            </Button>
                        </a>

                        {/* Discord - Future */}
                        <div className="relative p-8 rounded-2xl bg-slate-900/50 border border-white/5 opacity-75">
                            <MessageCircle className="w-12 h-12 text-indigo-400/50 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-300 mb-2">Discord</h3>
                            <p className="text-slate-500 text-sm">Community server for discussions</p>
                            <div className="mt-6 inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full uppercase tracking-wider">
                                Coming Soon
                            </div>
                        </div>

                        {/* Newsletter - Future */}
                        <div className="relative p-8 rounded-2xl bg-slate-900/50 border border-white/5 opacity-75">
                            <Mail className="w-12 h-12 text-emerald-400/50 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-slate-300 mb-2">Newsletter</h3>
                            <p className="text-slate-500 text-sm">Weekly digests and exclusives</p>
                            <div className="mt-6 inline-block px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider">
                                Coming Later
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Creator Spotlight */}
            <section className="py-20 px-6 bg-slate-900/30">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                                Creator Spotlight
                            </h2>
                            <p className="text-slate-400 mt-2">Celebrating the artists shaping our world</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Static Creator Cards */}
                        <CreatorCard
                            name="Arjun V."
                            role="Concept Artist"
                            detail="Known for cyber-mythology fusion art styles."
                            color="blue"
                        />
                        <CreatorCard
                            name="Mira K."
                            role="Manga Author"
                            detail="Creator of 'Neon Mumbai', a hit web-manga series."
                            color="purple"
                        />
                        <CreatorCard
                            name="Team Yodha"
                            role="Animation Studio"
                            detail="Indie studio focusing on high-octane action sequences."
                            color="orange"
                        />
                        <CreatorCard
                            name="Rohan S."
                            role="Character Designer"
                            detail="Specializes in bringing mythological characters to modern life."
                            color="green"
                        />
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

// Helper Component for Creator Cards
function CreatorCard({ name, role, detail, color }: { name: string, role: string, detail: string, color: string }) {
    const colorClasses: Record<string, string> = {
        blue: "border-blue-500/20 bg-blue-500/5 hover:border-blue-500/50",
        purple: "border-purple-500/20 bg-purple-500/5 hover:border-purple-500/50",
        orange: "border-orange-500/20 bg-orange-500/5 hover:border-orange-500/50",
        green: "border-green-500/20 bg-green-500/5 hover:border-green-500/50",
    };

    const textColors: Record<string, string> = {
        blue: "text-blue-400",
        purple: "text-purple-400",
        orange: "text-orange-400",
        green: "text-green-400",
    };

    return (
        <div className={`p-6 rounded-xl border transition-all hover:bg-slate-800/50 ${colorClasses[color] || colorClasses.blue}`}>
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-slate-800 ${textColors[color]}`}>
                    <User size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">{name}</h3>
                    <span className={`text-xs font-bold uppercase tracking-wider ${textColors[color]}`}>{role}</span>
                    <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                        {detail}
                    </p>
                </div>
            </div>
        </div>
    );
}
