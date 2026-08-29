"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Plus,
  Send,
  RefreshCw,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  UserCheck,
  CheckSquare,
  Users,
  MoreVertical,
  X,
  Calendar,
  AlertTriangle,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";
import {
  useComplaints,
  useCreateComplaint,
  useTransferComplaint,
} from "@/features/reception/hooks/useReception";
import { extractApiError } from "@/lib/utils";

interface ComplaintItem {
  id: string;
  code: string;
  memberName: string;
  memberNumber: string;
  phone: string;
  planName: string;
  subject: string;
  description: string;
  priority: "High" | "Medium" | "Low";
  status: "Open" | "InReview" | "Transferred" | "Closed";
  createdAt: string;
  updatedAt: string;
  avatar: string;
}

export default function ReceptionComplaintsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({ memberName: "", subject: "", description: "", priority: "High" });
  const [noteText, setNoteText] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState<string>("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { data: complaints, isLoading, refetch } = useComplaints();
  const createMutation = useCreateComplaint();
  const transferMutation = useTransferComplaint();

  // Mock dataset matching screenshot exactly
  const mockComplaintsList: ComplaintItem[] = [
    {
      id: "c1",
      code: "#C-10034",
      memberName: "أحمد خالد محمد",
      memberNumber: "#1001",
      phone: "0100 123 4567",
      planName: "اشتراك شهري - جولد",
      subject: "جهاز المشي رقم 5 لا يعمل بشكل جيد",
      description: "جهاز المشي رقم 5 يتوقف أثناء المشي ويظهر عليه رسالة خطأ.",
      priority: "High", // عالية
      status: "Open", // مفتوحة
      createdAt: "2024-05-21 10:45 ص",
      updatedAt: "2024-05-21 10:45 ص",
      avatar: "أ",
    },
    {
      id: "c2",
      code: "#C-10033",
      memberName: "سارة محمود علي",
      memberNumber: "#1002",
      phone: "0100 234 5678",
      planName: "اشتراك 3 أشهر - بريميوم",
      subject: "نظافة دورات المياه غير مرضية",
      description: "يرجى الاهتمام بنظافة دورات المياه وتعقيمها بانتظام.",
      priority: "Medium", // متوسطة
      status: "InReview", // قيد المراجعة
      createdAt: "2024-05-20 03:20 م",
      updatedAt: "2024-05-21 09:30 ص",
      avatar: "س",
    },
    {
      id: "c3",
      code: "#C-10032",
      memberName: "محمد أسامة حسن",
      memberNumber: "#1003",
      phone: "0100 345 6789",
      planName: "اشتراك سنوي - بلاتينيوم",
      subject: "تأخر فتح الصالة في الصباح",
      description: "تأخر فتح أبواب الصالة الرياضية نصف ساعة اليوم.",
      priority: "Medium", // متوسطة
      status: "Open", // مفتوحة
      createdAt: "2024-05-19 08:15 م",
      updatedAt: "2024-05-19 08:15 م",
      avatar: "م",
    },
    {
      id: "c4",
      code: "#C-10031",
      memberName: "نورهان سعيد عبد الله",
      memberNumber: "#1004",
      phone: "0100 456 7890",
      planName: "اشتراك شهري - جولد",
      subject: "المدرب لا يلتزم بالمواعيد",
      description: "تأخر المدرب الخاص عن موعد الجلسة المحددة.",
      priority: "High", // عالية
      status: "Transferred", // تم التحويل
      createdAt: "2024-05-18 12:30 م",
      updatedAt: "2024-05-20 11:10 ص",
      avatar: "ن",
    },
    {
      id: "c5",
      code: "#C-10030",
      memberName: "عمرو طارق إبراهيم",
      memberNumber: "#1005",
      phone: "0100 567 8901",
      planName: "اشتراك 3 أشهر - بريميوم",
      subject: "عطل تكييف في الصالة",
      description: "التكييف الرئيسي في صالة الأثقال يفصل فجأة.",
      priority: "Low", // منخفضة
      status: "Closed", // مغلقة
      createdAt: "2024-05-18 09:05 ص",
      updatedAt: "2024-05-19 02:40 م",
      avatar: "ع",
    },
    {
      id: "c6",
      code: "#C-10029",
      memberName: "إسلام محمد فتحي",
      memberNumber: "#1006",
      phone: "0100 678 9012",
      planName: "اشتراك شهري - جولد",
      subject: "عدم توفر أدوات تمارين معينة",
      description: "نقص في أوزان الدنابل 15 كجم بالصالة.",
      priority: "Medium", // متوسطة
      status: "Open", // مفتوحة
      createdAt: "2024-05-17 07:50 ص",
      updatedAt: "2024-05-18 10:05 ص",
      avatar: "إ",
    },
    {
      id: "7",
      code: "#C-10028",
      memberName: "هالة أحمد مصطفي",
      memberNumber: "#1007",
      phone: "0100 789 0123",
      planName: "اشتراك سنوي - بلاتينيوم",
      subject: "ضعيفة",
      description: "ملاحظات حول الإضاءة في منطقة الاستراحة.",
      priority: "Low", // منخفضة
      status: "Closed", // مغلقة
      createdAt: "2024-05-17 06:30 م",
      updatedAt: "2024-05-18 09:20 ص",
      avatar: "هـ",
    },
  ];

  const rawComplaints = Array.isArray(complaints)
    ? complaints
    : (complaints as unknown as { items?: Array<any> })?.items;

  const displayComplaints = rawComplaints && rawComplaints.length > 0
    ? rawComplaints.map((c, idx) => ({
        id: c.id,
        code: `#C-100${34 - idx}`,
        memberName: c.memberName || "عضو",
        memberNumber: "#1001",
        phone: "0100 123 4567",
        planName: "اشتراك شهري - جولد",
        subject: c.subject,
        description: c.description,
        priority: "High" as const,
        status: (c.status === "Pending" ? "Open" : "Transferred") as ComplaintItem["status"],
        createdAt: new Date(c.createdAt).toLocaleString("ar-EG"),
        updatedAt: new Date(c.createdAt).toLocaleString("ar-EG"),
        avatar: c.memberName ? c.memberName.charAt(0) : "ع",
      }))
    : mockComplaintsList;

  // Selected initial complaint for sidebar panel
  const activeComplaint = selectedComplaint || displayComplaints[0];

  const filteredComplaints = displayComplaints.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "open" && item.status === "Open") ||
      (statusFilter === "review" && item.status === "InReview") ||
      (statusFilter === "transferred" && item.status === "Transferred") ||
      (statusFilter === "closed" && item.status === "Closed");

    const matchesPriority =
      priorityFilter === "all" ||
      (priorityFilter === "high" && item.priority === "High") ||
      (priorityFilter === "medium" && item.priority === "Medium") ||
      (priorityFilter === "low" && item.priority === "Low");

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    createMutation.mutate(
      {
        memberName: formData.memberName,
        subject: formData.subject,
        description: formData.description,
      },
      {
        onSuccess: () => {
          setFeedback({ type: "success", message: "تم تسجيل الشكوى بنجاح!" });
          setShowModal(false);
          setFormData({ memberName: "", subject: "", description: "", priority: "High" });
          refetch();
        },
        onError: (err) => {
          setFeedback({ type: "error", message: extractApiError(err) || "حدث خطأ أثناء تسجيل الشكوى." });
        },
      }
    );
  };

  const handleTransfer = (id: string) => {
    setFeedback(null);
    transferMutation.mutate(id, {
      onSuccess: () => {
        setFeedback({ type: "success", message: "تم تحويل الشكوى لمدير الفرع للمتابعة!" });
        refetch();
      },
      onError: (err) => {
        setFeedback({ type: "error", message: extractApiError(err) || "تعذر تحويل الشكوى." });
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
            <span className="text-zinc-800 font-bold">الشكاوى</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo">الشكاوى</h1>
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer shrink-0 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>تسجيل شكوى جديدة</span>
          </button>

          <button className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-700 font-cairo font-bold text-sm px-4 py-2.5 rounded-xl border border-zinc-200 shadow-xs transition-all cursor-pointer">
            <Download className="h-4 w-4 text-zinc-500" />
            <span>تصدير</span>
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
        {/* Card 1: إجمالي الشكاوى */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">إجمالي الشكاوى</span>
            <div className="h-10 w-10 rounded-full bg-zinc-800 text-white flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">34</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">كل الشكاوى</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button
              onClick={() => setStatusFilter("all")}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 font-cairo"
            >
              <span>عرض الكل</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* Card 2: مفتوحة */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">مفتوحة</span>
            <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">18</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">قيد المعالجة</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button
              onClick={() => setStatusFilter("open")}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 font-cairo"
            >
              <span>عرض</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* Card 3: قيد المراجعة */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">قيد المراجعة</span>
            <div className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
              <MessageSquare className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">7</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">بانتظار مدير الفرع</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button
              onClick={() => setStatusFilter("review")}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 font-cairo"
            >
              <span>عرض</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* Card 4: تم التحويل */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">تم التحويل</span>
            <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
              <ArrowRightLeft className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">5</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">مُحولة لمدير الفرع</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button
              onClick={() => setStatusFilter("transferred")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 font-cairo"
            >
              <span>عرض</span>
              <span>←</span>
            </button>
          </div>
        </div>

        {/* Card 5: مغلقة */}
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-zinc-500 font-cairo">مغلقة</span>
            <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 stroke-[2]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-black text-zinc-900 font-cairo">4</p>
            <p className="text-[11px] text-zinc-400 font-medium mt-0.5">تم الحل</p>
          </div>
          <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
            <button
              onClick={() => setStatusFilter("closed")}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-cairo"
            >
              <span>عرض</span>
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
            placeholder="ابحث باسم العضو أو رقم الشكوى..."
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
            <option value="open">مفتوحة</option>
            <option value="review">قيد المراجعة</option>
            <option value="transferred">تم التحويل</option>
            <option value="closed">مغلقة</option>
          </select>
        </div>

        {/* Priority Dropdown (2 cols) */}
        <div className="lg:col-span-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-700 font-bold font-cairo focus:outline-none focus:border-amber-400 focus:bg-white transition-all cursor-pointer"
          >
            <option value="all">كل الأولويات</option>
            <option value="high">عالية</option>
            <option value="medium">متوسطة</option>
            <option value="low">منخفضة</option>
          </select>
        </div>

        {/* Date Filter (3 cols) */}
        <div className="lg:col-span-3 relative">
          <div className="flex items-center gap-2 h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-700 font-bold font-cairo cursor-pointer">
            <Calendar className="h-4 w-4 text-zinc-500 shrink-0" />
            <span>كل الفترات</span>
          </div>
        </div>
      </div>

      {/* ── Main Split Layout (Left: Table | Right: Details Sidebar) ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Left Column: Complaints Table (8 cols) ─────────────────────── */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <h2 className="text-base font-extrabold text-zinc-900 font-cairo">قائمة الشكاوى</h2>
            <span className="text-xs font-bold text-zinc-400 font-mono">{filteredComplaints.length} شكوى</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60 text-xs font-bold text-zinc-400 font-cairo">
                  <th className="py-3.5 px-4">رقم الشكوى</th>
                  <th className="py-3.5 px-4">العضو</th>
                  <th className="py-3.5 px-4 text-center">الأولوية</th>
                  <th className="py-3.5 px-4 text-center">الحالة</th>
                  <th className="py-3.5 px-4 text-center">تاريخ الإنشاء</th>
                  <th className="py-3.5 px-4 text-center">آخر تحديث</th>
                  <th className="py-3.5 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-zinc-400 font-medium">
                      لا توجد شكاوى تطابق التصفية الحالية.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedComplaint(item)}
                      className={`hover:bg-zinc-50/80 transition-colors cursor-pointer ${
                        activeComplaint?.id === item.id ? "bg-amber-50/40" : ""
                      }`}
                    >
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-zinc-800">
                        {item.code}
                      </td>

                      {/* Member & Subject Subtitle */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-zinc-900 text-white font-black flex items-center justify-center text-xs shrink-0 font-cairo">
                            {item.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 font-cairo">{item.subject}</p>
                            <p className="text-[10px] text-zinc-400 font-cairo">{item.memberName}</p>
                          </div>
                        </div>
                      </td>

                      {/* Priority Tag */}
                      <td className="py-3.5 px-4 text-center">
                        {item.priority === "High" && (
                          <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold text-rose-800 bg-rose-100 rounded">
                            عالية
                          </span>
                        )}
                        {item.priority === "Medium" && (
                          <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold text-amber-800 bg-amber-100 rounded">
                            متوسطة
                          </span>
                        )}
                        {item.priority === "Low" && (
                          <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 rounded">
                            منخفضة
                          </span>
                        )}
                      </td>

                      {/* Status Tag */}
                      <td className="py-3.5 px-4 text-center">
                        {item.status === "Open" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 bg-amber-50 rounded-full border border-amber-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                            <span>مفتوحة</span>
                          </span>
                        )}
                        {item.status === "InReview" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold text-purple-800 bg-purple-50 rounded-full border border-purple-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-purple-600"></span>
                            <span>قيد المراجعة</span>
                          </span>
                        )}
                        {item.status === "Transferred" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold text-blue-800 bg-blue-50 rounded-full border border-blue-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                            <span>تم التحويل</span>
                          </span>
                        )}
                        {item.status === "Closed" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 rounded-full border border-emerald-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                            <span>مغلقة</span>
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 font-mono text-zinc-500 text-center">
                        {item.createdAt}
                      </td>

                      {/* Updated At */}
                      <td className="py-3.5 px-4 font-mono text-zinc-500 text-center">
                        {item.updatedAt}
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
              <span>عرض 1 - 10 من 34 شكوى</span>
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
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100">
                4
              </button>
              <span className="px-1 text-zinc-400">...</span>
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100">
                5
              </button>
              <button className="h-8 w-8 rounded-lg border border-zinc-200 flex items-center justify-center text-zinc-700 hover:bg-zinc-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Column: Complaint Details Sidebar Panel (4 cols) ─────── */}
        {activeComplaint && (
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-5 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="text-base font-extrabold text-zinc-900 font-cairo">تفاصيل الشكوى</h2>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Member Profile Header Card */}
            <div className="p-4 rounded-xl bg-zinc-50/80 border border-zinc-200/70 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-zinc-900 text-white font-black flex items-center justify-center text-xs shrink-0 font-cairo">
                  {activeComplaint.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-zinc-900 text-sm font-cairo">{activeComplaint.memberName}</h3>
                    <span className="text-[10px] text-zinc-400 font-mono">{activeComplaint.memberNumber}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">{activeComplaint.phone}</p>
                  <p className="text-[10px] text-zinc-400 font-cairo mt-0.5">{activeComplaint.planName}</p>
                </div>
              </div>

              <span className="px-2.5 py-1 text-[10px] font-bold text-amber-800 bg-amber-100 rounded-md shrink-0 font-cairo">
                مفتوحة
              </span>
            </div>

            {/* Complaint Subject & Description Details */}
            <div className="space-y-3 text-right">
              <div>
                <span className="text-[11px] font-bold text-zinc-400 font-cairo block">الموضوع</span>
                <p className="text-xs font-extrabold text-zinc-900 font-cairo mt-0.5">
                  {activeComplaint.subject}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-zinc-400 font-cairo block">الوصف</span>
                <p className="text-xs text-zinc-600 leading-relaxed font-medium mt-0.5 bg-zinc-50 p-3 rounded-xl border border-zinc-200/50">
                  {activeComplaint.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  {activeComplaint.priority === "High" && (
                    <span className="px-3 py-1 rounded-md bg-rose-100 text-rose-800 text-xs font-bold font-cairo">
                      عالية
                    </span>
                  )}
                </div>
                <div className="text-left font-mono text-[10px] text-zinc-400">
                  <p>تاريخ الإنشاء: {activeComplaint.createdAt}</p>
                  <p>آخر تحديث: {activeComplaint.updatedAt}</p>
                </div>
              </div>
            </div>

            {/* Actions Form */}
            <div className="pt-3 border-t border-zinc-100 space-y-3">
              <h4 className="text-xs font-extrabold text-zinc-900 font-cairo">الإجراءات</h4>

              <div className="space-y-1">
                <select
                  value={updatedStatus}
                  onChange={(e) => setUpdatedStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs font-bold text-zinc-700 focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="">تغيير الحالة</option>
                  <option value="Open">مفتوحة</option>
                  <option value="InReview">قيد المراجعة</option>
                  <option value="Closed">مغلقة (تم الحل)</option>
                </select>
              </div>

              <div className="space-y-1">
                <textarea
                  rows={3}
                  placeholder="أضف ملاحظة..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs py-2.5 rounded-xl shadow-xs transition-all cursor-pointer">
                <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                <span>حفظ التحديث</span>
              </button>

              <button
                onClick={() => handleTransfer(activeComplaint.id)}
                disabled={transferMutation.isPending}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 text-xs font-bold font-cairo transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5 text-amber-600" />
                <span>تحويل لمدير الفرع</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Create New Complaint Modal Dialog ─────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 dir-rtl font-tajawal">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-zinc-200 shadow-2xl animate-card-enter"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gym-yellow text-gym-black flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-black text-zinc-900 font-cairo">تسجيل شكوى جديدة</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="h-8 w-8 rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-800 flex items-center justify-center cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 font-cairo block">اسم العضو / مقدم الشكوى *</label>
              <input
                type="text"
                required
                placeholder="أدخل اسم العضو..."
                value={formData.memberName}
                onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 font-cairo block">موضوع الشكوى *</label>
              <input
                type="text"
                required
                placeholder="مثال: جهاز المشي رقم 5 لا يعمل"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 font-cairo block">الأولوية *</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs font-bold text-zinc-700 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="High">عالية</option>
                <option value="Medium">متوسطة</option>
                <option value="Low">منخفضة</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 font-cairo block">التفاصيل والوصف *</label>
              <textarea
                required
                rows={3}
                placeholder="ادخل تفاصيل الشكوى الدقيقة..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50/50 text-xs text-zinc-900 font-medium focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-zinc-100">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {createMutation.isPending && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                <span>تسجيل الشكوى</span>
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
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

