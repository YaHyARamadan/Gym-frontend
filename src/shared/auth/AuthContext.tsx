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
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** Parse an access token and populate user state + window.__accessToken */
  const login = useCallback((accessToken: string) => {
    if (typeof window !== "undefined") {
      window.__accessToken = accessToken;
    }
    const payload = decodeJwt(accessToken);
    if (!payload) {
      setUser(null);
      return;
    }
    setUser({
      id: payload.sub,
      // email & fullName aren't in the JWT — we'll get them from /api/users/me lazily
      email: "",
      fullName: "",
      role: payload.role as UserRole,
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
      }
      setUser(null);
      window.location.href = "/login";
    }
  }, []);

  /**
   * On mount: try to refresh using the HttpOnly refreshToken cookie.
   * If refresh succeeds → we're authenticated.
   * If refresh fails → not authenticated (cookie missing/expired).
   */
  useEffect(() => {
    let cancelled = false;

    const tryRestore = async () => {
      try {
        const { data } = await apiClient.post<{ accessToken: string }>(
          "/api/auth/refresh-token"
        );
        if (!cancelled) {
          login(data.accessToken);
        }
      } catch {
        // Not authenticated — that's fine
      } finally {
        if (!cancelled) setIsLoading(false);
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
