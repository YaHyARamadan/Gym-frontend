"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  MapPin,
  FileText,
  Users,
  Hash,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useCreateBranch } from "@/features/owner/hooks/useBranches";

export default function AddNewBranchPage() {
  const router = useRouter();
  const createBranchMutation = useCreateBranch();

  const [formData, setFormData] = useState({
    name: "",
    managerUserId: "",
    phone: "",
    email: "",
    branchType: "",
    status: "active",
    address: "",
    governorate: "",
    city: "",
    postalCode: "",
    capacity: "",
    notes: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    createBranchMutation.mutate(
      {
        name: formData.name,
        address: [formData.address, formData.city, formData.governorate].filter(Boolean).join(" - ") || undefined,
        phone: formData.phone || undefined,
        managerUserId: formData.managerUserId || undefined,
      },
      {
        onSuccess: () => {
          router.push("/dashboard/owner/branches");
        },
        onError: (err: any) => {
          setErrorMessage(err?.response?.data?.message || err?.message || "حدث خطأ أثناء حفظ الفرع. يرجى المحاولة مرة أخرى.");
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto dir-rtl font-tajawal pb-12">
      {/* ── Header & Breadcrumbs ── */}
      <div className="flex items-center justify-between gap-4">
        {/* Back Button */}
        <Link
          href="/dashboard/owner/branches"
          className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>رجوع</span>
        </Link>

        {/* Title */}
        <div className="text-right flex items-center gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
              <span>إضافة فرع جديد</span>
              <span>‹</span>
              <span>الفروع</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">
              إضافة فرع جديد
            </h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
            <Building2 className="h-6 w-6" strokeWidth={1.8} />
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
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-8">
        
        {/* ── Section 1: معلومات الفرع ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-r-4 border-amber-400 pr-3">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo">معلومات الفرع</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. اسم الفرع */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">
                اسم الفرع <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: فرع مدينة نصر"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* 2. مدير الفرع */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">مدير الفرع</label>
              <div className="relative">
                <select
                  value={formData.managerUserId}
                  onChange={(e) => setFormData({ ...formData, managerUserId: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">اختر مدير الفرع (اختياري)</option>
                </select>
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* 3. رقم الهاتف */}
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

            {/* 4. البريد الإلكتروني */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="branch@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* 5. نوع الفرع */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">نوع الفرع</label>
              <div className="relative">
                <select
                  value={formData.branchType}
                  onChange={(e) => setFormData({ ...formData, branchType: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">اختر نوع الفرع</option>
                  <option value="رجالي">رجالي</option>
                  <option value="سيدات">سيدات</option>
                  <option value="مختلط">مختلط (VIP)</option>
                </select>
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* 6. حالة الفرع */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">حالة الفرع</label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
                <CheckCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-zinc-100" />

        {/* ── Section 2: موقع الفرع ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-r-4 border-amber-400 pr-3">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo">موقع الفرع</h2>
          </div>

          {/* العنوان التفصيلي */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-bold text-zinc-700 font-cairo">العنوان</label>
            <div className="relative">
              <input
                type="text"
                placeholder="أدخل عنوان الفرع بالتفصيل"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
              />
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* المحافظة */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">المحافظة</label>
              <div className="relative">
                <select
                  value={formData.governorate}
                  onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">اختر المحافظة</option>
                  <option value="القاهرة">القاهرة</option>
                  <option value="الجيزة">الجيزة</option>
                  <option value="الإسكندرية">الإسكندرية</option>
                  <option value="الشرقية">الشرقية</option>
                </select>
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* المدينة / المنطقة */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">المدينة / المنطقة</label>
              <div className="relative">
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">اختر المدينة / المنطقة</option>
                  <option value="مدينة نصر">مدينة نصر</option>
                  <option value="المهندسين">المهندسين</option>
                  <option value="المعادي">المعادي</option>
                  <option value="التجمع الخامس">التجمع الخامس</option>
                </select>
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* الرمز البريدي */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">الرمز البريدي</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="مثال: 12345"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-zinc-100" />

        {/* ── Section 3: معلومات إضافية ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-r-4 border-amber-400 pr-3">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo">معلومات إضافية</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* الطاقة الاستيعابية */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">الطاقة الاستيعابية</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="مثال: 250"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* ملاحظات */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">ملاحظات</label>
              <div className="relative">
                <textarea
                  rows={2}
                  placeholder="أضف أي ملاحظات حول الفرع (اختياري)"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full py-3 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all resize-none"
                />
                <FileText className="absolute left-3.5 top-4 h-4 w-4 text-zinc-400" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Form Actions (Buttons) ── */}
        <div className="flex items-center justify-start gap-4 pt-4 border-t border-zinc-100">
          <button
            type="submit"
            disabled={createBranchMutation.isPending}
            className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-8 py-3 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer disabled:opacity-50"
          >
            {createBranchMutation.isPending && <RefreshCw className="h-4 w-4 animate-spin" />}
            <span>حفظ الفرع</span>
          </button>

          <Link
            href="/dashboard/owner/branches"
            className="bg-white hover:bg-zinc-50 text-zinc-600 font-cairo font-bold text-sm px-8 py-3 rounded-xl border border-zinc-200 transition-all text-center cursor-pointer"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
