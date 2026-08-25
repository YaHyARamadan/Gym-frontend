"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, AlertTriangle, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { loginSchema, type LoginFormValues } from "../schemas";
import { useLogin } from "../hooks/useLogin";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { BrandMark } from "@/shared/ui/BrandMark";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isPending, serverError, clearServerError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    clearServerError();
    login(data);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto">
      <div className="flex flex-col items-center mb-6">
        <BrandMark tone="dark" size="lg" />
      </div>

      <div className="auth-card">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-white font-cairo tracking-wide">تسجيل الدخول</h1>
          <p className="text-sm text-zinc-400 mt-1.5 font-medium">
            مرحبًا بك، أدخل بياناتك للوصول لنظام الصالة
          </p>
        </div>

        {serverError && (
          <div
            role="alert"
            className={cn(
              "mb-5 rounded-xl px-4 py-3",
              "bg-gym-red/15 border border-gym-red/40",
              "text-sm text-red-300 font-medium",
              "flex items-center gap-2.5 animate-fadeIn"
            )}
          >
            <AlertTriangle className="h-4 w-4 shrink-0 text-gym-red" strokeWidth={2} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <Input
            {...register("email")}
            id="login-email"
            type="email"
            inputMode="email"
            label="البريد الإلكتروني"
            placeholder="example@email.com"
            autoComplete="email"
            autoFocus
            dir="ltr"
            error={errors.email?.message}
            rightIcon={<Mail className="h-4 w-4 text-zinc-400" />}
          />

          <div>
            <Input
              {...register("password")}
              id="login-password"
              type={showPassword ? "text" : "password"}
              label="كلمة المرور"
              placeholder="••••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              rightIcon={<Lock className="h-4 w-4 text-zinc-400" />}
              leftIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  className="pointer-events-auto text-zinc-400 hover:text-gym-yellow transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <div className="text-left mt-2">
              <Link
                href="#"
                className="text-xs font-medium text-zinc-400 hover:text-gym-yellow transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>
          </div>

          <Button
            id="login-submit"
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isPending}
            className="w-full mt-2 group font-cairo font-bold tracking-wide text-base shadow-[0_0_20px_rgba(245,197,24,0.3)] hover:shadow-[0_0_30px_rgba(245,197,24,0.5)] transition-all duration-300"
          >
            {isPending ? (
              "جارٍ تسجيل الدخول…"
            ) : (
              <span className="flex items-center justify-center gap-2">
                تسجيل الدخول
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/10 text-center">
          <p className="text-xs text-zinc-400 leading-relaxed">
            مدرب أو موظف جديد؟ يرجى قبول دعوتك المنسقة من بريدك الإلكتروني
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-zinc-400 mt-6">
        لا تملك حسابًا منشأة؟{" "}
        <Link href="/signup" className="font-semibold text-gym-yellow hover:text-amber-300 hover:underline underline-offset-4">
          أنشئ حساب مالك صالة
        </Link>
      </p>
    </div>
  );
}
