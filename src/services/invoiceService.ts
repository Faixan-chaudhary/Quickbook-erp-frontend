import { invoices as initialInvoices } from "@/data/mock";
import type { Invoice } from "@/types";

// In-memory state for mock mode
let mockInvoicesData: Invoice[] = [...initialInvoices];

/**
 * Fetch all invoices
 * 
 * 👉 REAL API CONVERSION:
 * Replace function body with:
 * return apiClient<Invoice[]>('/invoices');
 */
export async function getInvoices(): Promise<Invoice[]> {
  // Simulating async network delay
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockInvoicesData]), 100);
  });
}

/**
 * Get single invoice by ID
 */
export async function getInvoiceById(id: string): Promise<Invoice | undefined> {
  return new Promise((resolve) => {
    const found = mockInvoicesData.find((inv) => inv.id === id);
    resolve(found);
  });
}

/**
 * Create new invoice
 */
export async function createInvoice(newInvoice: Omit<Invoice, "id">): Promise<Invoice> {
  const created: Invoice = {
    ...newInvoice,
    id: `INV-2024-${String(mockInvoicesData.length + 848).padStart(4, "0")}`,
  };
  mockInvoicesData = [created, ...mockInvoicesData];
  return created;
}

/**
 * Update invoice status
 */
export async function updateInvoiceStatus(id: string, status: Invoice["status"]): Promise<Invoice | null> {
  const index = mockInvoicesData.findIndex((inv) => inv.id === id);
  if (index === -1) return null;
  mockInvoicesData[index] = { ...mockInvoicesData[index], status };
  return mockInvoicesData[index];
}
