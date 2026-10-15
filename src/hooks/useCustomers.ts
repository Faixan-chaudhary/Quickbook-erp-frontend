"use client";

import { useState, useEffect, useCallback } from "react";
import { customerService } from "@/services/customerService";
import type {
  QBOCustomer,
  CreateCustomerInput,
  UpdateCustomerInput,
  GetCustomersParams,
} from "@/types/customer";

export function useCustomers(companyId: string = "me") {
  const [customers, setCustomers] = useState<QBOCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(
    async (params?: GetCustomersParams) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await customerService.getCustomers(companyId, params);
        setCustomers(data);
        return data;
      } catch (err: any) {
        const message = err?.message || "Failed to load customers";
        setError(message);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [companyId]
  );

  useEffect(() => {
    let isMounted = true;

    customerService
      .getCustomers(companyId)
      .then((data) => {
        if (isMounted) {
          setCustomers(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "Failed to load customers");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  const addCustomer = async (payload: CreateCustomerInput) => {
    try {
      const created = await customerService.createCustomer(payload, companyId);
      setCustomers((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      throw new Error(err?.message || "Failed to add customer");
    }
  };

  const updateCustomer = async (payload: UpdateCustomerInput) => {
    try {
      const updated = await customerService.updateCustomer(payload, companyId);
      setCustomers((prev) =>
        prev.map((c) => (c.Id === updated.Id ? updated : c))
      );
      return updated;
    } catch (err: any) {
      throw new Error(err?.message || "Failed to update customer");
    }
  };

  const deleteCustomer = async (customerId: string) => {
    try {
      const deleted = await customerService.deleteCustomer(customerId, companyId);
      setCustomers((prev) => prev.filter((c) => c.Id !== customerId));
      return deleted;
    } catch (err: any) {
      throw new Error(err?.message || "Failed to delete customer");
    }
  };

  return {
    customers,
    isLoading,
    error,
    refresh: fetchCustomers,
    fetchCustomers,
    addCustomer,
    createCustomer: addCustomer,
    updateCustomer,
    deleteCustomer,
  };
}
