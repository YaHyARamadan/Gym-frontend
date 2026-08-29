import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parses backend ProblemDetails (RFC 7807) error responses into a human-readable string.
 * Reads in order: errors object → detail → title → null
 */
export function extractApiError(error: unknown): string | null {
  if (typeof error === "object" && error !== null) {
    const e = error as {
      response?: {
        data?: {
          errors?: Record<string, string[]>;
          detail?: string;
          title?: string;
          message?: string;
        };
      };
    };
    const data = e.response?.data;
    if (data?.errors && typeof data.errors === "object") {
      const messages = Object.values(data.errors).flat().filter(Boolean);
      if (messages.length > 0) return messages.join(" | ");
    }
    if (data?.detail) return data.detail;
    if (data?.title) return data.title;
    if (data?.message) return data.message;
  }
  return null;
}
