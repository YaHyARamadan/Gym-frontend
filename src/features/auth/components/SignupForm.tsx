"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, User, Building2, AlertTriangle, ArrowLeft, Lock } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { signupSchema, type SignupFormValues } from "../schemas";
import { useSignup } from "../hooks/useSignup";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { PasswordStrength } from "@/shared/ui/PasswordStrength";
import { BrandMark } from "@/shared/ui/BrandMark";
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
    <div className="w-full max-w-[440px] mx-auto">
      {/* Brand header */}
      <div className="flex flex-col items-center mb-6">
        <BrandMark tone="dark" size="lg" />
      </div>

      {/* Card */}
      <div className="auth-card">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-white font-cairo tracking-wide">إنشاء حساب جديد</h1>
          <p className="text-sm text-zinc-400 mt-1.5 font-medium">خاص بمالكي ومديري الصالات الرياضية</p>
        </div>

        {serverError && (
          <div
            role="alert"
            className={cn(
              "mb-5 rounded-xl px-4 py-3",
              "bg-gym-red/15 border border-gym-red/40",
              "text-sm text-red-300 font-medium",
              "flex items-center gap-2.5"
            )}
          >
            <AlertTriangle className="h-4 w-4 shrink-0 text-gym-red" strokeWidth={2} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            {...register("fullName")}
            id="signup-fullname"
            type="text"
            label="الاسم الكامل"
            placeholder="محمد أحمد"
            autoComplete="name"
            autoFocus
            error={errors.fullName?.message}
            rightIcon={<User className="h-4 w-4 text-zinc-400" />}
          />

          <Input
            {...register("organizationName")}
            id="signup-org"
            type="text"
            label="اسم المنشأة / الصالة"
            placeholder="صالة النخبة الرياضية"
            autoComplete="organization"
            error={errors.organizationName?.message}
            rightIcon={<Building2 className="h-4 w-4 text-zinc-400" />}
          />

          <Input
            {...register("email")}
            id="signup-email"
            type="email"
            label="البريد الإلكتروني"
            placeholder="example@email.com"
            autoComplete="email"
            error={errors.email?.message}
            rightIcon={<Mail className="h-4 w-4 text-zinc-400" />}
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
            id="signup-confirm-password"
            type={showConfirm ? "text" : "password"}
            label="تأكيد كلمة المرور"
            placeholder="••••••••"
            autoComplete="new-password"
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
            id="signup-submit"
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isPending}
            className="w-full mt-3 group font-cairo font-bold tracking-wide text-base shadow-[0_0_20px_rgba(245,197,24,0.3)] hover:shadow-[0_0_30px_rgba(245,197,24,0.5)] transition-all duration-300"
          >
            {isPending ? (
              "جارٍ إنشاء الحساب…"
            ) : (
              <span className="flex items-center justify-center gap-2">
                إنشاء الحساب
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-5 pt-5 border-t border-white/10 text-center">
          <p className="text-sm text-zinc-400">
            لديك حساب بالفعل؟{" "}
            <Link
              href="/login"
              className="font-semibold text-gym-yellow hover:text-amber-300 hover:underline underline-offset-4"
            >
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
