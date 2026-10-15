"use client";

import { useState, useEffect, useCallback } from "react";
import { accountService } from "@/services/accountService";
import type {
  QBOAccount,
  CreateAccountInput,
  UpdateAccountInput,
  GetAccountsParams,
} from "@/types/account";

export function useAccounts(companyId: string = "me") {
  const [accounts, setAccounts] = useState<QBOAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(
    async (params?: GetAccountsParams) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await accountService.getAccounts(companyId, params);
        setAccounts(data);
        return data;
      } catch (err: any) {
        const message = err?.message || "Failed to load accounts";
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

    accountService
      .getAccounts(companyId)
      .then((data) => {
        if (isMounted) {
          setAccounts(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "Failed to load accounts");
          setIsLoading(false);
        }
      });

  return () => {
      isMounted = false;
    };
  }, [companyId]);

  const createAccount = async (payload: CreateAccountInput) => {
    try {
      const created = await accountService.createAccount(payload, companyId);
      setAccounts((prev) => [...prev, created]);
      return created;
    } catch (err: any) {
      throw new Error(err?.message || "Failed to create account");
    }
  };

  const updateAccount = async (payload: UpdateAccountInput) => {
    try {
      const updated = await accountService.updateAccount(payload, companyId);
      setAccounts((prev) =>
        prev.map((acc) => (acc.Id === updated.Id ? updated : acc))
      );
      return updated;
    } catch (err: any) {
      throw new Error(err?.message || "Failed to update account");
    }
  };

  const deleteAccount = async (accountId: string) => {
    try {
      const deleted = await accountService.deleteAccount(accountId, companyId);
      setAccounts((prev) => prev.filter((acc) => acc.Id !== accountId));
      return deleted;
    } catch (err: any) {
      throw new Error(err?.message || "Failed to delete account");
    }
  };

  return {
    accounts,
    isLoading,
    error,
    refresh: fetchAccounts,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  };
}
