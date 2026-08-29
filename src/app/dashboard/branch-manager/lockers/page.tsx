"use client";

import { useState } from "react";
import { Key, Plus, Lock, Unlock, AlertTriangle } from "lucide-react";

export default function BranchLockersPage() {
  const [lockers, setLockers] = useState([
    { id: "1", number: "101", status: "Available", memberName: null, expiresAt: null },
    { id: "2", number: "102", status: "Occupied", memberName: "محمد علي", expiresAt: "2026-09-10" },
    { id: "3", number: "103", status: "Occupied", memberName: "أحمد محمود", expiresAt: "2026-08-30" },
    { id: "4", number: "104", status: "Available", memberName: null, expiresAt: null },
    { id: "5", number: "105", status: "ExpiringSoon", memberName: "كريم حسن", expiresAt: "2026-08-27" },
    { id: "6", number: "106", status: "Available", memberName: null, expiresAt: null },
  ]);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto dir-rtl font-tajawal pb-10">
      <div className="flex items-center justify-between gap-4">
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium justify-end">
            <span>الخزائن</span>
            <span>‹</span>
            <span>الرئيسية</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-900 font-cairo tracking-wide mt-0.5">
            إدارة خزائن الفرع
          </h1>
        </div>

        <button className="flex items-center gap-2 bg-gym-yellow hover:bg-amber-400 text-gym-black font-cairo font-black text-sm px-6 py-3 rounded-2xl shadow-[0_4px_16px_rgba(245,197,24,0.35)] transition-all cursor-pointer">
          <Plus className="h-4.5 w-4.5 stroke-[2.5]" />
          <span>+ إضافة خزانة جديدة</span>
        </button>
      </div>

      {/* Grid of Lockers */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-6 border-b border-zinc-100 pb-4 text-xs font-bold font-cairo">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-gym-yellow" />
            <span>متاحة للـتأجير</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-zinc-400" />
            <span>مشغولة</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500" />
            <span>تنتهي قريباً (تنبيه)</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {lockers.map((l) => (
            <div
              key={l.id}
              className={`p-5 rounded-2xl border text-center space-y-3 transition-all cursor-pointer ${
                l.status === "Available"
                  ? "border-amber-300 bg-amber-50/40 hover:bg-amber-100/50"
                  : l.status === "ExpiringSoon"
                  ? "border-rose-400 bg-rose-50/50 hover:bg-rose-100/50"
                  : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-400">#{l.number}</span>
                {l.status === "Available" ? (
                  <Unlock className="h-4 w-4 text-amber-600" />
                ) : l.status === "ExpiringSoon" ? (
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                ) : (
                  <Lock className="h-4 w-4 text-zinc-500" />
                )}
              </div>

              <div>
                <p className="text-lg font-black text-zinc-900 font-cairo">خزانة {l.number}</p>
                {l.memberName ? (
                  <p className="text-xs font-bold text-zinc-700 mt-1 truncate">{l.memberName}</p>
                ) : (
                  <p className="text-xs font-bold text-amber-700 mt-1">متاحة</p>
                )}
              </div>

              {l.expiresAt && (
                <p className="text-[10px] text-zinc-400 font-mono pt-1 border-t border-zinc-200/60">
                  ينتهي: {l.expiresAt}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
