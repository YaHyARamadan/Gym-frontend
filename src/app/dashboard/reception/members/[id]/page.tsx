"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  RefreshCw,
  Edit3,
  Dumbbell,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  UserCheck,
} from "lucide-react";
import { useMembers } from "@/features/owner/hooks/useMembers";
import { useRenewSubscription } from "@/features/owner/hooks/useSubscriptions";
import {
  useRequestMemberEdit,
  useAssignCoach,
  useUploadDocument,
} from "@/features/reception/hooks/useReception";
import { extractApiError } from "@/lib/utils";

export default function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: memberId } = use(params);

  const { data: membersData, isLoading, error } = useMembers();
  const renewMutation = useRenewSubscription();
  const requestEditMutation = useRequestMemberEdit();
  const assignCoachMutation = useAssignCoach();
  const uploadDocMutation = useUploadDocument();

  const member = membersData?.items?.find((m) => m.id === memberId) || {
    id: memberId,
    fullName: "محمد علي",
    memberNumber: "#1004",
    phone: "01001234567",
    isActive: true,
  };

  // Modals & form state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ fieldToEdit: "رقم الهاتف", newValue: "", reason: "" });

  const [showCoachModal, setShowCoachModal] = useState(false);
  const [coachId, setCoachId] = useState("");

  const [showDocModal, setShowDocModal] = useState(false);
  const [docForm, setDocForm] = useState({
    documentType: "NationalId" as "NationalId" | "Contract" | "Medical" | "Other",
    title: "",
    fileUrl: "",
  });

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 dir-rtl font-tajawal">
        <RefreshCw className="h-8 w-8 text-gym-yellow animate-spin" />
        <p className="text-sm font-bold text-zinc-600 font-cairo">جاري تحميل ملف العضو...</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-zinc-200 text-center space-y-4 max-w-lg mx-auto dir-rtl font-tajawal">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
        <h3 className="text-base font-bold text-zinc-900 font-cairo">تعذر الفتح أو العضو غير موجود</h3>
        <Link
          href="/dashboard/reception/members"
          className="inline-block bg-gym-yellow text-gym-black font-cairo font-bold text-xs px-5 py-2.5 rounded-xl"
        >
          الرجوع لقائمة الأعضاء
        </Link>
      </div>
    );
  }

  const handleRenew = () => {
    setFeedback(null);
    renewMutation.mutate(
      { subscriptionId: memberId },
      {
        onSuccess: () => {
          setFeedback({ type: "success", message: "تم تجديد اشتراك العضو بنجاح!" });
        },
        onError: (err: unknown) => {
          setFeedback({ type: "error", message: extractApiError(err) || "تعذر تجديد الاشتراك." });
        },
      }
    );
  };

  const handleRequestEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    requestEditMutation.mutate(
      {
        memberId,
        fieldToEdit: editForm.fieldToEdit,
        newValue: editForm.newValue,
        reason: editForm.reason,
      },
      {
        onSuccess: () => {
          setFeedback({ type: "success", message: "تم إرسال طلب التعديل لمدير الفرع للمراجعة." });
          setShowEditModal(false);
          setEditForm({ fieldToEdit: "رقم الهاتف", newValue: "", reason: "" });
        },
        onError: (err: unknown) => {
          setFeedback({ type: "error", message: extractApiError(err) || "تعذر إرسال الطلب." });
        },
      }
    );
  };

  const handleAssignCoach = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    assignCoachMutation.mutate(
      { memberId, coachId },
      {
        onSuccess: () => {
          setFeedback({ type: "success", message: "تم تعيين الكوتش المسؤول بنجاح!" });
          setShowCoachModal(false);
        },
        onError: (err: unknown) => {
          setFeedback({ type: "error", message: extractApiError(err) || "تعذر تعيين الكوتش." });
        },
      }
    );
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    uploadDocMutation.mutate(
      {
        memberId,
        documentType: docForm.documentType,
        title: docForm.title || "مستند عضو",
        fileUrl: docForm.fileUrl || "https://example.com/doc.pdf",
      },
      {
        onSuccess: () => {
          setFeedback({ type: "success", message: "تم رفع المستند بنجاح بنظام المستندات!" });
          setShowDocModal(false);
        },
        onError: (err: unknown) => {
          setFeedback({ type: "error", message: extractApiError(err) || "تعذر رفع المستند." });
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-[1000px] mx-auto dir-rtl font-tajawal pb-12">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/dashboard/reception/members"
          className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>رجوع للأعضاء</span>
        </Link>
        <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide">ملف العضو</h1>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-3 ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-zinc-900 text-white font-black text-xl flex items-center justify-center font-cairo">
              {member.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-zinc-900 font-cairo">{member.fullName}</h2>
                {member.isActive ? (
                  <span className="px-3 py-1 text-xs font-bold text-amber-900 bg-amber-200/60 rounded-full border border-amber-300">
                    نشط 🟡
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs font-bold text-red-700 bg-red-100 rounded-full">
                    منتهي 🔴
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">رقم العضوية: {member.memberNumber}</p>
              <p className="text-xs text-zinc-500 font-mono mt-0.5 dir-ltr text-right">{member.phone}</p>
            </div>
          </div>

          <button
            onClick={handleRenew}
            disabled={renewMutation.isPending}
            className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs px-6 py-3 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer disabled:opacity-50"
          >
            {renewMutation.isPending && <RefreshCw className="h-4 w-4 animate-spin" />}
            <UserCheck className="h-4 w-4" />
            <span>تجديد الاشتراك</span>
          </button>
        </div>

        {/* Section 1: Member Edit Request */}
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit3 className="h-5 w-5 text-zinc-700" />
              <h3 className="font-extrabold text-sm text-zinc-900 font-cairo">تعديل بيانات العضو</h3>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="text-xs font-bold text-amber-700 hover:underline cursor-pointer font-cairo"
            >
              ✏ تقديم طلب تعديل ↗
            </button>
          </div>
          <p className="text-xs text-zinc-500">
            بصفتك موظف استقبال، يُرسل هذا الطلب تلقائيًا لمدير الفرع للمراجعة والاعتماد.
          </p>
        </div>

        {/* Section 2: Coach Assignment */}
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-amber-600" />
              <h3 className="font-extrabold text-sm text-zinc-900 font-cairo">الكوتش المسؤول</h3>
            </div>
            <button
              onClick={() => setShowCoachModal(true)}
              className="text-xs font-bold text-amber-700 hover:underline cursor-pointer font-cairo"
            >
              [تغيير الكوتش]
            </button>
          </div>
          <p className="text-xs text-zinc-600 font-medium">
            الكوتش المخصص حالياً: <span className="font-bold text-zinc-900 font-cairo">كريم أحمد (أو لم يحدد بعد)</span>
          </p>
        </div>

        {/* Section 3: Documents Upload */}
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-sky-600" />
              <h3 className="font-extrabold text-sm text-zinc-900 font-cairo">مستندات العضو (بطاقة / عقد)</h3>
            </div>
            <button
              onClick={() => setShowDocModal(true)}
              className="flex items-center gap-1 text-xs font-bold text-sky-700 hover:underline cursor-pointer font-cairo"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>[+ رفع مستند]</span>
            </button>
          </div>
          <p className="text-xs text-zinc-500">رفع صورة البطاقة الشخصية، العقد الموقّع، أو التقرير الطبي للعضو.</p>
        </div>
      </div>

      {/* Edit Request Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleRequestEdit} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 text-right dir-rtl">
            <h3 className="text-base font-black text-zinc-900 font-cairo">تقديم طلب تعديل بيانات عضو</h3>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 font-cairo">الحقل المراد تعديله</label>
              <input
                type="text"
                value={editForm.fieldToEdit}
                onChange={(e) => setEditForm({ ...editForm, fieldToEdit: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 font-cairo">القيمة الجديدة *</label>
              <input
                type="text"
                required
                value={editForm.newValue}
                onChange={(e) => setEditForm({ ...editForm, newValue: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={requestEditMutation.isPending}
                className="flex-1 h-10 rounded-xl bg-gym-yellow text-gym-black font-cairo font-black text-xs"
              >
                إرسال للمدير
              </button>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="h-10 px-4 rounded-xl border border-zinc-200 text-xs font-bold"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coach Assign Modal */}
      {showCoachModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleAssignCoach} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 text-right dir-rtl">
            <h3 className="text-base font-black text-zinc-900 font-cairo">تعيين كوتش كوتش للعضو</h3>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 font-cairo">اختر الكوتش المسؤول</label>
              <select
                value={coachId}
                onChange={(e) => setCoachId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs font-bold"
              >
                <option value="">اختر الكوتش من القائمة...</option>
                <option value="coach-1">كوتش كريم أحمد</option>
                <option value="coach-2">كوتش أحمد حسام</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={assignCoachMutation.isPending}
                className="flex-1 h-10 rounded-xl bg-gym-yellow text-gym-black font-cairo font-black text-xs"
              >
                حفظ التعيين
              </button>
              <button
                type="button"
                onClick={() => setShowCoachModal(false)}
                className="h-10 px-4 rounded-xl border border-zinc-200 text-xs font-bold"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Document Upload Modal */}
      {showDocModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <form onSubmit={handleUploadDoc} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 text-right dir-rtl">
            <h3 className="text-base font-black text-zinc-900 font-cairo">رفع مستند للعضو</h3>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 font-cairo">نوع المستند</label>
              <select
                value={docForm.documentType}
                onChange={(e) =>
                  setDocForm({ ...docForm, documentType: e.target.value as "NationalId" | "Contract" | "Medical" | "Other" })
                }
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs font-bold"
              >
                <option value="NationalId">صورة بطاقة الرقم القومي</option>
                <option value="Contract">عقد الاشتراك الموقّع</option>
                <option value="Medical">تقرير طبي</option>
                <option value="Other">مستند آخر</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 font-cairo">عنوان المستند</label>
              <input
                type="text"
                required
                placeholder="مثال: بطاقة الرقم القومي 2026"
                value={docForm.title}
                onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 text-xs"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={uploadDocMutation.isPending}
                className="flex-1 h-10 rounded-xl bg-gym-yellow text-gym-black font-cairo font-black text-xs"
              >
                رفع المستند
              </button>
              <button
                type="button"
                onClick={() => setShowDocModal(false)}
                className="h-10 px-4 rounded-xl border border-zinc-200 text-xs font-bold"
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
