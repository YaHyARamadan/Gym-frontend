"use client";

import { Calendar, Clock, CheckCircle2, User } from "lucide-react";

export default function CoachSchedulePage() {
  const sessions = [
    { id: "s1", time: "10:00 ص - 11:00 ص", traineeName: "محمد أحمد", planName: "تمرين حديد + فتنس", status: "Completed" },
    { id: "s2", time: "11:30 ص - 12:30 م", traineeName: "علي محمود", planName: "متابعة أوزان وتقييم", status: "Upcoming" },
    { id: "s3", time: "02:00 م - 03:00 م", traineeName: "أحمد حسن", planName: "تدريب شخصي VIP", status: "Upcoming" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-right flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-800 shadow-xs">
            <Calendar className="h-6 w-6 stroke-[1.8]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide">
              جدول التدريب والجلسات
            </h1>
            <p className="text-xs text-zinc-500 font-medium">مواعيد الجلسات التدريبية المجدولة لليوم</p>
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gym-yellow text-gym-black flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-zinc-900 font-cairo">{session.traineeName}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{session.planName}</p>
                  <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{session.time}</p>
                </div>
              </div>

              <div>
                {session.status === "Completed" ? (
                  <span className="px-3 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>مكتملة</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs font-bold text-amber-800 bg-amber-100 rounded-full">
                    مجدولة
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
