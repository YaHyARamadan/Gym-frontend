"use client";

import { useState } from "react";
import {
  Users,
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
import { useMembers } from "@/features/owner/hooks/useMembers";

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 20;

  const { data, isLoading, error, refetch } = useMembers({
    searchTerm: searchQuery || undefined,
    pageNumber,
    pageSize,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 dir-rtl font-tajawal">
        <RefreshCw className="h-8 w-8 text-gym-yellow animate-spin" />
        <p className="text-sm font-bold text-zinc-600 font-cairo">جاري تحميل بيانات المشتركين...</p>
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
          <h3 className="text-base font-bold text-zinc-900 font-cairo">حدث خطأ أثناء تحميل المشتركين</h3>
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

  const members = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const activeCount = members.filter((m) => m.isActive).length;
  const inactiveCount = members.filter((m) => !m.isActive).length;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* ── Top Header / Breadcrumb ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-right flex items-center gap-3 mr-auto">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
              <span>المشتركين</span>
              <span>‹</span>
              <span>الرئيسية</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">
              المشتركين
            </h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
            <Users className="h-6 w-6" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* ── 5 Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي المشتركين</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{totalCount.toLocaleString()}</p>
            <p className="text-xs font-bold text-zinc-500 mt-1">مشترك</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
            <Users className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">مشتركين نشطين</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{activeCount}</p>
            <p className="text-xs font-bold text-amber-600 mt-1">
              {totalCount > 0 ? Math.round((activeCount / members.length) * 100) : 0}% من الصفحة الحالية
            </p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <UserCheck className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">مشتركين غير نشطين</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{inactiveCount}</p>
            <p className="text-xs font-bold text-red-600 mt-1">غير نشط</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <UserX className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">الصفحة الحالية</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{members.length}</p>
            <p className="text-xs font-bold text-rose-700 mt-1">من {totalCount} مشترك</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
            <Clock className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between border-b-4 border-b-amber-400">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي الصفحات</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{totalPages}</p>
            <p className="text-xs font-bold text-amber-600 mt-1">صفحة</p>
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
              placeholder="ابحث بالاسم أو رقم الهاتف أو الكود..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPageNumber(1); }}
              className="w-full h-11 pr-10 pl-4 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20"
            />
          </div>

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
                <th className="py-4 px-4">رقم الهاتف</th>
                <th className="py-4 px-4">الجنس</th>
                <th className="py-4 px-4">رقم العضوية</th>
                <th className="py-4 px-4 text-center">الحالة</th>
                <th className="py-4 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-zinc-400 text-sm font-bold font-cairo">
                    لا يوجد مشتركون مطابقون للبحث
                  </td>
                </tr>
              ) : (
                members.map((row) => (
                  <tr key={row.id} className="hover:bg-zinc-50/80 transition-colors">
                    {/* Member Name */}
                    <td className="py-3.5 px-4 font-bold text-zinc-900 font-cairo">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                          {row.fullName.charAt(0)}
                        </div>
                        <span>{row.fullName}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs dir-ltr text-right">
                      {row.phone}
                    </td>

                    {/* Gender */}
                    <td className="py-3.5 px-4 text-zinc-700 font-medium">
                      {row.gender === "Male" ? "ذكر" : "أنثى"}
                    </td>

                    {/* Member Number */}
                    <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs">{row.memberNumber}</td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      {row.isActive ? (
                        <span className="inline-block px-3 py-1 text-xs font-bold text-amber-800 bg-amber-200/60 rounded-md border border-amber-300">
                          نشط
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-red-600 rounded-md">
                          غير نشط
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <button className="h-8 w-8 rounded-lg border border-zinc-200 bg-white flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-colors mx-auto cursor-pointer">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-zinc-100 bg-white text-xs font-medium text-zinc-500">
          <span>عرض {members.length} من {totalCount} مشترك</span>
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
