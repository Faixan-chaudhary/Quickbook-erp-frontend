import { apiClient } from "./apiClient";
import type {
  QBOPreferencesResponse,
  PreferencesDetail,
  PreferencesUpdateInput,
  BusinessType,
} from "@/types/preferences";

/**
 * Company Information Payload for Updating / Completing Company Setup
 * Matches POST /v3/company/{company_id}/companyinfo
 */
export interface CompanyInfoUpdate {
  name: string;
  legal_name: string;
  phone: string;
  email: string;
  website: string;
  tax_id: string;
  fiscal_year_start_month: string;
  line1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  currency: string;
}

/**
 * Company Creation Payload for registering a new company
 * Matches backend POST /v3/company
 */
export interface CompanyCreate {
  name?: string;
  company_name?: string;
  legal_name?: string;
  country?: string;
  currency?: string;
  plan?: string;
  phone?: string;
  email?: string;
  website?: string;
  tax_id?: string;
  fiscal_year_start_month?: string;
  line1?: string;
  city?: string;
  state?: string;
  postal_code?: string;
}

/**
 * Company Profile Response from Backend
 * Matches GET /v3/company/me and response of companyinfo POST
 */
export interface CompanyInfoResponse {
  id?: string;
  name?: string;
  legal_name?: string | null;
  plan?: string | null;
  country?: string;
  currency?: string;
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
 * Helper to check if company setup is completed in the database.
 * Setup is complete when legal_name, tax_id, address (line1), and city have been populated.
 */
export function isCompanySetupComplete(
  company?: CompanyInfoResponse | null
): boolean {
  if (!company) return false;

  const hasTaxId = Boolean(company.tax_id && company.tax_id.trim().length > 0);
  const hasLine1 = Boolean(company.line1 && company.line1.trim().length > 0);
  const hasCity = Boolean(company.city && company.city.trim().length > 0);

  return hasTaxId && (hasLine1 || hasCity);
}

/**
 * Generate sensible default company preferences based on business type
 */
export function getDefaultPreferencesByCompanyType(
  businessType: BusinessType = "general",
  baseCurrency = "USD"
): PreferencesDetail {
  const isService = businessType === "services";
  const isProduct = businessType === "product_sales";

  return {
    SyncToken: "0",
    domain: "QBO",
    AccountingInfoPrefs: {
      FirstMonthOfFiscalYear: "January",
      CustomerTerminology: isService ? "Clients" : "Customers",
      TrackDepartments: isProduct,
      DepartmentTerminology: "Department",
      ClassTrackingPerTxn: isProduct,
      ClassTrackingPerTxnLine: false,
    },
    CurrencyPrefs: {
      MultiCurrencyEnabled: false,
      HomeCurrency: {
        value: baseCurrency,
        name: baseCurrency,
      },
    },
    ProductAndServicesPrefs: {
      ForSales: true,
      ForPurchase: !isService,
      InventoryAndPurchaseOrder: isProduct,
      QuantityWithPriceAndRate: true,
      QuantityOnHand: isProduct,
    },
    SalesFormsPrefs: {
      CustomTxnNumbers: true,
      AllowDeposit: true,
      AllowDiscount: true,
      DefaultCustomerMessage: "Thank you for your business and have a great day!",
      DefaultTerms: {
        value: isService ? "Net 30" : "Due on Receipt",
        name: isService ? "Net 30" : "Due on Receipt",
      },
      AutoApplyCredit: true,
      AutoApplyPayments: true,
    },
    TaxPrefs: {
      UsingSalesTax: true,
      PartnerTaxEnabled: false,
    },
  };
}

/**
 * Central Company Service
 * Handles company retrieval, profile updates, and preferences.
 */
export const companyService = {
  /**
   * Fetch current user's company profile
   * GET /api/company/me
   */
  async getCompanyMe(): Promise<CompanyInfoResponse> {
    return apiClient<CompanyInfoResponse>("/api/company/me");
  },

  /**
   * List all companies accessible by current user
   * GET /api/company/user/companies
   */
  async getUserCompanies(): Promise<CompanyInfoResponse[]> {
    return apiClient<CompanyInfoResponse[]>("/api/company/user/companies");
  },

  /**
   * Update company information / complete setup
   * POST /api/company/{company_id}/companyinfo -> Backend /v3/company/{company_id}/companyinfo
   */
  async updateCompanyInfo(
    companyId: string,
    payload: CompanyInfoUpdate
  ): Promise<CompanyInfoResponse> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    return apiClient<CompanyInfoResponse>(
      `/api/company/${encodeURIComponent(id)}/companyinfo`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  /**
   * Fetch company preferences
   * GET /api/company/{company_id}/preferences -> Backend /v3/company/{company_id}/preferences
   */
  async getPreferences(companyId: string): Promise<QBOPreferencesResponse> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    return apiClient<QBOPreferencesResponse>(
      `/api/company/${encodeURIComponent(id)}/preferences`
    );
  },

  /**
   * Update company preferences
   * POST /api/company/{company_id}/preferences -> Backend /v3/company/{company_id}/preferences
   */
  async updatePreferences(
    companyId: string,
    payload: PreferencesUpdateInput
  ): Promise<QBOPreferencesResponse> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    return apiClient<QBOPreferencesResponse>(
      `/api/company/${encodeURIComponent(id)}/preferences`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  /**
   * Switch active company
   * POST /api/company/switch
   */
  async switchCompany(companyId: string): Promise<{ success: boolean; company_id: string }> {
    return apiClient<{ success: boolean; company_id: string }>(
      "/api/company/switch",
      {
        method: "POST",
        body: JSON.stringify({ company_id: companyId }),
      }
    );
  },

  /**
   * Register a new business entity in the database
   * POST /api/company/register -> Backend POST /v3/company
   */
  async registerCompany(payload: CompanyCreate): Promise<CompanyInfoResponse> {
    return apiClient<CompanyInfoResponse>("/api/company/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};



