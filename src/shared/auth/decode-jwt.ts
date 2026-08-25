/**
 * Decode a JWT access token (client-side only).
 * The token is NOT HttpOnly — it's in the response body — so we can read it.
 */
export interface JwtPayload {
  sub: string;       // userId
  role: string;      // UserRole enum value
  orgId: string;
  branchId?: string;
  exp: number;
  iat: number;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // Base64url decode
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const parsed = JSON.parse(jsonPayload) as Record<string, unknown>;

    // Handle ASP.NET Core JWT Claim Types mapping
    const sub = (parsed.sub || parsed["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]) as string;
    const role = (parsed.role || parsed["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "Owner") as string;
    const orgId = (parsed.orgId || parsed["OrganizationId"] || "") as string;
    const branchId = (parsed.branchId || parsed["BranchId"]) as string | undefined;

    return {
      sub: sub || "user",
      role: role || "Owner",
      orgId: orgId || "",
      branchId,
      exp: (parsed.exp as number) || 0,
      iat: (parsed.iat as number) || 0,
    };
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return false;
  return Date.now() >= payload.exp * 1000;
}
