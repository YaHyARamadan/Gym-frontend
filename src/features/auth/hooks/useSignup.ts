"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/shared/auth/AuthContext";
import { signupOwner } from "../api/auth.api";
import type { SignupFormValues } from "../schemas";

export function useSignup() {
  const router = useRouter();
  const { login: setUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: SignupFormValues) =>
      signupOwner({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        organizationName: data.organizationName,
      }),
    onSuccess: (result) => {
      setServerError(null);
      setUser(result.accessToken);
      router.replace("/dashboard/owner");
    },
    onError: (error: unknown) => {
      const apiError = extractApiError(error);
      setServerError(apiError ?? "حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.");
    },
  });

  return {
    signup: mutation.mutate,
    isPending: mutation.isPending,
    serverError,
    clearServerError: () => setServerError(null),
  };
}

function extractApiError(error: unknown): string | null {
  if (typeof error === "object" && error !== null) {
    const e = error as { response?: { data?: { errors?: Record<string, string[]>; detail?: string; title?: string } } };
    const data = e.response?.data;
    if (data?.errors) {
      const first = Object.values(data.errors).flat()[0];
      if (first) return first;
    }
    if (data?.detail) return data.detail;
    if (data?.title) return data.title;
  }
  return null;
}
