/**
 * Central API Client for QuickBooks ERP
 * Connects to FastAPI Backend / Next.js API Routes with TypeScript support,
 * automatic token refreshing on 401s, and seamless error handling.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiErrorResponse {
  message: string;
  status: number;
  details?: unknown;
}

interface CustomRequestInit extends RequestInit {
  _isRetry?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

function onRefreshed(success: boolean) {
  refreshSubscribers.forEach((callback) => callback(success));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (success: boolean) => void) {
  refreshSubscribers.push(callback);
}

export async function apiClient<T>(
  endpoint: string,
  options: CustomRequestInit = {}
): Promise<T> {
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
    credentials: options.credentials || "include",
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

  // Handle Token Expiry & Automatic Refresh on 401 Unauthorized
  const isAuthEndpoint =
    endpoint.includes("/api/auth/signin") ||
    endpoint.includes("/api/auth/signup") ||
    endpoint.includes("/api/auth/refresh") ||
    endpoint.includes("/api/auth/verify-otp");

  if (response.status === 401 && !options._isRetry && !isAuthEndpoint) {
    if (typeof window !== "undefined") {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
          });

          if (refreshRes.ok) {
            isRefreshing = false;
            onRefreshed(true);
            return apiClient<T>(endpoint, { ...options, _isRetry: true });
          } else {
            isRefreshing = false;
            onRefreshed(false);
            // Session is completely expired; redirect to login
            const currentPath = window.location.pathname;
            if (
              currentPath !== "/signin" &&
              currentPath !== "/signup" &&
              currentPath !== "/"
            ) {
              window.location.href = "/signin?expired=true";
            }
          }
        } catch {
          isRefreshing = false;
          onRefreshed(false);
        }
      } else {
        // Wait for current refresh to complete, then retry
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((success) => {
            if (success) {
              resolve(apiClient<T>(endpoint, { ...options, _isRetry: true }));
            } else {
              reject(new Error("Session expired. Please sign in again."));
            }
          });
        });
      }
    }
  }

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status} ${response.statusText})`;

    if (data && typeof data === "object") {
      if (Array.isArray(data.detail)) {
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
