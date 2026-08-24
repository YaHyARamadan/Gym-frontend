"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Building2,
  Wallet,
  UserPlus,
  Settings,
  LogOut,
} from "lucide-react";
import { BrandMark } from "@/shared/ui/BrandMark";
import { useAuth } from "@/shared/auth/AuthContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard/owner", label: "نظرة عامة", icon: LayoutGrid },
  { href: "/dashboard/owner/branches", label: "الفروع", icon: Building2 },
  { href: "/dashboard/owner/members", label: "الأعضاء", icon: Users },
  { href: "/dashboard/owner/team", label: "الفريق والدعوات", icon: UserPlus },
  { href: "/dashboard/owner/billing", label: "الاشتراكات والمالية", icon: Wallet },
  { href: "/dashboard/owner/settings", label: "الإعدادات", icon: Settings },
];

export function OwnerSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="dash-sidebar hidden lg:flex lg:flex-col w-64 shrink-0 h-full">
      <div className="relative z-10 flex flex-col h-full px-5 py-6">
        <div className="flex items-center justify-center pb-6 mb-6 border-b border-white/10">
          <BrandMark tone="dark" size="sm" />
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-gym-yellow text-gym-black font-bold"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={active ? 2.4 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => logout()}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/50 hover:bg-white/5 hover:text-gym-red transition-colors mt-2"
        >
          <LogOut className="h-4.5 w-4.5" strokeWidth={1.8} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
