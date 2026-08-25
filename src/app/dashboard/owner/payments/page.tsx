"use client";

import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Receipt,
  Search,
  Filter,
  Download,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Payments data matching reference image 3
const PAYMENTS_DATA = [
  {
    id: 1,
    invoiceNo: "INV-2024-1258",
    name: "محمد علي",
    phone: "0100 123 4567",
    branch: "فرع مدينة نصر",
    product: "اشتراك VIP سنوي",
    amount: "12,000",
    method: "فيزا",
    methodType: "visa" as const,
    date: "2024-05-21 10:35 ص",
    status: "مستلمة",
    statusVariant: "received" as const,
  },
  {
    id: 2,
    invoiceNo: "INV-2024-1257",
    name: "أحمد خالد",
    phone: "0100 234 5678",
    branch: "فرع المهندسين",
    product: "اشتراك 6 شهور",
    amount: "6,000",
    method: "مدى",
    methodType: "mada" as const,
    date: "2024-05-21 09:15 ص",
    status: "مستلمة",
    statusVariant: "received" as const,
  },
  {
    id: 3,
    invoiceNo: "INV-2024-1256",
    name: "سارة عصام",
    phone: "0100 345 6789",
    branch: "فرع المعادي",
    product: "اشتراك 3 شهور",
    amount: "3,000",
    method: "كاش",
    methodType: "cash" as const,
    date: "2024-05-20 08:50 م",
    status: "مستلمة",
    statusVariant: "received" as const,
  },
  {
    id: 4,
    invoiceNo: "INV-2024-1255",
    name: "نورهان سعيد",
    phone: "0100 456 7890",
    branch: "فرع أكتوبر",
    product: "اشتراك شهري",
    amount: "1,200",
    method: "ماستر كارد",
    methodType: "mastercard" as const,
    date: "2024-05-20 06:30 م",
    status: "مستلمة",
    statusVariant: "received" as const,
  },
  {
    id: 5,
    invoiceNo: "INV-2024-1254",
    name: "عمرو حسن",
    phone: "0100 567 8901",
    branch: "فرع مدينة نصر",
    product: "اشتراك VIP سنوي",
    amount: "12,000",
    method: "فيزا",
    methodType: "visa" as const,
    date: "2024-05-18 —",
    status: "متأخرة",
    statusVariant: "overdue" as const,
  },
  {
    id: 6,
    invoiceNo: "INV-2024-1253",
    name: "محمود عادل",
    phone: "0100 678 9012",
    branch: "فرع المعادي",
    product: "اشتراك 6 شهور",
    amount: "6,000",
    method: "مدى",
    methodType: "mada" as const,
    date: "2024-05-16 —",
    status: "متأخرة",
    statusVariant: "overdue" as const,
  },
  {
    id: 7,
    invoiceNo: "INV-2024-1252",
    name: "هند محمد",
    phone: "0100 789 0123",
    branch: "فرع التجمع",
    product: "اشتراك 3 شهور",
    amount: "3,000",
    method: "فيزا",
    methodType: "visa" as const,
    date: "2024-05-15 05:20 م",
    status: "ملغاة",
    statusVariant: "cancelled" as const,
  },
  {
    id: 8,
    invoiceNo: "INV-2024-1251",
    name: "إسلام أحمد",
    phone: "0100 890 1234",
    branch: "فرع المهندسين",
    product: "اشتراك شهري",
    amount: "2,500",
    method: "كاش",
    methodType: "cash" as const,
    date: "2024-05-15 03:10 م",
    status: "مستلمة",
    statusVariant: "received" as const,
  },
];

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayments = PAYMENTS_DATA.filter(
    (p) =>
      p.name.includes(searchQuery) ||
      p.invoiceNo.includes(searchQuery) ||
      p.phone.includes(searchQuery) ||
      p.branch.includes(searchQuery)
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* ── Top Header / Breadcrumb ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-right flex items-center gap-3 mr-auto">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
              <span>المدفوعات</span>
              <span>‹</span>
              <span>الرئيسية</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">
              المدفوعات
            </h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
            <DollarSign className="h-6 w-6" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* ── 5 Metric Cards (Right to Left) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Average Payment Value */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">متوسط قيمة الدفع (ج.م)</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">539</p>
            <p className="text-xs font-bold text-zinc-500 mt-1">هذا الشهر</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
            <Receipt className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>

        {/* Card 2: Total Payments Count */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">عدد المدفوعات</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">1,562</p>
            <p className="text-xs font-bold text-zinc-500 mt-1">هذا الشهر</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
            <Receipt className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>

        {/* Card 3: Overdue Payments */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي المدفوعات المتأخرة (ج.م)</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">78,200</p>
            <p className="text-xs font-bold text-red-600 mt-1">+8.6% من الفترة السابقة</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>

        {/* Card 4: Received Payments */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي المدفوعات المستلمة (ج.م)</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">764,300</p>
            <p className="text-xs font-bold text-amber-600 mt-1">+12.8% من الفترة السابقة</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <TrendingUp className="h-5.5 w-5.5" strokeWidth={1.8} />
          </div>
        </div>

        {/* Card 5: Total Payments Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between border-b-4 border-b-amber-400">
          <div className="text-right">
            <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي المدفوعات (ج.م)</p>
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
              placeholder="ابحث بالاسم أو رقم الفاتورة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pr-10 pl-4 rounded-xl border border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20"
            />
          </div>

          <div className="h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 flex items-center justify-center">
            <span>من 01 مايو 2024 إلى 21 مايو 2024</span>
          </div>

          <select className="h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none">
            <option>كل الحالات</option>
          </select>

          <select className="h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 focus:outline-none">
            <option>كل طرق الدفع</option>
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
                <th className="py-4 px-4">رقم الفاتورة</th>
                <th className="py-4 px-4">المشترك</th>
                <th className="py-4 px-4">الفرع</th>
                <th className="py-4 px-4">نوع الاشتراك / المنتج</th>
                <th className="py-4 px-4">المبلغ (ج.م)</th>
                <th className="py-4 px-4">طريقة الدفع</th>
                <th className="py-4 px-4">تاريخ الدفع</th>
                <th className="py-4 px-4 text-center">الحالة</th>
                <th className="py-4 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {filteredPayments.map((row) => (
                <tr key={row.id} className="hover:bg-zinc-50/80 transition-colors">
                  {/* Invoice No */}
                  <td className="py-3.5 px-4 font-bold text-zinc-900 font-mono text-xs">{row.invoiceNo}</td>

                  {/* Member Name */}
                  <td className="py-3.5 px-4 font-bold text-zinc-900 font-cairo">
                    <div>
                      <p>{row.name}</p>
                      <p className="text-[11px] font-mono text-zinc-400">{row.phone}</p>
                    </div>
                  </td>

                  {/* Branch */}
                  <td className="py-3.5 px-4 text-zinc-700 font-medium">{row.branch}</td>

                  {/* Product / Plan */}
                  <td className="py-3.5 px-4 text-zinc-700 font-medium">{row.product}</td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 font-bold text-zinc-900 font-mono">{row.amount}</td>

                  {/* Method */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-zinc-100 border border-zinc-200 text-zinc-800">
                      {row.method}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs">{row.date}</td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center">
                    {row.statusVariant === "received" && (
                      <span className="inline-block px-3 py-1 text-xs font-bold text-amber-800 bg-amber-200/60 rounded-md border border-amber-300">
                        مستلمة
                      </span>
                    )}
                    {row.statusVariant === "overdue" && (
                      <span className="inline-block px-3 py-1 text-xs font-bold text-rose-800 bg-rose-200/60 rounded-md border border-rose-300">
                        متأخرة
                      </span>
                    )}
                    {row.statusVariant === "cancelled" && (
                      <span className="inline-block px-3 py-1 text-xs font-bold text-zinc-700 bg-zinc-200 rounded-md">
                        ملغاة
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
    </div>
  );
}
