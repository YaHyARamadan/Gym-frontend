import type { Metadata } from "next";
import { SignupForm } from "@/features/auth/components/SignupForm";

export const metadata: Metadata = {
  title: "إنشاء حساب",
  description: "أنشئ حسابك كمالك صالة رياضية وابدأ إدارة منشأتك.",
};

export default function SignupPage() {
  return <SignupForm />;
}
