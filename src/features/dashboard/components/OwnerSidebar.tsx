"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Building2,
  Users,
  CreditCard,
  Banknote,
  Briefcase,
  BarChart3,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { BrandMark } from "@/shared/ui/BrandMark";
import { useAuth } from "@/shared/auth/AuthContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard/owner", label: "الرئيسية", icon: LayoutGrid },
  { href: "/dashboard/owner/branches", label: "الفروع", icon: Building2 },
  { href: "/dashboard/owner/members", label: "المشتركين", icon: Users },
  { href: "/dashboard/owner/subscriptions", label: "الإشتراكات", icon: CreditCard },
  { href: "/dashboard/owner/payments", label: "المدفوعات", icon: Banknote },
  { href: "/dashboard/owner/staff", label: "الموظفين", icon: Briefcase },
  { href: "/dashboard/owner/reports", label: "التقارير", icon: BarChart3 },
  { href: "/dashboard/owner/notifications", label: "الإشعارات", icon: Bell },
  { href: "/dashboard/owner/settings", label: "الإعدادات", icon: Settings },
];

export function OwnerSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 h-screen sticky top-0 bg-[#0d0d0d] text-white border-l border-white/10 select-none z-30">
      <div className="flex flex-col h-full py-6 px-4">
        {/* Brand header */}
        <div className="flex items-center justify-center pb-6 mb-4 border-b border-white/10">
          <BrandMark tone="dark" size="md" />
        </div>

        {/* Navigation items */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard/owner" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-gym-yellow text-gym-black font-extrabold shadow-[0_2px_12px_rgba(245,197,24,0.35)]"
                    : "text-zinc-300 hover:bg-white/8 hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", active ? "text-gym-black stroke-[2.5]" : "text-zinc-400 stroke-[1.8]")} />
                <span className="font-cairo text-sm">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-white/8 hover:text-red-400 transition-colors group"
          >
            <span className="font-cairo text-sm font-bold">تسجيل الخروج</span>
            <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </aside>
  );
}
