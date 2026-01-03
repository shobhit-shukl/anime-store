import { cn } from "@/lib/utils";

interface GenrePillProps {
  genre: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "neon";
  onClick?: () => void;
  isSelected?: boolean;
}

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
  lg: "px-4 py-1.5 text-sm",
};

const variantClasses = {
  default: "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10",
  outline: "bg-transparent border-white/20 text-slate-300 hover:border-blue-500/50 hover:text-blue-400",
  neon: "bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
};

export function GenrePill({
  genre,
  size = "md",
  variant = "default",
  onClick,
  isSelected = false,
}: GenrePillProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center font-bold uppercase tracking-widest border rounded-full transition-all duration-200",
        sizeClasses[size],
        isSelected ? variantClasses.neon : variantClasses[variant],
        onClick && "cursor-pointer"
      )}
    >
      {genre}
    </span>
  );
}

// Preset genre colors for visual variety
const genreColors: Record<string, string> = {
  Action: "text-red-400 bg-red-500/10 border-red-500/20",
  Romance: "text-pink-400 bg-pink-500/10 border-pink-500/20",
  Comedy: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Drama: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Fantasy: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  Horror: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Isekai: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Mecha: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  "Sci-Fi": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "Slice of Life": "text-green-400 bg-green-500/10 border-green-500/20",
  Sports: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Supernatural: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  Thriller: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  Mystery: "text-slate-400 bg-slate-500/10 border-slate-500/20",
  Psychological: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
  Adventure: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  Music: "text-sky-400 bg-sky-500/10 border-sky-500/20",
};

interface ColoredGenrePillProps {
  genre: string;
  size?: "sm" | "md" | "lg";
}

export function ColoredGenrePill({ genre, size = "md" }: ColoredGenrePillProps) {
  const colorClass = genreColors[genre] || "text-slate-400 bg-white/5 border-white/10";
  
  return (
    <span
      className={cn(
        "inline-flex items-center font-bold uppercase tracking-widest border rounded-full transition-all duration-200",
        sizeClasses[size],
        colorClass
      )}
    >
      {genre}
    </span>
  );
}
