"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  UserCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  Calendar,
  Filter,
  Download,
  Users,
  UserX,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  X,
  AlertCircle,
} from "lucide-react";
import { useMembers } from "@/features/owner/hooks/useMembers";
import {
  useTodayAttendance,
  useCheckInMember,
  useCheckOutMember,
} from "@/features/reception/hooks/useReception";
import { extractApiError } from "@/lib/utils";

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<"today" | "history">("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  // Error shown *inside* the modal (not closed on error)
  const [modalError, setModalError] = useState<string | null>(null);
  const [errorMemberId, setErrorMemberId] = useState<string | null>(null);

  // ── API Hooks ──────────────────────────────────────────────────────────
  const { data: membersData, isLoading: isMembersLoading } = useMembers({
    searchTerm: memberSearchQuery.trim() ? memberSearchQuery : undefined,
    pageSize: 20,
  });

  const {
    data: todayAttendanceRaw,
    isLoading: isAttendanceLoading,
    isError: isAttendanceError,
    refetch,
    isFetching,
  } = useTodayAttendance();

  const checkInMutation = useCheckInMember();
  const checkOutMutation = useCheckOutMember();

  // ── Data Normalisation ─────────────────────────────────────────────────
  const members = membersData?.items || [];

  const attendanceList = useMemo(() => {
    if (!todayAttendanceRaw) return [];
    if (Array.isArray(todayAttendanceRaw)) return todayAttendanceRaw;
    if ("items" in todayAttendanceRaw && Array.isArray(todayAttendanceRaw.items)) {
      return todayAttendanceRaw.items;
    }
    return [];
  }, [todayAttendanceRaw]);

  // Derive display records from real attendance data (matching AttendanceSummaryDto from backend)
  const displayRecords = useMemo(() => {
    return attendanceList.map((item) => {
      const checkInDate = item.checkInAt ? new Date(item.checkInAt) : null;
      const checkOutDate = item.checkOutAt ? new Date(item.checkOutAt) : null;
      const name = item.memberFullName || "عضو";

      return {
        id: item.id,
        memberId: item.memberId,
        memberName: name,
        memberNumber: item.memberNumber || "#----",
        phone: "—",
        plan: "اشتراك",
        checkInTime: checkInDate
          ? checkInDate.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
          : "—",
        checkOutTime: checkOutDate
          ? checkOutDate.toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })
          : null,
        status: checkOutDate ? "CheckedOut" : checkInDate ? "CheckedIn" : "Absent",
        avatar: name.charAt(0),
      };
    });
  }, [attendanceList]);

  // ── Stats derived from live data ──────────────────────────────────────
  const checkedInCount = displayRecords.filter(
    (r) => r.status === "CheckedIn" || r.status === "Present"
  ).length;
  const checkedOutCount = displayRecords.filter(
    (r) => r.status === "CheckedOut"
  ).length;
  const totalTodayCount = displayRecords.length;
  const totalMembersCount = membersData?.totalCount || 0;

  // ── Filtered records ──────────────────────────────────────────────────
  const filteredRecords = displayRecords.filter((rec) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      rec.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.memberNumber.includes(searchQuery) ||
      rec.phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "present" &&
        (rec.status === "CheckedIn" || rec.status === "Present")) ||
      (statusFilter === "checkedout" && rec.status === "CheckedOut") ||
      (statusFilter === "absent" &&
        rec.status !== "CheckedIn" &&
        rec.status !== "CheckedOut" &&
        rec.status !== "Present");

    return matchesSearch && matchesStatus;
  });

  // Modal: search members for check-in (only show when query not empty)
  const searchedMembersForModal = memberSearchQuery.trim()
    ? members.filter(
        (m) =>
          m.fullName?.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
          m.memberNumber?.includes(memberSearchQuery) ||
          m.phone?.includes(memberSearchQuery)
      )
    : [];

  const handleCheckIn = (memberId: string) => {
    setModalError(null);
    setErrorMemberId(null);
    setFeedback(null);
    checkInMutation.mutate(
      { memberId },
      {
        onSuccess: () => {
          setFeedback({ type: "success", message: "تم تسجيل حضور العضو بنجاح! ✓" });
          setMemberSearchQuery("");
          setModalError(null);
          setErrorMemberId(null);
          setCheckInModalOpen(false);
          refetch();
        },
        onError: (err: unknown) => {
          const raw = extractApiError(err) || "تعذر تسجيل الحضور.";
          const isSubscriptionError =
            raw.toLowerCase().includes("subscription") ||
            raw.toLowerCase().includes("اشتراك") ||
            raw.includes("active, valid");
          const friendlyMsg = isSubscriptionError
            ? "هذا العضو ليس لديه اشتراك ساري. يجب تجديد اشتراكه أولاً."
            : raw;
          setModalError(friendlyMsg);
          setErrorMemberId(memberId);
        },
      }
    );
  };

  const handleCheckOut = (attendanceRecordId: string) => {
    setFeedback(null);
    checkOutMutation.mutate(attendanceRecordId, {
      onSuccess: () => {
        setFeedback({ type: "success", message: "تم تسجيل انصراف العضو بنجاح! ✓" });
        refetch();
      },
      onError: (err: unknown) => {
        setFeedback({
          type: "error",
          message: extractApiError(err) || "تعذر تسجيل الانصراف.",
        });
      },
    });
  };

  const getStatusLabel = (status: string) => {
    if (status === "CheckedIn" || status === "Present") return "حاضر";
    if (status === "CheckedOut") return "انصرف";
    return "غائب";
  };

  const getStatusStyle = (status: string) => {
    if (status === "CheckedIn" || status === "Present")
      return "text-emerald-800 bg-emerald-50 border-emerald-200";
    if (status === "CheckedOut")
      return "text-blue-800 bg-blue-50 border-blue-200";
    return "text-rose-800 bg-rose-50 border-rose-200";
  };

  const getStatusDot = (status: string) => {
    if (status === "CheckedIn" || status === "Present") return "bg-emerald-600";
    if (status === "CheckedOut") return "bg-blue-600";
    return "bg-rose-600";
  };

  return (
    <div className="space-y-6 max-w-[1550px] mx-auto dir-rtl font-tajawal pb-12">
      {/* ── Header Title & Breadcrumb ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium font-cairo mb-1">
            <Link href="/dashboard/reception" className="hover:text-zinc-700">
              الرئيسية
            </Link>
            <span>›</span>
            <span className="text-zinc-800 font-bold">الحضور</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <UserCheck className="h-5 w-5 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo">
              تسجيل الحضور
            </h1>
          </div>
        </div>
      </div>

      {/* ── Feedback Banner ────────────────────────────────────────────────── */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 animate-card-enter ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-zinc-400 hover:text-zinc-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Top Action Buttons & Tabs Row ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCheckInModalOpen(true)}
            className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>تسجيل حضور</span>
          </button>

          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 font-cairo font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-200 transition-all cursor-pointer"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isAttendanceLoading || isFetching ? "animate-spin" : ""}`}
            />
            <span>تحديث</span>
          </button>
        </div>

        {/* Right Navigation Tabs */}
        <div className="flex items-center bg-zinc-100/80 p-1 rounded-xl w-fit self-end md:self-auto">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-6 py-1.5 rounded-lg text-xs font-bold font-cairo transition-all cursor-pointer ${
              activeTab === "today"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            اليوم
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-1.5 rounded-lg text-xs font-bold font-cairo transition-all cursor-pointer ${
              activeTab === "history"
                ? "bg-white text-zinc-900 shadow-xs"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            سجل الحضور
          </button>
        </div>
      </div>

      {/* ── Search & Filter Controls ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search Bar (4 cols) */}
        <div className="lg:col-span-4 relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="ابحث بالاسم أو رقم العضوية..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pr-10 pl-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 font-medium placeholder:text-zinc-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
          />
        </div>

        {/* Status Dropdown (2 cols) */}
        <div className="lg:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-700 font-bold font-cairo focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer"
          >
            <option value="all">كل الحالات</option>
            <option value="present">حاضر فعلاً</option>
            <option value="checkedout">انصرف</option>
            <option value="absent">غائب</option>
          </select>
        </div>

        {/* Date Selector (3 cols) */}
        <div className="lg:col-span-3 relative">
          <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-700 font-bold font-cairo cursor-pointer">
            <Calendar className="h-4 w-4 text-zinc-500 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-xs focus:outline-none w-full font-mono cursor-pointer"
            />
          </div>
        </div>

        {/* Export + Filter button (3 cols) */}
        <div className="lg:col-span-3 flex gap-2">
          <button className="flex-1 h-10 flex items-center justify-center gap-1.5 px-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-bold font-cairo transition-all cursor-pointer">
            <Download className="h-3.5 w-3.5 text-zinc-500" />
            <span>تصدير</span>
          </button>
          <button className="flex-1 h-10 flex items-center justify-center gap-1.5 px-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-bold font-cairo transition-all cursor-pointer">
            <Filter className="h-3.5 w-3.5 text-zinc-500" />
            <span>فلاتر</span>
          </button>
        </div>
      </div>

      {/* ── 4 Summary Stats Cards Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Card 1: تسجيلات اليوم */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-zinc-500 font-cairo">تسجيلات اليوم</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo">
              {isAttendanceLoading ? "..." : totalTodayCount}
            </p>
            <p className="text-[11px] text-zinc-400 font-medium">إجمالي السجلات</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
            <Calendar className="h-6 w-6 stroke-[1.8]" />
          </div>
        </div>

        {/* Stat Card 2: حاضر الآن */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-zinc-500 font-cairo">حاضر الآن</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo">
              {isAttendanceLoading ? "..." : checkedInCount}
            </p>
            {totalMembersCount > 0 && (
              <p className="text-[11px] text-emerald-600 font-extrabold font-cairo">
                {((checkedInCount / totalMembersCount) * 100).toFixed(1)}% من الأعضاء
              </p>
            )}
            <button
              onClick={() => setStatusFilter("present")}
              className="text-xs font-bold text-emerald-600 hover:underline block mt-1 font-cairo"
            >
              عرض الحاضرين
            </button>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-6 w-6 stroke-[1.8]" />
          </div>
        </div>

        {/* Stat Card 3: انصرفوا */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-zinc-500 font-cairo">انصرفوا</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo">
              {isAttendanceLoading ? "..." : checkedOutCount}
            </p>
            <p className="text-[11px] text-blue-600 font-extrabold font-cairo">
              أتموا زيارتهم اليوم
            </p>
            <button
              onClick={() => setStatusFilter("checkedout")}
              className="text-xs font-bold text-blue-600 hover:underline block mt-1 font-cairo"
            >
              عرض المنصرفين
            </button>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <UserX className="h-6 w-6 stroke-[1.8]" />
          </div>
        </div>

        {/* Stat Card 4: إجمالي الأعضاء */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-bold text-zinc-500 font-cairo">إجمالي الأعضاء</p>
            <p className="text-3xl font-black text-zinc-900 font-cairo">
              {isMembersLoading ? "..." : totalMembersCount.toLocaleString("ar-EG")}
            </p>
            <p className="text-[11px] text-zinc-400 font-medium">عضو مسجل</p>
            <Link
              href="/dashboard/reception/members"
              className="text-xs font-bold text-zinc-500 hover:text-zinc-800 block mt-1 font-cairo"
            >
              عرض الأعضاء
            </Link>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-zinc-800 text-white flex items-center justify-center shrink-0">
            <Users className="h-6 w-6 stroke-[1.8]" />
          </div>
        </div>
      </div>

      {/* ── Main Attendance Table Section ───────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-4">
        {/* Table Header Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo">
              {activeTab === "today" ? "قائمة الحضور اليوم" : "سجل الحضور التاريخي"}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-black font-mono">
              {filteredRecords.length}
            </span>
          </div>

          {isFetching && !isAttendanceLoading && (
            <span className="text-xs text-zinc-400 font-cairo flex items-center gap-1.5">
              <RefreshCw className="h-3 w-3 animate-spin" />
              جاري التحديث...
            </span>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60 text-xs font-bold text-zinc-400 font-cairo">
                <th className="py-3 px-4">العضو</th>
                <th className="py-3 px-4">رقم الهاتف</th>
                <th className="py-3 px-4 text-center">الحالة</th>
                <th className="py-3 px-4 text-center">وقت الدخول</th>
                <th className="py-3 px-4 text-center">وقت الخروج</th>
                <th className="py-3 px-4 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {isAttendanceLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-zinc-200"></div>
                        <div className="space-y-1.5">
                          <div className="h-3 w-28 bg-zinc-200 rounded"></div>
                          <div className="h-2.5 w-16 bg-zinc-100 rounded"></div>
                        </div>
                      </div>
                    </td>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="py-3.5 px-4">
                        <div className="h-3 w-20 bg-zinc-100 rounded mx-auto"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : isAttendanceError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="h-8 w-8 text-rose-400" />
                      <p className="text-sm font-bold text-zinc-600 font-cairo">
                        تعذر تحميل سجل الحضور
                      </p>
                      <button
                        onClick={() => refetch()}
                        className="text-xs font-bold text-amber-600 hover:underline font-cairo"
                      >
                        إعادة المحاولة
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Clock className="h-8 w-8 text-zinc-300" />
                      <p className="text-sm font-bold text-zinc-400 font-cairo">
                        {searchQuery || statusFilter !== "all"
                          ? "لا توجد سجلات تطابق التصفية الحالية."
                          : "لا يوجد حضور مسجل اليوم بعد."}
                      </p>
                      {!searchQuery && statusFilter === "all" && (
                        <button
                          onClick={() => setCheckInModalOpen(true)}
                          className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:underline font-cairo"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>سجّل أول حضور اليوم</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="hover:bg-zinc-50/80 transition-colors"
                  >
                    {/* Member */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-zinc-900 text-white font-black flex items-center justify-center text-xs shrink-0 font-cairo">
                          {record.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 font-cairo">
                            {record.memberName}
                          </p>
                          <p className="text-[10px] text-zinc-400 font-mono">
                            {record.memberNumber}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 font-mono text-zinc-600 dir-ltr text-right">
                      {record.phone}
                    </td>

                    {/* Status Pill */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full border ${getStatusStyle(record.status)}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getStatusDot(record.status)}`}
                        ></span>
                        <span>{getStatusLabel(record.status)}</span>
                      </span>
                    </td>

                    {/* Check In Time */}
                    <td className="py-3.5 px-4 font-mono text-zinc-600 text-center font-bold">
                      {record.checkInTime}
                    </td>

                    {/* Check Out Time */}
                    <td className="py-3.5 px-4 font-mono text-zinc-400 text-center">
                      {record.checkOutTime || "—"}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {record.status === "CheckedIn" && (
                          <button
                            onClick={() => handleCheckOut(record.id)}
                            disabled={checkOutMutation.isPending}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold rounded-lg font-cairo transition-colors cursor-pointer disabled:opacity-50"
                          >
                            انصراف
                          </button>
                        )}
                        <button className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        {!isAttendanceLoading && filteredRecords.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-100 text-xs text-zinc-500 font-cairo">
            <div className="flex items-center gap-2">
              <span>
                عرض {filteredRecords.length} سجل من إجمالي {totalTodayCount} تسجيل اليوم
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 disabled:opacity-50">
                <ChevronRight className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 rounded-lg bg-gym-yellow text-gym-black font-black flex items-center justify-center">
                1
              </button>
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-100 disabled:opacity-50">
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Check-In Modal Dialog ───────────────────────────────────────────── */}
      {checkInModalOpen && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 dir-rtl font-tajawal">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-zinc-200 shadow-2xl animate-card-enter">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gym-yellow text-gym-black flex items-center justify-center">
                  <UserCheck className="h-4 w-4 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-black text-zinc-900 font-cairo">
                  تسجيل حضور عضو
                </h3>
              </div>
              <button
                onClick={() => {
                  setCheckInModalOpen(false);
                  setMemberSearchQuery("");
                  setModalError(null);
                  setErrorMemberId(null);
                }}
                className="h-8 w-8 rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-800 flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ── Modal Error Banner ─────────────────────────────────────────── */}
            {modalError && (
              <div className="p-3 rounded-2xl border border-rose-200 bg-rose-50 space-y-2 animate-card-enter">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-rose-800 font-cairo">{modalError}</p>
                    {(modalError.includes("اشتراك") || modalError.includes("subscription")) && errorMemberId && (
                      <a
                        href={`/dashboard/reception/members/${errorMemberId}`}
                        className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-extrabold text-rose-700 hover:text-rose-900 underline underline-offset-2 font-cairo"
                      >
                        ⇐ افتح ملف العضو لتجديد الاشتراك
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => { setModalError(null); setErrorMemberId(null); }}
                    className="text-rose-400 hover:text-rose-700 shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Search Input in Modal */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700 font-cairo block">
                ابحث عن العضو لتأكيد الحضور:
              </label>
              <div className="relative">
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="اسم العضو، رقم العضوية، أو رقم الهاتف..."
                  value={memberSearchQuery}
                  onChange={(e) => setMemberSearchQuery(e.target.value)}
                  className="w-full h-11 pr-10 pl-3 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-900 font-medium placeholder:text-zinc-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                />
              </div>
            </div>

            {/* Search Results List */}
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {memberSearchQuery.trim() === "" ? (
                <p className="text-xs text-zinc-400 text-center py-4 font-medium">
                  اكتب اسم العضو أو رقم هاتفه للبحث والبدء بالحضور
                </p>
              ) : isMembersLoading ? (
                <div className="flex items-center justify-center py-6 gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-amber-500" />
                  <span className="text-xs text-zinc-500 font-cairo">جاري البحث...</span>
                </div>
              ) : searchedMembersForModal.length === 0 ? (
                <p className="text-xs text-rose-500 text-center py-4 font-bold">
                  لم يتم العثور على عضو بهذا الإدخال.
                </p>
              ) : (
                searchedMembersForModal.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-3 rounded-xl border border-zinc-200/80 bg-zinc-50/50 flex items-center justify-between gap-3 hover:bg-zinc-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-zinc-900 text-white font-bold flex items-center justify-center text-xs">
                        {mem.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-900 font-cairo">
                          {mem.fullName}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-mono">
                          {mem.memberNumber} | {mem.phone}
                        </p>
                        <span
                          className={`text-[10px] font-bold ${
                            mem.isActive ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {mem.isActive ? "● نشط" : "● غير نشط"}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCheckIn(mem.id)}
                      disabled={checkInMutation.isPending || !mem.isActive}
                      className="px-4 py-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-extrabold text-xs rounded-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {checkInMutation.isPending && (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      )}
                      <span>تسجيل</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-zinc-100 flex justify-end">
              <button
                onClick={() => {
                  setCheckInModalOpen(false);
                  setMemberSearchQuery("");
                  setModalError(null);
                  setErrorMemberId(null);
                }}
                className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold font-cairo transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
