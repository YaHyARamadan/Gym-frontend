"use client";

import {
  Users,
  Building2,
  CreditCard,
  DollarSign,
  ArrowLeft,
  ChevronDown,
  Bell,
  MoreHorizontal,
  RefreshCw,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  useDashboardOverview,
  useRevenueReport,
} from "@/features/owner/hooks/useReports";
import { useBranches } from "@/features/owner/hooks/useBranches";
import { useNotifications } from "@/features/owner/hooks/useNotifications";
import { useSubscriptions } from "@/features/owner/hooks/useSubscriptions";
import type { SubscriptionStatus } from "@/features/owner/types";

function subStatusLabel(status: SubscriptionStatus): string {
  const map: Record<SubscriptionStatus, string> = {
    Active: "نشط",
    Expired: "منتهي",
    Frozen: "مجمّد",
    Cancelled: "ملغى",
    Pending: "معلق",
  };
  return map[status] ?? status;
}

function subStatusClass(status: SubscriptionStatus): string {
  switch (status) {
    case "Active":    return "text-amber-800 bg-amber-200/60 border border-amber-300";
    case "Expired":   return "text-white bg-red-600";
    case "Frozen":    return "text-blue-800 bg-blue-200/60 border border-blue-300";
    case "Cancelled": return "text-zinc-700 bg-zinc-200";
    case "Pending":   return "text-rose-800 bg-rose-200/60 border border-rose-300";
    default:          return "text-zinc-700 bg-zinc-200";
  }
}

