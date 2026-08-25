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
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AddNewStaffPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    birthDate: "",
    gender: "",
    nationality: "",
    nationalId: "",
    branch: "",
    role: "",
    hireDate: "",
    employmentType: "",
    baseSalary: "",
    commission: "",
    username: "",
    password: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent, redirect: boolean = true) => {
    e.preventDefault();
    if (redirect) {
      router.push("/dashboard/owner/staff");
    } else {
      // Reset form for adding another employee
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        birthDate: "",
        gender: "",
        nationality: "",
        nationalId: "",
        branch: "",
        role: "",
        hireDate: "",
        employmentType: "",
        baseSalary: "",
        commission: "",
        username: "",
        password: "",
        notes: "",
      });
    }
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
              إضافة موظف جديد
            </h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
            <UserPlus className="h-6 w-6" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* ── Main Form Card ── */}
      <form onSubmit={(e) => handleSubmit(e, true)} className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-8">
        
        {/* ── Section 1: المعلومات الشخصية ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-r-4 border-amber-400 pr-3">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo">المعلومات الشخصية</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* 1. الاسم بالكامل */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">
                الاسم بالكامل <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: محمد أحمد علي"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* 2. رقم الهاتف */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="0100 123 4567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all dir-ltr text-right"
                />
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* 3. البريد الإلكتروني */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="examch@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* 4. تاريخ الميلاد */}
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

            {/* 5. نوع الجنس */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">
                نوع الجنس <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
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

            {/* 6. الجنسية */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">
                الجنسية <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">اختر الجنسية</option>
                  <option value="مصري">مصري</option>
                  <option value="سعودي">سعودي</option>
                  <option value="إماراتي">إماراتي</option>
                  <option value="أخرى">أخرى</option>
                </select>
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* 7. الرقم القومي */}
            <div className="space-y-1.5 text-right md:col-span-2">
              <label className="text-xs font-bold text-zinc-700 font-cairo">الرقم القومي</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="رقم رقم"
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-zinc-100" />

        {/* ── Section 2: معلومات الوظيفة ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-r-4 border-amber-400 pr-3">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo">معلومات الوظيفة</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* 1. الفرع */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">
                الفرع <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">اختر الفرع</option>
                  <option value="فرع مدينة نصر">فرع مدينة نصر</option>
                  <option value="فرع المهندسين">فرع المهندسين</option>
                  <option value="فرع المعادي">فرع المعادي</option>
                </select>
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
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
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">اختر الدور الوظيفي</option>
                  <option value="مدير فرع">مدير فرع</option>
                  <option value="كوتش">كوتش (مدرب)</option>
                  <option value="أخصائية تغذية">أخصائي تغذية</option>
                  <option value="موظف استقبال">موظف استقبال</option>
                </select>
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* 3. تاريخ التعيين */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">
                تاريخ التعيين <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="اختر تاريخ التعيين"
                  value={formData.hireDate}
                  onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* 4. نوع التوظيف */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">
                نوع التوظيف <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.employmentType}
                  onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">اختر نوع التوظيف</option>
                  <option value="دوام كامل">دوام كامل</option>
                  <option value="دوام جزئي">دوام جزئي</option>
                  <option value="بالساعة">بالساعة</option>
                </select>
                <CheckCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-zinc-100" />

        {/* ── Section 3: معلومات إضافية وحساب النظام ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-r-4 border-amber-400 pr-3">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo">معلومات إضافية</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* 1. الراتب الأساسي */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">الراتب الأساسي (ج.م)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="أدخل الراتب الأساسي"
                  value={formData.baseSalary}
                  onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* 2. نسبة العمولة */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">نسبة العمولة (%)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="أدخل نسبة العمولة"
                  value={formData.commission}
                  onChange={(e) => setFormData({ ...formData, commission: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <Percent className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* 3. اسم المستخدم */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">اسم المستخدم</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="أدخل اسم المستخدم"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
              <p className="text-[10px] text-zinc-400 font-medium">سيستخدم لتسجيل الدخول للنظام</p>
            </div>

            {/* 4. كلمة المرور */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">كلمة المرور</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
              <p className="text-[10px] text-zinc-400 font-medium">سيستخدم لتسجيل الدخول للنظام</p>
            </div>
          </div>

          {/* ملاحظات حول الموظف */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-bold text-zinc-700 font-cairo">ملاحظات</label>
            <div className="relative">
              <textarea
                rows={2}
                placeholder="أضف أي ملاحظات حول الموظف (اختياري)"
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
            type="submit"
            className="bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-8 py-3 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer"
          >
            حفظ الموظف
          </button>

          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            className="bg-white hover:bg-zinc-50 text-zinc-800 font-cairo font-bold text-sm px-6 py-3 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer"
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
