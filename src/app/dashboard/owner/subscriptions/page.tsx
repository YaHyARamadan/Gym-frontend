"use client";

import { useState } from "react";
import {
  CreditCard,
  UserCheck,
  UserX,
  Clock,
  DollarSign,
  Search,
  Filter,
  Download,
  MoreVertical,
  RefreshCw,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubscriptions, useRenewSubscription, useFreezeSubscription, useCancelSubscription } from "@/features/owner/hooks/useSubscriptions";
import type { SubscriptionStatus } from "@/features/owner/types";

function statusLabel(status: SubscriptionStatus): string {
  const map: Record<SubscriptionStatus, string> = {
    Active: "نشط",
    Expired: "منتهي",
    Frozen: "مجمّد",
    Cancelled: "ملغى",
    Pending: "معلق",
  };
  return map[status] ?? status;
}

function statusClass(status: SubscriptionStatus): string {
  switch (status) {
    case "Active":    return "text-amber-800 bg-amber-200/60 border border-amber-300";
    case "Expired":   return "text-white bg-red-600";
    case "Frozen":    return "text-blue-800 bg-blue-200/60 border border-blue-300";
    case "Cancelled": return "text-zinc-700 bg-zinc-200";
    case "Pending":   return "text-rose-800 bg-rose-200/60 border border-rose-300";
    default:          return "text-zinc-700 bg-zinc-200";
  }
}

export default function SubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20;

  const { data, isLoading, error, refetch } = useSubscriptions({
    searchTerm: searchQuery || undefined,
    pageNumber,
    pageSize,
  });

  const renewMutation = useRenewSubscription();
  const freezeMutation = useFreezeSubscription();
  const cancelMutation = useCancelSubscription();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 dir-rtl font-tajawal">
        <RefreshCw className="h-8 w-8 text-gym-yellow animate-spin" />
        <p className="text-sm font-bold text-zinc-600 font-cairo">جاري تحميل بيانات الاشتراكات...</p>
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
          <h3 className="text-base font-bold text-zinc-900 font-cairo">حدث خطأ أثناء تحميل الاشتراكات</h3>
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

  const subs = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const activeCount = subs.filter((s) => s.status === "Active").length;
  const expiredCount = subs.filter((s) => s.status === "Expired").length;
  const frozenCount = subs.filter((s) => s.status === "Frozen").length;
  const pendingCount = subs.filter((s) => s.status === "Pending" || s.status === "Cancelled").length;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* ── Top Header / Breadcrumb ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-right flex items-center gap-3 mr-auto">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
              <span>الاشتراكات</span>
              <span>‹</span>
              <span>الرئيسية</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">
              الاشتراكات
            </h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
            <CreditCard className="h-6 w-6" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* ── 5 Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي الاشتراكات</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{totalCount.toLocaleString()}</p>
            <p className="text-xs font-bold text-zinc-500 mt-1">اشتراك</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
            <CreditCard className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">اشتراكات نشطة</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{activeCount}</p>
            <p className="text-xs font-bold text-amber-600 mt-1">نشط الآن</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <UserCheck className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">اشتراكات منتهية</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{expiredCount}</p>
            <p className="text-xs font-bold text-red-600 mt-1">منتهية</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <UserX className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">اشتراكات مجمّدة</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{frozenCount}</p>
            <p className="text-xs font-bold text-rose-700 mt-1">مجمّدة</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
            <Clock className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between border-b-4 border-b-amber-400">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">معلقة / ملغاة</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{pendingCount}</p>
            <p className="text-xs font-bold text-amber-600 mt-1">اشتراك</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
            <DollarSign className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* ── Filters & Search Bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو رقم العضوية..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPageNumber(1); }}
              className="w-full h-11 pr-10 pl-4 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20"
            />
          </div>

          <select className="h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none">
            <option>كل الخطط</option>
          </select>

          <select className="h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none">
            <option>كل الحالات</option>
          </select>

          <select className="h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none">
            <option>كل الفروع</option>
          </select>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
            <Filter className="h-4 w-4 text-zinc-500" />
            <span>فلترة</span>
          </button>
          <button className="flex items-center gap-2 h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
            <Download className="h-4 w-4 text-zinc-500" />
            <span>تصدير</span>
          </button>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-bold text-zinc-400 font-cairo">
                <th className="py-4 px-4">المشترك</th>
                <th className="py-4 px-4">رقم العضوية</th>
                <th className="py-4 px-4">الخطة</th>
                <th className="py-4 px-4">تاريخ البداية</th>
                <th className="py-4 px-4">تاريخ الانتهاء</th>
                <th className="py-4 px-4 text-center">الحالة</th>
                <th className="py-4 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {subs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-zinc-400 text-sm font-bold font-cairo">
                    لا يوجد اشتراكات مطابقة للبحث
                  </td>
                </tr>
              ) : (
                subs.map((row) => (
                  <tr key={row.id} className="hover:bg-zinc-50/80 transition-colors">
                    {/* Member Name */}
                    <td className="py-3.5 px-4 font-bold text-zinc-900 font-cairo">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                          {row.memberFullName.charAt(0)}
                        </div>
                        <span>{row.memberFullName}</span>
                      </div>
                    </td>

                    {/* Member Number */}
                    <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs">{row.memberNumber}</td>

                    {/* Plan */}
                    <td className="py-3.5 px-4 text-zinc-700 font-medium">{row.planName}</td>

                    {/* Start Date */}
                    <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs">
                      {new Date(row.startDate).toLocaleDateString("ar-EG")}
                    </td>

                    {/* End Date */}
                    <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs">
                      <span className={cn(row.status === "Expired" && "text-red-500 font-bold")}>
                        {new Date(row.endDate).toLocaleDateString("ar-EG")}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={cn("inline-block px-3 py-1 text-xs font-bold rounded-md", statusClass(row.status))}>
                        {statusLabel(row.status)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {row.status === "Expired" && (
                          <button
                            onClick={() => renewMutation.mutate(row.id)}
                            disabled={renewMutation.isPending}
                            className="px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg border border-amber-300 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            تجديد
                          </button>
                        )}
                        {row.status === "Active" && (
                          <button
                            onClick={() => freezeMutation.mutate(row.id)}
                            disabled={freezeMutation.isPending}
                            className="px-2.5 py-1 text-xs font-bold text-blue-800 bg-blue-100 hover:bg-blue-200 rounded-lg border border-blue-300 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            تجميد
                          </button>
                        )}
                        {(row.status === "Active" || row.status === "Frozen") && (
                          <button
                            onClick={() => cancelMutation.mutate(row.id)}
                            disabled={cancelMutation.isPending}
                            className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 rounded-lg border border-red-300 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            إلغاء
                          </button>
                        )}
                        <button className="h-7 w-7 rounded-lg border border-zinc-200 bg-white flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-colors cursor-pointer">
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-zinc-100 bg-white text-xs font-medium text-zinc-500">
          <span>عرض {subs.length} من {totalCount} اشتراك</span>
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
      </div>
    </div>
  );
}
