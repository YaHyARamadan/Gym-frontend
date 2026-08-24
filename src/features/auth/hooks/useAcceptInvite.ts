"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/shared/auth/AuthContext";
import { acceptInvite } from "../api/auth.api";
import type { AcceptInviteFormValues } from "../schemas";
import type { UserRole } from "@/types/api";

const ROLE_HOME: Record<UserRole, string> = {
  Owner: "/dashboard/owner",
  BranchManager: "/dashboard/branch-manager",
  Reception: "/dashboard/reception",
  Coach: "/dashboard/coach",
  User: "/dashboard",
};

export function useAcceptInvite(token: string) {
  const router = useRouter();
  const { login: setUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: AcceptInviteFormValues) =>
      acceptInvite({
        token,
        fullName: data.fullName,
        password: data.password,
      }),
    onSuccess: (result) => {
      setServerError(null);
      setUser(result.accessToken);
      const role = parseTokenRole(result.accessToken);
      const destination = role ? (ROLE_HOME[role] ?? "/dashboard") : "/dashboard";
      router.replace(destination);
    },
    onError: (error: unknown) => {
      const msg = extractApiError(error);
      setServerError(msg ?? "الرابط غير صالح أو منتهي الصلاحية.");
    },
  });

  return {
    accept: mutation.mutate,
    isPending: mutation.isPending,
    serverError,
    isSuccess: mutation.isSuccess,
  };
}

function parseTokenRole(token: string): UserRole | null {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
    );
    return payload.role as UserRole;
  } catch {
    return null;
  }
}

function extractApiError(error: unknown): string | null {
  if (typeof error === "object" && error !== null) {
    const e = error as {
      response?: {
        data?: {
          errors?: Record<string, string[]>;
          detail?: string;
          title?: string;
        };
      };
    };
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
