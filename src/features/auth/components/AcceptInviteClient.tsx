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
      <div className="w-full max-w-[400px] mx-auto">
        <div className="flex flex-col items-center mb-7">
          <BrandMark tone="dark" />
        </div>

        <div className="auth-card flex flex-col items-center gap-4 text-center">
          <div className="h-14 w-14 rounded-full bg-gym-red-tint flex items-center justify-center">
            <AlertTriangle className="h-7 w-7 text-gym-red" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-base font-bold text-gym-black font-cairo mb-1.5">
              رابط الدعوة غير صالح
            </p>
            <p className="text-sm text-gym-text-secondary leading-relaxed">
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
    <div className="w-full max-w-[400px] mx-auto">
      {/* Brand header */}
      <div className="flex flex-col items-center mb-7">
        <BrandMark tone="dark" />
        <h1 className="text-2xl font-bold text-white font-cairo mt-4">قبول الدعوة</h1>
        <p className="text-sm text-white/60 mt-1">فعّل حسابك للبدء</p>
      </div>

      {/* Invite info notice */}
      <div className="bg-gym-yellow-tint border border-gym-yellow/30 rounded-2xl px-5 py-4 mb-4 flex items-center gap-3">
        <Clock className="h-5 w-5 text-gym-black shrink-0" strokeWidth={1.5} />
        <p className="text-sm text-gym-black font-medium">
          رابط الدعوة صالح لمدة <strong>7 أيام</strong> من تاريخ الإرسال.
        </p>
      </div>

      {/* Form card */}
      <div className="auth-card">
        <AcceptInviteForm token={token} />
      </div>
    </div>
  );
}
