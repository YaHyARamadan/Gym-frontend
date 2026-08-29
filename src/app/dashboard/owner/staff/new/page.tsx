"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  Globe,
  CreditCard,
  Building2,
  Briefcase,
  CheckCircle2,
  DollarSign,
  Percent,
  Lock,
  FileText,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useCreateDirectStaff } from "@/features/owner/hooks/useStaff";
import { useBranches } from "@/features/owner/hooks/useBranches";
import type { UserRole } from "@/features/owner/types";
import { extractApiError } from "@/lib/utils";

export default function AddNewStaffPage() {
  const router = useRouter();
  const createStaffMutation = useCreateDirectStaff();
  const { data: branches } = useBranches();

  const [formData, setFormData] = useState({
    email: "",
    role: "Coach" as UserRole,
    branchId: "",
    fullName: "",
    phone: "",
    birthDate: "",
    gender: "",
    nationality: "",
    nationalId: "",
    hireDate: "",
    employmentType: "",
    baseSalary: "",
    commission: "",
    username: "",
    password: "",
    notes: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent, redirect: boolean = true) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim()) {
      setErrorMessage("الاسم بالكامل مطلوب.");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage("البريد الإلكتروني مطلوب.");
      return;
    }

    createStaffMutation.mutate(
      {
        email: formData.email,
        password: formData.password.trim() || "Gym1234#",
        fullName: formData.fullName,
        role: formData.role,
        branchId: formData.branchId.trim() ? formData.branchId : undefined,
      },
      {
        onSuccess: () => {
          if (redirect) {
            router.push("/dashboard/owner/staff");
          } else {
            setFormData({
              email: "",
              role: "Coach",
              branchId: "",
              fullName: "",
              phone: "",
              birthDate: "",
              gender: "",
              nationality: "",
              nationalId: "",
              hireDate: "",
              employmentType: "",
              baseSalary: "",
              commission: "",
              username: "",
              password: "",
              notes: "",
            });
          }
        },
        onError: (err: unknown) => {
          setErrorMessage(extractApiError(err) || "حدث خطأ أثناء إنشاء حساب الموظف.");
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-[1250px] mx-auto dir-rtl font-tajawal pb-12">
      {/* ── Header & Breadcrumbs ── */}
      <div className="flex items-center justify-between gap-4">
        {/* Back Button */}
        <Link
          href="/dashboard/owner/staff"
          className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>رجوع</span>
        </Link>

        {/* Title */}
        <div className="text-right flex items-center gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
              <span>إضافة موظف جديد</span>
              <span>‹</span>
              <span>الموظفين</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">
              إضافة موظف جديد (دعوة)
            </h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
            <UserPlus className="h-6 w-6" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-3 text-right">
          <XCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ── Main Form Card ── */}
      <form onSubmit={(e) => handleSubmit(e, true)} className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-8">
        
        {/* ── Section 1: المعلومات الشخصية للدعوة ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-r-4 border-amber-400 pr-3">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo">معلومات دعوة الموظف</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. البريد الإلكتروني (أساسي لدعوة الباك إند) */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="examch@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* 2. الدور الوظيفي */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">
                الدور الوظيفي <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="Coach">كوتش (مدرب)</option>
                  <option value="BranchManager">مدير فرع</option>
                  <option value="Reception">موظف استقبال</option>
                  <option value="Owner">مالك جديد</option>
                </select>
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* 3. الفرع */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">الفرع المخصص</label>
              <div className="relative">
                <select
                  value={formData.branchId}
                  onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">اختر الفرع (اختياري)</option>
                  {branches?.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-zinc-100" />

        {/* ── Section 2: معلومات تكميلية ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-r-4 border-amber-400 pr-3">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo">بيانات إضافية للملف</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* الاسم بالكامل */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">الاسم بالكامل</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="مثال: محمد أحمد علي"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* رقم الهاتف */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">رقم الهاتف</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="0100 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all dir-ltr text-right"
                />
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* تاريخ الميلاد */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">تاريخ الميلاد</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="اختر تاريخ الميلاد"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* نوع الجنس */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">نوع الجنس</label>
              <div className="relative">
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">اختر نوع الجنس</option>
                  <option value="ذكر">ذكر</option>
                  <option value="أنثى">أنثى</option>
                </select>
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ملاحظات */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-bold text-zinc-700 font-cairo">ملاحظات</label>
            <div className="relative">
              <textarea
                rows={2}
                placeholder="أضف أي ملاحظات حول الدعوة أو الموظف (اختياري)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full py-3 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all resize-none"
              />
              <FileText className="absolute left-3.5 top-4 h-4 w-4 text-zinc-400" />
            </div>
          </div>
        </div>

        {/* ── Form Actions (Buttons) ── */}
        <div className="flex flex-wrap items-center justify-start gap-4 pt-4 border-t border-zinc-100">
          <button
            type="button"
            disabled={createStaffMutation.isPending}
            onClick={(e) => handleSubmit(e, true)}
            className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-8 py-3 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer disabled:opacity-50"
          >
            {createStaffMutation.isPending && <RefreshCw className="h-4 w-4 animate-spin" />}
            <span>إنشاء حساب الموظف</span>
          </button>

          <button
            type="button"
            disabled={createStaffMutation.isPending}
            onClick={(e) => handleSubmit(e, false)}
            className="bg-white hover:bg-zinc-50 text-zinc-800 font-cairo font-bold text-sm px-6 py-3 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            حفظ وإضافة آخر
          </button>

          <Link
            href="/dashboard/owner/staff"
            className="bg-white hover:bg-zinc-50 text-zinc-600 font-cairo font-bold text-sm px-8 py-3 rounded-xl border border-zinc-200 transition-all text-center cursor-pointer"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
