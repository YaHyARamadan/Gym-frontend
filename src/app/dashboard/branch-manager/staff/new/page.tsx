"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  ArrowLeft,
  Mail,
  Briefcase,
  RefreshCw,
  XCircle,
  Info,
} from "lucide-react";
import { useInviteStaff } from "@/features/owner/hooks/useStaff";
import type { UserRole } from "@/features/owner/types";
import { extractApiError } from "@/lib/utils";

export default function InviteStaffPage() {
  const router = useRouter();
  const inviteMutation = useInviteStaff();

  const [formData, setFormData] = useState({
    email: "",
    role: "Coach" as UserRole,
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.email.trim()) {
      setErrorMessage("البريد الإلكتروني مطلوب.");
      return;
    }

    inviteMutation.mutate(
      {
        email: formData.email.trim(),
        role: formData.role,
      },
      {
        onSuccess: () => {
          router.push("/dashboard/branch-manager/staff");
        },
        onError: (err: unknown) => {
          setErrorMessage(extractApiError(err) || "حدث خطأ أثناء إرسال الدعوة.");
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-[900px] mx-auto dir-rtl font-tajawal pb-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/dashboard/branch-manager/staff"
          className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>رجوع</span>
        </Link>

        <div className="text-right flex items-center gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
              <span>دعوة موظف جديد</span>
              <span>‹</span>
              <span>الموظفون</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">
              دعوة موظف جديد لفرعك
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

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-8">
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-r-4 border-amber-400 pr-3">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo">معلومات الدعوة</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Email */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">
                البريد الإلكتروني للموظف <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="coach@gym.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* Role - Restricted to Coach / Reception */}
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
                  <option value="Reception">موظف استقبال</option>
                </select>
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3 text-xs font-medium text-amber-950 text-right">
          <Info className="h-5 w-5 text-amber-600 shrink-0" />
          <span>
            سيتم إرسال رابط دعوة إلى بريد الموظف مجدولاً تلقائياً على فرعك الحالي. يمكن للموظف إكمال إنشاء الحساب والانضمام لفريقك مباشرة.
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-start gap-4 pt-4 border-t border-zinc-100">
          <button
            type="submit"
            disabled={inviteMutation.isPending}
            className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-8 py-3 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer disabled:opacity-50"
          >
            {inviteMutation.isPending && <RefreshCw className="h-4 w-4 animate-spin" />}
            <span>إرسال الدعوة</span>
          </button>

          <Link
            href="/dashboard/branch-manager/staff"
            className="bg-white hover:bg-zinc-50 text-zinc-600 font-cairo font-bold text-sm px-8 py-3 rounded-xl border border-zinc-200 transition-all text-center cursor-pointer"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
