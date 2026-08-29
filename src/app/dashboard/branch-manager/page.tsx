"use client";

import {
  Users, DollarSign, UserCheck, AlertCircle, FileEdit,
  UserPlus, TrendingUp, ArrowLeft, RefreshCw, XCircle,
  Zap, Activity, Clock,
} from "lucide-react";
import Link from "next/link";
import { useDashboardOverview } from "@/features/owner/hooks/useReports";
import { useAuth } from "@/shared/auth/AuthContext";
import { cn } from "@/lib/utils";

function StatCard({
  label, value, sub, icon: Icon, accent = false, href,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  accent?: boolean;
  href?: string;
}) {
  const inner = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border p-6 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        accent
          ? "border-rose-200 bg-gradient-to-br from-white to-rose-50/40"
          : "border-zinc-200 bg-white"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110",
            accent
              ? "bg-rose-100 text-rose-700"
              : "bg-zinc-100 text-zinc-700"
          )}
        >
          <Icon className="h-6 w-6" strokeWidth={1.8} />
        </div>
        <div className="text-right flex-1 min-w-0">
          <p className="text-xs font-bold text-zinc-400 font-cairo mb-1">{label}</p>
          <p className={cn("text-3xl font-black font-cairo leading-none", accent ? "text-rose-900" : "text-zinc-900")}>
            {value}
          </p>
          <p className={cn("text-[11px] font-bold mt-2", accent ? "text-rose-600" : "text-zinc-500")}>{sub}</p>
        </div>
      </div>
      {accent && (
        <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-rose-500 to-rose-700 rounded-r-3xl" />
      )}
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function BranchManagerDashboardPage() {
  const { user } = useAuth();
  const { data: overview, isLoading, error, refetch } = useDashboardOverview();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-4 dir-rtl font-tajawal">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-amber-200 border-t-gym-yellow animate-spin" />
          <Zap className="absolute inset-0 m-auto h-6 w-6 text-gym-yellow" />
        </div>
        <p className="text-sm font-bold text-zinc-500 font-cairo">جاري تحميل بيانات الفرع...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 dir-rtl font-tajawal text-center p-8 bg-white rounded-3xl border border-zinc-200 shadow-xs max-w-lg mx-auto my-10">
        <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
          <XCircle className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900 font-cairo">تعذّر تحميل بيانات الفرع</h3>
          <p className="text-xs text-zinc-500 mt-1">{(error as Error)?.message || "تعذر الاتصال بالخادم."}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-bold text-xs px-6 py-3 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>إعادة المحاولة</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-zinc-900 via-zinc-800 to-zinc-900 p-7 shadow-lg">
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 font-cairo">مدير الفرع — النظام نشط</span>
            </div>
            <h1 className="text-3xl font-black text-white font-cairo tracking-wide">
              مرحباً، {user?.fullName?.split(" ")[0] || "مدير الفرع"} 👋
            </h1>
            <p className="text-sm text-zinc-400 font-medium mt-1.5">
              إليك نظرة عامة على أداء فرعك اليوم · {new Date().toLocaleDateString("ar-EG", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <Link
            href="/dashboard/branch-manager/staff/new"
            className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-7 py-3.5 rounded-2xl shadow-[0_4px_20px_rgba(245,197,24,0.4)] transition-all hover:scale-[1.02] cursor-pointer shrink-0"
          >
            <UserPlus className="h-5 w-5 stroke-[2.5]" />
            <span>دعوة موظف جديد</span>
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="الأعضاء النشطون"
          value={(overview?.activeMembers ?? 0).toLocaleString("ar-EG")}
          sub={`إجمالي: ${(overview?.totalMembers ?? 0).toLocaleString("ar-EG")} عضو`}
          icon={Users}
        />
        <div className="relative group overflow-hidden rounded-3xl border border-amber-300/60 bg-gradient-to-br from-amber-50 to-white p-6 shadow-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-t-3xl" />
          <div className="flex items-start justify-between gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
              <DollarSign className="h-6 w-6" strokeWidth={2} />
            </div>
            <div className="text-right flex-1">
              <p className="text-xs font-bold text-zinc-400 font-cairo mb-1">إيرادات الشهر</p>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-3xl font-black text-zinc-900 font-cairo leading-none">
                  {(overview?.monthlyRevenue ?? 0).toLocaleString("ar-EG")}
                </span>
                <span className="text-sm font-bold text-zinc-500">ج.م</span>
              </div>
              <p className="text-[11px] font-bold text-amber-600 mt-2">
                صافي الأرباح: {(overview?.netProfit ?? 0).toLocaleString("ar-EG")} ج.م
              </p>
            </div>
          </div>
        </div>
        <StatCard
          label="الشكاوى المعلّقة"
          value={overview?.expiringSubscriptionsCount ?? 0}
          sub="اشتراكات تنتهي قريباً"
          icon={AlertCircle}
          accent
          href="/dashboard/branch-manager/subscriptions"
        />
        <StatCard
          label="حضور اليوم"
          value={(overview?.todayAttendanceCount ?? 0).toLocaleString("ar-EG")}
          sub="تسجيل دخول اليوم"
          icon={Activity}
        />
      </div>

      {/* Secondary stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "أعضاء جدد هذا الشهر", value: overview?.newMembersThisMonth ?? 0, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "اشتراكات منتهية", value: overview?.expiredMembersCount ?? 0, color: "text-red-600", bg: "bg-red-50" },
          { label: "إيرادات المتجر", value: `${(overview?.storeRevenueThisMonth ?? 0).toLocaleString("ar-EG")} ج.م`, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "منتجات مخزونها منخفض", value: overview?.lowStockProductsCount ?? 0, color: "text-orange-600", bg: "bg-orange-50" },
        ].map((item) => (
          <div key={item.label} className={`rounded-2xl border border-zinc-100 ${item.bg} p-4 text-right`}>
            <p className="text-xs font-bold text-zinc-500 font-cairo">{item.label}</p>
            <p className={`text-2xl font-black font-cairo mt-1 ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-right">
            <div className="h-8 w-8 rounded-xl bg-gym-yellow/20 text-amber-700 flex items-center justify-center">
              <Zap className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <h3 className="text-base font-black text-zinc-900 font-cairo">إجراءات سريعة</h3>
          </div>
          <div className="space-y-2">
            {[
              { href: "/dashboard/branch-manager/staff/new", label: "دعوة موظف جديد", icon: UserPlus, accent: true },
              { href: "/dashboard/branch-manager/members", label: "إدارة الأعضاء", icon: UserCheck },
              { href: "/dashboard/branch-manager/subscriptions", label: "الاشتراكات", icon: Clock },
              { href: "/dashboard/branch-manager/finance", label: "المدفوعات والمصاريف", icon: DollarSign },
              { href: "/dashboard/branch-manager/complaints", label: "الشكاوى والمقترحات", icon: AlertCircle },
            ].map(({ href, label, icon: Icon, accent }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center justify-between p-3.5 rounded-2xl border transition-all text-xs font-bold font-cairo group",
                  accent
                    ? "border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900"
                    : "border-zinc-100 bg-zinc-50 hover:bg-zinc-100 text-zinc-800"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center", accent ? "bg-amber-200 text-amber-800" : "bg-zinc-200 text-zinc-700")}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{label}</span>
                </div>
                <ArrowLeft className="h-4 w-4 text-zinc-400 group-hover:-translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/branch-manager/reports" className="text-xs font-bold text-amber-600 hover:underline font-cairo flex items-center gap-1">
              <span>تقرير كامل</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
            <div className="text-right">
              <h3 className="text-base font-black text-zinc-900 font-cairo">ملخص إيرادات الفرع</h3>
              <p className="text-xs text-zinc-400">إيرادات الفرع هذا الشهر مقسمة حسب الأسبوع</p>
            </div>
          </div>

          <div className="relative h-52 bg-gradient-to-t from-amber-500/8 via-transparent to-transparent rounded-2xl border border-amber-200/40 p-4 overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-4 px-4 pointer-events-none">
              {[75, 50, 25].map((p) => (
                <div key={p} className="border-t border-zinc-100/80 w-full" />
              ))}
            </div>
            <div className="flex items-end justify-between gap-3 h-full relative z-10">
              {[
                { day: "الأسبوع 1", pct: 55 },
                { day: "الأسبوع 2", pct: 78 },
                { day: "الأسبوع 3", pct: 62 },
                { day: "الأسبوع 4", pct: 90 },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-zinc-600 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white px-2 py-0.5 rounded-lg shadow-xs border border-zinc-200 whitespace-nowrap">
                    {Math.round(bar.pct * (overview?.monthlyRevenue ?? 50000) / 400 / 100) * 100} ج.م
                  </span>
                  <div
                    className="w-full max-w-[36px] bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-xl shadow-sm transition-all duration-500 hover:from-amber-400 hover:to-amber-200 cursor-pointer"
                    style={{ height: `${bar.pct}%` }}
                  />
                  <span className="text-[10px] font-bold text-zinc-400 font-cairo whitespace-nowrap">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold text-zinc-500 border-t border-zinc-100 pt-4">
            <span className="text-emerald-600 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>مصروفات الشهر: {(overview?.monthlyExpenses ?? 0).toLocaleString("ar-EG")} ج.م</span>
            </span>
            <span className="text-amber-600 font-black">
              الإجمالي: {(overview?.monthlyRevenue ?? 0).toLocaleString("ar-EG")} ج.م
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
