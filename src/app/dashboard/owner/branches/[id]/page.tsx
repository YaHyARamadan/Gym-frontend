"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Pencil,
  PowerOff,
  Power,
  RefreshCw,
  Users,
  DollarSign,
  BarChart3,
  Activity,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { useBranch, useUpdateBranch, useDeleteBranch } from "@/features/owner/hooks/useBranches";
import { extractApiError } from "@/lib/utils";

export default function BranchDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: branch, isLoading, error } = useBranch(id);
  const updateMutation = useUpdateBranch();
  const deleteMutation = useDeleteBranch();

  const [actionError, setActionError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 dir-rtl font-tajawal">
        <RefreshCw className="h-8 w-8 text-gym-yellow animate-spin" />
        <p className="text-sm font-bold text-zinc-600 font-cairo">جاري تحميل بيانات الفرع...</p>
      </div>
    );
  }

  if (error || !branch) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 dir-rtl font-tajawal text-center p-6 bg-white rounded-3xl border border-zinc-200 shadow-xs max-w-lg mx-auto my-10">
        <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
          <XCircle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900 font-cairo">لم يتم العثور على الفرع</h3>
          <p className="text-xs text-zinc-500 mt-1">تعذر تحميل بيانات هذا الفرع. قد يكون تم حذفه.</p>
        </div>
        <Link
          href="/dashboard/owner/branches"
          className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>العودة للفروع</span>
        </Link>
      </div>
    );
  }

  const handleToggleStatus = () => {
    setActionError(null);
    updateMutation.mutate(
      {
        id: branch.id,
        payload: {
          id: branch.id,
          name: branch.name,
          address: branch.address,
          phone: branch.phone,
          managerUserId: branch.managerUserId,
          isActive: !branch.isActive,
        },
      },
      {
        onError: (err) =>
          setActionError(extractApiError(err) || "حدث خطأ أثناء تغيير حالة الفرع."),
      }
    );
  };

  const handleDelete = () => {
    setActionError(null);
    deleteMutation.mutate(branch.id, {
      onSuccess: () => router.push("/dashboard/owner/branches"),
      onError: (err) => {
        setActionError(extractApiError(err) || "حدث خطأ أثناء حذف الفرع.");
        setShowDeleteConfirm(false);
      },
    });
  };

  const isActing = updateMutation.isPending || deleteMutation.isPending;

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto dir-rtl font-tajawal pb-12">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link
          href="/dashboard/owner/branches"
          className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>رجوع</span>
        </Link>

        <div className="text-right flex items-center gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
              <span>{branch.name}</span>
              <span>‹</span>
              <span>الفروع</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">
              تفاصيل الفرع
            </h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
            <Building2 className="h-6 w-6" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {actionError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* ── Main Info Card ── */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs overflow-hidden">
        {/* Card Header with status banner */}
        <div className={`px-8 py-5 flex items-center justify-between border-b border-zinc-100 ${
          branch.isActive ? "bg-amber-50/60" : "bg-zinc-50"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${
              branch.isActive
                ? "bg-amber-100 border border-amber-200 text-amber-700"
                : "bg-zinc-200 border border-zinc-300 text-zinc-500"
            }`}>
              <Building2 className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <div className="text-right">
              <h2 className="text-lg font-black text-zinc-900 font-cairo">{branch.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                {branch.isActive ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-md border border-amber-300">
                    <CheckCircle2 className="h-3 w-3" />
                    نشط
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-200/60 px-2.5 py-0.5 rounded-md border border-rose-300">
                    <XCircle className="h-3 w-3" />
                    غير نشط
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/owner/branches/${branch.id}/edit`}
              className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>تعديل</span>
            </Link>
            <button
              onClick={handleToggleStatus}
              disabled={isActing}
              className={`flex items-center gap-2 font-cairo font-bold text-xs px-4 py-2.5 rounded-xl border shadow-xs transition-all cursor-pointer disabled:opacity-50 ${
                branch.isActive
                  ? "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200"
                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
              }`}
            >
              {updateMutation.isPending ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : branch.isActive ? (
                <PowerOff className="h-3.5 w-3.5" />
              ) : (
                <Power className="h-3.5 w-3.5" />
              )}
              <span>{branch.isActive ? "تعطيل" : "تفعيل"}</span>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isActing}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-cairo font-bold text-xs px-4 py-2.5 rounded-xl border border-red-200 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>حذف</span>
            </button>
          </div>
        </div>

        {/* Card Body — Info Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phone */}
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 shrink-0 mt-0.5">
              <Phone className="h-4 w-4" />
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-400 font-cairo">رقم الهاتف</p>
              <p className="text-sm font-bold text-zinc-800 mt-0.5 font-mono dir-ltr text-right">
                {branch.phone || "—"}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 shrink-0 mt-0.5">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-400 font-cairo">العنوان</p>
              <p className="text-sm font-bold text-zinc-800 mt-0.5">{branch.address || "—"}</p>
            </div>
          </div>

          {/* Created At */}
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 shrink-0 mt-0.5">
              <Calendar className="h-4 w-4" />
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-400 font-cairo">تاريخ الإنشاء</p>
              <p className="text-sm font-bold text-zinc-800 mt-0.5">
                {new Date(branch.createdAt).toLocaleDateString("ar-EG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Cards (Placeholder) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "إجمالي الأعضاء", value: "—", sub: "عضو", icon: Users, color: "zinc" },
          { label: "الأعضاء النشطين", value: "—", sub: "عضو", icon: Activity, color: "amber" },
          { label: "إيرادات الشهر", value: "—", sub: "ج.م", icon: DollarSign, color: "zinc" },
          { label: "إجمالي الإيرادات", value: "—", sub: "ج.م", icon: BarChart3, color: "zinc" },
        ].map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex items-center justify-between">
            <div className="text-right">
              <p className="text-xs font-bold text-zinc-400 font-cairo">{card.label}</p>
              <p className="text-3xl font-black text-zinc-900 font-cairo mt-1">{card.value}</p>
              <p className="text-xs font-bold text-zinc-400 mt-1">{card.sub}</p>
            </div>
            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${
              card.color === "amber"
                ? "bg-amber-50 border border-amber-200 text-amber-600"
                : "bg-zinc-100 border border-zinc-200 text-zinc-600"
            }`}>
              <card.icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Coming Soon Banner ── */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 flex items-center gap-4 text-right">
        <div className="h-10 w-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-black text-amber-900 font-cairo">التقارير والإحصائيات قيد التطوير</p>
          <p className="text-xs font-medium text-amber-700 mt-0.5">
            سيتم إضافة تقارير الحضور، الإيرادات، والأعضاء لكل فرع قريباً.
          </p>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl text-center space-y-5 dir-rtl font-tajawal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto h-16 w-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black text-zinc-900 font-cairo">تأكيد حذف الفرع</h3>
              <p className="text-sm font-medium text-zinc-500 leading-relaxed">
                هل أنت متأكد من حذف فرع{" "}
                <span className="font-black text-zinc-900">«{branch.name}»</span>؟
                <br />
                هذا الإجراء لا يمكن التراجع عنه.
              </p>
            </div>
            {actionError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
                <XCircle className="h-4 w-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 h-12 rounded-xl border border-zinc-200 bg-white text-sm font-bold text-zinc-700 font-cairo hover:bg-zinc-50 transition-all cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-black font-cairo transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 shadow-[0_2px_12px_rgba(220,38,38,0.35)]"
              >
                {deleteMutation.isPending && <RefreshCw className="h-4 w-4 animate-spin" />}
                <span>نعم، احذف</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
