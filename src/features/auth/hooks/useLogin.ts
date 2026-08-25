"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/shared/auth/AuthContext";
import { login } from "../api/auth.api";
import type { LoginFormValues } from "../schemas";
import type { UserRole } from "@/types/api";

const ROLE_HOME: Record<UserRole, string> = {
  Owner: "/dashboard/owner",
  BranchManager: "/dashboard/branch-manager",
  Reception: "/dashboard/reception",
  Coach: "/dashboard/coach",
  User: "/login",
};

export function useLogin() {
  const router = useRouter();
  const { login: setUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: LoginFormValues) => login(data),
    onSuccess: (result) => {
      setServerError(null);
      setUser(result.accessToken);
      // Decode role for redirect (role is in the token)
      const payload = parseTokenRole(result.accessToken);
      const destination = payload ? (ROLE_HOME[payload] ?? "/dashboard/owner") : "/dashboard/owner";
      if (typeof window !== "undefined") {
        window.location.href = destination;
      }
    },
    onError: () => {
      setServerError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    },
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
    serverError,
    clearServerError: () => setServerError(null),
  };
}

import { decodeJwt } from "@/shared/auth/decode-jwt";

function parseTokenRole(token: string): UserRole | null {
  const payload = decodeJwt(token);
  return (payload?.role as UserRole) ?? "Owner";
}
