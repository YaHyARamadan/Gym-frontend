"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  ArrowLeft,
  User,
  Phone,
  Building,
  CheckCircle2,
  MapPin,
  RefreshCw,
  XCircle,
  Save,
} from "lucide-react";
import { useBranch, useUpdateBranch } from "@/features/owner/hooks/useBranches";
import { extractApiError } from "@/lib/utils";

const EGYPT_GOVERNORATES: Record<string, string[]> = {
  "القاهرة": ["مدينة نصر", "التجمع الخامس", "المعادي", "مصر الجديدة", "الشروق", "العاصمة الإدارية"],
  "الجيزة": ["المهندسين", "الدقي", "Sheikh Zayed - الشيخ زايد", "6 أكتوبر", "الهرم", "فيصل"],
  "الإسكندرية": ["سموحة", "ميامي", "المنتزه", "ستنلي", "جليم", "العجمي"],
  "الشرقية": ["الزقازيق", "العاشر من رمضان", "بلبيس", "فاقوس"],
};

export default function EditBranchPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: branch, isLoading, error } = useBranch(id);
  const updateMutation = useUpdateBranch();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    governorate: "",
    city: "",
    status: "active",
    managerUserId: "",
    branchType: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pre-fill form once branch is loaded
  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name || "",
        phone: branch.phone || "",
        address: branch.address || "",
        governorate: "",
        city: "",
        status: branch.isActive ? "active" : "inactive",
        managerUserId: branch.managerUserId || "",
        branchType: "",
      });
    }
  }, [branch]);

  const handleGovernorateChange = (gov: string) => {
    setFormData((prev) => ({
      ...prev,
      governorate: gov,
      city: EGYPT_GOVERNORATES[gov]?.includes(prev.city) ? prev.city : "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage("اسم الفرع مطلوب.");
      return;
    }

    const addressParts = [formData.address, formData.city, formData.governorate]
      .map((s) => s.trim())
      .filter(Boolean);
    const fullAddress = addressParts.length > 0 ? addressParts.join(" - ") : undefined;

    updateMutation.mutate(
      {
        id,
        payload: {
          id,
          name: formData.name.trim(),
          address: fullAddress,
          phone: formData.phone.trim() || undefined,
          managerUserId: formData.managerUserId || undefined,
          isActive: formData.status === "active",
        },
      },
      {
        onSuccess: () => {
          setSuccessMessage("تم حفظ التعديلات بنجاح.");
          setTimeout(() => router.push(`/dashboard/owner/branches/${id}`), 1200);
        },
        onError: (err) => {
          setErrorMessage(extractApiError(err) || "حدث خطأ أثناء حفظ التعديلات. يرجى المحاولة مرة أخرى.");
        },
      }
    );
  };

  const cityOptions = formData.governorate ? EGYPT_GOVERNORATES[formData.governorate] || [] : [];

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
          <p className="text-xs text-zinc-500 mt-1">تعذر تحميل بيانات هذا الفرع.</p>
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

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto dir-rtl font-tajawal pb-12">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/dashboard/owner/branches/${id}`}
          className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>رجوع</span>
        </Link>

        <div className="text-right flex items-center gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
              <span>تعديل</span>
              <span>‹</span>
              <span>{branch.name}</span>
              <span>‹</span>
              <span>الفروع</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">
              تعديل الفرع
            </h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
            <Building2 className="h-6 w-6" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* Error / Success Banners */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-700 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ── Edit Form ── */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-8">

        {/* ── Section 1: معلومات الفرع ── */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 border-r-4 border-amber-400 pr-3">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo">معلومات الفرع</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* اسم الفرع */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-800 font-cairo block">
                اسم الفرع <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="أدخل اسم الفرع"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
                />
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* رقم الهاتف */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-800 font-cairo block">
                رقم الهاتف <span className="text-xs font-normal text-zinc-500">(اختياري)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="أدخل رقم التواصل"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all dir-ltr text-right"
                />
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {/* حالة الفرع */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-800 font-cairo block">حالة الفرع</label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="active">نشط</option>
                  <option value="inactive">غير نشط</option>
                </select>
                <CheckCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* نوع الفرع */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-800 font-cairo block">
                نوع الفرع <span className="text-xs font-normal text-zinc-500">(اختياري)</span>
              </label>
              <div className="relative">
                <select
                  value={formData.branchType}
                  onChange={(e) => setFormData({ ...formData, branchType: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">اختر نوع الفرع</option>
                  <option value="رجالي">رجالي</option>
                  <option value="سيدات">سيدات</option>
                  <option value="مختلط">مختلط (VIP)</option>
                </select>
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* مدير الفرع */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-800 font-cairo block">
                مدير الفرع <span className="text-xs font-normal text-zinc-500">(اختياري)</span>
              </label>
              <div className="relative">
                <select
                  value={formData.managerUserId}
                  onChange={(e) => setFormData({ ...formData, managerUserId: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">اختر مدير الفرع (اختياري)</option>
                </select>
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
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

          <div className="space-y-1.5 text-right">
            <label className="text-xs font-bold text-zinc-800 font-cairo block">
              العنوان التفصيلي <span className="text-xs font-normal text-zinc-500">(اختياري)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="أدخل اسم الشارع، رقم المبنى، العلامات المميزة"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all"
              />
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* المحافظة */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-800 font-cairo block">
                المحافظة <span className="text-xs font-normal text-zinc-500">(اختياري)</span>
              </label>
              <div className="relative">
                <select
                  value={formData.governorate}
                  onChange={(e) => handleGovernorateChange(e.target.value)}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="">اختر المحافظة</option>
                  {Object.keys(EGYPT_GOVERNORATES).map((gov) => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* المدينة */}
            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-800 font-cairo block">
                المدينة / المنطقة <span className="text-xs font-normal text-zinc-500">(اختياري)</span>
              </label>
              <div className="relative">
                <select
                  disabled={!formData.governorate}
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full h-11 pr-4 pl-10 rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-700 focus:outline-none focus:border-gym-yellow focus:ring-2 focus:ring-gym-yellow/20 transition-all appearance-none cursor-pointer disabled:bg-zinc-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {formData.governorate ? "اختر المدينة / المنطقة" : "اختر المحافظة أولاً"}
                  </option>
                  {cityOptions.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Form Actions ── */}
        <div className="flex items-center justify-start gap-4 pt-4 border-t border-zinc-100">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-8 py-3 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>حفظ التعديلات</span>
          </button>

          <Link
            href={`/dashboard/owner/branches/${id}`}
            className="bg-white hover:bg-zinc-50 text-zinc-600 font-cairo font-bold text-sm px-8 py-3 rounded-xl border border-zinc-200 transition-all text-center cursor-pointer"
          >
            إلغاء
          </Link>
        </div>
      </form>
    </div>
  );
}
