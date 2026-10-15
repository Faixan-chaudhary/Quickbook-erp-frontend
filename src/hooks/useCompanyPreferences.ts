"use client";

import { useQuery } from "@tanstack/react-query";
import { companyService } from "@/services/companyService";
import type { PreferencesDetail, QBOPreferencesResponse } from "@/types/preferences";

/**
 * Hook to fetch and cache Company Preferences per company_id
 * - Isolates preferences strictly per companyId
 * - Loads immediately from company-scoped localStorage cache on page refresh (0 API calls)
 * - Caches via TanStack React Query with companyId in queryKey
 * - Company A and Company B never share or overwrite each other's preferences
 */
export function useCompanyPreferences(companyId?: string) {
  // Resolve the actual company ID
  const effectiveId =
    companyId && companyId !== "undefined" && companyId !== "me"
      ? companyId
      : typeof window !== "undefined"
      ? localStorage.getItem("company_id") || "me"
      : "me";

  // Read from company-specific localStorage cache if available
  let cachedPreferences: PreferencesDetail | undefined = undefined;
  if (typeof window !== "undefined" && effectiveId && effectiveId !== "me") {
    try {
      const stored = localStorage.getItem(`arca_company_preferences_${effectiveId}`);
      if (stored) {
        cachedPreferences = JSON.parse(stored);
      }
    } catch {
      // Ignore parse error
    }
  }

  return useQuery<QBOPreferencesResponse>({
    queryKey: ["company-preferences", effectiveId],
    queryFn: async () => {
      const data = await companyService.getPreferences(effectiveId);
      if (typeof window !== "undefined" && data?.Preferences && effectiveId !== "me") {
        localStorage.setItem(
          `arca_company_preferences_${effectiveId}`,
          JSON.stringify(data.Preferences)
        );
      }
      return data;
    },
    initialData: cachedPreferences
      ? { Preferences: cachedPreferences }
      : undefined,
    enabled: Boolean(effectiveId),
    staleTime: 5 * 60 * 1000, // 5 minutes cache per company
    gcTime: 24 * 60 * 60 * 1000, // 24 hours persistence
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}
