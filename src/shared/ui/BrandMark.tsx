import { cn } from "@/lib/utils";

interface BrandMarkProps {
  /** "light" for white cards, "dark" for the dark sidebar/hero */
  tone?: "light" | "dark";
  size?: "sm" | "md";
  className?: string;
}

/**
 * Shared barbell wordmark — GYM MANAGEMENT.
 * Used on login / signup / accept-invite cards and the dashboard sidebar.
 */
export function BrandMark({ tone = "light", size = "md", className }: BrandMarkProps) {
  const barColor = tone === "dark" ? "#F5C518" : "#0D0D0D";
  const plateColor = "#F5C518";
  const isSmall = size === "sm";

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <svg
        width={isSmall ? 56 : 72}
        height={isSmall ? 31 : 40}
        viewBox="0 0 72 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="0" y="8" width="5" height="24" rx="2" fill={plateColor} />
        <rect x="8" y="4" width="5" height="32" rx="2" fill={plateColor} />
        <rect x="16" y="17" width="40" height="6" rx="3" fill={barColor} />
        <rect x="59" y="4" width="5" height="32" rx="2" fill={plateColor} />
        <rect x="67" y="8" width="5" height="24" rx="2" fill={plateColor} />
      </svg>

      <div className="text-center leading-[1.1]">
        <p
          className={cn(
            "font-cairo font-extrabold tracking-[0.06em] m-0",
            isSmall ? "text-lg" : "text-2xl",
            tone === "dark" ? "text-white" : "text-gym-black"
          )}
        >
          GYM
        </p>
        <p
          className={cn(
            "font-bold tracking-[0.3em] -mt-0.5",
            isSmall ? "text-[0.55rem]" : "text-[0.6875rem]",
            tone === "dark" ? "text-gym-yellow" : "text-[#c08c0e]"
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
