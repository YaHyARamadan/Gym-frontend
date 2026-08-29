"use client";

import {
  BarChart3, TrendingUp, Users, Clock, DollarSign,
  RefreshCw, XCircle, Activity, UserPlus, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardOverview, useRevenueReport, useAttendanceReport, useMemberGrowthReport } from "@/features/owner/hooks/useReports";
import type { PeakHourDto, TopActiveMemberDto } from "@/features/owner/types";

function KpiCard({ label, value, sub, color = "text-zinc-900" }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs p-6 text-right hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
      <p className="text-xs font-bold text-zinc-400 font-cairo">{label}</p>
      <p className={cn("text-3xl font-black font-cairo mt-1.5 leading-none", color)}>{value}</p>
      {sub && <p className="text-[11px] font-bold text-zinc-400 mt-2">{sub}</p>}
    </div>
  );
}

export default function BranchReportsPage() {
  const { data: overview, isLoading: ovLoading, error: ovError, refetch: refetchOv } = useDashboardOverview();
  const { data: revenue, isLoading: revLoading } = useRevenueReport();
  const { data: attendance, isLoading: attLoading } = useAttendanceReport();
  const { data: growth, isLoading: grLoading } = useMemberGrowthReport();

  const isLoading = ovLoading || revLoading || attLoading || grLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 dir-rtl font-tajawal">
        <div className="h-14 w-14 rounded-full border-4 border-amber-200 border-t-gym-yellow animate-spin" />
        <p className="text-sm font-bold text-zinc-500 font-cairo">جاري تحميل تقارير الفرع...</p>
      </div>
    );
  }

  if (ovError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 dir-rtl text-center p-8 bg-white rounded-3xl border border-zinc-200 max-w-lg mx-auto">
        <div className="h-14 w-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
          <XCircle className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900 font-cairo">تعذّر تحميل التقارير</h3>
          <p className="text-xs text-zinc-500 mt-1">{(ovError as Error)?.message}</p>
        </div>
        <button onClick={() => refetchOv()} className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-bold text-xs px-6 py-3 rounded-xl cursor-pointer">
          <RefreshCw className="h-4 w-4" />إعادة المحاولة
        </button>
      </div>
    );
  }

  const maxAttendance = Math.max(...(attendance?.peakHours?.map((h: PeakHourDto) => h.attendanceCount) ?? [1]), 1);

  return (
    <div className="space-y-7 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* Header */}
      <div className="text-right">
        <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
          <span>التقارير</span><span>‹</span><span>الرئيسية</span>
        </div>
        <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">تقارير وإحصائيات الفرع</h1>
      </div>

      {/* Overview KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="إيرادات الشهر" value={`${(overview?.monthlyRevenue ?? 0).toLocaleString("ar-EG")} ج.م`} sub="مقارنةً بالشهر الماضي" color="text-emerald-700" />
        <KpiCard label="صافي الأرباح" value={`${(overview?.netProfit ?? 0).toLocaleString("ar-EG")} ج.م`} sub={`مصاريف: ${(overview?.monthlyExpenses ?? 0).toLocaleString("ar-EG")} ج.م`} color="text-amber-700" />
        <KpiCard label="الأعضاء النشطون" value={(overview?.activeMembers ?? 0).toLocaleString("ar-EG")} sub={`إجمالي: ${(overview?.totalMembers ?? 0).toLocaleString("ar-EG")}`} color="text-zinc-900" />
        <KpiCard label="حضور اليوم" value={(overview?.todayAttendanceCount ?? 0).toLocaleString("ar-EG")} sub="تسجيل دخول" color="text-sky-700" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Method */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs p-6 space-y-5 text-right">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
            <h3 className="text-base font-black text-zinc-900 font-cairo">الإيرادات حسب طريقة الدفع</h3>
          </div>
          <div className="space-y-3">
            {revenue?.methodBreakdown?.length ? revenue.methodBreakdown.map((m) => {
              const pct = revenue.totalRevenue > 0 ? (m.totalAmount / revenue.totalRevenue) * 100 : 0;
              return (
                <div key={m.method}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-zinc-500">{m.transactionCount} معاملة</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-zinc-900 font-mono">{m.totalAmount.toLocaleString("ar-EG")} ج.م</span>
                      <span className="text-xs font-bold text-zinc-700">{m.methodName}</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            }) : (
              <p className="text-xs text-zinc-400 text-center py-4">لا توجد بيانات إيرادات متاحة</p>
            )}
          </div>
        </div>

        {/* Member Growth */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs p-6 space-y-5 text-right">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <UserPlus className="h-4 w-4" />
            </div>
            <h3 className="text-base font-black text-zinc-900 font-cairo">نمو الأعضاء</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "أعضاء جدد اليوم", value: growth?.newMembersToday ?? 0, color: "text-emerald-600", bg: "bg-emerald-50 border border-emerald-100" },
              { label: "جدد هذا الأسبوع", value: growth?.newMembersThisWeek ?? 0, color: "text-sky-600", bg: "bg-sky-50 border border-sky-100" },
              { label: "جدد هذا الشهر", value: growth?.newMembersThisMonth ?? 0, color: "text-amber-600", bg: "bg-amber-50 border border-amber-100" },
              { label: "أعضاء غير نشطين", value: growth?.inactiveMembers ?? 0, color: "text-red-500", bg: "bg-red-50 border border-red-100" },
            ].map((item) => (
              <div key={item.label} className={cn("rounded-2xl p-4", item.bg)}>
                <p className="text-[10px] font-bold text-zinc-500">{item.label}</p>
                <p className={cn("text-2xl font-black font-cairo mt-1", item.color)}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs p-6 space-y-5 text-right">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <h3 className="text-base font-black text-zinc-900 font-cairo">ساعات الذروة (الحضور)</h3>
          </div>
          {attendance?.peakHours?.length ? (
            <div className="space-y-2">
              {attendance.peakHours.slice(0, 6).map((h: PeakHourDto) => {
                const pct = (h.attendanceCount / maxAttendance) * 100;
                return (
                  <div key={h.hourOfDay} className="flex items-center gap-3">
                    <div className="flex-1 bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-sky-400 to-sky-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-zinc-500 w-20 shrink-0 text-left font-mono">{h.timeSlot}</span>
                    <span className="text-xs font-black text-zinc-900 w-8 text-left font-mono">{h.attendanceCount}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 text-center py-4">لا توجد بيانات حضور متاحة</p>
          )}
        </div>

        {/* Top Members */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-xs p-6 space-y-5 text-right">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Activity className="h-4 w-4" />
            </div>
            <h3 className="text-base font-black text-zinc-900 font-cairo">الأعضاء الأكثر حضوراً</h3>
          </div>
          <div className="space-y-2">
            {attendance?.topMembers?.length ? attendance.topMembers.slice(0, 5).map((m: TopActiveMemberDto, i: number) => (
              <div key={m.memberId} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-zinc-900 font-cairo">{m.checkInCount} <span className="text-xs font-bold text-zinc-400">دخول</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-zinc-900 font-cairo">{m.memberFullName}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">{m.memberNumber}</p>
                  </div>
                  <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center font-black text-sm font-cairo",
                    i === 0 ? "bg-amber-200 text-amber-800" : i === 1 ? "bg-zinc-200 text-zinc-700" : i === 2 ? "bg-orange-200 text-orange-700" : "bg-zinc-100 text-zinc-500"
                  )}>
                    #{i + 1}
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-xs text-zinc-400 text-center py-4">لا توجد بيانات حضور متاحة</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
