import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingBadgeProps {
  rating?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "minimal" | "detailed";
  showIcon?: boolean;
}

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

const iconSizes = {
  sm: 10,
  md: 14,
  lg: 16,
};

function getRatingColor(rating: number) {
  if (rating >= 8.5) return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
  if (rating >= 7) return "text-green-400 bg-green-500/10 border-green-500/20";
  if (rating >= 5) return "text-blue-400 bg-blue-500/10 border-blue-500/20";
  return "text-slate-400 bg-slate-500/10 border-slate-500/20";
}

export function RatingBadge({
  rating,
  size = "md",
  variant = "default",
  showIcon = true,
}: RatingBadgeProps) {
  if (rating === undefined || rating === null) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 font-bold rounded-lg border",
          sizeClasses[size],
          "text-slate-500 bg-white/5 border-white/10"
        )}
      >
        {showIcon && <Star size={iconSizes[size]} />}
        N/A
      </span>
    );
  }

  const displayRating = rating.toFixed(1);
  const colorClass = getRatingColor(rating);

  if (variant === "minimal") {
    return (
      <span className={cn("inline-flex items-center gap-1 font-bold", colorClass.split(" ")[0])}>
        <Star size={iconSizes[size]} fill="currentColor" />
        {displayRating}
      </span>
    );
  }

  if (variant === "detailed") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 font-bold rounded-lg border",
          sizeClasses[size],
          colorClass
        )}
      >
        <Star size={iconSizes[size]} fill="currentColor" />
        <span>{displayRating}</span>
        <span className="opacity-50">/10</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-bold rounded-lg border",
        sizeClasses[size],
        colorClass
      )}
    >
      {showIcon && <Star size={iconSizes[size]} fill="currentColor" />}
      {displayRating}
    </span>
  );
}

// Star rating display (5 stars)
interface StarRatingProps {
  rating?: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

export function StarRating({
  rating = 0,
  maxStars = 5,
  size = "md",
  showValue = true,
}: StarRatingProps) {
  // Convert 10-point scale to 5-star scale
  const normalizedRating = (rating / 10) * maxStars;
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating - fullStars >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            size={iconSizes[size]}
            className="text-yellow-400"
            fill="currentColor"
          />
        ))}
        {hasHalfStar && (
          <Star
            key="half"
            size={iconSizes[size]}
            className="text-yellow-400"
            fill="currentColor"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            size={iconSizes[size]}
            className="text-slate-600"
          />
        ))}
      </div>
      {showValue && (
        <span className={cn("font-bold text-slate-400", size === "sm" ? "text-xs" : "text-sm")}>
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
}
