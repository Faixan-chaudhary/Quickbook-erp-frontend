"use client";

import { useState, useEffect, useCallback } from "react";
import type { Invoice } from "@/types";
import { getInvoices, createInvoice as createInvoiceApi } from "@/services/invoiceService";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getInvoices();
      setInvoices(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load invoices");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getInvoices();
        if (isMounted) {
          setInvoices(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load invoices");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const addInvoice = async (newInvoice: Omit<Invoice, "id">) => {
    try {
      const created = await createInvoiceApi(newInvoice);
      setInvoices((prev) => [created, ...prev]);
      return created;
    } catch (err: unknown) {
      throw new Error(err instanceof Error ? err.message : "Failed to create invoice");
    }
  };

  return {
    invoices,
    isLoading,
    error,
    refresh: fetchInvoices,
    addInvoice,
  };
}
