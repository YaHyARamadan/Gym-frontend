"use client";

import { useState } from "react";
import { Users, Search, RefreshCw, Dumbbell } from "lucide-react";
import { useMembers } from "@/features/owner/hooks/useMembers";

export default function CoachMembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: membersData, isLoading, refetch } = useMembers();

  const members = membersData?.items || [];
  const filteredMembers = members.filter((m) =>
    m.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.memberNumber?.includes(searchQuery)
  );

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-right flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-800 shadow-xs">
            <Users className="h-6 w-6 stroke-[1.8]" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide">
              المتدربين التابعين لي
            </h1>
            <p className="text-xs text-zinc-500 font-medium">متابعة المتدربين والبرامج التدريبية المخصصة لهم</p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-5">
        <div className="relative max-w-sm">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="ابحث باسم المتدرب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pr-10 pl-4 rounded-xl border border-zinc-200 bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-gym-yellow"
          />
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-xs font-bold text-zinc-400">جاري تحميل المتدربين...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/50 text-xs font-bold text-zinc-400 font-cairo">
                  <th className="py-4 px-4">المتدرب</th>
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
                      <span className="inline-block px-3 py-1 text-xs font-bold text-amber-900 bg-amber-200/60 rounded-full border border-amber-300">
                        نشط
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
