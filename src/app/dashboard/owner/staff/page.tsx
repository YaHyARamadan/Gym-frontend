"use client";

import { useState } from "react";
import {
  Briefcase,
  UserCheck,
  Dumbbell,
  Clock,
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  IdCard,
  RefreshCw,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUsers } from "@/features/owner/hooks/useStaff";

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users, isLoading, error, refetch } = useUsers();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 dir-rtl font-tajawal">
        <RefreshCw className="h-8 w-8 text-gym-yellow animate-spin" />
        <p className="text-sm font-bold text-zinc-600 font-cairo">جاري تحميل بيانات الموظفين...</p>
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
          <h3 className="text-base font-bold text-zinc-900 font-cairo">حدث خطأ أثناء تحميل الموظفين</h3>
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

  const staffList = users || [];
  const isEmptyState = staffList.length === 0;

  const filteredStaff = staffList.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeStaffCount = staffList.filter((s) => s.isActive).length;
  const coachCount = staffList.filter((s) => s.role === "Coach").length;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* ── Top Header / Breadcrumb ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-right flex items-center gap-3 mr-auto">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
              <span>الموظفين</span>
              <span>‹</span>
              <span>الرئيسية</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">
              الموظفين
            </h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
            <Briefcase className="h-6 w-6" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {!isEmptyState ? (
        <>
          {/* Top CTA Add Employee Bar */}
          <div className="flex justify-start">
            <Link
              href="/dashboard/owner/staff/new"
              className="flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-6 py-3 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
              <span>إضافة موظف جديد</span>
            </Link>
          </div>

          {/* ── 4 Metric Cards (Right to Left) ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Staff */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي الموظفين</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{staffList.length}</p>
                <p className="text-xs font-bold text-amber-600 mt-1">موظف</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                <Briefcase className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>

            {/* Card 2: Active Staff */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">الموظفين النشطين</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{activeStaffCount}</p>
                <p className="text-xs font-bold text-amber-600 mt-1">موظف نشط</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <UserCheck className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>

            {/* Card 3: Coaches */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">الكوتشز</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{coachCount}</p>
                <p className="text-xs font-bold text-amber-600 mt-1">مدرب</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                <Dumbbell className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>

            {/* Card 4: Pending Staff */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">الموظفين غير النشطين</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{staffList.length - activeStaffCount}</p>
                <p className="text-xs font-bold text-red-600 mt-1">موظف</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
                <Clock className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>
          </div>

          {/* ── Search & Filters Bar ── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pr-10 pl-4 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20"
                />
              </div>

              <select className="h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none">
                <option>كل الفروع</option>
              </select>

              <select className="h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none">
                <option>كل الأدوار</option>
              </select>

              <select className="h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none">
                <option>كل الحالات</option>
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
                    <th className="py-4 px-4">الموظف</th>
                    <th className="py-4 px-4">الدور الوظيفي</th>
                    <th className="py-4 px-4">البريد الإلكتروني</th>
                    <th className="py-4 px-4">تاريخ التعيين</th>
                    <th className="py-4 px-4 text-center">الحالة</th>
                    <th className="py-4 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                  {filteredStaff.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-50/80 transition-colors">
                      {/* Avatar + Name */}
                      <td className="py-3.5 px-4 font-bold text-zinc-900 font-cairo">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                            {row.fullName.charAt(0)}
                          </div>
                          <div>
                            <p>{row.fullName}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4 text-zinc-700 font-medium">{row.role}</td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs dir-ltr text-right">
                        {row.email}
                      </td>

                      {/* Hire Date */}
                      <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs">
                        {new Date(row.createdAt).toLocaleDateString("ar-EG")}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {row.isActive ? (
                          <span className="inline-block px-3 py-1 text-xs font-bold text-amber-800 bg-amber-200/60 rounded-md border border-amber-300">
                            نشط
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 text-xs font-bold text-zinc-700 bg-zinc-200 rounded-md">
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
          </div>
        </>
      ) : (
        /* Empty State Graphic */
        <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-4">
          <div className="h-20 w-20 rounded-3xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
            <IdCard className="h-10 w-10" strokeWidth={1.5} />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-zinc-900 font-cairo">لا يوجد موظفين حتى الآن</h3>
            <p className="text-xs text-zinc-500 font-medium">أضف أول موظف لبدء إدارة فريق العمل في فروع الجيم الخاصة بك.</p>
          </div>

          <Link
            href="/dashboard/owner/staff/new"
            className="mt-4 flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-6 py-3 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
            <span>إضافة أول موظف</span>
          </Link>
        </div>
      )}
    </div>
  );
}
