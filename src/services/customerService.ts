import { apiClient } from "./apiClient";
import type {
  QBOCustomer,
  QBOCustomerResponse,
  QBOCustomerQueryResponse,
  CreateCustomerInput,
  UpdateCustomerInput,
  GetCustomersParams,
} from "@/types/customer";

/**
 * Central Service for interacting with QuickBooks Customers API
 */
export const customerService = {
  /**
   * Fetch all customers for a company
   * GET /api/company/{company_id}/customer
   */
  async getCustomers(
    companyId: string = "me",
    params?: GetCustomersParams
  ): Promise<QBOCustomer[]> {
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
    const endpoint = `/api/company/${encodeURIComponent(id)}/customer${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await apiClient<any>(endpoint);
    // Backend may return QBOCustomer[] or { Customer: QBOCustomer[] } or QueryResponse
    if (Array.isArray(response)) {
      // Direct array or array of { Customer: QBOCustomer }
      return response.map((item: any) => (item.Customer ? item.Customer : item));
    }
    if (response?.QueryResponse?.Customer) {
      return response.QueryResponse.Customer;
    }
    if (response?.Customer && Array.isArray(response.Customer)) {
      return response.Customer;
    }
    return [];
  },

  /**
   * Fetch a single customer by ID
   * GET /api/company/{company_id}/customer/{customer_id}
   */
  async getCustomerById(
    customerId: string,
    companyId: string = "me"
  ): Promise<QBOCustomer> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    const endpoint = `/api/company/${encodeURIComponent(id)}/customer/${encodeURIComponent(customerId)}`;
    const response = await apiClient<QBOCustomerResponse | QBOCustomer>(endpoint);
    return "Customer" in response ? response.Customer : response;
  },

  /**
   * Create a new customer in QuickBooks
   * POST /api/company/{company_id}/customer
   */
  async createCustomer(
    payload: CreateCustomerInput,
    companyId: string = "me"
  ): Promise<QBOCustomer> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    const endpoint = `/api/company/${encodeURIComponent(id)}/customer`;

    const response = await apiClient<QBOCustomerResponse | QBOCustomer>(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return "Customer" in response ? response.Customer : response;
  },

  /**
   * Update an existing customer in QuickBooks
   * POST /api/company/{company_id}/customer
   */
  async updateCustomer(
    payload: UpdateCustomerInput,
    companyId: string = "me"
  ): Promise<QBOCustomer> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    const endpoint = `/api/company/${encodeURIComponent(id)}/customer`;

    const response = await apiClient<QBOCustomerResponse | QBOCustomer>(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return "Customer" in response ? response.Customer : response;
  },

  /**
   * Soft-delete / Deactivate a customer
   * DELETE /api/company/{company_id}/customer/{customer_id}
   */
  async deleteCustomer(
    customerId: string,
    companyId: string = "me"
  ): Promise<QBOCustomer> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    const endpoint = `/api/company/${encodeURIComponent(id)}/customer/${encodeURIComponent(customerId)}`;

    const response = await apiClient<QBOCustomerResponse | QBOCustomer>(endpoint, {
      method: "DELETE",
    });
    return "Customer" in response ? response.Customer : response;
  },

  /**
   * Execute custom customer query (e.g. "Select * from Customer")
   * GET /api/company/{company_id}/query?query=...
   */
  async queryCustomers(
    queryString: string,
    companyId: string = "me"
  ): Promise<QBOCustomer[]> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    const endpoint = `/api/company/${encodeURIComponent(id)}/query?query=${encodeURIComponent(queryString)}`;

    const response = await apiClient<QBOCustomerQueryResponse>(endpoint);
    return response.QueryResponse?.Customer || [];
  },
};

// Backwards compatibility export
export const getCustomers = customerService.getCustomers;
export const createCustomer = customerService.createCustomer;
