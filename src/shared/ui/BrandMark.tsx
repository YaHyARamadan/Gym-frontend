import { cn } from "@/lib/utils";

interface BrandMarkProps {
  /** "light" for light cards, "dark" for dark luxury pages & sidebar */
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Shared barbell wordmark — GYM MANAGEMENT.
 * Enhanced with electric gold accents and glowing plate silhouettes.
 */
export function BrandMark({ tone = "dark", size = "md", className }: BrandMarkProps) {
  const isSmall = size === "sm";
  const isLarge = size === "lg";

  return (
    <div className={cn("flex flex-col items-center gap-2 select-none group", className)}>
      <div className="relative flex items-center justify-center">
        {/* Ambient glow behind mark */}
        <div className="absolute inset-0 bg-gym-yellow/20 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        
        <svg
          width={isSmall ? 48 : isLarge ? 80 : 64}
          height={isSmall ? 28 : isLarge ? 46 : 36}
          viewBox="0 0 72 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-[0_2px_8px_rgba(245,197,24,0.3)] transition-transform duration-300 group-hover:scale-105"
          aria-hidden="true"
        >
          <rect x="0" y="8" width="5" height="24" rx="2" fill="#F5C518" />
          <rect x="8" y="4" width="5" height="32" rx="2" fill="#F5C518" />
          <rect x="16" y="17" width="40" height="6" rx="3" fill={tone === "light" ? "#0D0D0D" : "#FFFFFF"} />
          <rect x="59" y="4" width="5" height="32" rx="2" fill="#F5C518" />
          <rect x="67" y="8" width="5" height="24" rx="2" fill="#F5C518" />
        </svg>
      </div>

      <div className="text-center leading-none">
        <p
          className={cn(
            "font-cairo font-extrabold tracking-[0.08em] m-0 bg-gradient-to-r from-white via-amber-100 to-gym-yellow bg-clip-text text-transparent drop-shadow-sm",
            isSmall ? "text-base" : isLarge ? "text-3xl" : "text-2xl"
          )}
        >
          GYM
        </p>
        <p
          className={cn(
            "font-bold tracking-[0.32em] mt-0.5 text-gym-yellow opacity-90",
            isSmall ? "text-[0.5rem]" : isLarge ? "text-[0.75rem]" : "text-[0.625rem]"
          )}
        >
          MANAGEMENT
        </p>
      </div>
    </div>
  );
}

/** Decorative oversized plate-stack silhouette used in dark backgrounds */
export function PlateStackDecor({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="220"
      height="420"
      viewBox="0 0 220 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="150" y="0" width="70" height="420" fill="#F5C518" fillOpacity="0.10" />
      <rect x="90" y="40" width="50" height="340" rx="10" fill="#F5C518" fillOpacity="0.14" />
      <rect x="40" y="90" width="36" height="240" rx="10" fill="#F5C518" fillOpacity="0.10" />
      <rect x="0" y="140" width="24" height="140" rx="8" fill="#F5C518" fillOpacity="0.08" />
    </svg>
  );
}
