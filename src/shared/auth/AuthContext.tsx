"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CurrentUser, UserRole } from "@/types/api";
import { decodeJwt } from "./decode-jwt";
import apiClient from "../api/client";

// ─────────────────────────────────────────────
// Context shape
// ─────────────────────────────────────────────
interface AuthContextValue {
  user: CurrentUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (accessToken: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isDev = process.env.NODE_ENV === "development";
  const [user, setUser] = useState<CurrentUser | null>(
    isDev
      ? {
          id: "dev-owner-id",
          email: "owner@gym.com",
          fullName: "أحمد محمد",
          role: "Owner",
          orgId: "org-1",
        }
      : null
  );
  const [isLoading, setIsLoading] = useState(!isDev);

  /** Parse an access token and populate user state + window.__accessToken */
  const login = useCallback((accessToken: string) => {
    if (typeof window !== "undefined") {
      window.__accessToken = accessToken;
      localStorage.setItem("accessToken", accessToken);
    }
    const payload = decodeJwt(accessToken);
    if (!payload) {
      setUser(null);
      return;
    }
    setUser({
      id: payload.sub,
      email: "",
      fullName: "",
      role: (payload.role as UserRole) || "Owner",
      orgId: payload.orgId,
      branchId: payload.branchId,
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/api/auth/logout");
    } catch {
      // best-effort
    } finally {
      if (typeof window !== "undefined") {
        window.__accessToken = undefined;
        localStorage.removeItem("accessToken");
      }
      setUser(null);
      window.location.href = "/login";
    }
  }, []);

  /**
   * On mount: try to restore token from localStorage or refresh via HttpOnly cookie
   */
  useEffect(() => {
    let cancelled = false;

    const tryRestore = async () => {
      if (typeof window !== "undefined") {
        const storedToken = localStorage.getItem("accessToken");
        if (storedToken) {
          window.__accessToken = storedToken;
          login(storedToken);
          setIsLoading(false);
          return;
        }
      }

      try {
        const { data } = await apiClient.post<{ accessToken: string }>(
          "/api/auth/refresh-token"
        );
        if (!cancelled) {
          login(data.accessToken);
        }
      } catch {
        // Not authenticated
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    tryRestore();
    return () => {
      cancelled = true;
    };
  }, [login]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
