"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  RefreshCw,
  ChevronDown,
  UserPlus,
  Clock,
  PauseCircle,
  FileEdit,
  Download,
  Filter,
  MoreVertical,
  User,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useMembers } from "@/features/owner/hooks/useMembers";
import { useMemberGrowthReport } from "@/features/owner/hooks/useReports";

export default function ReceptionMembersPage() {
  const [topSearchQuery, setTopSearchQuery] = useState("");
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  // Build isActive param based on filter
  const isActiveParam =
    statusFilter === "active" ? true : statusFilter === "expired" ? false : undefined;

  const activeSearch = tableSearchQuery || topSearchQuery;

  const {
    data: membersData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useMembers({
    searchTerm: activeSearch || undefined,
    isActive: isActiveParam,
    pageNumber,
    pageSize,
  });

  const { data: growthStats } = useMemberGrowthReport();

  const apiMembers = membersData?.items || [];
  const totalCount = membersData?.totalCount || 0;
  const totalPages = membersData?.totalPages || 1;
  const hasPreviousPage = membersData?.hasPreviousPage ?? false;
  const hasNextPage = membersData?.hasNextPage ?? false;

  // Derived stats from API
  const totalMembers = growthStats?.totalMembers ?? totalCount ?? 0;
  const activeMembers = growthStats?.activeMembers ?? 0;
  const inactiveMembers = growthStats?.inactiveMembers ?? 0;
  const expiredMembers = growthStats?.expiredMembers ?? 0;
  const newThisMonth = growthStats?.newMembersThisMonth ?? 0;

  // Map API members to display format
  const displayMembers = apiMembers.map((m) => ({
    id: m.id,
    fullName: m.fullName || "عضو",
    memberNumber: m.memberNumber || "#----",
    phone: m.phone || "—",
    gender: m.gender,
    status: m.isActive ? "Active" : "Expired",
    isActive: m.isActive,
    avatar: m.fullName ? m.fullName.charAt(0) : "م",
  }));

  // Reset to page 1 on filter/search change
  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPageNumber(1);
  };

  const handleSearchChange = (val: string) => {
    setTableSearchQuery(val);
    setPageNumber(1);
  };

  const handleTopSearchChange = (val: string) => {
    setTopSearchQuery(val);
    setPageNumber(1);
  };

  return (
    <div className="space-y-6 max-w-[1550px] mx-auto dir-rtl font-tajawal pb-12">
      {/* ── Top Header Section ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium font-cairo mb-1">
            <Link href="/dashboard/reception" className="hover:text-zinc-700">الرئيسية</Link>
            <span>›</span>
            <span className="text-zinc-800 font-bold">الأعضاء</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Users className="h-5 w-5 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo">الأعضاء</h1>
          </div>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Main Action Button */}
          <Link
            href="/dashboard/reception/members/new"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>تسجيل عضو جديد</span>
          </Link>

          {/* Quick Actions Menu */}
          <div className="relative">
            <button
              onClick={() => setQuickActionsOpen(!quickActionsOpen)}
              className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-sm px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer"
            >
              <span>إجراءات سريعة</span>
              <ChevronDown className={`h-4 w-4 text-zinc-500 transition-transform ${quickActionsOpen ? "rotate-180" : ""}`} />
            </button>

            {quickActionsOpen && (
              <div className="absolute left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-zinc-200 py-2 z-50 animate-card-enter">
                <Link
                  href="/dashboard/reception/members/new"
                  onClick={() => setQuickActionsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                >
                  <UserPlus className="h-4 w-4 text-amber-500" />
                  <span>تسجيل عضو جديد</span>
                </Link>
                <Link
                  href="/dashboard/reception/attendance"
                  onClick={() => setQuickActionsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                >
                  <Users className="h-4 w-4 text-emerald-500" />
                  <span>تسجيل حضور عضو</span>
                </Link>
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-sm px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 text-zinc-500 ${isFetching ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">تحديث</span>
          </button>

          {/* Export Button */}
          <button className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-sm px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer">
            <Download className="h-4 w-4 text-zinc-500" />
            <span>تصدير</span>
          </button>

          {/* Top Header Search Bar */}
          <div className="relative hidden md:block w-72">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو رقم الهاتف أو البريد..."
              value={topSearchQuery}
              onChange={(e) => handleTopSearchChange(e.target.value)}
              className="w-full h-10 pr-10 pl-3 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-amber-400 shadow-xs transition-all"
            />
          </div>
        </div>
      </div>

      {/* ── 5 Operational Metric Stat Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: إجمالي الأعضاء */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">إجمالي الأعضاء</span>
            <div className="h-10 w-10 rounded-full bg-zinc-800 text-white flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">
              {isLoading ? "..." : totalMembers.toLocaleString("ar-EG")}
            </p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">إجمالي المسجلين</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button
              onClick={() => { handleStatusChange("all"); setTableSearchQuery(""); }}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 font-cairo"
            >
              <span>عرض الكل</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* Card 2: أعضاء نشطون */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">أعضاء نشطون</span>
            <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <UserPlus className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">
              {isLoading ? "..." : activeMembers.toLocaleString("ar-EG")}
            </p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">اشتراك سارٍ</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button
              onClick={() => handleStatusChange("active")}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-cairo"
            >
              <span>عرض النشطين</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* Card 3: منتهية الاشتراك */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">منتهية الاشتراك</span>
            <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">
              {isLoading ? "..." : expiredMembers.toLocaleString("ar-EG")}
            </p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">يحتاجون تجديد</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button
              onClick={() => handleStatusChange("expired")}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 font-cairo"
            >
              <span>عرض المنتهية</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* Card 4: غير نشط */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">غير نشط / معلق</span>
            <div className="h-10 w-10 rounded-full bg-rose-900 text-white flex items-center justify-center shrink-0">
              <PauseCircle className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">
              {isLoading ? "..." : inactiveMembers.toLocaleString("ar-EG")}
            </p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">غير نشط حالياً</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button
              onClick={() => handleStatusChange("all")}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 font-cairo"
            >
              <span>عرض الكل</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* Card 5: جدد هذا الشهر */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">أعضاء جدد (الشهر)</span>
            <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <FileEdit className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">
              {isLoading ? "..." : newThisMonth.toLocaleString("ar-EG")}
            </p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">منذ بداية الشهر</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <Link
              href="/dashboard/reception/members/new"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 font-cairo"
            >
              <span>تسجيل جديد</span>
              <span>←</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Table Filter Controls Row ───────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search Bar (5 cols) */}
        <div className="lg:col-span-5 relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="ابحث باسم العضو أو رقم الهاتف..."
            value={tableSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full h-10 pr-10 pl-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 font-medium placeholder:text-zinc-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
          />
        </div>

        {/* Status Dropdown (2 cols) */}
        <div className="lg:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-700 font-bold font-cairo focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer"
          >
            <option value="all">كل الحالات</option>
            <option value="active">نشط فقط</option>
            <option value="expired">منتهي فقط</option>
          </select>
        </div>

        {/* Page Size Dropdown (2 cols) */}
        <div className="lg:col-span-2">
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPageNumber(1); }}
            className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-700 font-bold font-cairo focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer"
          >
            <option value={10}>10 لكل صفحة</option>
            <option value={25}>25 لكل صفحة</option>
            <option value={50}>50 لكل صفحة</option>
          </select>
        </div>

        {/* Spacer + Filter button (3 cols) */}
        <div className="lg:col-span-3">
          <button className="w-full h-10 flex items-center justify-center gap-1.5 px-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-bold font-cairo transition-all cursor-pointer">
            <Filter className="h-3.5 w-3.5 text-zinc-500" />
            <span>فلاتر متقدمة</span>
          </button>
        </div>
      </div>

      {/* ── Main Members Table Card ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-4">
        {/* Table header controls */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo">قائمة الأعضاء</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-black font-mono">
              {totalCount.toLocaleString("ar-EG")}
            </span>
          </div>
          {isFetching && !isLoading && (
            <span className="text-xs text-zinc-400 font-cairo flex items-center gap-1.5">
              <RefreshCw className="h-3 w-3 animate-spin" />
              جاري التحديث...
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60 text-xs font-bold text-zinc-400 font-cairo">
                <th className="py-3.5 px-4">العضو</th>
                <th className="py-3.5 px-4">رقم الهاتف</th>
                <th className="py-3.5 px-4 text-center">رقم العضوية</th>
                <th className="py-3.5 px-4 text-center">الجنس</th>
                <th className="py-3.5 px-4 text-center">الحالة</th>
                <th className="py-3.5 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {isLoading ? (
                // Loading skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-zinc-200"></div>
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 bg-zinc-200 rounded"></div>
                          <div className="h-2.5 w-16 bg-zinc-100 rounded"></div>
                        </div>
                      </div>
                    </td>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="py-3.5 px-4">
                        <div className="h-3 w-20 bg-zinc-100 rounded mx-auto"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="h-8 w-8 text-rose-400" />
                      <p className="text-sm font-bold text-zinc-600 font-cairo">تعذر تحميل بيانات الأعضاء</p>
                      <button
                        onClick={() => refetch()}
                        className="text-xs font-bold text-amber-600 hover:underline font-cairo"
                      >
                        إعادة المحاولة
                      </button>
                    </div>
                  </td>
                </tr>
              ) : displayMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-zinc-400 font-medium">
                    {activeSearch ? "لا يوجد أعضاء يطابقون نتائج البحث." : "لا يوجد أعضاء مسجلون بعد."}
                  </td>
                </tr>
              ) : (
                displayMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-zinc-50/80 transition-colors">
                    {/* Member */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-zinc-900 text-white font-black flex items-center justify-center text-xs shrink-0 font-cairo">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 font-cairo">{member.fullName}</p>
                          <p className="text-[10px] text-zinc-400 font-mono">{member.memberNumber}</p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 font-mono text-zinc-600 dir-ltr text-right">
                      {member.phone}
                    </td>

                    {/* Member Number */}
                    <td className="py-3.5 px-4 font-mono text-zinc-600 text-center text-[11px]">
                      {member.memberNumber}
                    </td>

                    {/* Gender */}
                    <td className="py-3.5 px-4 text-center font-bold text-zinc-700 font-cairo">
                      {member.gender === "Male" ? "ذكر" : member.gender === "Female" ? "أنثى" : "—"}
                    </td>

                    {/* Status Pill Tag */}
                    <td className="py-3.5 px-4 text-center">
                      {member.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 rounded-full border border-emerald-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                          <span>نشط</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-rose-800 bg-rose-50 rounded-full border border-rose-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-600"></span>
                          <span>غير نشط</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/dashboard/reception/members/${member.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 font-cairo font-bold text-xs transition-colors"
                        >
                          <User className="h-3.5 w-3.5 text-zinc-500" />
                          <span>عرض الملف</span>
                        </Link>
                        <button className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-100 text-xs text-zinc-500 font-cairo">
          <div className="flex items-center gap-2">
            <span>
              عرض {((pageNumber - 1) * pageSize) + 1} - {Math.min(pageNumber * pageSize, totalCount)} من {totalCount.toLocaleString("ar-EG")} عضو
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={!hasPreviousPage || isLoading}
              onClick={() => setPageNumber((p) => p - 1)}
              className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page: number;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (pageNumber <= 3) {
                page = i + 1;
              } else if (pageNumber >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = pageNumber - 2 + i;
              }
              return (
                <button
                  key={page}
                  onClick={() => setPageNumber(page)}
                  className={`h-8 w-8 rounded-lg font-bold flex items-center justify-center transition-colors ${
                    page === pageNumber
                      ? "bg-gym-yellow text-gym-black"
                      : "border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              disabled={!hasNextPage || isLoading}
              onClick={() => setPageNumber((p) => p + 1)}
              className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
