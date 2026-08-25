"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User, CheckCircle2, AlertTriangle, ArrowLeft, Lock } from "lucide-react";
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
      <div className="flex flex-col items-center gap-3 py-8 text-center animate-fadeIn">
        <div className="h-16 w-16 rounded-full bg-gym-yellow/20 border border-gym-yellow/40 flex items-center justify-center shadow-[0_0_30px_rgba(245,197,24,0.3)]">
          <CheckCircle2 className="h-10 w-10 text-gym-yellow" strokeWidth={1.75} />
        </div>
        <p className="text-xl font-extrabold text-white font-cairo mt-2">تم تفعيل الحساب بنجاح!</p>
        <p className="text-sm text-zinc-400">جارٍ تحويلك إلى لوحة التحكم…</p>
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
            "bg-gym-red/15 border border-gym-red/40",
            "text-sm text-red-300 font-medium flex items-center gap-2.5"
          )}
        >
          <AlertTriangle className="h-4 w-4 shrink-0 text-gym-red" strokeWidth={2} />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
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
          rightIcon={<User className="h-4 w-4 text-zinc-400" />}
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
            rightIcon={<Lock className="h-4 w-4 text-zinc-400" />}
            leftIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "إخفاء" : "إظهار"}
                className="pointer-events-auto text-zinc-400 hover:text-gym-yellow transition-colors"
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
          rightIcon={<Lock className="h-4 w-4 text-zinc-400" />}
          leftIcon={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "إخفاء" : "إظهار"}
              className="pointer-events-auto text-zinc-400 hover:text-gym-yellow transition-colors"
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
          className="w-full mt-3 group font-cairo font-bold tracking-wide text-base shadow-[0_0_20px_rgba(245,197,24,0.3)] hover:shadow-[0_0_30px_rgba(245,197,24,0.5)] transition-all duration-300"
        >
          {isPending ? (
            "جارٍ تفعيل الحساب…"
          ) : (
            <span className="flex items-center justify-center gap-2">
              تفعيل الحساب والدخول
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
