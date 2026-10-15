export type Page =
  | "landing"
  | "dashboard"
  | "estimates"
  | "sales-orders"
  | "invoices"
  | "customers"
  | "banking"
  | "accounts"
  | "expenses"
  | "bills"
  | "vendors"
  | "products"
  | "inventory"
  | "purchase-orders"
  | "payments"
  | "payroll"
  | "employees"
  | "taxes"
  | "projects"
  | "time-tracking"
  | "reports"
  | "ai-assistant"
  | "analytics"
  | "automation"
  | "documents"
  | "settings";

export interface Company {
  name: string;
  legalName: string;
  industry: string;
  country: string;
  currency: string;
  fiscalYear: string;
  taxId: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  logo: string | null;
}

export interface User {
  name: string;
  email: string;
  role: string;
  avatar: string | null;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  balance: number;
  status: string;
  totalInvoiced: number;
  lastPayment: string;
  creditLimit: number;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  category: string;
  balance: number;
  status: string;
  totalSpend: number;
  paymentTerms: string;
  lastBill: string;
}

export interface Invoice {
  id: string;
  customer: string;
  customerId: string;
  amount: number;
  tax: number;
  total: number;
  status: string;
  dueDate: string;
  issueDate: string;
  paidDate: string | null;
  items: number;
  currency: string;
}

export interface Bill {
  id: string;
  vendor: string;
  vendorId: string;
  amount: number;
  status: string;
  dueDate: string;
  issueDate: string;
  paidDate: string | null;
  category: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  employee: string;
  date: string;
  status: string;
  receipt: boolean;
}

export interface Product {
  id: string;
  name: string;
  type: string;
  sku: string;
  price: number;
  unit: string;
  taxable: boolean;
  status: string;
  revenue: number;
}

export interface Account {
  id: string;
  name: string;
  institution: string;
  type: string;
  balance: number;
  lastSync: string;
  status: string;
  number: string | null;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  account: string;
  balance: number;
  reconciled: boolean;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  title: string;
  salary: number;
  status: string;
  startDate: string;
  payType: string;
}

export type PlanType = "Simple Start" | "Essentials" | "Plus" | "Advanced";

export interface SignUpRequest {
  name?: string;
  user_name?: string;
  full_name?: string;
  email: string;
  password: string;
  company_name: string;
  phone: string;
  country?: string;
  currency?: string;
  plan?: PlanType | string;
}

export interface SignUpResponse {
  message: string;
  email: string;
  phone?: string | null;
  plan?: string;
  requires_verification?: boolean;
  totp_secret?: string | null;
  totp_auth_url?: string | null;
  totp_qr_code?: string | null;
  user_id?: string;
  company_id?: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
}

export interface SignInEmailRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  new_password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  company_id?: string;
  user_id?: string;
  user?: User;
}

export * from "./preferences";
export * from "./account";
export * from "./customer";
export * from "./vendor";
