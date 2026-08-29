"use client";

import { Bell, Calendar, Building2 } from "lucide-react";
import { useAuth } from "@/shared/auth/AuthContext";
import { useUnreadNotificationsCount } from "@/features/owner/hooks/useNotifications";

export function BranchManagerTopbar() {
  const { user } = useAuth();
  const { data: unreadCount } = useUnreadNotificationsCount();

  const currentDate = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between sticky top-0 z-20 font-tajawal">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-zinc-900 text-gym-yellow flex items-center justify-center font-bold font-cairo text-sm shadow-xs border border-zinc-800">
          {user?.fullName?.charAt(0) || "M"}
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-zinc-900 font-cairo leading-tight">
            {user?.fullName || "مدير الفرع"}
          </p>
          <p className="text-xs text-zinc-500 font-medium leading-tight">مدير الفرع</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-1.5 text-xs text-zinc-700 font-medium">
          <Building2 className="h-4 w-4 text-amber-500" />
          <span>الفرع الحالي (فرعك)</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-1.5 font-medium">
          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
          <span>{currentDate}</span>
        </div>

        <div className="relative">
          <button className="h-9 w-9 rounded-xl border border-zinc-200 bg-white flex items-center justify-center text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer">
            <Bell className="h-4.5 w-4.5" />
          </button>
          {!!unreadCount && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              {unreadCount > 99 ? "+99" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
