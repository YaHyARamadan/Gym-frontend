"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/shared/auth/AuthContext";
import { signupOwner } from "../api/auth.api";
import type { SignupFormValues } from "../schemas";
import { extractApiError } from "@/lib/utils";

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
