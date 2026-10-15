import type { RefType } from "./preferences";

/**
 * QuickBooks Online Account Model
 * Matches QBO Account Entity Specification
 */
export interface QBOAccount {
  Id?: string;
  SyncToken?: string;
  domain?: string;
  sparse?: boolean;
  Name: string;
  SubAccount?: boolean;
  ParentRef?: RefType | null;
  FullyQualifiedName?: string;
  Active?: boolean;
  Classification?: string;
  AccountType: string;
  AccountSubType?: string | null;
  Description?: string | null;
  AcctNum?: string | null;
  CurrentBalance?: number;
  CurrentBalanceWithSubAccounts?: number;
  CurrencyRef?: RefType;
  MetaData?: {
    CreateTime?: string;
    LastUpdatedTime?: string;
  } | null;
}

/**
 * Single Account API Response
 * Matches GET/POST /v3/company/{company_id}/account/{account_id}
 */
export interface QBOAccountResponse {
  Account: QBOAccount;
  time?: string;
}

/**
 * Account Query Content inside QueryResponse
 */
export interface QBOAccountQueryContent {
  Account?: QBOAccount[];
  startPosition?: number;
  maxResults?: number;
  totalCount?: number;
}

/**
 * List / Query Accounts API Response
 * Matches GET /v3/company/{company_id}/account and /v3/company/{company_id}/query
 */
export interface QBOAccountQueryResponse {
  QueryResponse: QBOAccountQueryContent;
  time?: string;
}

/**
 * Payload for creating a new Account
 */
export interface CreateAccountInput {
  Name: string;
  AccountType: string;
  AccountSubType?: string;
  Classification?: string;
  Description?: string;
  AcctNum?: string;
  CurrentBalance?: number;
  SubAccount?: boolean;
  ParentRef?: RefType;
  CurrencyRef?: RefType;
  Active?: boolean;
}

/**
 * Payload for updating an existing Account
 */
export interface UpdateAccountInput {
  Id: string;
  SyncToken: string;
  Name?: string;
  AccountType?: string;
  AccountSubType?: string;
  Classification?: string;
  Description?: string;
  AcctNum?: string;
  CurrentBalance?: number;
  SubAccount?: boolean;
  ParentRef?: RefType;
  CurrencyRef?: RefType;
  Active?: boolean;
}

/**
 * Query filters for listing accounts
 */
export interface GetAccountsParams {
  activeOnly?: boolean;
  startPosition?: number;
  maxResults?: number;
}
