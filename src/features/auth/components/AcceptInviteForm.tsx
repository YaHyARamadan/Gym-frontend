"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User, CheckCircle2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { acceptInviteSchema, type AcceptInviteFormValues } from "../schemas";
import { useAcceptInvite } from "../hooks/useAcceptInvite";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { PasswordStrength } from "@/shared/ui/PasswordStrength";
import { cn } from "@/lib/utils";

interface AcceptInviteFormProps {
  token: string;
}

export function AcceptInviteForm({ token }: AcceptInviteFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { accept, isPending, serverError, isSuccess } = useAcceptInvite(token);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AcceptInviteFormValues>({
    resolver: zodResolver(acceptInviteSchema),
  });

  const passwordValue = watch("password", "");

  const onSubmit = (data: AcceptInviteFormValues) => accept(data);

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 className="h-12 w-12 text-gym-yellow" strokeWidth={1.5} />
        <p className="text-lg font-bold text-gym-black font-cairo">تم تفعيل الحساب!</p>
        <p className="text-sm text-gym-text-secondary">جارٍ تحويلك…</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {serverError && (
        <div
          role="alert"
          className={cn(
            "rounded-xl px-4 py-3",
            "bg-gym-red-tint border border-gym-red/20",
            "text-sm text-gym-red font-medium flex items-center gap-2"
          )}
        >
          <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={2} />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Input
          {...register("fullName")}
          id="invite-fullname"
          type="text"
          label="اسمك الكامل"
          placeholder="محمد أحمد"
          autoComplete="name"
          autoFocus
          required
          error={errors.fullName?.message}
          rightIcon={<User className="h-4 w-4" />}
        />

        <div className="space-y-2">
          <Input
            {...register("password")}
            id="invite-password"
            type={showPassword ? "text" : "password"}
            label="كلمة المرور الجديدة"
            placeholder="••••••••"
            autoComplete="new-password"
            required
            error={errors.password?.message}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "إخفاء" : "إظهار"}
                className="pointer-events-auto text-gym-text-secondary hover:text-gym-black transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <PasswordStrength password={passwordValue} />
        </div>

        <Input
          {...register("confirmPassword")}
          id="invite-confirm-password"
          type={showConfirm ? "text" : "password"}
          label="تأكيد كلمة المرور"
          placeholder="••••••••"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "إخفاء" : "إظهار"}
              className="pointer-events-auto text-gym-text-secondary hover:text-gym-black transition-colors"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />

        <Button
          id="invite-submit"
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isPending}
          className="w-full mt-2"
        >
          {isPending ? "جارٍ تفعيل الحساب…" : "تفعيل الحساب والدخول"}
        </Button>
      </form>
    </div>
  );
}
