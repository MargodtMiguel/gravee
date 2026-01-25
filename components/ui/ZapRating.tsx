import { Zap } from "lucide-react";

interface ZapRatingProps {
  rating: number; // 1 to 5
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ZapRating({
  rating,
  maxRating = 5,
  size = "md",
  className = "",
}: ZapRatingProps) {
  const iconSizes = {
    sm: "size-3",
    md: "size-4",
    lg: "size-5",
  };

  return (
    <div className={`flex gap-0.5 ${className}`}>
      {Array.from({ length: maxRating }).map((_, i) => (
        <Zap
          key={i}
          className={`${iconSizes[size]} ${
            i < rating
              ? "fill-primary text-primary"
              : "fill-primary/20 text-primary/20"
          }`}
        />
      ))}
    </div>
  );
}
