"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User, Building2, Dumbbell } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { signupSchema, type SignupFormValues } from "../schemas";
import { useSignup } from "../hooks/useSignup";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { PasswordStrength } from "@/shared/ui/PasswordStrength";
import { cn } from "@/lib/utils";

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { signup, isPending, serverError, clearServerError } = useSignup();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const passwordValue = watch("password", "");

  const onSubmit = (data: SignupFormValues) => {
    clearServerError();
    signup(data);
  };

  return (
    <div className="w-full max-w-[400px] mx-auto">
      {/* Brand header */}
      <div className="flex flex-col items-center mb-8">
        <div className="h-14 w-14 rounded-2xl bg-gym-yellow flex items-center justify-center shadow-lg mb-4">
          <Dumbbell className="h-7 w-7 text-gym-black" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold text-gym-black font-cairo">إنشاء حساب جديد</h1>
        <p className="text-sm text-gym-text-secondary mt-1">لمالكي الصالات الرياضية فقط</p>
      </div>

      {/* Card */}
      <div className="bg-gym-surface rounded-3xl border border-gym-border shadow-[0_4px_24px_rgba(0,0,0,0.07)] p-7">
        {serverError && (
          <div
            role="alert"
            className={cn(
              "mb-5 rounded-xl px-4 py-3",
              "bg-gym-red-tint border border-gym-red/20",
              "text-sm text-gym-red font-medium",
              "flex items-center gap-2"
            )}
          >
            <span aria-hidden="true" className="text-base">⚠</span>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Input
            {...register("fullName")}
            id="signup-fullname"
            type="text"
            label="الاسم الكامل"
            placeholder="محمد أحمد"
            autoComplete="name"
            autoFocus
            error={errors.fullName?.message}
            rightIcon={<User className="h-4 w-4" />}
          />

          <Input
            {...register("organizationName")}
            id="signup-org"
            type="text"
            label="اسم المنشأة / الصالة"
            placeholder="صالة النخبة الرياضية"
            autoComplete="organization"
            error={errors.organizationName?.message}
            rightIcon={<Building2 className="h-4 w-4" />}
          />

          <Input
            {...register("email")}
            id="signup-email"
            type="email"
            label="البريد الإلكتروني"
            placeholder="example@email.com"
            autoComplete="email"
            error={errors.email?.message}
            rightIcon={<Mail className="h-4 w-4" />}
            dir="ltr"
          />

          <div className="space-y-2">
            <Input
              {...register("password")}
              id="signup-password"
              type={showPassword ? "text" : "password"}
              label="كلمة المرور"
              placeholder="••••••••"
              autoComplete="new-password"
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
            id="signup-confirm-password"
            type={showConfirm ? "text" : "password"}
            label="تأكيد كلمة المرور"
            placeholder="••••••••"
            autoComplete="new-password"
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
            id="signup-submit"
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isPending}
            className="w-full mt-2"
          >
            {isPending ? "جارٍ إنشاء الحساب…" : "إنشاء الحساب"}
          </Button>
        </form>

        <div className="mt-5 pt-5 border-t border-gym-border text-center">
          <p className="text-sm text-gym-text-secondary">
            لديك حساب بالفعل؟{" "}
            <Link
              href="/login"
              className="font-semibold text-gym-black hover:underline underline-offset-2"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
