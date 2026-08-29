"use client";

import Link from "next/link";
import { Dumbbell, Users, Calendar, CheckCircle2, Clock, Activity } from "lucide-react";
import { useAuth } from "@/shared/auth/AuthContext";
import { useMembers } from "@/features/owner/hooks/useMembers";

export default function CoachDashboardPage() {
  const { user } = useAuth();
  const { data: membersData } = useMembers();

  const members = membersData?.items || [];
  const assignedTraineesCount = members.length;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-white/10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gym-yellow font-bold font-cairo">
            <span>لوحة الكوتش</span>
            <span>•</span>
            <span>الفرع الحالي</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-cairo tracking-wide">
            مرحبًا كوتش، {user?.fullName || "المدرّب"} 🏋️‍♂️
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl">
            أهلاً بك في شاشتك الخاصة للتدريب. يمكنك متابعة المتدربين التابعين لك، جدول الجلسات التدريبية، وتجهيز البرامج.
          </p>
        </div>

        <Link
          href="/dashboard/coach/schedule"
          className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-6 py-3.5 rounded-2xl shadow-[0_2px_16px_rgba(245,197,24,0.4)] transition-all cursor-pointer shrink-0"
        >
          <Calendar className="h-5 w-5 stroke-[2.2]" />
          <span>جدول جلسات اليوم</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Assigned Trainees */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-zinc-400 font-cairo">المتدربين التابعين لي</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo">{assignedTraineesCount || 12}</p>
            <Link
              href="/dashboard/coach/members"
              className="inline-block text-xs font-bold text-amber-600 hover:text-amber-700 mt-2 font-cairo"
            >
              عرض قائمة المتدربين ←
            </Link>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <Users className="h-7 w-7 stroke-[1.8]" />
          </div>
        </div>

        {/* Card 2: Today Sessions */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-zinc-400 font-cairo">جلسات اليوم المجدولة</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo">5 <span className="text-base text-zinc-400 font-medium">جلسات</span></p>
            <Link
              href="/dashboard/coach/schedule"
              className="inline-block text-xs font-bold text-sky-600 hover:text-sky-700 mt-2 font-cairo"
            >
              متابعة الجدول ←
            </Link>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center shrink-0">
            <Calendar className="h-7 w-7 stroke-[1.8]" />
          </div>
        </div>

        {/* Card 3: Active Training Plans */}
        <div className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-extrabold text-zinc-400 font-cairo">البرامج التدريبية النشطة</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo">8</p>
            <span className="inline-block text-xs font-bold text-emerald-600 mt-2 font-cairo">
              محدثة لهذا الأسبوع
            </span>
          </div>
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <Activity className="h-7 w-7 stroke-[1.8]" />
          </div>
        </div>
      </div>

      {/* Trainees Table Preview */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <h2 className="text-base font-extrabold text-zinc-900 font-cairo">المتدربين النشطين مؤخراً</h2>
          <Link
            href="/dashboard/coach/members"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 font-cairo"
          >
            عرض الكل ↗
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-bold text-zinc-400 font-cairo">
                <th className="py-3 px-4">المتدرب</th>
                <th className="py-3 px-4">الهدف التدريبي</th>
                <th className="py-3 px-4 text-center">حالة الاشتراك</th>
                <th className="py-3 px-4 text-center">آخر حضور</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs font-medium">
              {members.slice(0, 5).map((m) => (
                <tr key={m.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-zinc-900 font-cairo">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                        {m.fullName.charAt(0)}
                      </div>
                      <div>
                        <p>{m.fullName}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">{m.memberNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-700">بناء عضلات وتنشيف</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block px-3 py-1 text-[11px] font-bold text-amber-900 bg-amber-200/60 rounded-full border border-amber-300">
                      نشط
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center text-zinc-500 font-mono">اليوم 10:30 ص</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
