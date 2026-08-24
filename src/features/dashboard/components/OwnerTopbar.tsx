"use client";

import { Bell, Search } from "lucide-react";
import { useAuth } from "@/shared/auth/AuthContext";

export function OwnerTopbar() {
  const { user } = useAuth();
  const initials = user?.fullName?.trim()?.[0] ?? "م";

  return (
    <header className="flex items-center justify-between gap-4 px-5 lg:px-8 py-4 border-b border-gym-border bg-gym-surface/70 backdrop-blur-sm sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-bold text-gym-black font-cairo">نظرة عامة</h1>
        <p className="text-xs text-gym-text-secondary mt-0.5">أهلًا بعودتك، إليك ملخص صالتك اليوم</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 h-10 px-3.5 rounded-xl border border-gym-border bg-gym-surface text-gym-text-secondary text-sm w-56">
          <Search className="h-4 w-4 shrink-0" />
          <span className="truncate">بحث عن عضو، فرع…</span>
        </div>

        <button
          className="relative h-10 w-10 rounded-xl border border-gym-border bg-gym-surface flex items-center justify-center text-gym-text-secondary hover:text-gym-black transition-colors"
          aria-label="الإشعارات"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gym-red" />
        </button>

        <div className="h-10 w-10 rounded-xl bg-gym-yellow text-gym-black font-cairo font-bold flex items-center justify-center">
          {initials}
        </div>
      </div>
    </header>
  );
}
