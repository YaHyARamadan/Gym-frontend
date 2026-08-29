"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, ArrowLeft, RefreshCw, XCircle, CheckCircle2, Building2 } from "lucide-react";
import { useCreateMember } from "@/features/owner/hooks/useMembers";
import { useCreatePayment } from "@/features/reception/hooks/useReception";
import { useMembershipPlans, useCreateSubscription } from "@/features/owner/hooks/useSubscriptions";
import { useAuth } from "@/shared/auth/AuthContext";
import { useBranches } from "@/features/owner/hooks/useBranches";
import { extractApiError } from "@/lib/utils";

export default function NewMemberPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: branches } = useBranches();
  const { data: plansData } = useMembershipPlans();
  const createMemberMutation = useCreateMember();
  const createPaymentMutation = useCreatePayment();
  const createSubscriptionMutation = useCreateSubscription();

  const plans = plansData?.items || [];

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    gender: "Male" as "Male" | "Female",
    email: "",
    nationalId: "",
    planId: "plan-monthly-vip",
    amount: 500,
    paymentMethod: "Cash",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const effectiveBranchId = user?.branchId || selectedBranchId || branches?.[0]?.id || "";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!effectiveBranchId) {
      setErrorMessage("تعذر تحديد الفرع. يرجى اختيار الفرع أولاً.");
      return;
    }

    try {
      // Step 1 & 2: Create member
      const memberId = await createMemberMutation.mutateAsync({
        fullName: formData.fullName,
        phone: formData.phone,
        gender: formData.gender,
        email: formData.email || undefined,
        nationalId: formData.nationalId || undefined,
        branchId: effectiveBranchId,
      });

      if (memberId) {
        // Step 3: Create Active Subscription in backend
        if (formData.planId) {
          try {
            await createSubscriptionMutation.mutateAsync({
              memberId: memberId,
              membershipPlanId: formData.planId,
              amountPaid: Number(formData.amount),
              notes: `اشتراك جديد عند التأسيس - ${formData.fullName}`,
            });
          } catch (subErr) {
            console.error("Subscription creation error:", subErr);
          }
        }

        // Step 4: Record Payment
        await createPaymentMutation.mutateAsync({
          memberId: memberId,
          amount: Number(formData.amount),
          paymentMethod: formData.paymentMethod,
          notes: `اشتراك جديد - ${formData.fullName}`,
        });
      }

      router.push("/dashboard/reception/members");
    } catch (err: unknown) {
      setErrorMessage(extractApiError(err) || "حدث خطأ أثناء تسجيل العضو الجديد.");
    }
  };

  return (
    <div className="space-y-6 max-w-[900px] mx-auto dir-rtl font-tajawal pb-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/dashboard/reception/members"
          className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>رجوع للأعضاء</span>
        </Link>

        <div className="text-right flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide">
              تسجيل عضو جديد بالفرع
            </h1>
            <p className="text-xs text-zinc-500 font-medium">إدخال البيانات الأساسية وتفعيل الاشتراك الأول</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-gym-yellow text-gym-black flex items-center justify-center shadow-xs">
            <UserPlus className="h-6 w-6 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* 3 Step Wizard Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex items-center justify-between font-cairo text-xs font-bold">
        <div className={`flex items-center gap-2 ${step >= 1 ? "text-zinc-900 font-black" : "text-zinc-400"}`}>
          <div className={`h-7 w-7 rounded-full flex items-center justify-center ${step >= 1 ? "bg-gym-yellow text-gym-black" : "bg-zinc-100"}`}>1</div>
          <span>البيانات الشخصية</span>
        </div>
        <span className="text-zinc-300">‹</span>
        <div className={`flex items-center gap-2 ${step >= 2 ? "text-zinc-900 font-black" : "text-zinc-400"}`}>
          <div className={`h-7 w-7 rounded-full flex items-center justify-center ${step >= 2 ? "bg-gym-yellow text-gym-black" : "bg-zinc-100"}`}>2</div>
          <span>خطة الاشتراك</span>
        </div>
        <span className="text-zinc-300">‹</span>
        <div className={`flex items-center gap-2 ${step >= 3 ? "text-zinc-900 font-black" : "text-zinc-400"}`}>
          <div className={`h-7 w-7 rounded-full flex items-center justify-center ${step === 3 ? "bg-gym-yellow text-gym-black" : "bg-zinc-100"}`}>3</div>
          <span>تحصيل الاشتراك</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-700 flex items-center gap-3 text-right">
          <XCircle className="h-5 w-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleRegister} className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs space-y-8">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo border-r-4 border-amber-400 pr-3">
              1. البيانات الشخصية للعضو
            </h2>

            {/* Branch Selector if User has no explicit branchId attached */}
            {!user?.branchId && branches && branches.length > 0 && (
              <div className="space-y-1.5 text-right p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60">
                <label className="text-xs font-bold text-zinc-800 font-cairo flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-amber-600" />
                  <span>اختر الفرع التابع له العضو *</span>
                </label>
                <select
                  value={selectedBranchId || effectiveBranchId}
                  onChange={(e) => setSelectedBranchId(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-800 focus:outline-none"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-zinc-700 font-cairo">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  placeholder="محمد أحمد علي"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-gym-yellow"
                />
              </div>

              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-zinc-700 font-cairo">رقم الهاتف *</label>
                <input
                  type="tel"
                  required
                  placeholder="01001234567"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 text-xs text-zinc-900 font-mono focus:outline-none focus:border-gym-yellow dir-ltr text-right"
                />
              </div>

              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-zinc-700 font-cairo">النوع *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as "Male" | "Female" })}
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-700 focus:outline-none"
                >
                  <option value="Male">ذكر</option>
                  <option value="Female">أنثى</option>
                </select>
              </div>

              <div className="space-y-1.5 text-right">
                <label className="text-xs font-bold text-zinc-700 font-cairo">الرقم القومي (اختياري)</label>
                <input
                  type="text"
                  placeholder="29901011234567"
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-zinc-200 text-xs text-zinc-900 font-mono focus:outline-none focus:border-gym-yellow dir-ltr text-right"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  if (!formData.fullName.trim() || !formData.phone.trim()) {
                    setErrorMessage("يرجى ملء الاسم الكامل ورقم الهاتف أولاً.");
                    return;
                  }
                  setErrorMessage(null);
                  setStep(2);
                }}
                className="bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs px-8 py-3 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                التالي: خطة الاشتراك ←
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo border-r-4 border-amber-400 pr-3">
              2. اختيار خطة الاشتراك
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.length > 0 ? (
                plans.map((p: import("@/features/owner/api/owner.api").MembershipPlanSummaryDto) => (
                  <div
                    key={p.id}
                    onClick={() => setFormData({ ...formData, planId: p.id, amount: p.price })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.planId === p.id ? "border-gym-yellow bg-amber-50/50" : "border-zinc-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-zinc-900 font-cairo">{p.name}</h3>
                      <span className="font-black text-amber-700 text-base font-cairo">{p.price} ج.م</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">مدة الباقة: {p.durationDays} يوم</p>
                  </div>
                ))
              ) : (
                <>
                  <div
                    onClick={() => setFormData({ ...formData, planId: "monthly-vip", amount: 500 })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.planId === "monthly-vip" ? "border-gym-yellow bg-amber-50/50" : "border-zinc-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-zinc-900 font-cairo">اشتراك شهر VIP</h3>
                      <span className="font-black text-amber-700 text-base font-cairo">500 ج.م</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">استخدام كامل الصالة والتجهيزات + خزانة يومية مجانية</p>
                  </div>

                  <div
                    onClick={() => setFormData({ ...formData, planId: "3months-gold", amount: 1300 })}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      formData.planId === "3months-gold" ? "border-gym-yellow bg-amber-50/50" : "border-zinc-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-sm text-zinc-900 font-cairo">اشتراك 3 شهور Gold</h3>
                      <span className="font-black text-amber-700 text-base font-cairo">1,300 ج.م</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">خصم خاص لـ 3 شهور متواصلة + جلسات تدريب أولية</p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
              >
                → السابق
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs px-8 py-3 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                التالي: الدفع والتحصيل ←
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo border-r-4 border-amber-400 pr-3">
              3. تحصيل المبلغ وطريقة الدفع
            </h2>

            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs font-medium">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">اسم العضو:</span>
                <span className="font-bold text-zinc-900 font-cairo">{formData.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">المبلغ المطلوب:</span>
                <span className="font-black text-amber-700 text-sm font-cairo">{formData.amount} ج.م</span>
              </div>
            </div>

            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-zinc-700 font-cairo">طريقة الدفع *</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-700 focus:outline-none"
              >
                <option value="Cash">نقداً (Cash)</option>
                <option value="CreditCard">بطاقة ائتمان (Visa/Mastercard)</option>
                <option value="BankTransfer">تحويل بنكي / InstaPay</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
              >
                → السابق
              </button>
              <button
                type="submit"
                disabled={createMemberMutation.isPending || createPaymentMutation.isPending}
                className="flex-1 max-w-xs mr-auto flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs px-8 py-3.5 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer disabled:opacity-50"
              >
                {(createMemberMutation.isPending || createPaymentMutation.isPending) && (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                )}
                <CheckCircle2 className="h-4.5 w-4.5" />
                <span>إتمام التأسيس والتحصيل</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
