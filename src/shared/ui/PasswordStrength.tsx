"use client";

import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

function getStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) || /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  // Normalize to 4 dots
  return Math.min(4, Math.ceil((score / 5) * 4));
}

const LABELS = ["", "ضعيف", "مقبول", "جيد", "قوي"];
const LABEL_COLORS = [
  "",
  "text-gym-red",
  "text-gym-maroon",
  "text-gym-maroon",
  "text-gym-yellow",
];

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const strength = getStrength(password);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex gap-1.5" role="meter" aria-valuenow={strength} aria-valuemin={0} aria-valuemax={4}>
        {[1, 2, 3, 4].map((dot) => (
          <div
            key={dot}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              dot <= strength
                ? strength === 4
                  ? "bg-gym-yellow"
                  : strength >= 3
                  ? "bg-gym-maroon/70"
                  : "bg-gym-red/60"
                : "bg-gym-border"
            )}
          />
        ))}
      </div>
      {password && strength > 0 && (
        <p className={cn("text-xs font-medium", LABEL_COLORS[strength])}>
          قوة كلمة المرور: {LABELS[strength]}
        </p>
      )}
    </div>
  );
}
