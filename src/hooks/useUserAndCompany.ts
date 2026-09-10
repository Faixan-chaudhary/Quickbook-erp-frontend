"use client";

import { useQuery } from "@tanstack/react-query";

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  role?: string;
  plan?: string;
}

export interface CompanyProfile {
  id?: string;
  name?: string;
  legal_name?: string | null;
  country?: string;
  currency?: string;
  plan?: string;
  phone?: string | null;
  email?: string | null;
}

/**
 * 1. Hook to fetch current logged-in User profile
 * - Uses localStorage cache on page refresh (0 API calls on refresh)
 * - staleTime: Infinity ensures it only fetches once unless cache is cleared or on logout
 */
export function useUserProfile() {
  // Read cached user data from localStorage if available
  let cachedUser: UserProfile | undefined = undefined;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("arca_user_profile");
      if (stored) cachedUser = JSON.parse(stored);
    } catch {
      // Ignore JSON parse error
    }
  }

  return useQuery<UserProfile>({
    queryKey: ["user-profile-me"],
    queryFn: async () => {
      const res = await fetch("/api/users/me");
      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }
      const data = await res.json();
      if (typeof window !== "undefined" && data) {
        localStorage.setItem("arca_user_profile", JSON.stringify(data));
        if (data.email) localStorage.setItem("user_email", data.email);
      }
      return data;
    },
    initialData: cachedUser,
    staleTime: Infinity, // Does not re-fetch on refresh if cache exists
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}

/**
 * 2. Hook to fetch current Company profile
 * - Uses localStorage cache on page refresh (0 API calls on refresh)
 * - staleTime: Infinity ensures it only fetches once unless cache is cleared or on logout
 */
export function useCompanyProfile() {
  // Read cached company data from localStorage if available
  let cachedCompany: CompanyProfile | undefined = undefined;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("arca_company_profile");
      if (stored) cachedCompany = JSON.parse(stored);
    } catch {
      // Ignore JSON parse error
    }
  }

  return useQuery<CompanyProfile>({
    queryKey: ["company-profile-me"],
    queryFn: async () => {
      const res = await fetch("/api/company/me");
      if (!res.ok) {
        throw new Error("Failed to fetch company profile");
      }
      const data = await res.json();
      if (typeof window !== "undefined" && data) {
        localStorage.setItem("arca_company_profile", JSON.stringify(data));
        if (data.name) localStorage.setItem("company_name", data.name);
      }
      return data;
    },
    initialData: cachedCompany,
    staleTime: Infinity, // Does not re-fetch on refresh if cache exists
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}

/**
 * Helper to convert email into a formatted human-readable name
 * Example: "farhan.ali@gmail.com" -> "Farhan Ali"
 * Example: "owner@example.com" -> "Owner"
 */
function formatEmailToName(email: string): string {
  if (!email) return "User";
  const prefix = email.split("@")[0] || "";
  return prefix
    .split(/[._-]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * 3. Unified Hook for Dashboard, Topbar, and Sidebar
 * Reads immediately from cached state — zero flickering and zero redundant API calls.
 */
export function useUserAndCompany() {
  const { data: userData, isLoading: isUserLoading } = useUserProfile();
  const { data: companyData, isLoading: isCompanyLoading } = useCompanyProfile();

  // Determine user email & formatted display name
  const effectiveEmail = userData?.email || "";
  const userName =
    userData?.name || (effectiveEmail ? formatEmailToName(effectiveEmail) : "User");
  const userRole = userData?.role || "Administrator";
  const userPlan = userData?.plan || companyData?.plan || "Essentials";

  // Determine company name & currency
  const companyName = companyData?.name || "My Company";
  const companyCurrency = companyData?.currency || "USD";

  return {
    userName,
    userEmail: effectiveEmail,
    userRole,
    userPlan,
    companyName,
    companyCurrency,
    isLoading: isUserLoading || isCompanyLoading,
    user: userData,
    company: companyData,
  };
}
