"use client";

import { useState } from "react";
import {
  Bell, Send, CheckCircle2, RefreshCw, XCircle,
  CreditCard, DollarSign, UserPlus, BarChart3, Settings2, Info,
  ChevronLeft, ChevronRight, CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useNotifications, useMarkAllNotificationsAsRead,
  useMarkNotificationAsRead, useUnreadNotificationsCount,
} from "@/features/owner/hooks/useNotifications";
import type { NotificationDto, NotificationType } from "@/features/owner/types";

function notifIcon(type: NotificationType) {
  switch (type) {
    case "Subscription": return { Icon: CreditCard, bg: "bg-emerald-100 text-emerald-600" };
    case "Payment":      return { Icon: DollarSign, bg: "bg-sky-100 text-sky-600" };
    case "Member":       return { Icon: UserPlus, bg: "bg-purple-100 text-purple-600" };
    case "Security":     return { Icon: Settings2, bg: "bg-amber-100 text-amber-600" };
    default:             return { Icon: BarChart3, bg: "bg-zinc-100 text-zinc-600" };
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${Math.floor(hours / 24)} يوم`;
}

export default function BranchNotificationsPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetAudience, setTargetAudience] = useState("members");
  const [sentSuccess, setSentSuccess] = useState(false);
  const pageSize = 15;

  const { data, isLoading, error, refetch } = useNotifications({ pageNumber, pageSize });
  const { data: unreadCount } = useUnreadNotificationsCount();
  const markAllMutation = useMarkAllNotificationsAsRead();
  const markOneMutation = useMarkNotificationAsRead();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    // Broadcast endpoint — wire when available
    setSentSuccess(true);
    setTitle("");
    setMessage("");
    setTimeout(() => setSentSuccess(false), 4000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 dir-rtl font-tajawal">
        <div className="h-14 w-14 rounded-full border-4 border-amber-200 border-t-gym-yellow animate-spin" />
        <p className="text-sm font-bold text-zinc-500 font-cairo">جاري تحميل الإشعارات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 dir-rtl text-center p-8 bg-white rounded-3xl border border-zinc-200 max-w-lg mx-auto">
        <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
          <XCircle className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900 font-cairo">تعذّر تحميل الإشعارات</h3>
          <p className="text-xs text-zinc-500 mt-1">{(error as Error)?.message}</p>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-bold text-xs px-6 py-3 rounded-xl cursor-pointer">
          <RefreshCw className="h-4 w-4" />إعادة المحاولة
        </button>
      </div>
    );
  }

  const notifications = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;

  return (
    <div className="space-y-6 max-w-[1300px] mx-auto dir-rtl font-tajawal pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
            <span>الإشعارات</span><span>‹</span><span>الرئيسية</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">مركز إشعارات الفرع</h1>
        </div>
        <button
          onClick={() => markAllMutation.mutate()}
          disabled={markAllMutation.isPending}
          className="flex items-center gap-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-cairo font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          {markAllMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCheck className="h-4 w-4 text-emerald-600" />}
          <span>تحديد الكل كمعاين</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send Broadcast */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-xs space-y-5 text-right">
          <div className="flex items-center gap-2 border-r-4 border-gym-yellow pr-3">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo">إرسال إشعار للفرع</h2>
          </div>

          {sentSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>تم إرسال الإشعار بنجاح!</span>
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 font-cairo">المستهدفون</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-800 focus:outline-none focus:border-gym-yellow focus:bg-white focus:ring-2 focus:ring-gym-yellow/15 transition-all"
              >
                <option value="members">كل أعضاء الفرع</option>
                <option value="staff">كل موظفي الفرع</option>
                <option value="all">الجميع بالفرع</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 font-cairo">عنوان الإشعار</label>
              <input
                type="text" required placeholder="عنوان التنبيه..." value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-900 focus:outline-none focus:border-gym-yellow focus:bg-white focus:ring-2 focus:ring-gym-yellow/15 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-700 font-cairo">نص الرسالة</label>
              <textarea
                rows={4} required placeholder="اكتب نص الإشعار هنا..." value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-900 focus:outline-none focus:border-gym-yellow focus:bg-white focus:ring-2 focus:ring-gym-yellow/15 transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs px-6 py-3 rounded-xl shadow-xs transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Send className="h-4 w-4" />إرسال الإشعار
            </button>
          </form>

          <div className="flex items-start gap-2 p-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-[11px] font-medium text-zinc-500">
            <Info className="h-3.5 w-3.5 text-zinc-400 mt-0.5 shrink-0" />
            <span>سيتم ربط الإرسال بالباك إند عند توفر الـ endpoint الخاص بالإشعارات الجماعية.</span>
          </div>
        </div>

        {/* Notifications Feed */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              {(unreadCount ?? 0) > 0 && (
                <span className="h-6 w-6 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-black text-zinc-900 font-cairo">الإشعارات الواردة ({totalCount})</h3>
            </div>
          </div>

          <div className="divide-y divide-zinc-50">
            {notifications.length === 0 ? (
              <div className="py-16 text-center">
                <Bell className="h-10 w-10 text-zinc-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-zinc-400 font-cairo">لا توجد إشعارات حالياً</p>
              </div>
            ) : notifications.map((n: NotificationDto) => {
              const { Icon, bg } = notifIcon(n.type);
              return (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && markOneMutation.mutate(n.id)}
                  className={cn(
                    "flex items-start gap-4 px-6 py-4 cursor-pointer transition-colors",
                    !n.isRead ? "bg-amber-50/50 hover:bg-amber-50" : "hover:bg-zinc-50/60"
                  )}
                >
                  {!n.isRead && <span className="h-2 w-2 rounded-full bg-red-500 mt-2.5 shrink-0" />}
                  <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center shrink-0", bg)}>
                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 text-right min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-zinc-400 font-mono">{timeAgo(n.createdAt)}</span>
                      <h4 className={cn("text-sm font-bold font-cairo", !n.isRead ? "text-zinc-900" : "text-zinc-700")}>{n.title}</h4>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed line-clamp-2">{n.message}</p>
                  </div>
                  <span className={cn("shrink-0 px-2.5 py-1 text-[10px] font-bold rounded-lg mt-1",
                    !n.isRead ? "bg-amber-200/60 text-amber-800 border border-amber-300" : "bg-zinc-100 text-zinc-500"
                  )}>
                    {!n.isRead ? "جديد" : "قُرئ"}
                  </span>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 text-xs font-medium text-zinc-500">
              <span>صفحة {pageNumber} من {totalPages}</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber === 1}
                  className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 cursor-pointer disabled:opacity-40">
                  <ChevronRight className="h-4 w-4" />
                </button>
                <span className="h-8 px-3 rounded-lg bg-gym-yellow text-gym-black font-black flex items-center">{pageNumber}</span>
                <button onClick={() => setPageNumber(p => Math.min(totalPages, p + 1))} disabled={pageNumber === totalPages}
                  className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 cursor-pointer disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
