import type { RefType } from "./preferences";

/**
 * Address Schema for QBO entities
 */
export interface PhysicalAddress {
  Id?: string;
  Line1?: string;
  Line2?: string;
  Line3?: string;
  City?: string;
  Country?: string;
  CountrySubDivisionCode?: string;
  PostalCode?: string;
}

export interface EmailAddress {
  Address?: string;
}

export interface TelephoneNumber {
  FreeFormNumber?: string;
}

export interface WebSiteAddress {
  URI?: string;
}

/**
 * QuickBooks Online Customer Model
 * Matches QBO Customer Entity Specification
 */
export interface QBOCustomer {
  Id?: string;
  SyncToken?: string;
  domain?: string;
  sparse?: boolean;
  DisplayName: string;
  Title?: string | null;
  GivenName?: string | null;
  MiddleName?: string | null;
  FamilyName?: string | null;
  Suffix?: string | null;
  FullyQualifiedName?: string;
  CompanyName?: string | null;
  PrintOnCheckName?: string | null;
  Notes?: string | null;
  Active?: boolean;
  Taxable?: boolean;
  DefaultTaxCodeRef?: RefType | null;
  Job?: boolean;
  BillWithParent?: boolean;
  ParentRef?: RefType | null;
  Balance?: number;
  BalanceWithJobs?: number;
  CurrencyRef?: RefType;
  PreferredDeliveryMethod?: string;
  BillAddr?: PhysicalAddress | null;
  ShipAddr?: PhysicalAddress | null;
  PrimaryPhone?: TelephoneNumber | null;
  Mobile?: TelephoneNumber | null;
  PrimaryEmailAddr?: EmailAddress | null;
  WebAddr?: WebSiteAddress | null;
  MetaData?: {
    CreateTime?: string;
    LastUpdatedTime?: string;
  } | null;
}

/**
 * Single Customer Response
 */
export interface QBOCustomerResponse {
  Customer: QBOCustomer;
  time?: string;
}

/**
 * Customer Query / List Content
 */
export interface QBOCustomerQueryContent {
  Customer?: QBOCustomer[];
  startPosition?: number;
  maxResults?: number;
  totalCount?: number;
}

/**
 * Customer Query Response
 */
export interface QBOCustomerQueryResponse {
  QueryResponse: QBOCustomerQueryContent;
  time?: string;
}

/**
 * DTO for creating a new Customer
 */
export interface CreateCustomerInput {
  DisplayName: string;
  GivenName?: string;
  FamilyName?: string;
  CompanyName?: string;
  PrimaryEmailAddr?: { Address: string };
  PrimaryPhone?: { FreeFormNumber: string };
  BillAddr?: {
    Line1?: string;
    City?: string;
    Country?: string;
    PostalCode?: string;
  };
  Balance?: number;
  Notes?: string;
  Active?: boolean;
}

/**
 * DTO for updating an existing Customer
 */
export interface UpdateCustomerInput {
  Id: string;
  SyncToken: string;
  DisplayName?: string;
  GivenName?: string;
  FamilyName?: string;
  CompanyName?: string;
  PrimaryEmailAddr?: { Address: string };
  PrimaryPhone?: { FreeFormNumber: string };
  BillAddr?: {
    Line1?: string;
    City?: string;
    Country?: string;
    PostalCode?: string;
  };
  Balance?: number;
  Notes?: string;
  Active?: boolean;
}

/**
 * Filter parameters for listing customers
 */
export interface GetCustomersParams {
  activeOnly?: boolean;
  startPosition?: number;
  maxResults?: number;
}
