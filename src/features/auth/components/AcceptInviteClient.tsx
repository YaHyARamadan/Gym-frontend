"use client";

import { AlertTriangle, Clock } from "lucide-react";
import { AcceptInviteForm } from "./AcceptInviteForm";
import { BrandMark } from "@/shared/ui/BrandMark";

interface AcceptInviteClientProps {
  token: string | undefined;
}

export function AcceptInviteClient({ token }: AcceptInviteClientProps) {
  // No token in URL → invalid link
  if (!token) {
    return (
      <div className="w-full max-w-[420px] mx-auto">
        <div className="flex flex-col items-center mb-6">
          <BrandMark tone="dark" size="lg" />
        </div>

        <div className="auth-card flex flex-col items-center gap-4 text-center">
          <div className="h-14 w-14 rounded-full bg-gym-red/20 border border-gym-red/40 flex items-center justify-center">
            <AlertTriangle className="h-7 w-7 text-gym-red" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-lg font-bold text-white font-cairo mb-1.5">
              رابط الدعوة غير صالح
            </p>
            <p className="text-sm text-zinc-400 leading-relaxed">
              هذا الرابط مكسور أو لا يحتوي على رمز دعوة صالح.
              <br />
              تواصل مع مدير المنشأة للحصول على رابط جديد.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Brand header */}
      <div className="flex flex-col items-center mb-6">
        <BrandMark tone="dark" size="lg" />
        <h1 className="text-2xl font-extrabold text-white font-cairo mt-4 tracking-wide">قبول الدعوة</h1>
        <p className="text-sm text-zinc-400 mt-1">فعّل حسابك للبدء في النظام</p>
      </div>

      {/* Invite info notice */}
      <div className="bg-gym-yellow/10 border border-gym-yellow/30 backdrop-blur-md rounded-2xl px-4 py-3 mb-5 flex items-center gap-3 shadow-[0_0_20px_rgba(245,197,24,0.1)]">
        <Clock className="h-5 w-5 text-gym-yellow shrink-0" strokeWidth={1.75} />
        <p className="text-xs text-zinc-200 font-medium leading-relaxed">
          رابط الدعوة صالح لمدة <strong className="text-gym-yellow">7 أيام</strong> من تاريخ الإرسال.
        </p>
      </div>

      {/* Form card */}
      <div className="auth-card">
        <AcceptInviteForm token={token} />
      </div>
    </div>
  );
}
