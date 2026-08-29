"use client";

import { useState } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  FileEdit,
  UserCheck,
} from "lucide-react";
import { useMembers } from "@/features/owner/hooks/useMembers";

export default function BranchMembersPage() {
  const [activeTab, setActiveTab] = useState<"all" | "requests">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: membersData, isLoading, error, refetch } = useMembers();

  const [pendingEditRequests, setPendingEditRequests] = useState([
    {
      id: "req-1",
      memberName: "محمد علي",
      memberNumber: "#1004",
      field: "رقم الهاتف",
      oldValue: "01001234567",
      newValue: "01198765432",
      requestedBy: "سارة - استقبال",
      date: "منذ ساعة",
    },
    {
      id: "req-2",
      memberName: "أحمد محمود",
      memberNumber: "#1012",
      field: "البريد الإلكتروني",
      oldValue: "ahmed_old@email.com",
      newValue: "ahmed_new@email.com",
      requestedBy: "سارة - استقبال",
      date: "منذ 3 ساعات",
    },
  ]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 dir-rtl font-tajawal">
        <RefreshCw className="h-8 w-8 text-gym-yellow animate-spin" />
        <p className="text-sm font-bold text-zinc-600 font-cairo">جاري تحميل أعضاء الفرع...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 dir-rtl font-tajawal text-center p-6 bg-white rounded-3xl border border-zinc-200 shadow-xs max-w-lg mx-auto my-10">
        <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
          <XCircle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-zinc-900 font-cairo">حدث خطأ أثناء تحميل أعضاء الفرع</h3>
          <p className="text-xs text-zinc-500 mt-1">{(error as Error)?.message || "تعذر الاتصال بالخادم."}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>إعادة المحاولة</span>
        </button>
      </div>
    );
  }

  const members = membersData?.items || [];

  const handleApproveRequest = (id: string) => {
    setPendingEditRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRejectRequest = (id: string) => {
    setPendingEditRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const filteredMembers = members.filter(
    (m) =>
      m.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.memberNumber?.includes(searchQuery) ||
      m.phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      <div className="flex items-center justify-between gap-4">
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
            <span>الأعضاء</span>
            <span>‹</span>
            <span>الرئيسية</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">
            أعضاء الفرع
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-zinc-200 pb-1">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold font-cairo transition-all cursor-pointer ${
            activeTab === "all"
              ? "bg-zinc-900 text-gym-yellow shadow-xs"
              : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>قائمة الأعضاء</span>
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold font-cairo transition-all cursor-pointer relative ${
            activeTab === "requests"
              ? "bg-zinc-900 text-gym-yellow shadow-xs"
              : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <FileEdit className="h-4 w-4" />
          <span>طلبات تعديل معلّقة</span>
          {pendingEditRequests.length > 0 && (
            <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-rose-800 text-white text-[10px] font-bold flex items-center justify-center mr-1">
              {pendingEditRequests.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === "all" && (
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="ابحث باسم العضو، الهاتف، أو الرقم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pr-10 pl-4 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-bold text-zinc-400 font-cairo">
                  <th className="py-4 px-4">العضو</th>
                  <th className="py-4 px-4">رقم الهاتف</th>
                  <th className="py-4 px-4 text-center">النوع</th>
                  <th className="py-4 px-4 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-xs font-medium">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-zinc-900 font-cairo">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-xs text-zinc-700">
                          {m.fullName?.charAt(0) || "M"}
                        </div>
                        <div>
                          <p>{m.fullName}</p>
                          <p className="text-[10px] text-zinc-400 font-mono">{m.memberNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-600 font-mono dir-ltr text-right">{m.phone}</td>
                    <td className="py-3.5 px-4 text-center text-zinc-600">
                      {m.gender === "Male" ? "ذكر" : "أنثى"}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {m.isActive ? (
                        <span className="inline-block px-3 py-1 text-xs font-bold text-amber-800 bg-amber-200/60 rounded-md border border-amber-300">
                          نشط
                        </span>
                      ) : (
                        <span className="inline-block px-3 py-1 text-xs font-bold text-zinc-600 bg-zinc-200 rounded-md">
                          غير نشط
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "requests" && (
        <div className="space-y-4">
          {pendingEditRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center shadow-xs space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-zinc-900 font-cairo">لا توجد أي طلبات تعديل معلّقة</h3>
              <p className="text-xs text-zinc-500">تمت مراجعة والبت في كل طلبات التعديل المقدمة من موظفي الاستقبال.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingEditRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-xs space-y-4 text-right"
                >
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <div>
                      <h4 className="text-sm font-black text-zinc-900 font-cairo">{req.memberName}</h4>
                      <span className="text-[11px] text-zinc-400 font-mono">{req.memberNumber}</span>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">{req.date}</span>
                  </div>

                  <div className="space-y-2 text-xs font-medium">
                    <div className="flex items-center justify-between text-zinc-600">
                      <span className="font-bold text-zinc-900">{req.field}</span>
                      <span>الحقل المطلوب تعديله:</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5 font-mono dir-ltr text-right">
                      <p className="text-zinc-400 line-through text-[11px]">السابق: {req.oldValue}</p>
                      <p className="text-emerald-700 font-bold text-xs">الجديد: {req.newValue}</p>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">مقدم الطلب: {req.requestedBy}</p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => handleApproveRequest(req.id)}
                      className="flex-1 h-10 rounded-xl bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-xs transition-all cursor-pointer shadow-xs"
                    >
                      موافقة وتحديث
                    </button>
                    <button
                      onClick={() => handleRejectRequest(req.id)}
                      className="flex-1 h-10 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-cairo font-bold text-xs transition-all cursor-pointer"
                    >
                      رفض الطلب
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
