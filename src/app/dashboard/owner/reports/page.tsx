"use client";

import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  CreditCard,
  Download,
  Filter,
  ArrowLeft,
  ChevronDown,
  FileSpreadsheet,
  MoreVertical,
  RefreshCw,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {
  useDashboardOverview,
  useRevenueReport,
  useMemberGrowthReport,
} from "@/features/owner/hooks/useReports";

// ── Loading skeleton ──────────────────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs animate-pulse flex flex-col gap-3">
      <div className="h-4 w-24 bg-zinc-200 rounded-lg ml-auto" />
      <div className="h-8 w-16 bg-zinc-200 rounded-lg ml-auto" />
    </div>
  );
}

export default function ReportsPage() {
  const {
    data: overview,
    isLoading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview,
  } = useDashboardOverview();

  const {
    data: revenue,
    isLoading: revenueLoading,
  } = useRevenueReport();

  const {
    data: memberGrowth,
    isLoading: growthLoading,
  } = useMemberGrowthReport();

  const isLoading = overviewLoading || revenueLoading || growthLoading;

  if (overviewError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 dir-rtl font-tajawal text-center p-6 bg-white rounded-3xl border border-zinc-200 shadow-xs max-w-lg mx-auto my-10">
        <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
          <XCircle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900 font-cairo">حدث خطأ أثناء تحميل التقارير</h3>
          <p className="text-xs text-zinc-500 mt-1">{(overviewError as Error)?.message || "تعذر الاتصال بالخادم."}</p>
        </div>
        <button
          onClick={() => refetchOverview()}
          className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>إعادة المحاولة</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* ── Top Header / Breadcrumb & Controls ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Export & Filter Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-2 h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
            <Download className="h-4 w-4 text-zinc-500" />
            <span>تصدير التقرير</span>
          </button>
          <button className="flex items-center gap-2 h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer">
            <Filter className="h-4 w-4 text-zinc-500" />
            <span>تصفية</span>
          </button>
          <div className="h-11 px-4 rounded-xl border border-zinc-200 bg-white text-xs font-bold text-zinc-700 flex items-center justify-center">
            <span>هذا الشهر</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-right flex items-center gap-3 mr-auto sm:mr-0">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
              <span>التقارير</span>
              <span>‹</span>
              <span>الرئيسية</span>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">التقارير</h1>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
            <BarChart3 className="h-6 w-6" strokeWidth={1.8} />
          </div>
        </div>
      </div>

      {/* ── 5 Key Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            {/* Card 1: Active Subscriptions */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex flex-col justify-between text-right">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700">
                  <CreditCard className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-zinc-400 font-cairo">الاشتراكات المنتهية قريباً</p>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black text-zinc-900 font-cairo">
                  {overview?.expiringSubscriptionsCount ?? 0}
                </p>
                <p className="text-xs font-bold text-amber-600 mt-1">اشتراك يقترب من الانتهاء</p>
              </div>
            </div>

            {/* Card 2: Total Members */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex flex-col justify-between text-right">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700">
                  <Users className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي المشتركين</p>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black text-zinc-900 font-cairo">
                  {(overview?.totalMembers ?? 0).toLocaleString()}
                </p>
                <p className="text-xs font-bold text-amber-600 mt-1">
                  ↗ +{memberGrowth?.newMembersThisMonth ?? 0} هذا الشهر
                </p>
              </div>
            </div>

            {/* Card 3: Net Profit */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex flex-col justify-between text-right border-b-4 border-b-amber-400">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-zinc-400 font-cairo">صافي الربح (ج.م)</p>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black text-zinc-900 font-cairo">
                  {(overview?.netProfit ?? 0).toLocaleString("ar-EG")}
                </p>
                <p className="text-xs font-bold text-amber-600 mt-1">هذا الشهر</p>
              </div>
            </div>

            {/* Card 4: Total Expenses */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex flex-col justify-between text-right border-b-4 border-b-red-600">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700">
                  <DollarSign className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي المصروفات (ج.م)</p>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black text-zinc-900 font-cairo">
                  {(overview?.monthlyExpenses ?? 0).toLocaleString("ar-EG")}
                </p>
                <p className="text-xs font-bold text-red-600 mt-1">هذا الشهر</p>
              </div>
            </div>

            {/* Card 5: Total Revenue */}
            <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs flex flex-col justify-between text-right border-b-4 border-b-amber-400">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-700">
                  <DollarSign className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-zinc-400 font-cairo">إجمالي الإيرادات (ج.م)</p>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-black text-zinc-900 font-cairo">
                  {(overview?.monthlyRevenue ?? 0).toLocaleString("ar-EG")}
                </p>
                <p className="text-xs font-bold text-amber-600 mt-1">هذا الشهر</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Row 2: Charts & Distribution ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue SVG Line Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-zinc-600">
                  <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" /> الإيرادات
                </span>
                <span className="flex items-center gap-1.5 text-zinc-600">
                  <span className="h-2.5 w-2.5 rounded-sm bg-red-600" /> المصروفات
                </span>
              </div>
              <h3 className="text-base font-extrabold text-zinc-900 font-cairo">الإيرادات vs المصروفات</h3>
            </div>
            <div className="relative w-full h-[210px] mt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                <line x1="0" y1="20" x2="500" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeDasharray="4 4" />
                <line x1="0" y1="180" x2="500" y2="180" stroke="#e2e8f0" />
                <polyline fill="none" stroke="#fbbf24" strokeWidth="3"
                  points="20,150 70,120 120,90 170,85 220,40 270,65 320,45 370,55 420,80 470,95" />
                <polyline fill="none" stroke="#dc2626" strokeWidth="2.5"
                  points="20,175 70,160 120,140 170,125 220,110 270,115 320,130 370,145 420,165 470,175" />
              </svg>
            </div>
          </div>
        </div>

        {/* Center: Revenue Donut Chart */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-extrabold text-zinc-900 font-cairo text-right mb-4">
              توزيع الإيرادات حسب طريقة الدفع
            </h3>
            <div className="flex items-center justify-between gap-4 mt-2">
              {/* Legend List from real data */}
              <div className="space-y-3 text-right text-xs font-semibold flex-1">
                {revenueLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-4 bg-zinc-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : revenue?.methodBreakdown && revenue.methodBreakdown.length > 0 ? (
                  revenue.methodBreakdown.slice(0, 4).map((m, i) => {
                    const colors = ["bg-amber-400", "bg-rose-700", "bg-red-900", "bg-zinc-400"];
                    const pct = revenue.totalRevenue > 0
                      ? ((m.totalAmount / revenue.totalRevenue) * 100).toFixed(1)
                      : "0";
                    return (
                      <div key={i} className="flex items-center justify-end gap-2">
                        <span>
                          {m.methodName}{" "}
                          <span className="text-zinc-400 font-mono">
                            ({pct}%) {m.totalAmount.toLocaleString("ar-EG")}
                          </span>
                        </span>
                        <span className={`h-2.5 w-2.5 rounded-full ${colors[i] ?? "bg-zinc-300"}`} />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-zinc-400 text-xs">لا يوجد بيانات إيرادات</p>
                )}
              </div>
              {/* Donut Graphic */}
              <div className="relative h-36 w-36 shrink-0 flex items-center justify-center">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path stroke="#e4e4e7" strokeWidth="4.5" fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path stroke="#f5c518" strokeWidth="4.5"
                    strokeDasharray={`${revenue?.methodBreakdown?.[0] && revenue.totalRevenue > 0
                      ? ((revenue.methodBreakdown[0].totalAmount / revenue.totalRevenue) * 100).toFixed(0)
                      : 0}, 100`}
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute text-center">
                  <p className="text-sm font-black text-zinc-900 font-cairo">
                    {(revenue?.totalRevenue ?? 0).toLocaleString("ar-EG")}
                  </p>
                  <p className="text-[9px] text-zinc-400 font-bold">إجمالي الإيرادات</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Branch Revenue Progress */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 text-xs text-zinc-500 border border-zinc-200 rounded-lg px-2 py-1 bg-zinc-50">
                <span>كل الفروع</span>
                <ChevronDown className="h-3 w-3" />
              </div>
              <h3 className="text-base font-extrabold text-zinc-900 font-cairo">أداء الفروع (الإيرادات)</h3>
            </div>

            <div className="space-y-3">
              {revenueLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1 animate-pulse">
                    <div className="h-3 bg-zinc-100 rounded-lg" />
                    <div className="h-1.5 bg-zinc-100 rounded-full" />
                  </div>
                ))
              ) : revenue?.branchBreakdown && revenue.branchBreakdown.length > 0 ? (
                (() => {
                  const maxAmt = Math.max(...revenue.branchBreakdown.map((b) => b.totalAmount), 1);
                  return revenue.branchBreakdown.slice(0, 6).map((b, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-zinc-500 font-mono">{b.totalAmount.toLocaleString("ar-EG")} ج.م</span>
                        <span className="text-zinc-800 font-cairo">{b.branchName}</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${(b.totalAmount / maxAmt) * 100}%` }}
                        />
                      </div>
                    </div>
                  ));
                })()
              ) : (
                <p className="text-zinc-400 text-xs text-center py-4">لا يوجد بيانات فروع</p>
              )}
            </div>
          </div>

          <Link
            href="/dashboard/owner/branches"
            className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 group"
          >
            <span>عرض جميع الفروع</span>
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>

      {/* ── Row 3: Quick Reports Table & Sidebar Filters ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Quick Reports Table */}
        <div className="lg:col-span-9 bg-white rounded-2xl border border-zinc-200 p-6 shadow-xs space-y-4">
          <h3 className="text-lg font-extrabold text-zinc-900 font-cairo text-right">التقارير السريعة</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 text-xs font-bold text-zinc-400 font-cairo pb-3">
                  <th className="pb-3">اسم التقرير</th>
                  <th className="pb-3">الوصف</th>
                  <th className="pb-3">التفاصيل</th>
                  <th className="pb-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm">
                {[
                  {
                    title: "تقرير الإيرادات",
                    desc: "تفاصيل الإيرادات حسب الفروع والمصادر",
                    detail: `${revenue?.totalTransactions ?? "—"} عملية`,
                  },
                  {
                    title: "تقرير صافي الربح",
                    desc: "صافي الربح بعد خصم المصروفات",
                    detail: `${(overview?.netProfit ?? 0).toLocaleString("ar-EG")} ج.م`,
                  },
                  {
                    title: "تقرير المشتركين",
                    desc: "إحصائيات المشتركين الجدد والمنتهيين",
                    detail: `+${memberGrowth?.newMembersThisMonth ?? 0} هذا الشهر`,
                  },
                  {
                    title: "تقرير الحضور",
                    desc: "إحصائيات الحضور اليومي وأوقات الذروة",
                    detail: `${overview?.todayAttendanceCount ?? 0} اليوم`,
                  },
                  {
                    title: "تقرير المدفوعات",
                    desc: "المدفوعات المستلمة والمعلقة",
                    detail: `${(overview?.monthlyRevenue ?? 0).toLocaleString("ar-EG")} ج.م`,
                  },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 font-bold text-zinc-900 font-cairo flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>{row.title}</span>
                    </td>
                    <td className="py-3.5 text-zinc-600 text-xs">{row.desc}</td>
                    <td className="py-3.5 text-zinc-500 font-mono text-xs">{row.detail}</td>
                    <td className="py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 cursor-pointer">
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-zinc-100 cursor-pointer">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Filters Sidebar */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs space-y-4 text-right">
          <h3 className="text-base font-extrabold text-zinc-900 font-cairo">تصفية سريعة</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600">جميع الفروع</label>
              <select className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-700 focus:outline-none">
                <option>جميع الفروع</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600">الفترة الزمنية</label>
              <select className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-700 focus:outline-none">
                <option>هذا الشهر</option>
                <option>الشهر الماضي</option>
                <option>آخر 3 شهور</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-600">نوع التقرير</label>
              <select className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-700 focus:outline-none">
                <option>جميع التقارير</option>
                <option>الإيرادات</option>
                <option>المصروفات</option>
              </select>
            </div>
            <button className="w-full bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs py-3 rounded-xl shadow-[0_2px_12px_rgba(245,197,24,0.35)] transition-all cursor-pointer mt-2">
              تطبيق الفلتر
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