export default function OwnerDashboardPage() {
  const { data: overview, isLoading: overviewLoading, error, refetch } = useDashboardOverview();
  const { data: revenue, isLoading: revenueLoading } = useRevenueReport();
  const { data: notificationsData, isLoading: notifsLoading } = useNotifications({ pageSize: 5 });
  const { data: subsData, isLoading: subsLoading } = useSubscriptions({ pageSize: 5 });
  const { data: branchesData, isLoading: branchesLoading } = useBranches();

  const isAnyLoading = (overviewLoading && overview === undefined) || 
                      (revenueLoading && revenue === undefined) || 
                      (notifsLoading && notificationsData === undefined) || 
                      (subsLoading && subsData === undefined) || 
                      (branchesLoading && branchesData === undefined);

  if (isAnyLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 dir-rtl font-tajawal">
        <RefreshCw className="h-8 w-8 text-amber-500 animate-spin" />
        <p className="text-sm font-bold text-zinc-600 font-cairo">جاري تحميل إحصائيات لوحة التحكم...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 dir-rtl font-tajawal text-center p-6 bg-white rounded-3xl border border-zinc-200 shadow-xs max-w-lg mx-auto my-10">
        <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
          <XCircle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900 font-cairo">حدث خطأ أثناء تحميل لوحة التحكم</h3>
          <p className="text-xs text-zinc-500 mt-1">{(error as Error)?.message || "تعذر الاتصال بالخادم."}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>إعادة المحاولة</span>
        </button>
      </div>
    );
  }

  const totalBranchesCount = branchesData?.length ?? 0;

  // Cards data connected to Backend Overview API
  const METRIC_CARDS = [
    {
      title: "إجمالي الفروع",
      value: totalBranchesCount.toString(),
      badgeText: `${totalBranchesCount} فرع نشط`,
      badgeType: "active" as const,
      icon: Building2,
    },
    {
      title: "إجمالي المشتركين",
      value: (overview?.totalMembers ?? 0).toLocaleString("ar-EG"),
      badgeText: `نشط: ${overview?.activeMembers ?? 0}`,
      badgeType: "active" as const,
      icon: Users,
    },
    {
      title: "اشتراكات تقترب من الانتهاء",
      value: (overview?.expiringSubscriptionsCount ?? 0).toString(),
      badgeText: "تنبيه الانتهاء",
      badgeType: "expired" as const,
      icon: CreditCard,
    },
    {
      title: "إجمالي الإيرادات",
      value: (overview?.monthlyRevenue ?? 0).toLocaleString("ar-EG"),
      unit: "ج.م",
      subtitle: "هذا الشهر (ج.م)",
      icon: DollarSign,
      borderBottomClass: "border-b-4 border-amber-400",
    },
    {
      title: "إجمالي المصروفات",
      value: (overview?.monthlyExpenses ?? 0).toLocaleString("ar-EG"),
      unit: "ج.م",
      subtitle: "هذا الشهر (ج.م)",
      icon: DollarSign,
      borderBottomClass: "border-b-4 border-red-700",
    },
  ];

  const recentNotifs = notificationsData?.items ?? [];
  const recentSubs = subsData?.items ?? [];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* ── Row 1: Top Metrics Grid (5 cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {METRIC_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={cn(
                "bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex flex-col justify-between relative overflow-hidden transition-all duration-200 hover:shadow-md",
                card.borderBottomClass
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <span className="text-xs font-bold text-zinc-500 font-cairo text-left">{card.title}</span>
              </div>

              <div className="mt-4 text-right">
                <div className="flex items-baseline justify-start gap-1">
                  <span className="text-2xl lg:text-3xl font-black text-zinc-900 font-cairo tracking-tight">
                    {card.value}
                  </span>
                  {card.unit && <span className="text-xs font-bold text-zinc-500">{card.unit}</span>}
                </div>

                {card.subtitle && (
                  <p className="text-[11px] font-semibold text-zinc-400 mt-1">{card.subtitle}</p>
                )}

                {card.badgeText && (
                  <div className="mt-2 text-xs font-bold flex items-center gap-1">
                    {card.badgeType === "active" ? (
                      <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {card.badgeText}
                      </span>
                    ) : (
                      <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                        {card.badgeText}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Row 2: Charts & Widgets ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Right Widget: Branch Performance */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-extrabold text-zinc-900 font-cairo">أداء الفروع</h3>
              <div className="flex items-center gap-1 text-xs text-zinc-500 border border-zinc-200 rounded-lg px-2.5 py-1 bg-zinc-50">
                <span>هذا الشهر</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="space-y-4">
              {revenue?.branchBreakdown && revenue.branchBreakdown.length > 0 ? (
                (() => {
                  const maxAmt = Math.max(...revenue.branchBreakdown.map((b) => b.totalAmount), 1);
                  return revenue.branchBreakdown.slice(0, 5).map((branch, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-zinc-800 font-cairo">{branch.branchName}</span>
                        <span className="text-zinc-500 font-mono dir-ltr">
                          {branch.totalAmount.toLocaleString("ar-EG")} ج.م
                        </span>
                      </div>
                      <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden dir-rtl">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${(branch.totalAmount / maxAmt) * 100}%` }}
                        />
                      </div>
                    </div>
                  ));
                })()
              ) : (
                <p className="text-xs text-zinc-400 text-center py-6">لا يوجد بيانات فروع</p>
              )}
            </div>
          </div>

          <Link
            href="/dashboard/owner/branches"
            className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors group"
          >
            <span>عرض جميع الفروع</span>
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Center Widget: Revenue vs Expenses Line Chart */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-extrabold text-zinc-900 font-cairo">الإيرادات vs المصروفات</h3>
                <div className="flex items-center gap-1 text-xs text-zinc-500 border border-zinc-200 rounded-lg px-2.5 py-1 bg-zinc-50">
                  <span>هذا الشهر</span>
                  <ChevronDown className="h-3.5 w-3.5" />
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-zinc-600">
                  <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" />
                  الإيرادات
                </span>
                <span className="flex items-center gap-1.5 text-zinc-600">
                  <span className="h-2.5 w-2.5 rounded-sm bg-red-600" />
                  المصروفات
                </span>
              </div>
            </div>

            {/* SVG Interactive Line Chart */}
            <div className="relative w-full h-[210px] mt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="180" x2="500" y2="180" stroke="#e2e8f0" />

                <polyline
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  points="40,150 90,120 140,90 190,85 240,40 290,65 340,45 390,55 440,80 490,95"
                />
                <polyline
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                  points="40,175 90,160 140,140 190,125 240,110 290,115 340,130 390,145 440,165 490,175"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Left Widget: Recent Notifications */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-extrabold text-zinc-900 font-cairo">الإشعارات الحديثة</h3>
              <Bell className="h-4.5 w-4.5 text-zinc-400" />
            </div>

            <div className="space-y-4">
              {recentNotifs.length > 0 ? (
                recentNotifs.map((notif) => (
                  <div key={notif.id} className="flex items-center justify-between gap-3 text-right">
                    <div className="h-9 w-9 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                      <Bell className="h-4 w-4 text-zinc-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-900 font-cairo truncate">{notif.title}</p>
                      <p className="text-[11px] font-medium text-zinc-500 truncate">{notif.message}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={cn("h-1.5 w-1.5 rounded-full", !notif.isRead ? "bg-amber-400" : "bg-zinc-300")} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-400 text-center py-6">لا توجد إشعارات حالية</p>
              )}
            </div>
          </div>

          <Link
            href="/dashboard/owner/notifications"
            className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors group"
          >
            <span>عرض جميع الإشعارات</span>
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>

      {/* ── Row 3: Recent Subscriptions Data Table ── */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-extrabold text-zinc-900 font-cairo">آخر الاشتراكات</h3>
          <Link
            href="/dashboard/owner/subscriptions"
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors group"
          >
            <span>عرض جميع الإشتراكات</span>
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 text-xs font-bold text-zinc-400 font-cairo pb-3">
                <th className="pb-3">المشترك</th>
                <th className="pb-3">رقم العضوية</th>
                <th className="pb-3">الخطة</th>
                <th className="pb-3">تاريخ البداية</th>
                <th className="pb-3">تاريخ الانتهاء</th>
                <th className="pb-3 text-center">الحالة</th>
                <th className="pb-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {recentSubs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400 text-xs font-bold font-cairo">
                    لا يوجد اشتراكات حديثة
                  </td>
                </tr>
              ) : (
                recentSubs.map((row) => (
                  <tr key={row.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 font-bold text-zinc-900 font-cairo">{row.memberFullName}</td>
                    <td className="py-3.5 font-medium text-zinc-700 font-mono text-xs">{row.memberNumber}</td>
                    <td className="py-3.5 text-zinc-600 text-xs">{row.planName}</td>
                    <td className="py-3.5 text-zinc-600 font-mono text-xs">
                      {new Date(row.startDate).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="py-3.5 text-zinc-600 font-mono text-xs">
                      {new Date(row.endDate).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={cn("inline-block px-3 py-1 text-xs font-bold rounded-md", subStatusClass(row.status))}>
                        {subStatusLabel(row.status)}
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <button className="h-8 w-8 rounded-lg border border-zinc-200 bg-white flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-colors mx-auto cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
