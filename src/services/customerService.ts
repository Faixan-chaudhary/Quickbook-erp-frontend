import { customers as initialCustomers } from "@/data/mock";
import type { Customer } from "@/types";

let mockCustomersData: Customer[] = [...initialCustomers];

/**
 * Fetch all customers
 * 
 * 👉 REAL API CONVERSION:
 * return apiClient<Customer[]>('/customers');
 */
export async function getCustomers(): Promise<Customer[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockCustomersData]), 100);
  });
}

/**
 * Add a new customer
 */
export async function createCustomer(newCustomer: Omit<Customer, "id">): Promise<Customer> {
  const created: Customer = {
    ...newCustomer,
    id: `C${String(mockCustomersData.length + 1).padStart(3, "0")}`,
  };
  mockCustomersData = [created, ...mockCustomersData];
  return created;
}
