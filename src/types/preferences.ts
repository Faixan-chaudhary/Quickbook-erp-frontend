/**
 * QuickBooks Online Company Preferences Types
 * Matches GET /v3/company/{company_id}/preferences and POST /v3/company/{company_id}/preferences
 */

export interface RefType {
  value: string;
  name?: string | null;
}

export interface AccountingInfoPrefs {
  FirstMonthOfFiscalYear: string;
  CustomerTerminology: string;
  TrackDepartments: boolean;
  DepartmentTerminology: string;
  ClassTrackingPerTxn: boolean;
  ClassTrackingPerTxnLine: boolean;
}

export interface CurrencyPrefs {
  MultiCurrencyEnabled: boolean;
  HomeCurrency?: RefType;
}

export interface ProductAndServicesPrefs {
  ForSales: boolean;
  ForPurchase: boolean;
  InventoryAndPurchaseOrder: boolean;
  QuantityWithPriceAndRate: boolean;
  QuantityOnHand: boolean;
}

export interface SalesFormsPrefs {
  CustomTxnNumbers: boolean;
  AllowDeposit: boolean;
  AllowDiscount: boolean;
  DefaultCustomerMessage: string;
  DefaultTerms?: RefType;
  AutoApplyCredit: boolean;
  AutoApplyPayments: boolean;
}

export interface TaxPrefs {
  UsingSalesTax: boolean;
  PartnerTaxEnabled: boolean;
}

export interface PreferencesDetail {
  Id?: string;
  SyncToken?: string;
  domain?: string;
  AccountingInfoPrefs: AccountingInfoPrefs;
  CurrencyPrefs: CurrencyPrefs;
  ProductAndServicesPrefs: ProductAndServicesPrefs;
  SalesFormsPrefs: SalesFormsPrefs;
  TaxPrefs: TaxPrefs;
}

export interface QBOPreferencesResponse {
  Preferences: PreferencesDetail;
  time?: string;
}

export interface PreferencesUpdateInput {
  Preferences?: Partial<PreferencesDetail>;
  AccountingInfoPrefs?: Partial<AccountingInfoPrefs>;
  CurrencyPrefs?: Partial<CurrencyPrefs>;
  ProductAndServicesPrefs?: Partial<ProductAndServicesPrefs>;
  SalesFormsPrefs?: Partial<SalesFormsPrefs>;
  TaxPrefs?: Partial<TaxPrefs>;
  SyncToken?: string;
}

export type BusinessType = "services" | "product_sales" | "general";
