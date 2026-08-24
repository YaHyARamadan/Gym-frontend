"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, AlertTriangle } from "lucide-react";
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
    <div className="w-full max-w-[400px] mx-auto">
      <div className="flex flex-col items-center mb-7">
        <BrandMark tone="dark" />
      </div>

      <div className="auth-card">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gym-black font-cairo">تسجيل الدخول</h1>
          <p className="text-sm text-gym-text-secondary mt-1.5">
            مرحبًا بك، الرجاء إدخال بياناتك للمتابعة
          </p>
        </div>

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
            <AlertTriangle className="h-4 w-4 shrink-0" strokeWidth={2} />
            {serverError}
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
            rightIcon={<Mail className="h-4 w-4" />}
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
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  className="pointer-events-auto text-gym-text-secondary hover:text-gym-black transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
            <div className="text-left mt-2">
              <Link
                href="#"
                className="text-xs font-medium text-gym-text-secondary hover:text-gym-black transition-colors"
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
            className="w-full mt-1"
          >
            {isPending ? "جارٍ تسجيل الدخول…" : "تسجيل الدخول"}
          </Button>
        </form>

        <div className="mt-5 pt-5 border-t border-gym-border text-center">
          <p className="text-sm text-gym-text-secondary">
            لو انت مدرب/موظف ووصلك دعوة، يرجى قبول الدعوة أولًا من بريدك الإلكتروني
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-white/40 mt-6">
        لا تملك حسابًا؟{" "}
        <Link href="/signup" className="font-semibold text-gym-yellow hover:underline underline-offset-2">
          أنشئ حساب مالك صالة
        </Link>
      </p>
    </div>
  );
}
