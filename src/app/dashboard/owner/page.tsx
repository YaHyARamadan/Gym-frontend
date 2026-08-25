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
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/shared/ui/Badge";
import { cn } from "@/lib/utils";

// Top 5 Key Metric Cards (Ordered Right to Left)
const METRIC_CARDS = [
  {
    title: "إجمالي الفروع",
    value: "8",
    badgeText: "7 فرع نشط",
    badgeType: "active" as const,
    icon: Building2,
  },
  {
    title: "إجمالي المشتركين",
    value: "1,248",
    badgeText: "1,082 نشط",
    badgeType: "active" as const,
    icon: Users,
  },
  {
    title: "إجمالي الاشتراكات النشطة",
    value: "962",
    badgeText: "286 منتهية",
    badgeType: "expired" as const,
    icon: CreditCard,
  },
  {
    title: "إجمالي الإيرادات",
    value: "842,500",
    unit: "ج.م",
    subtitle: "هذا الشهر (ج.م)",
    icon: DollarSign,
    accentColor: "bg-amber-400",
    borderBottomClass: "border-b-4 border-amber-400",
  },
  {
    title: "إجمالي المصروفات",
    value: "215,300",
    unit: "ج.م",
    subtitle: "هذا الشهر (ج.م)",
    icon: DollarSign,
    accentColor: "bg-red-700",
    borderBottomClass: "border-b-4 border-red-700",
  },
];

// Branch performance data
const BRANCH_PERFORMANCE = [
  { name: "فرع مدينة نصر", value: "210,450 ج.م", percentage: 88 },
  { name: "فرع المعادي", value: "185,200 ج.م", percentage: 75 },
  { name: "فرع أكتوبر", value: "162,300 ج.م", percentage: 65 },
  { name: "فرع التجمع", value: "128,750 ج.م", percentage: 50 },
  { name: "فرع المهندسين", value: "98,600 ج.م", percentage: 40 },
];

// Notifications
const RECENT_NOTIFICATIONS = [
  {
    title: "تم تسجيل اشتراك جديد",
    sub: "فرع مدينة نصر",
    time: "منذ 5 دقائق",
    dotColor: "bg-amber-400",
  },
  {
    title: "دفعة متأخرة",
    sub: "المشترك محمد أشرف",
    time: "منذ 25 دقيقة",
    dotColor: "bg-red-500",
  },
  {
    title: "طلب إجازة جديد",
    sub: "الكوتش أحمد سمير",
    time: "منذ ساعة",
    dotColor: "bg-zinc-400",
  },
  {
    title: "انتهاء اشتراك",
    sub: "المشترك سارة عصام",
    time: "منذ ساعتين",
    dotColor: "bg-red-500",
  },
];

// Subscriptions table data
const RECENT_SUBSCRIPTIONS = [
  {
    member: "محمد علي",
    branch: "فرع مدينة نصر",
    startDate: "2024-05-21",
    endDate: "2024-08-21",
    type: "اشتراك شهري",
    amount: "3,000 ج.م",
    status: "نشط",
    statusVariant: "active" as const,
  },
  {
    member: "أحمد خالد",
    branch: "فرع المعادي",
    startDate: "2024-04-15",
    endDate: "2024-07-15",
    type: "اشتراك 3 شهور",
    amount: "2,500 ج.م",
    status: "معلق",
    statusVariant: "pending" as const,
  },
  {
    member: "سارة عصام",
    branch: "فرع أكتوبر",
    startDate: "2024-02-10",
    endDate: "2024-05-10",
    type: "اشتراك شهري",
    amount: "2,000 ج.م",
    status: "منتهي",
    statusVariant: "expired" as const,
  },
  {
    member: "أحمد محمود",
    branch: "فرع التجمع",
    startDate: "2024-05-20",
    endDate: "2024-11-20",
    type: "اشتراك سنوي",
    amount: "4,500 ج.م",
    status: "نشط",
    statusVariant: "active" as const,
  },
  {
    member: "نورهان سعيد",
    branch: "فرع المهندسين",
    startDate: "2024-05-30",
    endDate: "2024-06-30",
    type: "اشتراك شهري",
    amount: "1,800 ج.م",
    status: "معلق",
    statusVariant: "pending" as const,
  },
];

