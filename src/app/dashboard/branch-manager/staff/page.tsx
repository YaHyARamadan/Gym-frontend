"use client";

import { useState, useMemo } from "react";
import {
  Users,
  CheckCircle2,
  Dumbbell,
  Headphones,
  Clock,
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  IdCard,
  RefreshCw,
  XCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useUsers, usePendingInvites } from "@/features/owner/hooks/useStaff";
import type { UserDto } from "@/features/owner/types";

export default function BranchStaffPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: users, isLoading: isUsersLoading, error: usersError, refetch } = useUsers();
  const { data: pendingInvites } = usePendingInvites();

  // Combine staff and pending invites if available or display unified staff list
  const staffList = useMemo(() => {
    return users || [];
  }, [users]);

  const pendingInvitesCount = pendingInvites?.length || 0;

  // Filtered staff based on controls
  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      // Search filter
      const searchMatch =
        !searchQuery.trim() ||
        staff.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.id.toLowerCase().includes(searchQuery.toLowerCase());

      // Role filter
      const roleMatch =
        selectedRole === "all" ||
        (selectedRole === "Coach" && staff.role === "Coach") ||
        (selectedRole === "Reception" && staff.role === "Reception") ||
        (selectedRole === "BranchManager" && staff.role === "BranchManager");

      // Status filter
      const statusMatch =
        selectedStatus === "all" ||
        (selectedStatus === "active" && staff.isActive) ||
        (selectedStatus === "inactive" && !staff.isActive);

      return searchMatch && roleMatch && statusMatch;
    });
  }, [staffList, searchQuery, selectedRole, selectedStatus]);

  // Metrics counts
  const totalStaffCount = staffList.length;
  const activeStaffCount = staffList.filter((s) => s.isActive).length;
  const coachCount = staffList.filter((s) => s.role === "Coach").length;
  const receptionCount = staffList.filter((s) => s.role === "Reception").length;

  // Pagination calculation
  const totalItems = filteredStaff.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStaff.slice(start, start + pageSize);
  }, [filteredStaff, currentPage, pageSize]);

  if (isUsersLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 dir-rtl font-tajawal">
        <RefreshCw className="h-8 w-8 text-gym-yellow animate-spin" />
        <p className="text-sm font-bold text-zinc-600 font-cairo">جاري تحميل بيانات الموظفين...</p>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 dir-rtl font-tajawal text-center p-6 bg-white rounded-3xl border border-zinc-200 shadow-xs max-w-lg mx-auto my-10">
        <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
          <XCircle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900 font-cairo">حدث خطأ أثناء تحميل الموظفين</h3>
          <p className="text-xs text-zinc-500 mt-1">{(usersError as Error)?.message || "تعذر الاتصال بالخادم."}</p>
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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "Coach":
        return "كوتش";
      case "Reception":
        return "موظف الاستقبال";
      case "BranchManager":
        return "مدير فرع";
      case "Owner":
        return "مالك Gym";
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* ── Top Header / Breadcrumb ── */}
      <div className="flex items-center justify-between gap-4">
        {/* Title & Breadcrumbs */}
        <div className="text-right flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-800 shadow-xs">
            <Users className="h-6 w-6 stroke-[1.8]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide">
              الموظفون
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
              <span>الرئيسية</span>
              <span>‹</span>
              <span className="text-zinc-600 font-bold">الموظفون</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/dashboard/branch-manager/staff/new"
          className="flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs sm:text-sm px-5 py-3 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          <span>دعوة موظف جديد</span>
        </Link>
      </div>

      {/* ── 5 Metric Cards Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Staff */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي الموظفين</p>
              <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{totalStaffCount}</p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
              <Users className="h-5.5 w-5.5" strokeWidth={1.8} />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs border-t border-zinc-100 pt-2">
            <span className="text-zinc-400 font-bold">كل الموظفين</span>
            <button
              onClick={() => {
                setSelectedRole("all");
                setSelectedStatus("all");
              }}
              className="text-zinc-700 font-bold hover:text-black flex items-center gap-1 cursor-pointer font-cairo"
            >
              <span>عرض الكل</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* Card 2: Active Staff */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-400 font-cairo">الموظفين النشطين</p>
              <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{activeStaffCount}</p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5.5 w-5.5" strokeWidth={1.8} />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs border-t border-zinc-100 pt-2">
            <span className="text-zinc-400 font-bold">موظف نشط</span>
            <button
              onClick={() => setSelectedStatus("active")}
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer font-cairo"
            >
              <span>عرض الكل</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* Card 3: Coaches */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-400 font-cairo">الكوتشز</p>
              <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{coachCount}</p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <Dumbbell className="h-5.5 w-5.5" strokeWidth={1.8} />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs border-t border-zinc-100 pt-2">
            <span className="text-zinc-400 font-bold">كوتش</span>
            <button
              onClick={() => setSelectedRole("Coach")}
              className="text-amber-700 font-bold hover:underline flex items-center gap-1 cursor-pointer font-cairo"
            >
              <span>عرض الكل</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* Card 4: Reception Staff */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-400 font-cairo">موظفي الاستقبال</p>
              <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{receptionCount}</p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
              <Headphones className="h-5.5 w-5.5" strokeWidth={1.8} />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs border-t border-zinc-100 pt-2">
            <span className="text-zinc-400 font-bold">موظف استقبال</span>
            <button
              onClick={() => setSelectedRole("Reception")}
              className="text-sky-700 font-bold hover:underline flex items-center gap-1 cursor-pointer font-cairo"
            >
              <span>عرض الكل</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* Card 5: Pending Invites */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-start justify-between">
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-400 font-cairo">الدعوات المعلقة</p>
              <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{pendingInvitesCount}</p>
            </div>
            <div className="h-11 w-11 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
              <Clock className="h-5.5 w-5.5" strokeWidth={1.8} />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs border-t border-zinc-100 pt-2">
            <span className="text-zinc-400 font-bold">دعوات معلقة</span>
            <span className="text-rose-700 font-bold flex items-center gap-1 cursor-pointer font-cairo">
              <span>عرض الكل</span>
              <span>←</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── Search & Filters Bar ── */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Controls (Right Side) */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto flex-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو رقم الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pr-10 pl-4 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 font-medium"
            />
          </div>

          {/* Gender Filter */}
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none cursor-pointer"
          >
            <option value="all">كل النوع</option>
            <option value="Male">ذكر</option>
            <option value="Female">أنثى</option>
          </select>

          {/* Job Role Filter */}
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none cursor-pointer"
          >
            <option value="all">كل الدور الوظيفي</option>
            <option value="Coach">كوتش</option>
            <option value="Reception">موظف استقبال</option>
            <option value="BranchManager">مدير فرع</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none cursor-pointer"
          >
            <option value="all">كل الحالة</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>
        </div>

        {/* Actions (Left Side) */}
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
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

      {/* ── Table Container ── */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
        {paginatedStaff.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-xs font-extrabold text-zinc-500 font-cairo">
                  <th className="py-4 px-4">الموظف</th>
                  <th className="py-4 px-4">الدور الوظيفي</th>
                  <th className="py-4 px-4">النوع</th>
                  <th className="py-4 px-4">رقم الهاتف</th>
                  <th className="py-4 px-4">
                    <div className="flex items-center gap-1">
                      <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
                      <span>تاريخ التعيين</span>
                    </div>
                  </th>
                  <th className="py-4 px-4 text-center">الحالة</th>
                  <th className="py-4 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-medium">
                {paginatedStaff.map((staff, index) => {
                  const staffCode = `#${1002 + index}`;
                  return (
                    <tr key={staff.id} className="hover:bg-zinc-50/80 transition-colors">
                      {/* Avatar + Name + Code */}
                      <td className="py-3.5 px-4 font-bold text-zinc-900 font-cairo">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs shrink-0 overflow-hidden">
                            {staff.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-zinc-900">{staff.fullName}</p>
                            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{staffCode}</p>
                          </div>
                        </div>
                      </td>

                      {/* Job Role */}
                      <td className="py-3.5 px-4 text-zinc-700 font-bold">{getRoleLabel(staff.role)}</td>

                      {/* Gender/Type */}
                      <td className="py-3.5 px-4 text-zinc-600">موظف</td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-zinc-700 font-mono text-xs dir-ltr text-right">
                        0100 123 4567
                      </td>

                      {/* Hire Date */}
                      <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs">
                        {new Date(staff.createdAt).toISOString().split("T")[0]}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {staff.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-amber-900 bg-amber-200/70 rounded-full border border-amber-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
                            <span>نشط</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-zinc-600 bg-zinc-100 rounded-full border border-zinc-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400"></span>
                            <span>غير نشط</span>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
              <IdCard className="h-8 w-8" strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-zinc-900 font-cairo">لا توجد نتائج لعرضها</h3>
              <p className="text-xs text-zinc-500">جرب تعديل مصفاة البحث أو الإعدادات المختارة.</p>
            </div>
          </div>
        )}

        {/* ── Table Footer / Pagination ── */}
        <div className="p-4 bg-white border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4 font-tajawal">
          {/* Right: Showing count & Rows per page */}
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span>
              عرض {totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0} -{" "}
              {Math.min(currentPage * pageSize, totalItems)} من {totalItems} موظف
            </span>
            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 px-2 border border-zinc-200 rounded-lg bg-white text-xs font-bold text-zinc-700 focus:outline-none cursor-pointer"
              >
                <option value={10}>10 لكل صفحة</option>
                <option value={20}>20 لكل صفحة</option>
                <option value={50}>50 لكل صفحة</option>
              </select>
            </div>
          </div>

          {/* Left: Page buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 w-8 rounded-lg border border-zinc-200 bg-white flex items-center justify-center text-zinc-500 disabled:opacity-40 cursor-pointer hover:bg-zinc-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 rounded-lg text-xs font-bold font-cairo transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-gym-yellow text-gym-black shadow-xs font-black"
                    : "bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-8 w-8 rounded-lg border border-zinc-200 bg-white flex items-center justify-center text-zinc-500 disabled:opacity-40 cursor-pointer hover:bg-zinc-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
