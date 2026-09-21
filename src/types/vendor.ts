import type { RefType } from "./preferences";
import type { PhysicalAddress, TelephoneNumber, EmailAddress, WebSiteAddress } from "./customer";

/**
 * QuickBooks Online Vendor Model
 * Matches QBO Vendor Entity Specification
 */
export interface QBOVendor {
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
  CompanyName?: string | null;
  PrintOnCheckName?: string | null;
  Active?: boolean;
  TaxIdentifier?: string | null;
  Vendor1099?: boolean;
  Balance?: number;
  CurrencyRef?: RefType | null;
  AcctNum?: string | null;
  TermRef?: RefType | null;
  BillAddr?: PhysicalAddress | null;
  OtherAddr?: PhysicalAddress | null;
  PrimaryPhone?: TelephoneNumber | null;
  Mobile?: TelephoneNumber | null;
  Fax?: TelephoneNumber | null;
  PrimaryEmailAddr?: EmailAddress | null;
  WebAddr?: WebSiteAddress | null;
  MetaData?: {
    CreateTime?: string;
    LastUpdatedTime?: string;
  } | null;
}

/**
 * Single Vendor Response
 */
export interface QBOVendorResponse {
  Vendor: QBOVendor;
  time?: string;
}

/**
 * Vendor Query Content
 */
export interface QBOVendorQueryContent {
  Vendor?: QBOVendor[];
  startPosition?: number;
  maxResults?: number;
  totalCount?: number;
}

/**
 * Vendor Query Response
 */
export interface QBOVendorQueryResponse {
  QueryResponse: QBOVendorQueryContent;
  time?: string;
}

/**
 * DTO for creating a new Vendor
 */
export interface CreateVendorInput {
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
  AcctNum?: string;
  TaxIdentifier?: string;
  Balance?: number;
  Active?: boolean;
}

/**
 * DTO for updating an existing Vendor
 */
export interface UpdateVendorInput {
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
  AcctNum?: string;
  TaxIdentifier?: string;
  Balance?: number;
  Active?: boolean;
}

/**
 * Filter parameters for listing vendors
 */
export interface GetVendorsParams {
  activeOnly?: boolean;
  startPosition?: number;
  maxResults?: number;
}
