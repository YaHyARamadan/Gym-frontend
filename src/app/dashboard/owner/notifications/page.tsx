"use client";

import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Settings,
  Search,
  CreditCard,
  DollarSign,
  Clock,
  UserPlus,
  BarChart3,
  XCircle,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock Notifications matching reference image 1
const NOTIFICATIONS_DATA = [
  {
    id: 1,
    title: "تم تجديد اشتراك",
    sub: "تم تجديد اشتراك المشترك محمد علي في فرع مدينة نصر لمدة 3 أشهر.",
    time: "منذ 5 دقائق",
    fullTime: "21 مايو 2024 - 11:35 ص",
    unread: true,
    category: "subscriptions",
    icon: CreditCard,
    iconBg: "bg-emerald-100 text-emerald-600",
  },
  {
    id: 2,
    title: "دفعة جديدة",
    sub: "تم استلام دفعة جديدة من أحمد خالد بمبلغ 1,200 ج.م.",
    time: "منذ 25 دقيقة",
    fullTime: "21 مايو 2024 - 11:15 ص",
    unread: true,
    category: "payments",
    icon: DollarSign,
    iconBg: "bg-sky-100 text-sky-600",
  },
  {
    id: 3,
    title: "اشتراك على وشك الانتهاء",
    sub: "ينتهي اشتراك سارة عصام في فرع المعادي خلال 2 أيام.",
    time: "منذ ساعة",
    fullTime: "21 مايو 2024 - 10:40 ص",
    unread: true,
    category: "subscriptions",
    icon: Clock,
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    id: 4,
    title: "موظف جديد",
    sub: "تم إضافة موظف جديد باسم نورهان سعيد في فرع أكتوبر.",
    time: "منذ ساعتين",
    fullTime: "21 مايو 2024 - 09:30 ص",
    unread: false,
    category: "system",
    icon: UserPlus,
    iconBg: "bg-purple-100 text-purple-600",
  },
  {
    id: 5,
    title: "تحديث نظام",
    sub: "تم تحديث النظام إلى الإصدار 2.4.0 بنجاح.",
    time: "منذ 3 ساعات",
    fullTime: "21 مايو 2024 - 08:15 ص",
    unread: false,
    category: "system",
    icon: Settings,
    iconBg: "bg-zinc-200 text-zinc-700",
  },
  {
    id: 6,
    title: "تقرير يومي جاهز",
    sub: "التقرير اليومي للمبيعات والمدفوعات متاح الآن.",
    time: "منذ يوم",
    fullTime: "20 مايو 2024 - 07:45 م",
    unread: false,
    category: "system",
    icon: BarChart3,
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    id: 7,
    title: "تم إلغاء اشتراك",
    sub: "تم إلغاء اشتراك المشترك هند محمد في فرع التجمع.",
    time: "منذ يومين",
    fullTime: "19 مايو 2024 - 06:20 م",
    unread: false,
    category: "subscriptions",
    icon: XCircle,
    iconBg: "bg-rose-100 text-rose-600",
  },
];

