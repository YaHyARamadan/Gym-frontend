"use client";

import { useState } from "react";
import {
  Search, RefreshCw, XCircle, RotateCcw, DollarSign,
  TrendingDown, PlusCircle, ChevronLeft, ChevronRight, Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePayments } from "@/features/owner/hooks/usePayments";
import { useRefundPayment } from "@/features/owner/hooks/usePayments";
import { useDashboardOverview } from "@/features/owner/hooks/useReports";

export default function BranchFinancePage() {
  const [activeTab, setActiveTab] = useState<"payments" | "expenses">("payments");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const pageSize = 12;

  const { data: overview } = useDashboardOverview();
  const { data: paymentsData, isLoading, error, refetch } = usePayments({ searchTerm: searchQuery || undefined, pageNumber, pageSize });
  const refundMutation = useRefundPayment();

  const payments = paymentsData?.items ?? [];
  const totalPages = paymentsData?.totalPages ?? 1;
  const totalCount = paymentsData?.totalCount ?? 0;

  const METHOD_LABEL: Record<string, string> = {
    Cash: "نقداً", CreditCard: "بطاقة ائتمان", BankTransfer: "تحويل بنكي", Other: "أخرى",
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 dir-rtl font-tajawal">
        <div className="h-14 w-14 rounded-full border-4 border-amber-200 border-t-gym-yellow animate-spin" />
        <p className="text-sm font-bold text-zinc-500 font-cairo">جاري تحميل الحسابات...</p>
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
          <h3 className="text-base font-bold text-zinc-900 font-cairo">تعذّر تحميل البيانات المالية</h3>
          <p className="text-xs text-zinc-500 mt-1">{(error as Error)?.message}</p>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-bold text-xs px-6 py-3 rounded-xl cursor-pointer">
          <RefreshCw className="h-4 w-4" />إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
            <span>الحسابات</span><span>‹</span><span>الرئيسية</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">حسابات الفرع</h1>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl border border-emerald-200 p-5 text-right shadow-xs">
          <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي الإيرادات</p>
          <p className="text-2xl font-black text-emerald-700 font-cairo mt-1">{(overview?.monthlyRevenue ?? 0).toLocaleString("ar-EG")} ج.م</p>
          <p className="text-[11px] font-bold text-zinc-400 mt-1">هذا الشهر</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-white rounded-3xl border border-red-200 p-5 text-right shadow-xs">
          <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي المصاريف</p>
          <p className="text-2xl font-black text-red-600 font-cairo mt-1">{(overview?.monthlyExpenses ?? 0).toLocaleString("ar-EG")} ج.م</p>
          <p className="text-[11px] font-bold text-zinc-400 mt-1">هذا الشهر</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-white rounded-3xl border border-amber-200 p-5 text-right shadow-xs relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-t-3xl" />
          <p className="text-xs font-bold text-zinc-400 font-cairo">صافي الأرباح</p>
          <p className="text-2xl font-black text-amber-700 font-cairo mt-1">{(overview?.netProfit ?? 0).toLocaleString("ar-EG")} ج.م</p>
          <p className="text-[11px] font-bold text-zinc-400 mt-1">هذا الشهر</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-0">
        <button
          onClick={() => setActiveTab("payments")}
          className={cn("flex items-center gap-2 px-5 py-3 text-xs font-bold font-cairo transition-all cursor-pointer border-b-2 -mb-px", activeTab === "payments" ? "border-gym-yellow text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-700")}
        >
          <DollarSign className="h-4 w-4" />المدفوعات الواردة
        </button>
        <button
          onClick={() => setActiveTab("expenses")}
          className={cn("flex items-center gap-2 px-5 py-3 text-xs font-bold font-cairo transition-all cursor-pointer border-b-2 -mb-px", activeTab === "expenses" ? "border-gym-yellow text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-700")}
        >
          <TrendingDown className="h-4 w-4 text-red-400" />المصاريف
        </button>
      </div>

      {activeTab === "payments" && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-zinc-100">
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="ابحث باسم العضو أو رقم المعاملة..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPageNumber(1); }}
                className="w-full h-11 pr-10 pl-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:bg-white focus:ring-2 focus:ring-gym-yellow/15 transition-all"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-black text-zinc-400 font-cairo uppercase tracking-wide">
                  <th className="py-4 px-5">العضو</th>
                  <th className="py-4 px-5">المبلغ</th>
                  <th className="py-4 px-5 text-center">طريقة الدفع</th>
                  <th className="py-4 px-5 text-center">الحالة</th>
                  <th className="py-4 px-5 text-center">التاريخ</th>
                  <th className="py-4 px-5 text-center">استرجاع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {payments.length === 0 ? (
                  <tr><td colSpan={6} className="py-16 text-center text-zinc-400 text-sm font-bold font-cairo">لا توجد مدفوعات</td></tr>
                ) : payments.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors group">
                    <td className="py-4 px-5">
                      <p className="text-sm font-bold text-zinc-900 font-cairo">{p.memberFullName}</p>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{p.memberNumber}</p>
                    </td>
                    <td className="py-4 px-5 font-black text-emerald-600 font-mono text-sm">
                      +{p.amount.toLocaleString("ar-EG")} ج.م
                    </td>
                    <td className="py-4 px-5 text-center text-xs font-bold text-zinc-600">
                      {METHOD_LABEL[p.paymentMethod] ?? p.paymentMethod}
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={cn("inline-block px-2.5 py-1 text-[10px] font-bold rounded-lg",
                        p.status === "Completed" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                        p.status === "Refunded" ? "bg-zinc-100 text-zinc-600 border border-zinc-200" :
                        "bg-amber-100 text-amber-800 border border-amber-200"
                      )}>
                        {p.status === "Completed" ? "مكتمل" : p.status === "Refunded" ? "مسترجع" : p.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center text-xs text-zinc-500 font-mono">
                      {new Date(p.paidAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="py-4 px-5 text-center">
                      {p.status === "Completed" && (
                        refundingId === p.id ? (
                          <button
                            onClick={() => { refundMutation.mutate({ id: p.id, reason: "طلب مدير الفرع" }); setRefundingId(null); }}
                            disabled={refundMutation.isPending}
                            className="h-8 px-3 rounded-lg bg-red-500 text-white text-[11px] font-black cursor-pointer flex items-center gap-1 mx-auto"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />تأكيد
                          </button>
                        ) : (
                          <button
                            onClick={() => setRefundingId(p.id)}
                            className="h-8 px-3 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-[11px] font-bold text-zinc-700 flex items-center gap-1 mx-auto cursor-pointer transition-colors"
                          >
                            <RotateCcw className="h-3.5 w-3.5 text-zinc-500" />استرجاع
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-100 text-xs font-medium text-zinc-500">
              <span>عرض {payments.length} من {totalCount}</span>
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
      )}

      {activeTab === "expenses" && (
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer">
              <PlusCircle className="h-4 w-4" />تسجيل مصروف جديد
            </button>
            <h3 className="text-base font-black text-zinc-900 font-cairo">المصاريف المسجلة</h3>
          </div>
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-8 text-center text-zinc-400 text-sm font-bold font-cairo">
            <Banknote className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
            <p>سيتم ربط سجلات المصاريف بالباك إند عند توفر الـ endpoint الخاص بها.</p>
            <p className="text-xs text-zinc-400 mt-1">المبلغ الإجمالي للمصاريف: {(overview?.monthlyExpenses ?? 0).toLocaleString("ar-EG")} ج.م</p>
          </div>
        </div>
      )}
    </div>
  );
}
