/**
 * API Client Configuration
 * 
 * In future, when connecting to a real backend:
 * 1. Set NEXT_PUBLIC_API_URL in your .env.local (e.g. http://localhost:5000/api)
 * 2. This client handles auth headers, base URL, and JSON serialization automatically.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Future JWT Token support:
  // const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  // if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
