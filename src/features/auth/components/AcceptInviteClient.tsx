"use client";

import { Dumbbell, AlertTriangle, Clock } from "lucide-react";
import { AcceptInviteForm } from "./AcceptInviteForm";

const ROLE_LABELS: Record<string, string> = {
  BranchManager: "مدير فرع",
  Reception: "موظف استقبال",
  Coach: "مدرب",
  Owner: "مالك",
};

interface AcceptInviteClientProps {
  token: string | undefined;
}

export function AcceptInviteClient({ token }: AcceptInviteClientProps) {
  // No token in URL → invalid link
  if (!token) {
    return (
      <div className="w-full max-w-[400px] mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gym-yellow flex items-center justify-center shadow-lg mb-4">
            <Dumbbell className="h-7 w-7 text-gym-black" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold text-gym-black font-cairo">قبول الدعوة</h1>
        </div>

        <div className="bg-gym-surface rounded-3xl border border-gym-border shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-8 flex flex-col items-center gap-4 text-center">
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
      <div className="flex flex-col items-center mb-8">
        <div className="h-14 w-14 rounded-2xl bg-gym-yellow flex items-center justify-center shadow-lg mb-4">
          <Dumbbell className="h-7 w-7 text-gym-black" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold text-gym-black font-cairo">قبول الدعوة</h1>
        <p className="text-sm text-gym-text-secondary mt-1">فعّل حسابك للبدء</p>
      </div>

      {/* Invite info notice */}
      <div className="bg-gym-yellow-tint border border-gym-yellow/30 rounded-2xl px-5 py-4 mb-4 flex items-center gap-3">
        <Clock className="h-5 w-5 text-gym-black shrink-0" strokeWidth={1.5} />
        <p className="text-sm text-gym-black font-medium">
          رابط الدعوة صالح لمدة <strong>7 أيام</strong> من تاريخ الإرسال.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-gym-surface rounded-3xl border border-gym-border shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-7">
        <AcceptInviteForm token={token} />
      </div>
    </div>
  );
}
