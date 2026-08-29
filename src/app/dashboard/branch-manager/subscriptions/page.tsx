"use client";

import { useState } from "react";
import {
  CreditCard, Search, RefreshCw, XCircle, PauseCircle,
  PlayCircle, XOctagon, RotateCw, ChevronLeft, ChevronRight, Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useSubscriptions, useRenewSubscription, useFreezeSubscription,
  useResumeSubscription, useCancelSubscription,
} from "@/features/owner/hooks/useSubscriptions";
import type { SubscriptionStatus } from "@/features/owner/types";

const STATUS_CONFIG: Record<SubscriptionStatus, { label: string; className: string }> = {
  Active:    { label: "نشط",    className: "bg-emerald-100 text-emerald-800 border border-emerald-200" },
  Frozen:    { label: "مجمّد",  className: "bg-sky-100 text-sky-800 border border-sky-200" },
  Expired:   { label: "منتهي", className: "bg-red-100 text-red-700 border border-red-200" },
  Cancelled: { label: "ملغى",  className: "bg-zinc-100 text-zinc-600 border border-zinc-200" },
  Pending:   { label: "معلّق", className: "bg-amber-100 text-amber-800 border border-amber-200" },
};

export default function BranchSubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 12;

  const { data, isLoading, error, refetch } = useSubscriptions({
    searchTerm: searchQuery || undefined,
    status: statusFilter || undefined,
    pageNumber,
    pageSize,
  });

  const renewMutation = useRenewSubscription();
  const freezeMutation = useFreezeSubscription();
  const resumeMutation = useResumeSubscription();
  const cancelMutation = useCancelSubscription();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 dir-rtl font-tajawal">
        <div className="h-14 w-14 rounded-full border-4 border-amber-200 border-t-gym-yellow animate-spin" />
        <p className="text-sm font-bold text-zinc-500 font-cairo">جاري تحميل اشتراكات الفرع...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 dir-rtl font-tajawal text-center p-8 bg-white rounded-3xl border border-zinc-200 max-w-lg mx-auto">
        <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
          <XCircle className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900 font-cairo">تعذّر تحميل الاشتراكات</h3>
          <p className="text-xs text-zinc-500 mt-1">{(error as Error)?.message}</p>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-bold text-xs px-6 py-3 rounded-xl cursor-pointer">
          <RefreshCw className="h-4 w-4" />إعادة المحاولة
        </button>
      </div>
    );
  }

  const subscriptions = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
            <span>الاشتراكات</span><span>‹</span><span>الرئيسية</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">اشتراكات الفرع</h1>
          <p className="text-xs text-zinc-400 mt-0.5">{totalCount} اشتراك إجمالاً</p>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="ابحث باسم العضو، الخطة، أو الرقم..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPageNumber(1); }}
              className="w-full h-11 pr-10 pl-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:bg-white focus:ring-2 focus:ring-gym-yellow/15 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-zinc-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPageNumber(1); }}
              className="h-11 px-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/15 cursor-pointer transition-all"
            >
              <option value="">كل الحالات</option>
              <option value="Active">نشط</option>
              <option value="Frozen">مجمّد</option>
              <option value="Expired">منتهي</option>
              <option value="Cancelled">ملغى</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        {subscriptions.length === 0 ? (
          <div className="py-16 text-center text-zinc-400 text-sm font-bold font-cairo">
            لا توجد اشتراكات مطابقة للفلتر الحالي
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-black text-zinc-400 font-cairo uppercase tracking-wide">
                  <th className="py-4 px-5">العضو</th>
                  <th className="py-4 px-5">الخطة</th>
                  <th className="py-4 px-5 text-center">البداية</th>
                  <th className="py-4 px-5 text-center">الانتهاء</th>
                  <th className="py-4 px-5 text-center">الحالة</th>
                  <th className="py-4 px-5 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {subscriptions.map((sub) => {
                  const cfg = STATUS_CONFIG[sub.status] ?? STATUS_CONFIG.Pending;
                  return (
                    <tr key={sub.id} className="hover:bg-zinc-50/60 transition-colors group">
                      <td className="py-4 px-5">
                        <p className="text-sm font-bold text-zinc-900 font-cairo group-hover:text-gym-black transition-colors">{sub.memberFullName}</p>
                        <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{sub.memberNumber}</p>
                      </td>
                      <td className="py-4 px-5 text-xs font-bold text-zinc-700">{sub.planName}</td>
                      <td className="py-4 px-5 text-center text-xs text-zinc-500 font-mono">
                        {new Date(sub.startDate).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="py-4 px-5 text-center text-xs text-zinc-500 font-mono">
                        {new Date(sub.endDate).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span className={cn("inline-block px-3 py-1 text-[11px] font-bold rounded-lg", cfg.className)}>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {sub.status === "Active" && (
                            <>
                              <button
                                onClick={() => freezeMutation.mutate(sub.id)}
                                disabled={freezeMutation.isPending}
                                className="h-8 px-3 rounded-lg border border-sky-200 bg-sky-50 text-[11px] font-bold text-sky-700 hover:bg-sky-100 flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
                              >
                                <PauseCircle className="h-3.5 w-3.5" /><span>تجميد</span>
                              </button>
                              <button
                                onClick={() => cancelMutation.mutate(sub.id)}
                                disabled={cancelMutation.isPending}
                                className="h-8 px-3 rounded-lg border border-red-200 bg-red-50 text-[11px] font-bold text-red-600 hover:bg-red-100 flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
                              >
                                <XOctagon className="h-3.5 w-3.5" /><span>إلغاء</span>
                              </button>
                            </>
                          )}
                          {sub.status === "Frozen" && (
                            <button
                              onClick={() => resumeMutation.mutate(sub.id)}
                              disabled={resumeMutation.isPending}
                              className="h-8 px-3 rounded-lg bg-gym-yellow hover:bg-amber-400 text-gym-black text-[11px] font-black flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-xs transition-all"
                            >
                              <PlayCircle className="h-3.5 w-3.5" /><span>استئناف</span>
                            </button>
                          )}
                          {sub.status === "Expired" && (
                            <button
                              onClick={() => renewMutation.mutate({ subscriptionId: sub.id })}
                              disabled={renewMutation.isPending}
                              className="h-8 px-3 rounded-lg bg-gym-yellow hover:bg-amber-400 text-gym-black text-[11px] font-black flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-xs transition-all"
                            >
                              <RotateCw className="h-3.5 w-3.5" /><span>تجديد</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-100 text-xs font-medium text-zinc-500">
            <span>عرض {subscriptions.length} من {totalCount} اشتراك</span>
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
  );
}
