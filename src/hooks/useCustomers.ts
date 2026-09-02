"use client";

import { useState, useEffect, useCallback } from "react";
import type { Customer } from "@/types";
import { getCustomers, createCustomer as createCustomerApi } from "@/services/customerService";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCustomers();
      setCustomers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const addCustomer = async (newCust: Omit<Customer, "id">) => {
    try {
      const created = await createCustomerApi(newCust);
      setCustomers((prev) => [created, ...prev]);
      return created;
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : "Failed to add customer");
    }
  };

  return {
    customers,
    isLoading,
    error,
    refresh: fetchCustomers,
    addCustomer,
  };
}
