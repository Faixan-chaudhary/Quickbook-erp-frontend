"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isCompanySetupComplete } from "@/services/companyService";

export interface UserProfile {
  id?: string;
  name?: string;
  user_name?: string;
  full_name?: string;
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
  website?: string | null;
  tax_id?: string | null;
  fiscal_year_start_month?: string | null;
  line1?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
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
        const resolvedName = data.name || data.user_name || data.full_name;
        if (resolvedName) localStorage.setItem("user_name", resolvedName);
        if (data.email) localStorage.setItem("user_email", data.email);
        if (data.phone) localStorage.setItem("user_phone", data.phone);
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
        if (data.id) localStorage.setItem("company_id", data.id);
        if (data.phone) localStorage.setItem("user_phone", data.phone);
      }
      return data;
    },
    initialData: cachedCompany,
    staleTime: 5 * 60 * 1000, // 5 minutes caching (no redundant re-fetches)
    gcTime: 24 * 60 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false, // Prevents duplicate API calls on window / DevTools focus
    refetchOnReconnect: false,
    retry: 1,
  });
}


/**
 * Helper to capitalize names (e.g. "ahsan" -> "Ahsan", "ahsan ali" -> "Ahsan Ali")
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Helper to convert email into a formatted human-readable name
 * Example: "ahsan2431@gmail.com" -> "Ahsan"
 * Example: "farhan.ali@gmail.com" -> "Farhan Ali"
 */
function formatEmailToName(email: string): string {
  if (!email) return "User";
  const prefix = email.split("@")[0] || "";
  // Strip trailing numbers (e.g. "ahsan2431" -> "ahsan")
  const cleanPrefix = prefix.replace(/\d+$/, "");
  return (cleanPrefix || prefix)
    .split(/[._-]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Helper to ensure company name is never displayed as a raw email address
 */
function resolveCompanyName(
  companyApiName?: string | null,
  storedName?: string | null,
  userEmail?: string | null
): string {
  const rawCandidate = (companyApiName || storedName || "").trim();

  // If candidate is a valid non-email name, capitalize and return
  if (rawCandidate && !rawCandidate.includes("@")) {
    return capitalize(rawCandidate);
  }

  // If candidate was an email or empty, generate a clean workspace name
  const sourceEmail = rawCandidate.includes("@") ? rawCandidate : userEmail || "";
  if (sourceEmail && sourceEmail.includes("@")) {
    const prefix = sourceEmail.split("@")[0].replace(/\d+$/, "");
    return `${capitalize(prefix || "My")} Workspace`;
  }

  return "Arca Workspace";
}

/**
 * 3. Unified Hook for Dashboard, Topbar, and Sidebar
 * Reads immediately from cached state — zero flickering and zero redundant API calls.
 */
export function useUserAndCompany() {
  const { data: userData, isLoading: isUserLoading } = useUserProfile();
  const {
    data: companyData,
    isLoading: isCompanyLoading,
    refetch: refetchCompany,
  } = useCompanyProfile();

  // Determine user email & formatted display name
  const effectiveEmail =
    userData?.email ||
    (typeof window !== "undefined" ? localStorage.getItem("user_email") || "" : "");
  const storedUserName =
    typeof window !== "undefined" ? localStorage.getItem("user_name") || "" : "";

  const rawUserName =
    userData?.name ||
    userData?.user_name ||
    userData?.full_name ||
    storedUserName ||
    (effectiveEmail ? formatEmailToName(effectiveEmail) : "User");

  const userName = capitalize(rawUserName);
  const userRole = userData?.role || "Administrator";
  const userPlan = userData?.plan || companyData?.plan || "Essentials";

  // Determine company name & currency
  const storedCompanyName =
    typeof window !== "undefined" ? localStorage.getItem("company_name") || "" : "";
  const companyName = resolveCompanyName(
    companyData?.name ||
      (companyData as any)?.company_name ||
      (companyData as any)?.legal_name,
    storedCompanyName,
    effectiveEmail
  );
  const companyCurrency = companyData?.currency || "USD";

  // Determine user phone
  const storedUserPhone =
    typeof window !== "undefined" ? localStorage.getItem("user_phone") || "" : "";
  const userPhone =
    companyData?.phone ||
    userData?.phone ||
    (userData as any)?.phone_number ||
    storedUserPhone ||
    "";

  const companyId =
    companyData?.id ||
    (typeof window !== "undefined" ? localStorage.getItem("company_id") || "" : "");

  const isSetupComplete = isCompanySetupComplete(companyData as any);

  return {
    userName,
    userEmail: effectiveEmail,
    userPhone,
    userRole,
    userPlan,
    companyName,
    companyCurrency,
    companyId,
    isSetupComplete,
    isLoading: isUserLoading || isCompanyLoading,
    user: userData,
    company: companyData,
    refetchCompany,
  };
}

