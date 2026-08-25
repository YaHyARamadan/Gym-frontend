import apiClient from "@/shared/api/client";
import type { AuthResultDto } from "@/types/api";
import type { LoginFormValues, SignupFormValues } from "../schemas";

// ── Payloads ─────────────────────────────────────────────────────────
interface AcceptInvitePayload {
  token: string;
  fullName: string;
  password: string;
}

// ── API calls ─────────────────────────────────────────────────────────

/** POST /api/auth/login */
export async function login(data: LoginFormValues): Promise<AuthResultDto> {
  const res = await apiClient.post<AuthResultDto>("/api/auth/login", data);
  return res.data;
}

/** POST /api/auth/signup-owner */
export async function signupOwner(
  data: Omit<SignupFormValues, "confirmPassword">
): Promise<AuthResultDto> {
  const res = await apiClient.post<AuthResultDto>("/api/auth/signup-owner", {
    email: data.email,
    password: data.password,
    fullName: data.fullName,
    orgName: data.organizationName,
  });
  return res.data;
}

/** POST /api/auth/accept-invite */
export async function acceptInvite(
  payload: AcceptInvitePayload
): Promise<AuthResultDto> {
  const res = await apiClient.post<AuthResultDto>(
    "/api/auth/accept-invite",
    payload
  );
  return res.data;
}

/** POST /api/auth/logout */
export async function logout(): Promise<void> {
  await apiClient.post("/api/auth/logout");
}
