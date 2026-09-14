/**
 * Central API Client for Meridian ERP
 * Connects to FastAPI Backend with full TypeScript support & error handling.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiErrorResponse {
  message: string;
  status: number;
  details?: unknown;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Allow local Next.js API route handlers (e.g. /api/auth/*, /api/company/*, /api/users/*) or full URLs
  const isLocalRoute =
    endpoint.startsWith("/api/auth/") ||
    endpoint.startsWith("/api/company/") ||
    endpoint.startsWith("/api/users/");

  const url =
    endpoint.startsWith("http") || isLocalRoute
      ? endpoint
      : `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    },
    credentials: options.credentials || "include", // Automatically handles HttpOnly auth cookies
  });

  // Try to parse JSON response body
  const text = await response.text();
  let data: any = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status} ${response.statusText})`;

    if (data && typeof data === "object") {
      if (Array.isArray(data.detail)) {
        // FastAPI Pydantic validation error array
        errorMessage = data.detail
          .map((d: { msg?: string; loc?: string[] }) => d.msg || "Invalid input")
          .join(", ");
      } else if (typeof data.detail === "string") {
        errorMessage = data.detail;
      } else if (data.message) {
        errorMessage = data.message;
      }
    } else if (response.status === 500) {
      errorMessage =
        "Backend server is currently initializing database. Please check back shortly.";
    }

    const error = new Error(errorMessage) as Error & ApiErrorResponse;
    error.status = response.status;
    error.details = data;
    throw error;
  }

  return data as T;
}
