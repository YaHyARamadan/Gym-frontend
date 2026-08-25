"use client";

import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  XCircle,
  Users,
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Info,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useBranches } from "@/features/owner/hooks/useBranches";

export default function BranchesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: branches, isLoading, error, refetch } = useBranches();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 dir-rtl font-tajawal">
        <RefreshCw className="h-8 w-8 text-gym-yellow animate-spin" />
        <p className="text-sm font-bold text-zinc-600 font-cairo">جاري تحميل الفروع...</p>
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
          <h3 className="text-base font-bold text-zinc-900 font-cairo">حدث خطأ أثناء تحميل الفروع</h3>
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

  const branchList = branches || [];
  const isEmpty = branchList.length === 0;

  // Filtered branches
  const filteredBranches = branchList.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.address && b.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.phone && b.phone.includes(searchQuery))
  );

  const activeBranchesCount = branchList.filter((b) => b.isActive).length;
  const inactiveBranchesCount = branchList.filter((b) => !b.isActive).length;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* ── Top Header / Breadcrumb Area ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-right flex items-center gap-3 mr-auto">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
              <span>الفروع</span>
              <span>‹</span>
              <span>الرئيسية</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">
              الفروع
            </h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
            <Building2 className="h-6 w-6" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* ── Condition A: Populated Branches State ── */}
      {!isEmpty && (
        <>
          {/* Top 5 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Card 1: Total Branches */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي الفروع</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{branchList.length}</p>
                <p className="text-xs font-bold text-zinc-500 mt-1">فرع</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                <Building2 className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>

            {/* Card 2: Active Branches */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">الفروع النشطة</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{activeBranchesCount}</p>
                <p className="text-xs font-bold text-amber-600 mt-1">فرع</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <CheckCircle2 className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>

            {/* Card 3: Inactive Branches */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">الفروع غير النشطة</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{inactiveBranchesCount}</p>
                <p className="text-xs font-bold text-red-600 mt-1">فرع</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <XCircle className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>

            {/* Card 4: Total Subscribers */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي المشتركين</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">2,450</p>
                <p className="text-xs font-bold text-amber-600 mt-1">مشترك</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                <Users className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>

            {/* Card 5: Total Revenue */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي الإيرادات (ج.م)</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">842,500</p>
                <p className="text-xs font-bold text-zinc-400 mt-1">هذا الشهر</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                <DollarSign className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>
          </div>

          {/* Action Bar (Search, Filter, Export, Add New Branch) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            {/* CTA Button */}
            <Link
              href="/dashboard/owner/branches/new"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-5 py-3 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
              <span>إضافة فرع جديد</span>
            </Link>

            {/* Search & Action filters */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="ابحث عن فرع..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pr-10 pl-4 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20"
                />
              </div>

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

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-bold text-zinc-400 font-cairo">
                    <th className="py-4 px-4">اسم الفرع</th>
                    <th className="py-4 px-4">العنوان</th>
                    <th className="py-4 px-4">رقم الهاتف</th>
                    <th className="py-4 px-4 text-center">تاريخ الإنشاء</th>
                    <th className="py-4 px-4 text-center">حالة الفرع</th>
                    <th className="py-4 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                  {filteredBranches.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-50/80 transition-colors">
                      {/* Branch Name with thumbnail */}
                      <td className="py-3.5 px-4 font-bold text-zinc-900 font-cairo">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-12 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 font-bold text-xs">
                            <Building2 className="h-5 w-5 text-zinc-500" />
                          </div>
                          <span>{row.name}</span>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="py-3.5 px-4 text-zinc-700 font-medium">{row.address || "—"}</td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs dir-ltr text-right">
                        {row.phone || "—"}
                      </td>

                      {/* Created date */}
                      <td className="py-3.5 px-4 text-center text-zinc-600 font-mono text-xs">
                        {new Date(row.createdAt).toLocaleDateString("ar-EG")}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {row.isActive ? (
                          <span className="inline-block px-3 py-1 text-xs font-bold text-amber-800 bg-amber-200/60 rounded-md border border-amber-300">
                            نشط
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 text-xs font-bold text-rose-800 bg-rose-200/60 rounded-md border border-rose-300">
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-zinc-100 bg-white text-xs font-medium text-zinc-500">
              <div className="flex items-center gap-2">
                <span>لكل صفحة</span>
                <select className="h-8 px-2 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 focus:outline-none">
                  <option>8</option>
                  <option>16</option>
                  <option>24</option>
                </select>
                <span>عرض 1 - {filteredBranches.length} من {branchList.length} فرع</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 cursor-pointer">
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button className="h-8 px-3 rounded-lg bg-gym-yellow text-gym-black font-black shadow-xs cursor-pointer">
                  1
                </button>
                <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 cursor-pointer">
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Condition B: Empty State (Reference Screenshot 2) ── */}
      {isEmpty && (
        <div className="space-y-6">
          {/* Top Filters & Add Branch Bar */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/dashboard/owner/branches/new"
              className="flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-5 py-2.5 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
              <span>إضافة فرع جديد</span>
            </Link>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
                <Filter className="h-4 w-4 text-zinc-500" />
                <span>فلترة</span>
              </button>

              <button className="flex items-center gap-2 h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
                <Download className="h-4 w-4 text-zinc-500" />
                <span>تصدير</span>
              </button>
            </div>
          </div>

          {/* Centered Graphic Card */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-6">
            <div className="relative h-28 w-28 rounded-3xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400">
              <Building2 className="h-14 w-14 stroke-[1.2]" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-extrabold text-zinc-900 font-cairo">
                لا يوجد لديك أي فروع حتى الآن
              </h3>
              <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                أضف أول فرع لبدء إدارة الجيم الخاص بك ومتابعة الأداء والمشتركين والإيرادات.
              </p>
            </div>

            <Link
              href="/dashboard/owner/branches/new"
              className="mt-6 flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-6 py-3 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
              <span>إضافة أول فرع</span>
            </Link>
          </div>

          {/* Info Notice Banner */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-center gap-3 text-xs font-semibold text-amber-950">
            <Info className="h-5 w-5 text-amber-600 shrink-0" />
            <span>يمكنك إضافة أكثر من فرع لاحقاً وإدارة كل فرع بشكل مستقل من لوحة التحكم الخاصة به.</span>
          </div>
        </div>
      )}
    </div>
  );
}
