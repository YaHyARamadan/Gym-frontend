"use client";

import { Bell, Calendar, ChevronDown } from "lucide-react";
import { useAuth } from "@/shared/auth/AuthContext";

export function OwnerTopbar() {
  const { user } = useAuth();
  const userName = user?.fullName || "المستخدم";
  const userRole = user?.role === "Owner" ? "المالك" : user?.role || "مستخدم";

  // Real-time formatted date in Arabic
  const currentDateFormatted = new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="flex flex-row-reverse items-center justify-between gap-4 px-6 lg:px-8 py-4 bg-white border-b border-zinc-200 sticky top-0 z-20 shadow-xs">
      {/* Right side: User Profile, Bell, Date */}
      <div className="flex items-center gap-4">
        {/* User Profile dropdown button */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="h-10 w-10 rounded-full bg-zinc-900 text-white font-cairo font-bold flex items-center justify-center text-sm shadow-xs overflow-hidden">
            {userName.charAt(0) || "أ"}
          </div>
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-bold text-zinc-900 font-cairo leading-tight">{userName}</span>
            <span className="text-xs text-zinc-500 font-medium">{userRole}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
        </div>

        {/* Notifications bell */}
        <button
          className="relative h-10 w-10 rounded-full border border-zinc-200 bg-zinc-50/80 flex items-center justify-center text-zinc-600 hover:bg-zinc-100 transition-colors"
          aria-label="الإشعارات"
        >
          <Bell className="h-4.5 w-4.5" strokeWidth={1.8} />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Dynamic Current Date */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs font-medium text-zinc-600">
          <Calendar className="h-4 w-4 text-zinc-500" strokeWidth={1.8} />
          <span>{currentDateFormatted}</span>
        </div>
      </div>

      {/* Left side: Welcome greeting with active user name */}
      <div className="text-right">
        <h1 className="text-xl font-black text-zinc-900 font-cairo tracking-wide">
          مرحبًا بك، {userName}
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5 font-medium">
          إليك نظرة عامة على أداء الجيم اليوم
        </p>
      </div>
    </header>
  );
}