export default function NotificationsPage() {
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotifs = NOTIFICATIONS_DATA.filter((n) => {
    if (filterTab === "unread" && !n.unread) return false;
    if (filterTab === "read" && n.unread) return false;
    if (searchQuery) {
      return n.title.includes(searchQuery) || n.sub.includes(searchQuery);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* ── Top Header & Action Controls ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Controls: Filter Tabs, Mark all as read, Settings */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Settings button */}
          <Link
            href="/dashboard/owner/settings"
            className="flex items-center gap-2 h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            <Settings className="h-4 w-4 text-zinc-500" />
            <span>إعدادات الإشعارات</span>
          </Link>

          {/* Mark all as read */}
          <button className="flex items-center gap-2 h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
            <CheckCheck className="h-4 w-4 text-zinc-500" />
            <span>تحديد الكل كمقروء</span>
          </button>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-bold">
            <button
              onClick={() => setFilterTab("read")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5",
                filterTab === "read" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              <span>16</span>
              <span>مقروءة</span>
            </button>

            <button
              onClick={() => setFilterTab("unread")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5",
                filterTab === "unread" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-red-600">8</span>
              <span>غير مقروءة</span>
            </button>

            <button
              onClick={() => setFilterTab("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5",
                filterTab === "all" ? "bg-gym-yellow text-gym-black font-extrabold shadow-xs" : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              <span>24</span>
              <span>الكل</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-right flex items-center gap-3 mr-auto sm:mr-0">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
              <span>الإشعارات</span>
              <span>‹</span>
              <span>الرئيسية</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">
              الإشعارات
            </h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
            <Bell className="h-6 w-6" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* ── Main Content Grid (Left Summary Sidebar + Right Feed List) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Right Section: Notifications Table List (9 cols) */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
          
          {/* Search Bar inside container */}
          <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
            <div className="relative w-full">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="ابحث في الإشعارات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pr-10 pl-4 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20"
              />
            </div>
          </div>

          {/* Notifications Table Header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 border-b border-zinc-100 bg-zinc-50 text-xs font-bold text-zinc-400 font-cairo text-right">
            <div className="col-span-7">الإشعار</div>
            <div className="col-span-3">الوقت</div>
            <div className="col-span-2 text-center">الحالة</div>
          </div>

          {/* Notifications Feed Rows */}
          <div className="divide-y divide-zinc-100">
            {filteredNotifs.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "grid grid-cols-1 sm:grid-cols-12 gap-4 px-6 py-4 items-center transition-colors text-right",
                    item.unread ? "bg-amber-50/20 hover:bg-amber-50/40" : "hover:bg-zinc-50/80"
                  )}
                >
                  {/* Icon + Title + Sub text */}
                  <div className="col-span-1 sm:col-span-7 flex items-start gap-3.5">
                    <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 mt-0.5", item.iconBg)}>
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>

                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-zinc-900 font-cairo">{item.title}</h4>
                        {item.unread && <span className="h-2 w-2 rounded-full bg-red-500 shrink-0 sm:hidden" />}
                      </div>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed">{item.sub}</p>
                    </div>
                  </div>

                  {/* Relative Time & Timestamp */}
                  <div className="col-span-1 sm:col-span-3 text-xs space-y-0.5">
                    <p className="font-bold text-zinc-700">{item.time}</p>
                    <p className="text-[11px] text-zinc-400 font-mono">{item.fullTime}</p>
                  </div>

                  {/* Read / Unread Status Badge */}
                  <div className="col-span-1 sm:col-span-2 flex justify-start sm:justify-center items-center">
                    {item.unread ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                        غير مقروءة
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        مقروءة
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-zinc-100 bg-white text-xs font-medium text-zinc-500">
            <div className="flex items-center gap-2">
              <span>لكل صفحة</span>
              <select className="h-8 px-2 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 focus:outline-none">
                <option>7</option>
                <option>14</option>
                <option>21</option>
              </select>
              <span>عرض 1 - 7 من 24 إشعار</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 cursor-pointer">
                <ChevronRight className="h-4 w-4" />
              </button>
              <button className="h-8 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 cursor-pointer">3</button>
              <button className="h-8 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 cursor-pointer">2</button>
              <button className="h-8 px-3 rounded-lg bg-gym-yellow text-gym-black font-black shadow-xs cursor-pointer">1</button>
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 cursor-pointer">
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Left Section: Notifications Summary Sidebar Widget (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-zinc-200 p-6 shadow-xs space-y-6 text-right">
          <h3 className="text-base font-extrabold text-zinc-900 font-cairo">ملخص الإشعارات</h3>

          <div className="space-y-4">
            {/* Category 1: Unread */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/50 border border-rose-100">
              <span className="text-2xl font-black text-rose-700 font-cairo">8</span>
              <div className="text-right">
                <p className="text-xs font-bold text-rose-900 font-cairo">غير مقروءة</p>
                <p className="text-[10px] font-semibold text-rose-600">تحتاج إلى انتباهك</p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                <Bell className="h-4.5 w-4.5" />
              </div>
            </div>

            {/* Category 2: Subscriptions */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
              <span className="text-2xl font-black text-zinc-900 font-cairo">6</span>
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-800 font-cairo">اشتراكات</p>
                <p className="text-[10px] font-semibold text-zinc-400">تجديدات واشتراكات</p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CreditCard className="h-4.5 w-4.5" />
              </div>
            </div>

            {/* Category 3: Payments */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
              <span className="text-2xl font-black text-zinc-900 font-cairo">5</span>
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-800 font-cairo">مدفوعات</p>
                <p className="text-[10px] font-semibold text-zinc-400">مدفوعات وإيصالات</p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                <DollarSign className="h-4.5 w-4.5" />
              </div>
            </div>

            {/* Category 4: System */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
              <span className="text-2xl font-black text-zinc-900 font-cairo">5</span>
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-800 font-cairo">النظام</p>
                <p className="text-[10px] font-semibold text-zinc-400">تحديثات وتنبيهات</p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                <Settings className="h-4.5 w-4.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Notice Banner ── */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-amber-950">
        <div className="flex items-center gap-3">
          <Info className="h-5 w-5 text-amber-600 shrink-0" />
          <span>يمكنك تخصيص الإشعارات التي ترغب في استقبالها من خلال إعدادات الإشعارات.</span>
        </div>

        <Link
          href="/dashboard/owner/settings"
          className="bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
        >
          إعدادات الإشعارات
        </Link>
      </div>
    </div>
  );
}
