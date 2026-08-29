"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Key,
  Lock,
  Unlock,
  RefreshCw,
  Search,
  Plus,
  Wrench,
  TrendingUp,
  Users,
  Boxes,
  MoreVertical,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Percent,
} from "lucide-react";
import { useLockers, useRentLocker, useReleaseLocker } from "@/features/reception/hooks/useReception";
import { useMembers } from "@/features/owner/hooks/useMembers";
import { extractApiError } from "@/lib/utils";

interface LockerItem {
  id: string;
  code: string;
  type: string;
  doors: string;
  location: string;
  status: "Rented" | "Available" | "Maintenance";
  memberName?: string;
  memberNumber?: string;
  startDate?: string;
  endDate?: string;
  daysRemaining?: string;
  avatar?: string;
}

export default function ReceptionLockersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");

  // Modal State
  const [selectedLocker, setSelectedLocker] = useState<LockerItem | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [durationMonths, setDurationMonths] = useState(1);
  const [amount, setAmount] = useState(150);
  const [showRentModal, setShowRentModal] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { data: lockers, isLoading, refetch } = useLockers();
  const { data: membersData } = useMembers();
  const rentMutation = useRentLocker();
  const releaseMutation = useReleaseLocker();

  const members = membersData?.items || [];

  // Mock Dataset matching the screenshot exactly
  const mockLockersList: LockerItem[] = [
    {
      id: "l1",
      code: "L-001",
      type: "كبيرة",
      doors: "2 باب",
      location: "الدور الأرضي - منطقة رجال",
      status: "Rented",
      memberName: "أحمد خالد محمد",
      memberNumber: "#1001",
      startDate: "2024-05-01",
      endDate: "2024-06-01",
      daysRemaining: "متبقي 10 أيام",
      avatar: "أ",
    },
    {
      id: "l2",
      code: "L-002",
      type: "متوسطة",
      doors: "1 باب",
      location: "الدور الأرضي - منطقة رجال",
      status: "Rented",
      memberName: "سارة محمود علي",
      memberNumber: "#1002",
      startDate: "2024-05-10",
      endDate: "2024-06-10",
      daysRemaining: "متبقي 19 يوم",
      avatar: "س",
    },
    {
      id: "l3",
      code: "L-003",
      type: "كبيرة",
      doors: "2 باب",
      location: "الدور الأول - منطقة نساء",
      status: "Rented",
      memberName: "محمد أسامة حسن",
      memberNumber: "#1003",
      startDate: "2024-04-20",
      endDate: "2024-05-20",
      daysRemaining: "متبقي اليوم",
      avatar: "م",
    },
    {
      id: "l4",
      code: "L-004",
      type: "متوسطة",
      doors: "1 باب",
      location: "الدور الأول - منطقة نساء",
      status: "Available",
    },
    {
      id: "l5",
      code: "L-005",
      type: "كبيرة",
      doors: "2 باب",
      location: "الدور الثاني - منطقة رجال",
      status: "Rented",
      memberName: "عمر طارق إبراهيم",
      memberNumber: "#1005",
      startDate: "2024-05-05",
      endDate: "2024-06-05",
      daysRemaining: "متبقي 14 يوم",
      avatar: "ع",
    },
    {
      id: "l6",
      code: "L-006",
      type: "متوسطة",
      doors: "1 باب",
      location: "الدور الثاني - منطقة رجال",
      status: "Maintenance",
    },
    {
      id: "l7",
      code: "L-007",
      type: "كبيرة",
      doors: "2 باب",
      location: "الدور الأرضي - منطقة رجال",
      status: "Available",
    },
  ];

  const rawLockers = Array.isArray(lockers)
    ? lockers
    : (lockers as unknown as { items?: Array<any> })?.items;

  const displayLockers = rawLockers && rawLockers.length > 0
    ? rawLockers.map((l, idx) => ({
        id: l.id,
        code: l.lockerNumber || `L-00${idx + 1}`,
        type: "كبيرة",
        doors: "2 باب",
        location: "الدور الأرضي - منطقة رجال",
        status: (l.status === "Rented" ? "Rented" : "Available") as LockerItem["status"],
        memberName: l.rentedByMemberName,
        memberNumber: "#1001",
        startDate: "2024-05-01",
        endDate: l.rentalEndDate || "2024-06-01",
        daysRemaining: "متبقي 10 أيام",
        avatar: l.rentedByMemberName ? l.rentedByMemberName.charAt(0) : "ع",
      }))
    : mockLockersList;

  const filteredLockers = displayLockers.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.memberName && item.memberName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.memberNumber && item.memberNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "rented" && item.status === "Rented") ||
      (statusFilter === "available" && item.status === "Available") ||
      (statusFilter === "maintenance" && item.status === "Maintenance");

    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesLocation = locationFilter === "all" || item.location.includes(locationFilter);

    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });

  const handleRentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocker || !selectedMemberId) return;

    setFeedback(null);
    rentMutation.mutate(
      {
        lockerId: selectedLocker.id,
        memberId: selectedMemberId,
        durationMonths,
        amount,
      },
      {
        onSuccess: () => {
          setFeedback({ type: "success", message: `تم تأجير الخزانة ${selectedLocker.code} بنجاح!` });
          setShowRentModal(false);
          setSelectedLocker(null);
          refetch();
        },
        onError: (err) => {
          setFeedback({ type: "error", message: extractApiError(err) || "تعذر تأجير الخزانة." });
        },
      }
    );
  };

  const handleRelease = (lockerId: string, lockerCode: string) => {
    setFeedback(null);
    releaseMutation.mutate(lockerId, {
      onSuccess: () => {
        setFeedback({ type: "success", message: `تم تحرير الخزانة ${lockerCode} وإعادتها للمتاحة!` });
        refetch();
      },
      onError: (err) => {
        setFeedback({ type: "error", message: extractApiError(err) || "تعذر تحرير الخزانة." });
      },
    });
  };

  return (
    <div className="space-y-6 max-w-[1550px] mx-auto dir-rtl font-tajawal pb-12">
      {/* ── Top Header Section ──────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium font-cairo mb-1">
            <Link href="/dashboard/reception" className="hover:text-zinc-700">الرئيسية</Link>
            <span>›</span>
            <span className="text-zinc-800 font-bold">الخزائن</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Key className="h-5 w-5 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo">الخزائن (Lockers)</h1>
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              const avail = displayLockers.find((l) => l.status === "Available");
              if (avail) setSelectedLocker(avail);
              setShowRentModal(true);
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>تأجير خزنة جديدة</span>
          </button>

          <button
            onClick={() => {
              const rented = displayLockers.find((l) => l.status === "Rented");
              if (rented) handleRelease(rented.id, rented.code);
            }}
            className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-sm px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer"
          >
            <Unlock className="h-4 w-4 text-zinc-500" />
            <span>تحرير خزنة</span>
          </button>

          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-sm px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 text-zinc-500 ${isLoading ? "animate-spin" : ""}`} />
            <span>تحديث</span>
          </button>
        </div>
      </div>

      {/* ── Feedback Toast Banner ───────────────────────────────────────────── */}
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
          <button onClick={() => setFeedback(null)} className="text-zinc-400 hover:text-zinc-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── 5 Operational Metric Stat Cards Grid ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: إجمالي الخزائن */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">إجمالي الخزائن</span>
            <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Boxes className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">120</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">خزنة</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button
              onClick={() => setStatusFilter("all")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 font-cairo"
            >
              <span>عرض الكل</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* Card 2: الخزائن المؤجرة */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">الخزائن المؤجرة</span>
            <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">86</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">خزنة</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button
              onClick={() => setStatusFilter("rented")}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-cairo"
            >
              <span>عرض الكل</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* Card 3: الخزائن المتاحة */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">الخزائن المتاحة</span>
            <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Unlock className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">32</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">خزنة</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button
              onClick={() => setStatusFilter("available")}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-cairo"
            >
              <span>عرض الكل</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* Card 4: الصيانة */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">الصيانة</span>
            <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Wrench className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">2</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">خزائن</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button
              onClick={() => setStatusFilter("maintenance")}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 font-cairo"
            >
              <span>عرض الكل</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* Card 5: إجمالي إيرادات الشهر */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">إجمالي إيرادات الشهر</span>
            <div className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-zinc-900 font-cairo tracking-tight">
              8,600 <span className="text-xs font-bold text-zinc-500">ج.م</span>
            </p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">مايو 2024</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 font-cairo">
              <span>عرض التقرير</span>
              <span>←</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Search & Filters Bar ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search Input (5 cols) */}
        <div className="lg:col-span-5 relative">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="ابحث برقم الخزانة أو رقم العضو أو الاسم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pr-10 pl-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 font-medium placeholder:text-zinc-400 focus:outline-none focus:border-amber-400 focus:bg-white transition-all"
          />
        </div>

        {/* Location Dropdown (3 cols) */}
        <div className="lg:col-span-3">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-700 font-bold font-cairo focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer"
          >
            <option value="all">كل المناطق</option>
            <option value="رجال">منطقة رجال</option>
            <option value="نساء">منطقة نساء</option>
            <option value="الأرضي">الدور الأرضي</option>
            <option value="الأول">الدور الأول</option>
          </select>
        </div>

        {/* Type Dropdown (2 cols) */}
        <div className="lg:col-span-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-700 font-bold font-cairo focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer"
          >
            <option value="all">كل الأنواع</option>
            <option value="كبيرة">كبيرة (2 باب)</option>
            <option value="متوسطة">متوسطة (1 باب)</option>
          </select>
        </div>

        {/* Status Dropdown (2 cols) */}
        <div className="lg:col-span-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-700 font-bold font-cairo focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer"
          >
            <option value="all">كل الحالات</option>
            <option value="rented">مؤجرة</option>
            <option value="available">متاحة</option>
            <option value="maintenance">تحت الصيانة</option>
          </select>
        </div>
      </div>

      {/* ── Main Split Workspace Layout (Left: Table | Right: Summary Sidebars) ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Left Column: Lockers Table (8 cols) ─────────────────────────── */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo">قائمة الخزائن</h2>
            <span className="text-xs font-bold text-zinc-400 font-mono">{filteredLockers.length} خزانة</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60 text-xs font-bold text-zinc-400 font-cairo">
                  <th className="py-3.5 px-4">رقم الخزانة</th>
                  <th className="py-3.5 px-4">النوع</th>
                  <th className="py-3.5 px-4">الموقع</th>
                  <th className="py-3.5 px-4">الحالة / العضو</th>
                  <th className="py-3.5 px-4 text-center">رقم العضو</th>
                  <th className="py-3.5 px-4 text-center">تاريخ البداية</th>
                  <th className="py-3.5 px-4 text-center">تاريخ الانتهاء</th>
                  <th className="py-3.5 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {filteredLockers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-zinc-400 font-medium">
                      لا توجد خزائن تطابق التصفية الحالية.
                    </td>
                  </tr>
                ) : (
                  filteredLockers.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50/80 transition-colors">
                      {/* Locker Code Badge */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-3 py-1 bg-sky-50 text-sky-800 rounded-lg font-mono font-bold border border-sky-100">
                          {item.code}
                        </span>
                      </td>

                      {/* Locker Type */}
                      <td className="py-3.5 px-4 font-cairo">
                        <div className="flex items-center gap-1.5 font-bold text-zinc-800">
                          <Boxes className="h-4 w-4 text-zinc-400" />
                          <span>{item.type}</span>
                          <span className="text-[10px] text-zinc-400 font-normal">({item.doors})</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 font-cairo font-medium text-zinc-600">
                        {item.location}
                      </td>

                      {/* Status / Member */}
                      <td className="py-3.5 px-4">
                        {item.status === "Rented" && item.memberName ? (
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-zinc-900 text-white font-black flex items-center justify-center text-xs shrink-0 font-cairo">
                              {item.avatar}
                            </div>
                            <span className="font-bold text-zinc-900 font-cairo">{item.memberName}</span>
                          </div>
                        ) : item.status === "Maintenance" ? (
                          <span className="text-amber-700 font-bold font-cairo">تحت الصيانة</span>
                        ) : (
                          <span className="text-zinc-400 font-medium">—</span>
                        )}
                      </td>

                      {/* Member Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-zinc-700 text-center">
                        {item.memberNumber || "—"}
                      </td>

                      {/* Start Date */}
                      <td className="py-3.5 px-4 font-mono text-zinc-500 text-center">
                        {item.startDate || "—"}
                      </td>

                      {/* End Date & Days Remaining Subtext */}
                      <td className="py-3.5 px-4 text-center">
                        {item.endDate ? (
                          <div>
                            <p className="font-mono text-zinc-800 font-medium">{item.endDate}</p>
                            <p className="text-[10px] font-bold text-emerald-600 font-cairo mt-0.5">
                              {item.daysRemaining}
                            </p>
                          </div>
                        ) : item.status === "Maintenance" ? (
                          <span className="text-amber-700 font-bold text-[11px] font-cairo">
                            تحت الصيانة
                          </span>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <button className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-100 text-xs text-zinc-500 font-cairo">
            <div className="flex items-center gap-2">
              <span>عرض 1 - 1 من 120 خزانة</span>
              <span>•</span>
              <select className="h-8 px-2 rounded-lg border border-zinc-200 bg-zinc-50 text-xs font-bold text-zinc-700 focus:outline-none">
                <option value="10">10 لكل صفحة</option>
                <option value="25">25 لكل صفحة</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-400 hover:bg-zinc-100">
                <ChevronRight className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 rounded-lg bg-gym-yellow text-gym-black font-black flex items-center justify-center">
                1
              </button>
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100">
                2
              </button>
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100">
                3
              </button>
              <span className="px-1 text-zinc-400">...</span>
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100">
                12
              </button>
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Column: Summary Sidebars (4 cols) ────────────────────── */}
        <div className="lg:col-span-4 space-y-4 sticky top-6">
          {/* Card 1: ملخص سريع (Quick Summary) */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-900 font-cairo border-b border-zinc-100 pb-3">
              ملخص سريع
            </h3>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-extrabold font-cairo">
                <span className="text-zinc-700">معدل الإشغال</span>
                <span className="text-zinc-900 font-mono text-sm">71.7%</span>
              </div>
              <div className="h-2.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[71.7%]"></div>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between items-center text-zinc-600 font-medium">
                <span>إجمالي الخزائن المؤجرة</span>
                <span className="font-bold text-zinc-900 font-mono">86</span>
              </div>
              <div className="flex justify-between items-center text-zinc-600 font-medium">
                <span>إجمالي الخزائن المتاحة</span>
                <span className="font-bold text-zinc-900 font-mono">32</span>
              </div>
              <div className="flex justify-between items-center text-zinc-600 font-medium">
                <span>الخزائن تحت الصيانة</span>
                <span className="font-bold text-zinc-900 font-mono">2</span>
              </div>
              <div className="flex justify-between items-center text-zinc-600 font-medium pt-2 border-t border-zinc-100">
                <span>متوسط مدة الإيجار</span>
                <span className="font-bold text-zinc-900 font-cairo">45 يوم</span>
              </div>
            </div>
          </div>

          {/* Card 2: الإيرادات (Revenue Summary) */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-extrabold text-zinc-900 font-cairo">الإيرادات</h3>
              <span className="px-2.5 py-0.5 text-[10px] font-bold text-sky-800 bg-sky-50 rounded-md">
                هذا الشهر
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-zinc-600 font-medium">
                <span>إجمالي الإيرادات</span>
                <span className="font-black text-zinc-900 font-cairo text-sm">8,600 ج.م</span>
              </div>
              <div className="flex justify-between items-center text-zinc-600 font-medium">
                <span>عدد عقود الإيجار</span>
                <span className="font-bold text-zinc-900 font-mono">86</span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100">
              <button className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 font-cairo">
                <span>عرض تقرير الإيرادات</span>
                <span>←</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Rent Locker Modal Dialog ───────────────────────────────────────── */}
      {showRentModal && selectedLocker && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 dir-rtl font-tajawal">
          <form
            onSubmit={handleRentSubmit}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-zinc-200 shadow-2xl animate-card-enter"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gym-yellow text-gym-black flex items-center justify-center">
                  <Key className="h-4 w-4 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-zinc-900 font-cairo">
                  تأجير الخزانة ({selectedLocker.code})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRentModal(false)}
                className="h-8 w-8 rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-800 flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 font-cairo block">اختر العضو *</label>
              <select
                required
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs font-bold text-zinc-800 focus:outline-none focus:border-amber-400"
              >
                <option value="">اختر العضو من القائمة...</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.memberNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 font-cairo block">مدة الإيجار (أشهر)</label>
                <input
                  type="number"
                  min={1}
                  value={durationMonths}
                  onChange={(e) => {
                    const m = Number(e.target.value);
                    setDurationMonths(m);
                    setAmount(m * 150);
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs font-bold text-zinc-900 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 font-cairo block">المبلغ (ج.م)</label>
                <input
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs font-bold text-zinc-900 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-zinc-100">
              <button
                type="submit"
                disabled={rentMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {rentMutation.isPending && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>تأكيد التأجير</span>
              </button>
              <button
                type="button"
                onClick={() => setShowRentModal(false)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-bold font-cairo transition-colors cursor-pointer"
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

