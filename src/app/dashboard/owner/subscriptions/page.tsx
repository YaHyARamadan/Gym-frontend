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
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Subscriptions data matching reference image 2
const SUBSCRIPTIONS_DATA = [
  {
    id: 1,
    subCode: "#1001",
    name: "محمد علي",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
    phone: "0100 123 4567",
    branch: "فرع مدينة نصر",
    planType: "سنوي VIP",
    startDate: "2024-05-20",
    endDate: "2025-05-21",
    status: "نشط",
    statusVariant: "active" as const,
    price: "12,000",
  },
  {
    id: 2,
    subCode: "#1002",
    name: "أحمد خالد",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    phone: "0100 234 5678",
    branch: "فرع المهندسين",
    planType: "6 شهور",
    startDate: "2025-01-31",
    endDate: "2024-02-01",
    status: "نشط",
    statusVariant: "active" as const,
    price: "6,000",
  },
  {
    id: 3,
    subCode: "#1003",
    name: "سارة عصام",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    phone: "0100 345 6789",
    branch: "فرع المعادي",
    planType: "3 شهور",
    startDate: "2024-09-09",
    endDate: "2024-03-10",
    status: "نشط",
    statusVariant: "active" as const,
    price: "3,000",
  },
  {
    id: 4,
    subCode: "#1004",
    name: "نورهان سعيد",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=100&auto=format&fit=crop",
    phone: "0100 456 7890",
    branch: "فرع أكتوبر",
    planType: "شهري",
    startDate: "2024-05-20",
    endDate: "2024-04-20",
    status: "نشط",
    statusVariant: "active" as const,
    price: "1,200",
  },
  {
    id: 5,
    subCode: "#1005",
    name: "عمرو حسن",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
    phone: "0100 567 8901",
    branch: "فرع مدينة نصر",
    planType: "سنوي VIP",
    startDate: "2024-05-14",
    endDate: "2023-05-15",
    status: "منتهي",
    statusVariant: "expired" as const,
    price: "12,000",
  },
  {
    id: 6,
    subCode: "#1006",
    name: "محمود عادل",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop",
    phone: "0100 678 9012",
    branch: "فرع التجمع",
    planType: "3 شهور",
    startDate: "2024-10-31",
    endDate: "2024-05-01",
    status: "معلق",
    statusVariant: "pending" as const,
    price: "3,000",
  },
  {
    id: 7,
    subCode: "#1007",
    name: "هند محمد",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
    phone: "0100 789 0123",
    branch: "فرع المعادي",
    planType: "6 شهور",
    startDate: "2024-05-01",
    endDate: "2023-11-01",
    status: "منتهي",
    statusVariant: "expired" as const,
    price: "6,000",
  },
  {
    id: 8,
    subCode: "#1008",
    name: "إسلام أحمد",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=100&auto=format&fit=crop",
    phone: "0100 890 1234",
    branch: "فرع المهندسين",
    planType: "3 شهور",
    startDate: "2024-08-09",
    endDate: "2024-05-10",
    status: "معلق",
    statusVariant: "pending" as const,
    price: "2,500",
  },
];

export default function SubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubs = SUBSCRIPTIONS_DATA.filter(
    (s) =>
      s.name.includes(searchQuery) ||
      s.phone.includes(searchQuery) ||
      s.subCode.includes(searchQuery) ||
      s.branch.includes(searchQuery)
  );

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
              الإشتراكات
            </h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
            <CreditCard className="h-6 w-6" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* ── 5 Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Subscriptions */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي الاشتراكات</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">1,248</p>
            <p className="text-xs font-bold text-zinc-500 mt-1">مشترك</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
            <CreditCard className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>

        {/* Card 2: Pending Subscriptions */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">اشتراكات معلقة</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">68</p>
            <p className="text-xs font-bold text-rose-700 mt-1">5.4% من الإجمالي</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
            <Clock className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>

        {/* Card 3: Expired Subscriptions */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">اشتراكات منتهية</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">98</p>
            <p className="text-xs font-bold text-red-600 mt-1">7.9% من الإجمالي</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <UserX className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>

        {/* Card 4: Active Subscriptions */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">اشتراكات نشطة</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">1,082</p>
            <p className="text-xs font-bold text-amber-600 mt-1">86.8% من الإجمالي</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <UserCheck className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>

        {/* Card 5: Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between border-b-4 border-b-amber-400">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي الإيرادات (ج.م)</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">842,500</p>
            <p className="text-xs font-bold text-amber-600 mt-1">هذا الشهر</p>
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
              placeholder="ابحث بالاسم أو رقم الهاتف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pr-10 pl-4 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20"
            />
          </div>

          <select className="h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none">
            <option>كل أنواع الاشتراكات</option>
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
                <th className="py-4 px-4">رقم الهاتف</th>
                <th className="py-4 px-4">الفرع</th>
                <th className="py-4 px-4">نوع الاشتراك</th>
                <th className="py-4 px-4">تاريخ البداية</th>
                <th className="py-4 px-4">تاريخ الانتهاء</th>
                <th className="py-4 px-4 text-center">الحالة</th>
                <th className="py-4 px-4 text-left">المبلغ (ج.م)</th>
                <th className="py-4 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {filteredSubs.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50/80 transition-colors">
                  {/* Member Name + Sub Code + Avatar */}
                  <td className="py-3.5 px-4 font-bold text-zinc-900 font-cairo">
                    <div className="flex items-center gap-3">
                      <img
                        src={row.avatar}
                        alt={row.name}
                        className="h-9 w-9 rounded-full object-cover border border-zinc-200"
                      />
                      <div>
                        <p>{row.name}</p>
                        <p className="text-[10px] font-mono text-zinc-400">{row.subCode}</p>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs dir-ltr text-right">
                    {row.phone}
                  </td>

                  {/* Branch */}
                  <td className="py-3.5 px-4 text-zinc-700 font-medium">{row.branch}</td>

                  {/* Plan Type */}
                  <td className="py-3.5 px-4 text-zinc-700 font-medium">{row.planType}</td>

                  {/* Start Date */}
                  <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs">{row.startDate}</td>

                  {/* End Date */}
                  <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs">
                    <span className={cn(row.statusVariant === "expired" && "text-red-500 font-bold")}>
                      {row.endDate}
                    </span>
                  </td>

                  {/* Status Badge */}
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
                    {row.statusVariant === "expired" && (
                      <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-red-600 rounded-md">
                        منتهي
                      </span>
                    )}
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 font-bold text-zinc-900 font-mono text-left">{row.price}</td>

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
    </div>
  );
}
