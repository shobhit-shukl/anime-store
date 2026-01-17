
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Star, Shield, Zap, Coffee, Gift, MessageCircle } from "lucide-react";
import { Navbar, Footer } from "@/components/layout";
import { Button } from "@/components/ui/button";

export default function SupportPageClient() {
    return (
        <main className="min-h-screen bg-[--background] text-[--foreground]">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 text-blue-400 text-sm font-bold uppercase tracking-widest mb-6 border border-blue-500/20">
                            Community Driven
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-6">
                            Empowering the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                                Anime Culture
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10">
                            Slice Meow is a passion project built for fans, by fans. We rely on community support to keep servers running, ads away, and quality high.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        <FeatureCard
                            icon={Shield}
                            title="Ad-Free Experience"
                            desc="We believe in uninterrupted immersion. No pop-ups, no tracking."
                            color="blue"
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Blazing Fast"
                            desc="Optimized for speed and quality, delivering content instantly."
                            color="yellow"
                        />
                        <FeatureCard
                            icon={Heart}
                            title="Community First"
                            desc="Your feedback shapes the platform. We build what you want."
                            color="red"
                        />
                    </div>
                </div>
            </section>

            {/* Support Options */}
            <section className="py-20 px-6 bg-slate-900/30 border-y border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
                            Ways to Support Us
                        </h2>
                        <p className="text-slate-400">Choose how you want to contribute to the mission.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* One-time */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-3xl p-8 hover:border-blue-500/50 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Coffee size={120} />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-6">
                                    <Coffee size={28} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Buy us a Coffee</h3>
                                <p className="text-slate-400 mb-8">
                                    A small one-time donation helps cover server costs for a day. Every bit counts!
                                </p>
                                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white border-none" size="lg">
                                    Donate $5
                                </Button>
                            </div>
                        </div>

                        {/* Membership */}
                        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-3xl p-8 hover:border-blue-500 transition-all group relative overflow-hidden shadow-2xl shadow-blue-900/20">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Star size={120} />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                                    <Star size={28} className="text-white" fill="currentColor" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Become a Member</h3>
                                <p className="text-blue-200 mb-8">
                                    Join the inner circle. Get early access to features, a special badge, and voting rights.
                                </p>
                                <Button className="w-full bg-blue-500 hover:bg-blue-400 text-white border-none" size="lg">
                                    Join for $10/mo
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ / Community */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12">Frequently Asked Questions</h2>

                    <div className="space-y-4 text-left">
                        <FAQItem
                            question="Where do the donations go?"
                            answer="100% of donations go directly to server costs, CDN fees, and paying our developers/designers."
                        />
                        <FAQItem
                            question="Can I request a feature?"
                            answer="Absolutely! Supporters get priority in our feature request board on Discord."
                        />
                        <FAQItem
                            question="Is Slice Meow really free?"
                            answer="Yes, the core experience will always be free. We believe anime should be accessible to everyone."
                        />
                    </div>

                    <div className="mt-16 p-8 rounded-3xl bg-white/5 border border-white/5">
                        <MessageCircle size={40} className="mx-auto mb-4 text-blue-400" />
                        <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                        <p className="text-slate-400 mb-6">Join our community Discord server to chat with the team.</p>
                        <Button variant="outline">Join Discord</Button>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}

function FeatureCard({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
    const colorClasses: Record<string, string> = {
        blue: "text-blue-400 bg-blue-400/10",
        yellow: "text-yellow-400 bg-yellow-400/10",
        red: "text-red-400 bg-red-400/10",
    };

    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClasses[color]}`}>
                <Icon size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div
            onClick={() => setIsOpen(!isOpen)}
            className="border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:bg-white/5 transition-colors"
        >
            <div className="p-5 flex justify-between items-center bg-white/5">
                <h4 className="font-bold">{question}</h4>
                <div className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                    <PlusIcon />
                </div>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40" : "max-h-0"}`}>
                <p className="p-5 pt-0 text-slate-400 leading-relaxed text-sm">
                    {answer}
                </p>
            </div>
        </div>
    );
}

function PlusIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
