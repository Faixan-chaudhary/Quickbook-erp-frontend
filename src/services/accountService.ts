import { apiClient } from "./apiClient";
import type {
  QBOAccount,
  QBOAccountResponse,
  QBOAccountQueryResponse,
  CreateAccountInput,
  UpdateAccountInput,
  GetAccountsParams,
} from "@/types/account";

/**
 * Service for interacting with QuickBooks Accounts API
 */
export const accountService = {
  /**
   * Fetch all accounts for a company
   * GET /api/company/{company_id}/account
   */
  async getAccounts(
    companyId: string = "me",
    params?: GetAccountsParams
  ): Promise<QBOAccount[]> {
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
    const endpoint = `/api/company/${encodeURIComponent(id)}/account${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await apiClient<QBOAccountQueryResponse>(endpoint);
    return response.QueryResponse?.Account || [];
  },

  /**
   * Fetch raw query response including pagination metadata
   */
  async getAccountsQueryResponse(
    companyId: string = "me",
    params?: GetAccountsParams
  ): Promise<QBOAccountQueryResponse> {
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
    const endpoint = `/api/company/${encodeURIComponent(id)}/account${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient<QBOAccountQueryResponse>(endpoint);
  },

  /**
   * Fetch a single account by ID
   * GET /api/company/{company_id}/account/{account_id}
   */
  async getAccountById(
    accountId: string,
    companyId: string = "me"
  ): Promise<QBOAccount> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    const endpoint = `/api/company/${encodeURIComponent(id)}/account/${encodeURIComponent(accountId)}`;
    const response = await apiClient<QBOAccountResponse>(endpoint);
    return response.Account;
  },

  /**
   * Create a new QuickBooks account
   * POST /api/company/{company_id}/account
   */
  async createAccount(
    payload: CreateAccountInput,
    companyId: string = "me"
  ): Promise<QBOAccount> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    const endpoint = `/api/company/${encodeURIComponent(id)}/account`;

    const response = await apiClient<QBOAccountResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response.Account;
  },

  /**
   * Update an existing QuickBooks account
   * POST /api/company/{company_id}/account
   */
  async updateAccount(
    payload: UpdateAccountInput,
    companyId: string = "me"
  ): Promise<QBOAccount> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    const endpoint = `/api/company/${encodeURIComponent(id)}/account`;

    const response = await apiClient<QBOAccountResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response.Account;
  },

  /**
   * Soft-delete (deactivate) an account
   * DELETE /api/company/{company_id}/account/{account_id}
   */
  async deleteAccount(
    accountId: string,
    companyId: string = "me"
  ): Promise<QBOAccount> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    const endpoint = `/api/company/${encodeURIComponent(id)}/account/${encodeURIComponent(accountId)}`;

    const response = await apiClient<QBOAccountResponse>(endpoint, {
      method: "DELETE",
    });
    return response.Account;
  },

  /**
   * Execute custom query (e.g. "Select * from Account where Active = true")
   * GET /api/company/{company_id}/query?query=...
   */
  async queryAccounts(
    queryString: string,
    companyId: string = "me"
  ): Promise<QBOAccount[]> {
    const id = companyId && companyId !== "undefined" ? companyId : "me";
    const endpoint = `/api/company/${encodeURIComponent(id)}/query?query=${encodeURIComponent(queryString)}`;

    const response = await apiClient<QBOAccountQueryResponse>(endpoint);
    return response.QueryResponse?.Account || [];
  },
};
