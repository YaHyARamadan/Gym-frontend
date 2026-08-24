"use client";

import { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "../schemas";
import { useLogin } from "../hooks/useLogin";

/* ─────────────────────────────────────────────
   Barbell Logo — matches the reference design
───────────────────────────────────────────── */
function BarbellLogo() {
  return (
    <div className="login-logo">
      <svg
        width="72"
        height="40"
        viewBox="0 0 72 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* left weight plates */}
        <rect x="0"  y="8" width="5" height="24" rx="2" fill="#F5C518" />
        <rect x="8"  y="4" width="5" height="32" rx="2" fill="#F5C518" />
        {/* bar */}
        <rect x="16" y="17" width="40" height="6" rx="3" fill="#0D0D0D" />
        {/* right weight plates */}
        <rect x="59" y="4"  width="5" height="32" rx="2" fill="#F5C518" />
        <rect x="67" y="8"  width="5" height="24" rx="2" fill="#F5C518" />
      </svg>

      <div className="login-logo-text">
        <p className="login-logo-name">GYM</p>
        <p className="login-logo-sub">MANAGEMENT</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SVG Icons (inline — no extra lib needed)
───────────────────────────────────────────── */
const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
    <path d="m3.5 6 8.5 6.5L20.5 6" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="4" y="10.5" width="16" height="10" rx="2.3" />
    <path d="M7.5 10.5V7.8a4.5 4.5 0 0 1 9 0v2.7" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M3 3l18 18" />
    <path d="M10.6 5.2A10.9 10.9 0 0 1 12 5c5 0 9 4 10.5 7-0.6 1.2-1.5 2.5-2.7 3.6M6.2 6.6C4.2 8 2.7 10 1.5 12c1.5 3 5.5 7 10.5 7 1.6 0 3.1-.4 4.4-1" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
);

/* ─────────────────────────────────────────────
   Main LoginForm component
───────────────────────────────────────────── */
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
    <main className="login-page">
      {/* decorative dot pattern corners */}
      <div className="login-dot login-dot--tl" aria-hidden="true" />
      <div className="login-dot login-dot--br" aria-hidden="true" />
      {/* subtle gold gradient overlay */}
      <div className="login-gradient-overlay" aria-hidden="true" />

      {/* ── Card ── */}
      <div className="login-card">
        <BarbellLogo />

        <div className="login-heading">
          <h1 className="login-title">مرحبًا بعودتك</h1>
          <p className="login-subtitle">سجّل الدخول للوصول إلى لوحة التحكم</p>
        </div>

        {/* Server error */}
        {serverError && (
          <div role="alert" className="login-server-error">
            <span aria-hidden="true">⚠</span>
            {serverError}
          </div>
        )}

        <form
          className="login-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* ── Email ── */}
          <div className="login-field">
            <label htmlFor="login-email" className="login-label">
              البريد الإلكتروني
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <MailIcon />
              </span>
              <input
                {...register("email")}
                id="login-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                dir="ltr"
                placeholder="example@email.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={`login-input${errors.email ? " login-input--error" : ""}`}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="login-field-error">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* ── Password ── */}
          <div className="login-field">
            <label htmlFor="login-password" className="login-label">
              كلمة المرور
            </label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <LockIcon />
              </span>
              <input
                {...register("password")}
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                className={`login-input login-input--has-toggle${errors.password ? " login-input--error" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="login-eye-btn"
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="login-field-error">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* ── Submit ── */}
          <button
            id="login-submit"
            type="submit"
            disabled={isPending}
            className="login-submit-btn"
          >
            {isPending ? (
              <>
                <span className="login-spinner" aria-hidden="true" />
                جارٍ تسجيل الدخول…
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