export default function OwnerDashboardPage() {
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

      {/* ── Row 2: Charts & Widgets (3 Columns: Branch Performance Right, Line Chart Center, Notifications Left) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Right Widget: Branch Performance (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-extrabold text-zinc-900 font-cairo">أداء الفروع</h3>
              <div className="flex items-center gap-1 text-xs text-zinc-500 border border-zinc-200 rounded-lg px-2.5 py-1 bg-zinc-50 cursor-pointer">
                <span>هذا الشهر</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="space-y-4">
              {BRANCH_PERFORMANCE.map((branch, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-zinc-800 font-cairo">{branch.name}</span>
                    <span className="text-zinc-500 font-mono dir-ltr">{branch.value}</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden dir-rtl">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${branch.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
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

        {/* Center Widget: Revenue vs Expenses Line Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-base font-extrabold text-zinc-900 font-cairo">الإيرادات vs المصروفات</h3>
                <div className="flex items-center gap-1 text-xs text-zinc-500 border border-zinc-200 rounded-lg px-2.5 py-1 bg-zinc-50 cursor-pointer">
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

            {/* SVG Interactive Line Chart Graphics */}
            <div className="relative w-full h-[210px] mt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Horizontal Gridlines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="180" x2="500" y2="180" stroke="#e2e8f0" />

                {/* Y Axis Labels */}
                <text x="5" y="25" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">250K</text>
                <text x="5" y="65" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">200K</text>
                <text x="5" y="105" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">150K</text>
                <text x="5" y="145" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">100K</text>

                {/* Revenue Line (Yellow/Gold) */}
                <polyline
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  points="40,150 90,120 140,90 190,85 240,40 290,65 340,45 390,55 440,80 490,95"
                />

                {/* Revenue Dots */}
                {[
                  { x: 40, y: 150 }, { x: 90, y: 120 }, { x: 140, y: 90 }, { x: 190, y: 85 },
                  { x: 240, y: 40 }, { x: 290, y: 65 }, { x: 340, y: 45 }, { x: 390, y: 55 },
                  { x: 440, y: 80 }, { x: 490, y: 95 }
                ].map((pt, idx) => (
                  <circle key={`rev-${idx}`} cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#f5c518" strokeWidth="2.5" />
                ))}

                {/* Expenses Line (Red) */}
                <polyline
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2.5"
                  points="40,175 90,160 140,140 190,125 240,110 290,115 340,130 390,145 440,165 490,175"
                />

                {/* Expenses Dots */}
                {[
                  { x: 40, y: 175 }, { x: 90, y: 160 }, { x: 140, y: 140 }, { x: 190, y: 125 },
                  { x: 240, y: 110 }, { x: 290, y: 115 }, { x: 340, y: 130 }, { x: 390, y: 145 },
                  { x: 440, y: 165 }, { x: 490, y: 175 }
                ].map((pt, idx) => (
                  <circle key={`exp-${idx}`} cx={pt.x} cy={pt.y} r="3.5" fill="#ffffff" stroke="#dc2626" strokeWidth="2" />
                ))}
              </svg>
            </div>

            {/* X-Axis Month Labels */}
            <div className="flex justify-between items-center px-6 text-[11px] font-semibold text-zinc-400 mt-2">
              <span>8 مايو</span>
              <span>15 مايو</span>
              <span>21 مايو</span>
              <span>26 مايو</span>
              <span>31 مايو</span>
            </div>
          </div>
        </div>

        {/* Left Widget: Recent Notifications (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-extrabold text-zinc-900 font-cairo">الإشعارات الحديثة</h3>
              <Bell className="h-4.5 w-4.5 text-zinc-400" />
            </div>

            <div className="space-y-4">
              {RECENT_NOTIFICATIONS.map((notif, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 text-right">
                  <div className="h-9 w-9 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center shrink-0">
                    <Bell className="h-4 w-4 text-zinc-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900 font-cairo truncate">{notif.title}</p>
                    <p className="text-[11px] font-medium text-zinc-500 truncate">{notif.sub}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-semibold text-zinc-400">{notif.time}</span>
                    <span className={cn("h-1.5 w-1.5 rounded-full", notif.dotColor)} />
                  </div>
                </div>
              ))}
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
                <th className="pb-3">الفرع</th>
                <th className="pb-3">نوع الاشتراك</th>
                <th className="pb-3">تاريخ الانتهاء</th>
                <th className="pb-3">المبلغ/هـ</th>
                <th className="pb-3 text-center">الحالة</th>
                <th className="pb-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {RECENT_SUBSCRIPTIONS.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                  {/* Member Name */}
                  <td className="py-3.5 font-bold text-zinc-900 font-cairo">{row.member}</td>

                  {/* Branch */}
                  <td className="py-3.5 font-medium text-zinc-700">{row.branch}</td>

                  {/* Start date / type */}
                  <td className="py-3.5 text-zinc-600 font-mono text-xs">{row.startDate}</td>

                  {/* End date */}
                  <td className="py-3.5 text-zinc-600 font-mono text-xs">{row.endDate}</td>

                  {/* Amount */}
                  <td className="py-3.5 font-bold text-zinc-900 font-mono">{row.amount}</td>

                  {/* Status Badge */}
                  <td className="py-3.5 text-center">
                    {row.statusVariant === "active" && (
                      <span className="inline-block px-3 py-1 text-xs font-bold text-amber-800 bg-amber-200/60 rounded-md border border-amber-300">
                        نشط
                      </span>
                    )}
                    {row.statusVariant === "pending" && (
                      <span className="inline-block px-3 py-1 text-xs font-bold text-rose-800 bg-rose-200/60 rounded-md border border-rose-300">
                        معلق
                      </span>
                    )}
                    {row.statusVariant === "expired" && (
                      <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-red-600 rounded-md">
                        منتهي
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 text-center">
                    <button className="h-8 w-8 rounded-lg border border-zinc-200 bg-white flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-colors mx-auto">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
