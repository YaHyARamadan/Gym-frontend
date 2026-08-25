"use client";

import { useState } from "react";
import {
  Building2,
  Users,
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock populated data matching reference screenshot 1
const MOCK_BRANCHES = [
  {
    id: 1,
    name: "فرع مدينة نصر",
    city: "القاهرة",
    manager: "محمد علي",
    phone: "0100 123 4567",
    members: 450,
    status: "active" as const,
    createdDate: "2023-06-15",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=120&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "فرع المهندسين",
    city: "الجيزة",
    manager: "أحمد خالد",
    phone: "0100 234 5678",
    members: 380,
    status: "active" as const,
    createdDate: "2023-07-20",
    img: "https://images.unsplash.com/photo-1576678927484-cc909957088c?q=80&w=120&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "فرع سموحة",
    city: "الإسكندرية",
    manager: "سارة عصام",
    phone: "0100 345 6789",
    members: 320,
    status: "active" as const,
    createdDate: "2023-08-10",
    img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=120&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "فرع المنصورة",
    city: "المنصورة",
    manager: "نورهان سعيد",
    phone: "0100 456 7890",
    members: 280,
    status: "active" as const,
    createdDate: "2023-09-05",
    img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=120&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "فرع طنطا",
    city: "طنطا",
    manager: "—",
    phone: "0100 567 8901",
    members: 0,
    status: "inactive" as const,
    createdDate: "2023-10-12",
    img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=120&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "فرع أسيوط",
    city: "أسيوط",
    manager: "أحمد محمود",
    phone: "0100 678 9012",
    members: 270,
    status: "active" as const,
    createdDate: "2023-11-18",
    img: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=120&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "فرع شرم الشيخ",
    city: "شرم الشيخ",
    manager: "محمود عادل",
    phone: "0100 789 0123",
    members: 310,
    status: "active" as const,
    createdDate: "2023-12-25",
    img: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=120&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "فرع أسوان",
    city: "أسوان",
    manager: "—",
    phone: "0100 890 1234",
    members: 0,
    status: "inactive" as const,
    createdDate: "2024-01-30",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=120&auto=format&fit=crop",
  },
];

export default function BranchesPage() {
  // Toggle between populated data & empty state for dev testing
  const [branches, setBranches] = useState(MOCK_BRANCHES);
  const [searchQuery, setSearchQuery] = useState("");

  const isEmpty = branches.length === 0;

  // Filtered branches
  const filteredBranches = branches.filter(
    (b) =>
      b.name.includes(searchQuery) ||
      b.city.includes(searchQuery) ||
      b.manager.includes(searchQuery)
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* ── Top Header / Breadcrumb Area ── */}
      <div className="flex items-center justify-between gap-4">
        {/* Toggle switch for testing Backend Empty vs Populated state */}
        <div className="flex items-center gap-2 bg-zinc-100 p-1.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600">
          <span>اختبار الحالة:</span>
          <button
            onClick={() => setBranches(MOCK_BRANCHES)}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
              !isEmpty ? "bg-white shadow-xs text-zinc-900 font-extrabold" : "hover:text-zinc-900"
            )}
          >
            يوجد فروع ({MOCK_BRANCHES.length})
          </button>
          <button
            onClick={() => setBranches([])}
            className={cn(
              "px-3 py-1.5 rounded-lg transition-all cursor-pointer",
              isEmpty ? "bg-white shadow-xs text-zinc-900 font-extrabold" : "hover:text-zinc-900"
            )}
          >
            فارغ (0 فروع)
          </button>
        </div>

        {/* Title */}
        <div className="text-right flex items-center gap-3">
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
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">12</p>
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
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">9</p>
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
                <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">2</p>
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
                    <th className="py-4 px-4">المدينة ↕</th>
                    <th className="py-4 px-4">المدير</th>
                    <th className="py-4 px-4">رقم الهاتف</th>
                    <th className="py-4 px-4 text-center">إجمالي المشتركين ↕</th>
                    <th className="py-4 px-4 text-center">حالة الفرع ↕</th>
                    <th className="py-4 px-4 text-center">تاريخ الإنشاء ↕</th>
                    <th className="py-4 px-4 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-sm">
                  {filteredBranches.map((row) => (
                    <tr key={row.id} className="hover:bg-zinc-50/80 transition-colors">
                      {/* Branch Name with thumbnail */}
                      <td className="py-3.5 px-4 font-bold text-zinc-900 font-cairo">
                        <div className="flex items-center gap-3">
                          <img
                            src={row.img}
                            alt={row.name}
                            className="h-9 w-12 rounded-lg object-cover border border-zinc-200"
                          />
                          <span>{row.name}</span>
                        </div>
                      </td>

                      {/* City */}
                      <td className="py-3.5 px-4 text-zinc-700 font-medium">{row.city}</td>

                      {/* Manager */}
                      <td className="py-3.5 px-4 text-zinc-700 font-medium">{row.manager}</td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs dir-ltr text-right">
                        {row.phone}
                      </td>

                      {/* Members */}
                      <td className="py-3.5 px-4 text-center font-bold text-zinc-900 font-mono">
                        {row.members}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        {row.status === "active" ? (
                          <span className="inline-block px-3 py-1 text-xs font-bold text-amber-800 bg-amber-200/60 rounded-md border border-amber-300">
                            نشط
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 text-xs font-bold text-rose-800 bg-rose-200/60 rounded-md border border-rose-300">
                            غير نشط
                          </span>
                        )}
                      </td>

                      {/* Created date */}
                      <td className="py-3.5 px-4 text-center text-zinc-600 font-mono text-xs">
                        {row.createdDate}
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
                <span>عرض 1 - 8 من 12 فرع</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 cursor-pointer">
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button className="h-8 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 cursor-pointer">
                  3
                </button>
                <button className="h-8 px-3 rounded-lg border border-zinc-200 hover:bg-zinc-50 cursor-pointer">
                  2
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
            <button className="flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-5 py-2.5 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer">
              <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
              <span>إضافة فرع جديد</span>
            </button>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
                <Filter className="h-4 w-4 text-zinc-500" />
                <span>فلترة</span>
              </button>
              <select className="h-10 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none">
                <option>كل الفروع</option>
              </select>
            </div>
          </div>

          {/* Empty Illustration Card Container */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center shadow-xs flex flex-col items-center justify-center min-h-[420px]">
            {/* Custom SVG Gym Vector Illustration */}
            <div className="relative mb-6 flex items-center justify-center">
              <div className="h-40 w-40 rounded-full bg-zinc-100/80 absolute -z-0" />
              <svg
                width="160"
                height="120"
                viewBox="0 0 200 150"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative z-10 text-zinc-400"
              >
                {/* Dumbbell graphic floating top */}
                <rect x="75" y="15" width="50" height="6" rx="3" fill="#a1a1aa" />
                <rect x="65" y="8" width="10" height="20" rx="3" fill="#71717a" />
                <rect x="125" y="8" width="10" height="20" rx="3" fill="#71717a" />

                {/* Building structure */}
                <rect x="45" y="45" width="110" height="70" rx="6" fill="#e4e4e7" stroke="#a1a1aa" strokeWidth="3" />
                <rect x="75" y="35" width="50" height="15" rx="3" fill="#71717a" />
                <text x="85" y="46" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="sans-serif">GYM</text>
                
                {/* Windows & Doors */}
                <rect x="58" y="58" width="20" height="20" rx="3" fill="#ffffff" stroke="#a1a1aa" strokeWidth="2" />
                <rect x="122" y="58" width="20" height="20" rx="3" fill="#ffffff" stroke="#a1a1aa" strokeWidth="2" />
                <rect x="88" y="75" width="24" height="40" rx="2" fill="#ffffff" stroke="#71717a" strokeWidth="2" />
              </svg>
            </div>

            <h2 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide">
              لا يوجد لديك أي فروع حتى الآن
            </h2>
            <p className="text-sm font-medium text-zinc-400 mt-2 max-w-md">
              أضف أول فرع لبدء إدارة الجيم الخاص بك ومتابعة الأداء والمشتركين والإيرادات.
            </p>

            <button className="mt-6 flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-6 py-3 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer">
              <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
              <span>إضافة أول فرع</span>
            </button>
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
