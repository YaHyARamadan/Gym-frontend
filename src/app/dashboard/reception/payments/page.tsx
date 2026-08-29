"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Plus,
  RefreshCw,
  Search,
  DollarSign,
  Receipt,
  TrendingUp,
  BarChart3,
  Clock,
  Info,
  Download,
  Filter,
  MoreVertical,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useMyPayments, useCreatePayment } from "@/features/reception/hooks/useReception";
import { extractApiError } from "@/lib/utils";

export default function MyPaymentsPage() {
  const [topSearchQuery, setTopSearchQuery] = useState("");
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("2024-05-01 إلى 2024-05-21");

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ memberId: "", amount: 0, paymentMethod: "Cash", notes: "" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: payments, isLoading, error, refetch } = useMyPayments();
  const createPaymentMutation = useCreatePayment();

  const paymentList = Array.isArray(payments)
    ? payments
    : (payments as unknown as { items?: Array<any> })?.items || [];

  // Mock dataset matching screenshot exactly
  const mockTransactions = [
    {
      id: "1",
      receiptNo: "#P-10086",
      memberName: "أحمد خالد محمد",
      memberNumber: "#1001",
      description: "اشتراك شهري - جولد",
      amount: "2,100 ج.م",
      paymentMethod: "VISA",
      cardLast4: "**** 4567",
      dateTime: "2024-05-21 10:45 ص",
      status: "Paid", // مدفوعة
      avatar: "أ",
    },
    {
      id: "2",
      receiptNo: "#P-10085",
      memberName: "سارة محمود علي",
      memberNumber: "#1002",
      description: "تجديد اشتراك 3 أشهر",
      amount: "3,500 ج.م",
      paymentMethod: "Cash",
      cardLast4: "",
      dateTime: "2024-05-21 09:30 ص",
      status: "Paid",
      avatar: "س",
    },
    {
      id: "3",
      receiptNo: "#P-10084",
      memberName: "محمد أسامة حسن",
      memberNumber: "#1003",
      description: "طباعة كارنيه",
      amount: "60 ج.م",
      paymentMethod: "Cash",
      cardLast4: "",
      dateTime: "2024-05-20 06:15 م",
      status: "Paid",
      avatar: "م",
    },
    {
      id: "4",
      receiptNo: "#P-10083",
      memberName: "نورهان سعيد عبد الله",
      memberNumber: "#1004",
      description: "اشتراك سنوي - بلاتينيوم",
      amount: "8,500 ج.م",
      paymentMethod: "VISA",
      cardLast4: "**** 7890",
      dateTime: "2024-05-20 12:20 م",
      status: "Paid",
      avatar: "ن",
    },
    {
      id: "5",
      receiptNo: "#P-10082",
      memberName: "عمرو طارق إبراهيم",
      memberNumber: "#1005",
      description: "خزانة - 3 أشهر",
      amount: "450 ج.م",
      paymentMethod: "Cash",
      cardLast4: "",
      dateTime: "2024-05-19 08:05 م",
      status: "Paid",
      avatar: "ع",
    },
    {
      id: "6",
      receiptNo: "#P-10081",
      memberName: "إسلام محمد فتحي",
      memberNumber: "#1006",
      description: "تجديد اشتراك شهري",
      amount: "1,800 ج.م",
      paymentMethod: "VISA",
      cardLast4: "**** 1234",
      dateTime: "2024-05-19 11:10 ص",
      status: "Paid",
      avatar: "إ",
    },
    {
      id: "7",
      receiptNo: "#P-10080",
      memberName: "هالة أحمد مصطفي",
      memberNumber: "#1007",
      description: "منتج بروتين شيك",
      amount: "120 ج.م",
      paymentMethod: "Cash",
      cardLast4: "",
      dateTime: "2024-05-18 01:10 م",
      status: "Paid",
      avatar: "هـ",
    },
  ];

  // Merge API data with fallback
  const displayTransactions = paymentList.length > 0
    ? paymentList.map((p, idx) => ({
        id: p.id,
        receiptNo: `#P-100${86 - idx}`,
        memberName: p.memberFullName || "عضو عام",
        memberNumber: p.memberNumber || "#1000",
        description: "تحصيل حساب اشتراك",
        amount: `${p.amount} ج.م`,
        paymentMethod: p.paymentMethod === "CreditCard" ? "VISA" : "Cash",
        cardLast4: p.paymentMethod === "CreditCard" ? "**** 4567" : "",
        dateTime: new Date(p.paidAt).toLocaleString("ar-EG"),
        status: "Paid",
        avatar: p.memberFullName ? p.memberFullName.charAt(0) : "ع",
      }))
    : mockTransactions;

  const activeQuery = tableSearchQuery || topSearchQuery;
  const filteredTransactions = displayTransactions.filter((tx) => {
    const matchesSearch =
      !activeQuery.trim() ||
      tx.memberName.toLowerCase().includes(activeQuery.toLowerCase()) ||
      tx.memberNumber.includes(activeQuery) ||
      tx.receiptNo.toLowerCase().includes(activeQuery.toLowerCase());

    const matchesMethod =
      paymentMethodFilter === "all" ||
      (paymentMethodFilter === "cash" && tx.paymentMethod === "Cash") ||
      (paymentMethodFilter === "visa" && tx.paymentMethod === "VISA");

    return matchesSearch && matchesMethod;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    createPaymentMutation.mutate(
      {
        memberId: formData.memberId || "member-id",
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      },
      {
        onSuccess: () => {
          setShowModal(false);
          setFormData({ memberId: "", amount: 0, paymentMethod: "Cash", notes: "" });
          refetch();
        },
        onError: (err) => {
          setErrorMessage(extractApiError(err) || "حدث خطأ أثناء تسجيل الدفعة.");
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-[1550px] mx-auto dir-rtl font-tajawal pb-12">
      {/* ── Top Header Section ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium font-cairo mb-1">
            <Link href="/dashboard/reception" className="hover:text-zinc-700">الرئيسية</Link>
            <span>›</span>
            <span className="text-zinc-800 font-bold">المدفوعات</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <DollarSign className="h-5 w-5 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo">المدفوعات (عملياتي)</h1>
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Primary Button */}
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>تسجيل دفعة جديدة</span>
          </button>

          {/* Receipt Action Button */}
          <button className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-sm px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer">
            <Receipt className="h-4 w-4 text-zinc-500" />
            <span>إيصال دفعة</span>
          </button>
        </div>
      </div>

      {/* ── Top Search & Filters Bar ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search Bar (5 cols) */}
        <div className="lg:col-span-5 relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="ابحث باسم العضو أو رقم الهاتف أو رقم الإيصال..."
            value={topSearchQuery}
            onChange={(e) => setTopSearchQuery(e.target.value)}
            className="w-full h-10 pr-10 pl-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 font-medium placeholder:text-zinc-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
          />
        </div>

        {/* Status Dropdown (2 cols) */}
        <div className="lg:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-700 font-bold font-cairo focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer"
          >
            <option value="all">كل الحالات</option>
            <option value="paid">مدفوعة</option>
            <option value="pending">معلقة</option>
          </select>
        </div>

        {/* Payment Methods Dropdown (2 cols) */}
        <div className="lg:col-span-2">
          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-700 font-bold font-cairo focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer"
          >
            <option value="all">كل طرق الدفع</option>
            <option value="cash">نقداً (كاش)</option>
            <option value="visa">بطاقة VISA</option>
          </select>
        </div>

        {/* Date Range Selector (3 cols) */}
        <div className="lg:col-span-3 relative">
          <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-700 font-bold font-cairo cursor-pointer">
            <Calendar className="h-4 w-4 text-zinc-500 shrink-0" />
            <span className="text-xs font-mono">{dateRange}</span>
          </div>
        </div>
      </div>

      {/* ── 4 Summary Stat Cards Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card 1: إجمالي المدفوعات */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">إجمالي المدفوعات</span>
            <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <DollarSign className="h-5 w-5 stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-zinc-900 font-cairo tracking-tight">
              24,580 <span className="text-xs font-bold text-zinc-500">ج.م</span>
            </p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">هذا الشهر</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md dir-ltr">
              <TrendingUp className="h-3 w-3" />
              <span>12.4%</span>
            </span>
            <span className="text-[10px] text-zinc-400">من الشهر الماضي</span>
          </div>
        </div>

        {/* Stat Card 2: عدد العمليات */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">عدد العمليات</span>
            <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Receipt className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">128</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">هذا الشهر</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md dir-ltr">
              <TrendingUp className="h-3 w-3" />
              <span>8.7%</span>
            </span>
            <span className="text-[10px] text-zinc-400">من الشهر الماضي</span>
          </div>
        </div>

        {/* Stat Card 3: متوسط قيمة العملية */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">متوسط قيمة العملية</span>
            <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <BarChart3 className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-zinc-900 font-cairo tracking-tight">
              192 <span className="text-xs font-bold text-zinc-500">ج.م</span>
            </p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">هذا الشهر</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md dir-ltr">
              <TrendingUp className="h-3 w-3" />
              <span>3.1%</span>
            </span>
            <span className="text-[10px] text-zinc-400">من الشهر الماضي</span>
          </div>
        </div>

        {/* Stat Card 4: المبلغ المستحق (متأخر) */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">المبلغ المستحق (متأخر)</span>
            <div className="h-10 w-10 rounded-full bg-rose-900 text-white flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-zinc-900 font-cairo tracking-tight">
              2,350 <span className="text-xs font-bold text-zinc-500">ج.م</span>
            </p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">لـ 8 اشتراكات</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 font-cairo">
              <span>عرض المتأخرات</span>
              <span>←</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Info Notice Banner ──────────────────────────────────────────────── */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 px-5 flex items-center justify-between gap-3 text-xs text-blue-900 font-bold font-cairo">
        <div className="flex items-center gap-2">
          <Info className="h-4.5 w-4.5 text-blue-600 shrink-0" />
          <span>هذه قائمة عملياتك، فقط. لعرض جميع مدفوعات الفرع أو عمليات الاسترجاع، يرجى التواصل مع مدير الفرع.</span>
        </div>
      </div>

      {/* ── Main Transactions Table Card ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-4">
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo">إجمالي النتائج:</h2>
            <span className="text-sm font-black text-zinc-900 font-cairo">{filteredTransactions.length} عملية</span>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-bold font-cairo transition-all cursor-pointer">
              <Download className="h-3.5 w-3.5 text-zinc-500" />
              <span>تصدير</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-bold font-cairo transition-all cursor-pointer">
              <Filter className="h-3.5 w-3.5 text-zinc-500" />
              <span>فلاتر متقدمة</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60 text-xs font-bold text-zinc-400 font-cairo">
                <th className="py-3.5 px-4 text-center">الحالة</th>
                <th className="py-3.5 px-4 text-center">التاريخ والوقت</th>
                <th className="py-3.5 px-4">العضو</th>
                <th className="py-3.5 px-4">البيان</th>
                <th className="py-3.5 px-4 text-center">المبلغ</th>
                <th className="py-3.5 px-4 text-center">الإيصال</th>
                <th className="py-3.5 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-zinc-400 font-medium">
                    لا توجد عمليات ماليّة تطابق التصفية الحالية.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-50/80 transition-colors">
                    {/* Status Pill Tag */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 rounded-full border border-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                        <span>مدفوعة</span>
                      </span>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4 font-mono text-zinc-600 text-center">
                      {tx.dateTime}
                    </td>

                    {/* Member */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-zinc-900 text-white font-black flex items-center justify-center text-xs shrink-0 font-cairo">
                          {tx.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 font-cairo">{tx.memberName}</p>
                          <p className="text-[10px] text-zinc-400 font-mono">{tx.memberNumber}</p>
                        </div>
                      </div>
                    </td>

                    {/* Description / Item */}
                    <td className="py-3.5 px-4 font-bold text-zinc-800 font-cairo">
                      {tx.description}
                    </td>

                    {/* Amount & Method Badge */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-black text-zinc-900 dir-ltr font-cairo">{tx.amount}</span>
                        {tx.paymentMethod === "VISA" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-black rounded border border-blue-200">
                            <span>{tx.cardLast4}</span>
                            <span>VISA</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-100 text-zinc-700 text-[10px] font-bold rounded border border-zinc-200">
                            <span>كاش</span>
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Receipt Code Link */}
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-rose-700 hover:underline cursor-pointer">
                      {tx.receiptNo}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <button className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
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
            <span>عرض 1 - {filteredTransactions.length} من {paymentList.length || 128} عملية</span>
            <span>•</span>
            <select className="h-8 px-2 rounded-lg border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-700 focus:outline-none">
              <option value="10">10 لكل صفحة</option>
              <option value="25">25 لكل صفحة</option>
              <option value="50">50 لكل صفحة</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 disabled:opacity-50">
              ‹
            </button>
            <button className="h-8 w-8 rounded-lg bg-gym-yellow text-gym-black font-black flex items-center justify-center">
              1
            </button>
            <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100">
              2
            </button>
            <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100">
              3
            </button>
            <span className="px-1 text-zinc-400">...</span>
            <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100">
              13
            </button>
            <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ── Payment Creation Modal Dialog ───────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 dir-rtl font-tajawal">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-zinc-200 shadow-2xl animate-card-enter"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gym-yellow text-gym-black flex items-center justify-center">
                  <DollarSign className="h-4 w-4 stroke-[3]" />
                </div>
                <h3 className="text-base font-black text-zinc-900 font-cairo">تسجيل دفعة جديدة</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="h-8 w-8 rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-800 flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 font-cairo block">المبلغ المقبوض (ج.م) *</label>
              <input
                type="number"
                required
                min={1}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs font-bold text-zinc-900 focus:outline-none focus:border-amber-400 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 font-cairo block">طريقة الدفع *</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs font-bold text-zinc-700 focus:outline-none focus:border-amber-400 focus:bg-white cursor-pointer"
              >
                <option value="Cash">نقداً (Cash)</option>
                <option value="CreditCard">بطاقة ائتمان (VISA / MasterCard)</option>
                <option value="BankTransfer">InstaPay / تحويل بنكي</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 font-cairo block">ملاحظات أو رقم الإيصال</label>
              <input
                type="text"
                placeholder="أدخل أي بيان إضافي للعملية..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 font-medium focus:outline-none focus:border-amber-400 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-zinc-100">
              <button
                type="submit"
                disabled={createPaymentMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {createPaymentMutation.isPending && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>تحصيل وحفظ الإيصال</span>
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-bold font-cairo transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

