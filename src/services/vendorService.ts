import { apiClient } from "./apiClient";
import type {
  QBOVendor,
  QBOVendorResponse,
  QBOVendorQueryResponse,
  CreateVendorInput,
  UpdateVendorInput,
  GetVendorsParams,
} from "@/types/vendor";

/**
 * Central Service for interacting with QuickBooks Vendors API
 */
export const vendorService = {
  /**
   * Fetch all vendors for a company
   * GET /api/company/{company_id}/vendor
   */
  async getVendors(
    companyId: string = "me",
    params?: GetVendorsParams
  ): Promise<QBOVendor[]> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    const query = new URLSearchParams();

    if (params?.activeOnly !== undefined) {
      query.set("active_only", String(params.activeOnly));
    }
    if (params?.startPosition !== undefined) {
      query.set("start_position", String(params.startPosition));
    }
    if (params?.maxResults !== undefined) {
      query.set("max_results", String(params.maxResults));
    }

    const queryString = query.toString();
    const endpoint = `/api/company/${encodeURIComponent(id)}/vendor${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await apiClient<any>(endpoint);
    if (Array.isArray(response)) {
      return response.map((item: any) => (item.Vendor ? item.Vendor : item));
    }
    if (response?.QueryResponse?.Vendor) {
      return response.QueryResponse.Vendor;
    }
    if (response?.Vendor && Array.isArray(response.Vendor)) {
      return response.Vendor;
    }
    return [];
  },

  /**
   * Fetch a single vendor by ID
   * GET /api/company/{company_id}/vendor/{vendor_id}
   */
  async getVendorById(
    vendorId: string,
    companyId: string = "me"
  ): Promise<QBOVendor> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    const endpoint = `/api/company/${encodeURIComponent(id)}/vendor/${encodeURIComponent(vendorId)}`;
    const response = await apiClient<QBOVendorResponse | QBOVendor>(endpoint);
    return "Vendor" in response ? response.Vendor : response;
  },

  /**
   * Create a new vendor in QuickBooks
   * POST /api/company/{company_id}/vendor
   */
  async createVendor(
    payload: CreateVendorInput,
    companyId: string = "me"
  ): Promise<QBOVendor> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    const endpoint = `/api/company/${encodeURIComponent(id)}/vendor`;

    const response = await apiClient<QBOVendorResponse | QBOVendor>(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return "Vendor" in response ? response.Vendor : response;
  },

  /**
   * Update an existing vendor in QuickBooks
   * POST /api/company/{company_id}/vendor
   */
  async updateVendor(
    payload: UpdateVendorInput,
    companyId: string = "me"
  ): Promise<QBOVendor> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    const endpoint = `/api/company/${encodeURIComponent(id)}/vendor`;

    const response = await apiClient<QBOVendorResponse | QBOVendor>(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return "Vendor" in response ? response.Vendor : response;
  },

  /**
   * Soft-delete / Deactivate a vendor
   * DELETE /api/company/{company_id}/vendor/{vendor_id}
   */
  async deleteVendor(
    vendorId: string,
    companyId: string = "me"
  ): Promise<QBOVendor> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    const endpoint = `/api/company/${encodeURIComponent(id)}/vendor/${encodeURIComponent(vendorId)}`;

    const response = await apiClient<QBOVendorResponse | QBOVendor>(endpoint, {
      method: "DELETE",
    });
    return "Vendor" in response ? response.Vendor : response;
  },

  /**
   * Execute custom vendor query (e.g. "Select * from Vendor")
   * GET /api/company/{company_id}/query?query=...
   */
  async queryVendors(
    queryString: string,
    companyId: string = "me"
  ): Promise<QBOVendor[]> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    const endpoint = `/api/company/${encodeURIComponent(id)}/query?query=${encodeURIComponent(queryString)}`;

    const response = await apiClient<QBOVendorQueryResponse>(endpoint);
    return response.QueryResponse?.Vendor || [];
  },
};

// Backwards compatibility export
export const getVendors = vendorService.getVendors;
export const createVendor = vendorService.createVendor;
