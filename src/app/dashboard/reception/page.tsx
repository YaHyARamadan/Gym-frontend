"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  Key,
  DollarSign,
  AlertCircle,
  Plus,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Bell,
  Zap,
  RotateCw,
  UserPlus,
  CreditCard,
  UserCheck,
  Building2,
  FileEdit,
  BadgeAlert,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/shared/auth/AuthContext";
import { useMembers } from "@/features/owner/hooks/useMembers";
import { useLockers, useComplaints } from "@/features/reception/hooks/useReception";

export default function ReceptionDashboardPage() {
  const { user } = useAuth();
  const { data: membersData } = useMembers();
  const { data: lockersData } = useLockers();
  const { data: complaintsData } = useComplaints();

  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  const lockersList = Array.isArray(lockersData)
    ? lockersData
    : (lockersData as unknown as { items?: Array<{ status: string }> })?.items || [];

  const complaintsList = Array.isArray(complaintsData)
    ? complaintsData
    : (complaintsData as unknown as { items?: Array<{ status: string }> })?.items || [];

  const activeMembersCount = membersData?.items?.filter((m) => m.isActive).length || 986;
  const pendingComplaints = complaintsList.filter((c) => c.status === "Pending").length || 3;
  const rentedLockersCount = lockersList.filter((l) => l.status === "Occupied" || l.status === "Rented").length || 72;

  // Chart data for 7 days payments
  const paymentsChartData = [
    { day: "الأربعاء", amount: "3,250", value: 3250, x: 20, y: 110 },
    { day: "الخميس", amount: "4,180", value: 4180, x: 75, y: 92 },
    { day: "الجمعة", amount: "6,320", value: 6320, x: 130, y: 50 },
    { day: "السبت", amount: "3,980", value: 3980, x: 185, y: 96 },
    { day: "الأحد", amount: "5,760", value: 5760, x: 240, y: 61 },
    { day: "الإثنين", amount: "4,810", value: 4810, x: 295, y: 80 },
    { day: "اليوم", amount: "2,280", value: 2280, x: 350, y: 130 },
  ];

  return (
    <div className="space-y-6 max-w-[1550px] mx-auto dir-rtl font-tajawal pb-12">
      {/* ── Top Header Section ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 font-cairo flex items-center gap-2">
            <span>مرحباً بك، {user?.fullName?.split(" ")[0] || "أحمد"}</span>
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-0.5">
            نظرة عامة على عملك اليوم
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Quick Action Primary Button */}
          <Link
            href="/dashboard/reception/members/new"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>تسجيل عضو جديد</span>
          </Link>

          {/* Quick Actions Dropdown Menu Button */}
          <div className="relative">
            <button
              onClick={() => setQuickActionsOpen(!quickActionsOpen)}
              className="flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-cairo font-bold text-sm px-4 py-2.5 rounded-xl border border-zinc-200 transition-all cursor-pointer"
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
                  href="/dashboard/reception/payments"
                  onClick={() => setQuickActionsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                >
                  <CreditCard className="h-4 w-4 text-emerald-500" />
                  <span>إنشاء اشتراك جديد</span>
                </Link>
                <Link
                  href="/dashboard/reception/payments"
                  onClick={() => setQuickActionsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                >
                  <DollarSign className="h-4 w-4 text-blue-500" />
                  <span>تسجيل دفعة</span>
                </Link>
                <Link
                  href="/dashboard/reception/attendance"
                  onClick={() => setQuickActionsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
                >
                  <UserCheck className="h-4 w-4 text-amber-500" />
                  <span>تسجيل حضور عضو</span>
                </Link>
                <Link
                  href="/dashboard/reception/lockers"
                  onClick={() => setQuickActionsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-purple-50 hover:text-purple-900 transition-colors"
                >
                  <Key className="h-4 w-4 text-purple-500" />
                  <span>تأجير خزانة</span>
                </Link>
                <Link
                  href="/dashboard/reception/complaints"
                  onClick={() => setQuickActionsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:bg-rose-50 hover:text-rose-900 transition-colors"
                >
                  <BadgeAlert className="h-4 w-4 text-rose-500" />
                  <span>تسجيل شكوى</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 5 Operational Metric Cards Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric Card 1: أعضاء نشطون */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">أعضاء نشطون</span>
            <div className="h-10 w-10 rounded-full bg-zinc-800 text-white flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">{activeMembersCount}</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">أعضاء لديهم اشتراك نشط</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md dir-ltr">
              <TrendingUp className="h-3 w-3" />
              <span>8.5%</span>
            </span>
            <span className="text-[10px] text-zinc-400">من الشهر الماضي</span>
          </div>
        </div>

        {/* Metric Card 2: اشتراكات منتهية */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">اشتراكات منتهية</span>
            <div className="h-10 w-10 rounded-full bg-rose-900 text-white flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">134</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">تجديد مطلوب</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md dir-ltr">
              <TrendingUp className="h-3 w-3" />
              <span>12.3%</span>
            </span>
            <span className="text-[10px] text-zinc-400">من الشهر الماضي</span>
          </div>
        </div>

        {/* Metric Card 3: حجوزات الخزائن */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">حجوزات الخزائن</span>
            <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Key className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">{rentedLockersCount}</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">خزائن مؤجرة</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md dir-ltr">
              <TrendingUp className="h-3 w-3" />
              <span>5.4%</span>
            </span>
            <span className="text-[10px] text-zinc-400">من الشهر الماضي</span>
          </div>
        </div>

        {/* Metric Card 4: إجمالي المدفوعات */}
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

        {/* Metric Card 5: شكاوى جديدة */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">شكاوى جديدة</span>
            <div className="h-10 w-10 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">{pendingComplaints}</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">بانتظار تحويلها</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <Link
              href="/dashboard/reception/complaints"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 font-cairo"
            >
              <span>عرض الكل</span>
              <span>←</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Middle Section (3 Cards Grid) ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Card 1: المهام والتنبيهات (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100">
              <Bell className="h-5 w-5 text-amber-500 fill-amber-500/20" />
              <h2 className="text-base font-extrabold text-zinc-900 font-cairo">المهام والتنبيهات</h2>
            </div>

            <div className="space-y-3.5">
              {/* Task 1 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors">
                <div className="h-8 w-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-800 font-cairo">اشتراكات منتهية تحتاج لإشعار</p>
                  <p className="text-[11px] text-zinc-400 font-medium">134 عضو</p>
                </div>
                <span className="text-[10px] text-zinc-400 shrink-0">منذ 20 دقيقة</span>
              </div>

              {/* Task 2 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors">
                <div className="h-8 w-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <FileEdit className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-800 font-cairo">طلبات تعديل بيانات جديدة</p>
                  <p className="text-[11px] text-zinc-400 font-medium">2 طلبات جديدة</p>
                </div>
                <span className="text-[10px] text-zinc-400 shrink-0">منذ 35 دقيقة</span>
              </div>

              {/* Task 3 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors">
                <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-800 font-cairo">دفعات لم يتم تسجيلها</p>
                  <p className="text-[11px] text-zinc-400 font-medium">5 دفعات اليوم</p>
                </div>
                <span className="text-[10px] text-zinc-400 shrink-0">منذ ساعة</span>
              </div>

              {/* Task 4 */}
              <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors">
                <div className="h-8 w-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-800 font-cairo">شكاوى لم يتم تحويلها</p>
                  <p className="text-[11px] text-zinc-400 font-medium">3 شكاوى جديدة</p>
                </div>
                <span className="text-[10px] text-zinc-400 shrink-0">منذ ساعتين</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 text-center">
            <Link
              href="/dashboard/reception/complaints"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 font-cairo inline-flex items-center gap-1"
            >
              <span>عرض كل التنبيهات</span>
              <span>←</span>
            </Link>
          </div>
        </div>

        {/* Card 2: المدفوعات - آخر 7 أيام (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                <h2 className="text-base font-extrabold text-zinc-900 font-cairo">المدفوعات - آخر 7 أيام</h2>
              </div>
              <span className="text-xs font-bold text-zinc-400">ج.م</span>
            </div>

            {/* Area Chart Container */}
            <div className="relative w-full h-48 mt-2">
              <svg viewBox="0 0 380 160" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F5C518" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#F5C518" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="0" y1="30" x2="370" y2="30" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="65" x2="370" y2="65" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="370" y2="100" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="135" x2="370" y2="135" stroke="#e4e4e7" strokeWidth="1" />

                {/* Filled Area */}
                <path
                  d="M 20 110 Q 47 101, 75 92 T 130 50 T 185 96 T 240 61 T 295 80 T 350 130 L 350 135 L 20 135 Z"
                  fill="url(#yellowGradient)"
                />

                {/* Smooth Curve Line */}
                <path
                  d="M 20 110 Q 47 101, 75 92 T 130 50 T 185 96 T 240 61 T 295 80 T 350 130"
                  fill="none"
                  stroke="#F5C518"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Data Points with Text Above */}
                {paymentsChartData.map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.y} r="5" fill="#F5C518" stroke="#ffffff" strokeWidth="2.5" />
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      fill="#3f3f46"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      {pt.amount}
                    </text>
                    <text
                      x={pt.x}
                      y="150"
                      textAnchor="middle"
                      fill="#71717a"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {pt.day}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 text-center">
            <Link
              href="/dashboard/reception/payments"
              className="inline-block w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold font-cairo rounded-xl transition-colors text-center"
            >
              عرض التقرير الكامل
            </Link>
          </div>
        </div>

        {/* Card 3: إجراءات سريعة (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-100">
              <Zap className="h-5 w-5 text-amber-500 fill-amber-500/20" />
              <h2 className="text-base font-extrabold text-zinc-900 font-cairo">إجراءات سريعة</h2>
            </div>

            <div className="space-y-2">
              <Link
                href="/dashboard/reception/members/new"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-amber-50/70 border border-zinc-200/70 hover:border-amber-300 transition-all group"
              >
                <span className="text-xs font-extrabold text-zinc-800 group-hover:text-amber-900 font-cairo">
                  تسجيل عضو جديد
                </span>
                <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <UserPlus className="h-3.5 w-3.5" />
                </div>
              </Link>

              <Link
                href="/dashboard/reception/payments"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-emerald-50/70 border border-zinc-200/70 hover:border-emerald-300 transition-all group"
              >
                <span className="text-xs font-extrabold text-zinc-800 group-hover:text-emerald-900 font-cairo">
                  إنشاء اشتراك جديد
                </span>
                <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CreditCard className="h-3.5 w-3.5" />
                </div>
              </Link>

              <Link
                href="/dashboard/reception/payments"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-blue-50/70 border border-zinc-200/70 hover:border-blue-300 transition-all group"
              >
                <span className="text-xs font-extrabold text-zinc-800 group-hover:text-blue-900 font-cairo">
                  تسجيل دفعة
                </span>
                <div className="h-7 w-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <DollarSign className="h-3.5 w-3.5" />
                </div>
              </Link>

              <Link
                href="/dashboard/reception/attendance"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-amber-50/70 border border-zinc-200/70 hover:border-amber-300 transition-all group"
              >
                <span className="text-xs font-extrabold text-zinc-800 group-hover:text-amber-900 font-cairo">
                  تسجيل حضور عضو
                </span>
                <div className="h-7 w-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <UserCheck className="h-3.5 w-3.5" />
                </div>
              </Link>

              <Link
                href="/dashboard/reception/lockers"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-purple-50/70 border border-zinc-200/70 hover:border-purple-300 transition-all group"
              >
                <span className="text-xs font-extrabold text-zinc-800 group-hover:text-purple-900 font-cairo">
                  تأجير خزانة
                </span>
                <div className="h-7 w-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Key className="h-3.5 w-3.5" />
                </div>
              </Link>

              <Link
                href="/dashboard/reception/complaints"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-rose-50/70 border border-zinc-200/70 hover:border-rose-300 transition-all group"
              >
                <span className="text-xs font-extrabold text-zinc-800 group-hover:text-rose-900 font-cairo">
                  تسجيل شكوى
                </span>
                <div className="h-7 w-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <BadgeAlert className="h-3.5 w-3.5" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Section (2 Cards Grid) ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: آخر العمليات (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <RotateCw className="h-5 w-5 text-amber-500" />
                <h2 className="text-base font-extrabold text-zinc-900 font-cairo">آخر العمليات</h2>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-zinc-100 text-[11px] font-bold text-zinc-400 font-cairo">
                    <th className="py-2.5 px-3">الوقت</th>
                    <th className="py-2.5 px-3">النوع</th>
                    <th className="py-2.5 px-3">التفاصيل</th>
                    <th className="py-2.5 px-3">العضو</th>
                    <th className="py-2.5 px-3">المبلغ</th>
                    <th className="py-2.5 px-3 text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {/* Row 1 */}
                  <tr className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-zinc-500 dir-ltr text-right">10:45 ص</td>
                    <td className="py-3 px-3 font-bold text-zinc-800 font-cairo">دفعة</td>
                    <td className="py-3 px-3 text-zinc-600">اشتراك شهري</td>
                    <td className="py-3 px-3 font-bold text-zinc-900 font-cairo">أحمد خالد محمد</td>
                    <td className="py-3 px-3 font-bold text-zinc-900 dir-ltr text-right">2,100 ج.م</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                        مسجلة
                      </span>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-zinc-500 dir-ltr text-right">10:20 ص</td>
                    <td className="py-3 px-3 font-bold text-zinc-800 font-cairo">حضور</td>
                    <td className="py-3 px-3 text-zinc-600">تسجيل دخول</td>
                    <td className="py-3 px-3 font-bold text-zinc-900 font-cairo">سارة محمود علي</td>
                    <td className="py-3 px-3 text-zinc-400">-</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                        مسجلة
                      </span>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-zinc-500 dir-ltr text-right">09:35 ص</td>
                    <td className="py-3 px-3 font-bold text-zinc-800 font-cairo">اشتراك</td>
                    <td className="py-3 px-3 text-zinc-600">اشتراك 3 أشهر</td>
                    <td className="py-3 px-3 font-bold text-zinc-900 font-cairo">محمد أسامة حسن</td>
                    <td className="py-3 px-3 font-bold text-zinc-900 dir-ltr text-right">3,200 ج.م</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2.5 py-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                        مسجلة
                      </span>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-zinc-500 dir-ltr text-right">09:10 ص</td>
                    <td className="py-3 px-3 font-bold text-zinc-800 font-cairo">شكوى</td>
                    <td className="py-3 px-3 text-zinc-600">شكوى حول نظافة الخزائن</td>
                    <td className="py-3 px-3 font-bold text-zinc-900 font-cairo">أمل طارق إبراهيم</td>
                    <td className="py-3 px-3 text-zinc-400">-</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2.5 py-1 text-[10px] font-bold bg-amber-100 text-amber-800 rounded-md">
                        بانتظار التحويل
                      </span>
                    </td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-zinc-500 dir-ltr text-right">08:50 ص</td>
                    <td className="py-3 px-3 font-bold text-zinc-800 font-cairo">طلب تعديل</td>
                    <td className="py-3 px-3 text-zinc-600">طلب تعديل بيانات</td>
                    <td className="py-3 px-3 font-bold text-zinc-900 font-cairo">يوسف علي محمود</td>
                    <td className="py-3 px-3 text-zinc-400">-</td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block px-2.5 py-1 text-[10px] font-bold bg-rose-100 text-rose-800 rounded-md">
                        جديد
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 text-center">
            <Link
              href="/dashboard/reception/payments"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 font-cairo inline-flex items-center gap-1"
            >
              <span>عرض كل العمليات</span>
              <span>←</span>
            </Link>
          </div>
        </div>

        {/* Right Column: توزيع الاشتراكات النشطة (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo mb-4 pb-3 border-b border-zinc-100 text-center lg:text-right">
              توزيع الاشتراكات النشطة
            </h2>

            {/* Donut Chart SVG Container */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {/* Segment 1: 48% Yellow (#F5C518) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#F5C518"
                    strokeWidth="16"
                    strokeDasharray="114.6 238.7"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: 27% Dark (#27272a) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#27272a"
                    strokeWidth="16"
                    strokeDasharray="64.4 238.7"
                    strokeDashoffset="-114.6"
                  />
                  {/* Segment 3: 15% Maroon/Red (#881337) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#881337"
                    strokeWidth="16"
                    strokeDasharray="35.8 238.7"
                    strokeDashoffset="-179.0"
                  />
                  {/* Segment 4: 10% Gray (#a1a1aa) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#a1a1aa"
                    strokeWidth="16"
                    strokeDasharray="23.9 238.7"
                    strokeDashoffset="-214.8"
                  />
                </svg>

                {/* Donut Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-zinc-900 font-cairo">986</span>
                  <span className="text-[11px] font-bold text-zinc-400 font-cairo">إجمالي</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="w-full space-y-2 mt-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-amber-400 shrink-0"></span>
                    <span className="font-bold text-zinc-700 font-cairo">اشتراك شهري</span>
                  </div>
                  <span className="font-black text-zinc-900 dir-ltr">48%</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-zinc-800 shrink-0"></span>
                    <span className="font-bold text-zinc-700 font-cairo">اشتراك 3 أشهر</span>
                  </div>
                  <span className="font-black text-zinc-900 dir-ltr">27%</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-rose-900 shrink-0"></span>
                    <span className="font-bold text-zinc-700 font-cairo">اشتراك 6 أشهر</span>
                  </div>
                  <span className="font-black text-zinc-900 dir-ltr">15%</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-zinc-400 shrink-0"></span>
                    <span className="font-bold text-zinc-700 font-cairo">اشتراك سنوي</span>
                  </div>
                  <span className="font-black text-zinc-900 dir-ltr">10%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 text-center">
            <Link
              href="/dashboard/reception/members"
              className="inline-block w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold font-cairo rounded-xl transition-colors text-center"
            >
              عرض التفاصيل
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

