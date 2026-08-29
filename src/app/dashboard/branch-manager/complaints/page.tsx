"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
} from "lucide-react";

export default function BranchComplaintsPage() {
  const [complaints, setComplaints] = useState([
    {
      id: "comp-1",
      memberName: "كريم حسن",
      memberNumber: "#1055",
      title: "عطل في جهاز السير الكهربائي رقم 3",
      details: "الجهاز يتوقف فجأة أثناء الجري بسرعة عالية.",
      status: "Pending",
      date: "منذ ساعتين",
    },
    {
      id: "comp-2",
      memberName: "أحمد مجدي",
      memberNumber: "#1089",
      title: "ملاحظة على نظافة الأباهير والمنطقة العلوية",
      details: "يرجى الاهتمام بتطهير منطقة الأوزان بشكل أسرع.",
      status: "Pending",
      date: "أمس",
    },
  ]);

  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  const handleResolve = (id: string) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Resolved" } : c))
    );
    setResolvingId(null);
    setResolutionNote("");
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto dir-rtl font-tajawal pb-10">
      <div className="flex items-center justify-between gap-4">
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
            <span>الشكاوى المقترحة</span>
            <span>‹</span>
            <span>الرئيسية</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">
            شكاوى واقتراحات أعضاء الفرع
          </h1>
        </div>
      </div>

      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center shadow-xs space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-zinc-900 font-cairo">لا توجد أي شكاوى مفتوحة بالفرع</h3>
            <p className="text-xs text-zinc-500">تم حل وإغلاق كل شكاوى واقتراحات المشتركين بنجاح.</p>
          </div>
        ) : (
          complaints.map((c) => (
            <div
              key={c.id}
              className={`bg-white rounded-3xl border p-6 shadow-xs space-y-4 text-right transition-all ${
                c.status === "Pending" ? "border-rose-200" : "border-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-zinc-900 font-cairo">{c.title}</h4>
                    <p className="text-[11px] text-zinc-500">
                      مقدم الشكوى: <span className="font-bold text-zinc-800">{c.memberName}</span> ({c.memberNumber})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-zinc-400 font-mono">{c.date}</span>
                  {c.status === "Pending" ? (
                    <span className="px-3 py-1 bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold rounded-lg">
                      قيد المراجعة ⏳
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg">
                      تم الإغلاق ✅
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-zinc-700 font-medium leading-relaxed bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                {c.details}
              </p>

              {c.status === "Pending" && (
                <div className="pt-2">
                  {resolvingId === c.id ? (
                    <div className="space-y-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200">
                      <textarea
                        rows={2}
                        placeholder="اكتب ملاحظة الإغلاق والتصرف المتخذ..."
                        value={resolutionNote}
                        onChange={(e) => setResolutionNote(e.target.value)}
                        className="w-full p-3 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:border-gym-yellow resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResolve(c.id)}
                          className="px-5 py-2 rounded-xl bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs transition-all cursor-pointer"
                        >
                          تأكيد الإغلاق النهائي (Resolve)
                        </button>
                        <button
                          onClick={() => setResolvingId(null)}
                          className="px-4 py-2 rounded-xl bg-white border border-zinc-200 text-zinc-600 text-xs font-bold"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setResolvingId(c.id)}
                      className="px-5 py-2.5 rounded-xl bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs transition-all cursor-pointer shadow-xs"
                    >
                      إغلاق الشكوى نهائياً (Resolve)
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
