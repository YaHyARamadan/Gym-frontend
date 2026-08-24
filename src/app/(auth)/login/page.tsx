import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description: "سجّل الدخول للوصول إلى لوحة التحكم الخاصة بك.",
};

export default function LoginPage() {
  return <LoginForm />;
}
