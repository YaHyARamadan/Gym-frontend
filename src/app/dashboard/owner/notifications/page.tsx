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
  RefreshCw,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead,
  useUnreadNotificationsCount,
} from "@/features/owner/hooks/useNotifications";
import type { NotificationDto, NotificationType } from "@/features/owner/types";

// Icon & color per type
function notifIcon(type: NotificationType) {
  switch (type) {
    case "Subscription": return { Icon: CreditCard, bg: "bg-emerald-100 text-emerald-600" };
    case "Payment":      return { Icon: DollarSign, bg: "bg-sky-100 text-sky-600" };
    case "Member":       return { Icon: UserPlus, bg: "bg-purple-100 text-purple-600" };
    case "Security":     return { Icon: Settings2, bg: "bg-amber-100 text-amber-600" };
    case "System":
    default:             return { Icon: BarChart3, bg: "bg-zinc-200 text-zinc-700" };
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
}

export default function NotificationsPage() {
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error, refetch } = useNotifications({ pageNumber, pageSize });
  const { data: unreadCount } = useUnreadNotificationsCount();
  const markAllMutation = useMarkAllNotificationsAsRead();
  const markOneMutation = useMarkNotificationAsRead();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 dir-rtl font-tajawal">
        <RefreshCw className="h-8 w-8 text-gym-yellow animate-spin" />
        <p className="text-sm font-bold text-zinc-600 font-cairo">جاري تحميل الإشعارات...</p>
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
          <h3 className="text-base font-bold text-zinc-900 font-cairo">حدث خطأ أثناء تحميل الإشعارات</h3>
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

  const allNotifs = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const readCount = allNotifs.filter((n) => n.isRead).length;
  const unreadPageCount = allNotifs.filter((n) => !n.isRead).length;

  const filteredNotifs = allNotifs.filter((n: NotificationDto) => {
    if (filterTab === "unread" && n.isRead) return false;
    if (filterTab === "read" && !n.isRead) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q);
    }
    return true;
  });

  // Summary counts for sidebar
  const countByType = (type: NotificationType) =>
    allNotifs.filter((n) => n.type === type).length;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* ── Top Header & Action Controls ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/dashboard/owner/settings"
            className="flex items-center gap-2 h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            <Settings className="h-4 w-4 text-zinc-500" />
            <span>إعدادات الإشعارات</span>
          </Link>

          <button
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
            className="flex items-center gap-2 h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            {markAllMutation.isPending
              ? <RefreshCw className="h-4 w-4 animate-spin" />
              : <CheckCheck className="h-4 w-4 text-zinc-500" />
            }
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
              <span>{readCount}</span>
              <span>مقروءة</span>
            </button>

            <button
              onClick={() => setFilterTab("unread")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5",
                filterTab === "unread" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              {(unreadCount ?? unreadPageCount) > 0 && (
                <span className="h-4.5 w-4.5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                  {unreadCount ?? unreadPageCount}
                </span>
              )}
              <span>غير مقروءة</span>
            </button>

            <button
              onClick={() => setFilterTab("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5",
                filterTab === "all" ? "bg-white text-zinc-900 shadow-xs" : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              <span>{totalCount}</span>
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
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">الإشعارات</h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 relative">
            <Bell className="h-6 w-6" strokeWidth={1.8} />
            {(unreadCount ?? 0) > 0 && (
              <span className="absolute -top-1 -left-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Main 2-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Notification Feed (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="ابحث في الإشعارات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pr-10 pl-4 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20"
            />
          </div>

          {/* Notification Cards */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs divide-y divide-zinc-100 overflow-hidden">
            {filteredNotifs.length === 0 ? (
              <div className="py-16 text-center text-zinc-400 text-sm font-bold font-cairo">
                لا يوجد إشعارات مطابقة
              </div>
            ) : (
              filteredNotifs.map((n) => {
                const { Icon, bg } = notifIcon(n.type);
                return (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && markOneMutation.mutate(n.id)}
                    className={cn(
                      "flex items-start gap-4 p-5 cursor-pointer transition-colors",
                      !n.isRead ? "bg-amber-50/40 hover:bg-amber-50" : "hover:bg-zinc-50/80"
                    )}
                  >
                    {/* Unread dot */}
                    <div className="flex flex-col items-center gap-1 mt-1 shrink-0">
                      {!n.isRead && <span className="h-2 w-2 rounded-full bg-red-500" />}
                    </div>

                    {/* Icon */}
                    <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center shrink-0", bg)}>
                      <Icon className="h-5 w-5" strokeWidth={1.8} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-right min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] text-zinc-400 font-mono whitespace-nowrap">
                          {timeAgo(n.createdAt)}
                        </span>
                        <h4 className={cn("text-sm font-bold font-cairo", !n.isRead ? "text-zinc-900" : "text-zinc-700")}>
                          {n.title}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">{n.message}</p>
                    </div>

                    {/* Status badge */}
                    <div className="shrink-0 mt-1">
                      {!n.isRead ? (
                        <span className="inline-block px-2.5 py-1 text-[10px] font-bold text-amber-800 bg-amber-200/60 rounded-md border border-amber-300">
                          غير مقروءة
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 text-[10px] font-bold text-zinc-500 bg-zinc-100 rounded-md">
                          مقروءة
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs font-medium text-zinc-500 pt-1">
              <span>عرض {filteredNotifs.length} من {totalCount} إشعار</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                  disabled={pageNumber === 1}
                  className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 cursor-pointer disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <span className="h-8 px-3 rounded-lg bg-gym-yellow text-gym-black font-black flex items-center">
                  {pageNumber}
                </span>
                <button
                  onClick={() => setPageNumber((p) => Math.min(totalPages, p + 1))}
                  disabled={pageNumber === totalPages}
                  className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Summary Sidebar (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs space-y-4 text-right">
            <h3 className="text-base font-extrabold text-zinc-900 font-cairo">ملخص الإشعارات</h3>
            <div className="space-y-3">
              {[
                {
                  label: "غير مقروءة",
                  sub: "تحتاج إلى انتباهك",
                  count: unreadCount ?? unreadPageCount,
                  color: "text-red-500",
                  dot: "bg-red-500",
                },
                {
                  label: "اشتراكات",
                  sub: "تجديدات واشتراكات",
                  count: countByType("Subscription"),
                  color: "text-emerald-600",
                  dot: "bg-emerald-500",
                },
                {
                  label: "مدفوعات",
                  sub: "مدفوعات وإيصالات",
                  count: countByType("Payment"),
                  color: "text-sky-600",
                  dot: "bg-sky-500",
                },
                {
                  label: "النظام",
                  sub: "تحديثات وتنبيهات",
                  count: countByType("System"),
                  color: "text-zinc-600",
                  dot: "bg-zinc-400",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="text-right">
                    <p className="text-xs font-bold text-zinc-700">{item.label}</p>
                    <p className="text-[10px] text-zinc-400">{item.sub}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className={cn("text-xl font-black font-cairo", item.color)}>{item.count}</p>
                    <span className={cn("h-2.5 w-2.5 rounded-full", item.dot)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs font-semibold text-amber-950 text-right">
            <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <span>يمكنك تخصيص الإشعارات التي ترغب في استقبالها من خلال إعدادات الإشعارات.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
