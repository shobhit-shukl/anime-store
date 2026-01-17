
import React from "react";
import { MessageCircle, Heart, Share2, Quote } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const voices = [
    {
        id: 1,
        user: "AnimeKing99",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AnimeKing99",
        content: "Slice Meow has completely changed how I track my seasonal anime. The UI is just chef's kiss! 🤌",
        likes: "2.4k",
        role: "Pro Member"
    },
    {
        id: 2,
        user: "MangaLover_X",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MangaLover_X",
        content: "Finally, a platform that respects the art style. The dark mode is perfect for late-night binge watching.",
        likes: "1.8k",
        role: "Contributor"
    },
    {
        id: 3,
        user: "OtakuSensei",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=OtakuSensei",
        content: "The community recommendations are spot on. I found so many hidden gems here.",
        likes: "3.2k",
        role: "Moderator"
    }
];

export function CommunityVoice() {
    return (
        <section className="py-20 px-6 bg-gradient-to-b from-transparent to-slate-900/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <div className="h-10 w-2 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">
                            Community Voice
                        </h2>
                        <p className="text-slate-400 mt-1 font-medium">What our nakama are saying</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {voices.map((voice) => (
                        <div key={voice.id} className="group relative bg-slate-900/80 backend-blur-md border border-white/5 p-8 rounded-[32px] hover:border-yellow-400/30 transition-all hover:-translate-y-2 duration-300 hover:shadow-2xl hover:shadow-yellow-400/5">
                            <Quote className="absolute top-6 right-6 text-white/5 w-12 h-12 rotate-180" />

                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <Avatar className="w-14 h-14 border-2 border-white/10 group-hover:border-yellow-400/50 transition-colors">
                                    <AvatarImage src={voice.avatar} alt={voice.user} />
                                    <AvatarFallback>{voice.user[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-bold text-lg text-white group-hover:text-yellow-400 transition-colors">{voice.user}</h4>
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{voice.role}</span>
                                </div>
                            </div>

                            <p className="text-slate-300 mb-8 leading-relaxed font-medium relative z-10 min-h-[80px]">"{voice.content}"</p>

                            <div className="flex items-center gap-6 text-slate-500 text-sm font-bold border-t border-white/5 pt-6 relative z-10">
                                <button className="flex items-center gap-2 hover:text-red-400 transition-colors group/btn">
                                    <Heart size={16} className="group-hover/btn:fill-current" /> {voice.likes}
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
