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
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock Staff Data matching reference screenshot 1
const STAFF_DATA = [
  {
    id: 1,
    staffCode: "#1001",
    name: "محمد علي",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
    role: "مدير فرع",
    branch: "فرع مدينة نصر",
    phone: "0100 123 4567",
    hireDate: "2024-01-15",
    status: "نشط",
    statusVariant: "active" as const,
  },
  {
    id: 2,
    staffCode: "#1002",
    name: "أحمد خالد",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    role: "كوتش",
    branch: "فرع المهندسين",
    phone: "0100 234 5678",
    hireDate: "2024-02-01",
    status: "نشط",
    statusVariant: "active" as const,
  },
  {
    id: 3,
    staffCode: "#1003",
    name: "سارة عصام",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    role: "أخصائية تغذية",
    branch: "فرع المعادي",
    phone: "0100 345 6789",
    hireDate: "2024-02-10",
    status: "نشط",
    statusVariant: "active" as const,
  },
  {
    id: 4,
    staffCode: "#1004",
    name: "نورهان سعيد",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100&auto=format&fit=crop",
    role: "كوتش",
    branch: "فرع أكتوبر",
    phone: "0100 456 7890",
    hireDate: "2024-03-05",
    status: "معلق",
    statusVariant: "pending" as const,
  },
  {
    id: 5,
    staffCode: "#1005",
    name: "عمرو حسن",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
    role: "موظف استقبال",
    branch: "فرع مدينة نصر",
    phone: "0100 567 8901",
    hireDate: "2024-03-20",
    status: "نشط",
    statusVariant: "active" as const,
  },
  {
    id: 6,
    staffCode: "#1006",
    name: "محمود عادل",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop",
    role: "كوتش",
    branch: "فرع التجمع",
    phone: "0100 678 9012",
    hireDate: "2024-04-01",
    status: "غير نشط",
    statusVariant: "inactive" as const,
  },
  {
    id: 7,
    staffCode: "#1007",
    name: "هند محمد",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
    role: "أخصائية تغذية",
    branch: "فرع المعادي",
    phone: "0100 789 0123",
    hireDate: "2024-04-18",
    status: "معلق",
    statusVariant: "pending" as const,
  },
  {
    id: 8,
    staffCode: "#1008",
    name: "إسلام أحمد",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=100&auto=format&fit=crop",
    role: "مدير فرع",
    branch: "فرع المهندسين",
    phone: "0100 890 1234",
    hireDate: "2024-05-10",
    status: "نشط",
    statusVariant: "active" as const,
  },
];

export default function StaffPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEmptyState, setIsEmptyState] = useState(false);

  const filteredStaff = STAFF_DATA.filter(
    (s) =>
      s.name.includes(searchQuery) ||
      s.role.includes(searchQuery) ||
      s.phone.includes(searchQuery) ||
      s.branch.includes(searchQuery)
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* ── Top Header / Breadcrumb ── */}
      <div className="flex items-center justify-between gap-4">
        {/* State Toggle Bar */}
        <div className="flex items-center gap-2 bg-zinc-100 p-1.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600">
          <span>اختبار الحالة:</span>
          <button
            onClick={() => setIsEmptyState(false)}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
              !isEmptyState ? "bg-white shadow-xs text-zinc-900 font-extrabold" : "hover:text-zinc-900"
            )}
          >
            يوجد موظفين (32)
          </button>
          <button
            onClick={() => setIsEmptyState(true)}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
              isEmptyState ? "bg-white shadow-xs text-zinc-900 font-extrabold" : "hover:text-zinc-900"
            )}
          >
            فارغ (0 موظف)
          </button>
        </div>

        {/* Title & CTA */}
        <div className="text-right flex items-center gap-3">
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
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">32</p>
                <p className="text-xs font-bold text-amber-600 mt-1">↗ 12.5% من الشهر السابق</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                <Briefcase className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>

            {/* Card 2: Active Staff */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">الموظفين النشطين</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">27</p>
                <p className="text-xs font-bold text-amber-600 mt-1">↗ 10.2% من الشهر السابق</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <UserCheck className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>

            {/* Card 3: Coaches */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">الكوتشز</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">18</p>
                <p className="text-xs font-bold text-amber-600 mt-1">↗ 8.7% من الشهر السابق</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
                <Dumbbell className="h-5.5 w-5.5" strokeWidth={1.8} />
              </div>
            </div>

            {/* Card 4: Pending Staff */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-400 font-cairo">الموظفين المعلقين</p>
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">3</p>
                <p className="text-xs font-bold text-red-600 mt-1">↗ 50% من الشهر السابق</p>
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
                  placeholder="ابحث بالاسم أو رقم الهاتف..."
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
                    <th className="py-4 px-4">الوظيفة</th>
                    <th className="py-4 px-4">الفرع</th>
                    <th className="py-4 px-4">رقم الهاتف</th>
                    <th className="py-4 px-4">تاريخ التعيين</th>
                    <th className="py-4 px-4 text-center">الحالة</th>
                    <th className="py-4 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                  {filteredStaff.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-50/80 transition-colors">
                      {/* Avatar + Name + Code */}
                      <td className="py-3.5 px-4 font-bold text-zinc-900 font-cairo">
                        <div className="flex items-center gap-3">
                          <img
                            src={row.avatar}
                            alt={row.name}
                            className="h-9 w-9 rounded-full object-cover border border-zinc-200"
                          />
                          <div>
                            <p>{row.name}</p>
                            <p className="text-[10px] font-mono text-zinc-400">{row.staffCode}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4 text-zinc-700 font-medium">{row.role}</td>

                      {/* Branch */}
                      <td className="py-3.5 px-4 text-zinc-700 font-medium">{row.branch}</td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs dir-ltr text-right">
                        {row.phone}
                      </td>

                      {/* Hire Date */}
                      <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs">{row.hireDate}</td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {row.statusVariant === "active" && (
                          <span className="inline-block px-3 py-1 text-xs font-bold text-amber-800 bg-amber-200/60 rounded-md border border-amber-300">
                            نشط
                          </span>
                        )}
                        {row.statusVariant === "pending" && (
                          <span className="inline-block px-3 py-1 text-xs font-bold text-rose-800 bg-rose-200/60 rounded-md border border-rose-300">
                            معلق
                          </span>
                        )}
                        {row.statusVariant === "inactive" && (
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
        /* Empty State Graphic (Matching Bottom Card in Reference Screenshot 1) */
        <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-4">
          <div className="h-20 w-20 rounded-3xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
            <IdCard className="h-10 w-10" strokeWidth={1.5} />
          </div>

          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-zinc-900 font-cairo">لا يوجد موظفين حتى الآن</h3>
            <p className="text-xs text-zinc-500 font-medium">أضف أول موظف لبدء إدارة فريق العمل في فروع الجيم الخاصة بك.</p>
          </div>

          <button className="mt-4 flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-6 py-3 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer">
            <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
            <span>إضافة أول موظف</span>
          </button>
        </div>
      )}
    </div>
  );
}
