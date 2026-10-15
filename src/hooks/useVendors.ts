"use client";

import { useState, useEffect, useCallback } from "react";
import { vendorService } from "@/services/vendorService";
import type {
  QBOVendor,
  CreateVendorInput,
  UpdateVendorInput,
  GetVendorsParams,
} from "@/types/vendor";

export function useVendors(companyId: string = "me") {
  const [vendors, setVendors] = useState<QBOVendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = useCallback(
    async (params?: GetVendorsParams) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await vendorService.getVendors(companyId, params);
        setVendors(data);
        return data;
      } catch (err: any) {
        const message = err?.message || "Failed to load vendors";
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

    vendorService
      .getVendors(companyId)
      .then((data) => {
        if (isMounted) {
          setVendors(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || "Failed to load vendors");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [companyId]);

  const addVendor = async (payload: CreateVendorInput) => {
    try {
      const created = await vendorService.createVendor(payload, companyId);
      setVendors((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      throw new Error(err?.message || "Failed to add vendor");
    }
  };

  const updateVendor = async (payload: UpdateVendorInput) => {
    try {
      const updated = await vendorService.updateVendor(payload, companyId);
      setVendors((prev) =>
        prev.map((v) => (v.Id === updated.Id ? updated : v))
      );
      return updated;
    } catch (err: any) {
      throw new Error(err?.message || "Failed to update vendor");
    }
  };

  const deleteVendor = async (vendorId: string) => {
    try {
      const deleted = await vendorService.deleteVendor(vendorId, companyId);
      setVendors((prev) => prev.filter((v) => v.Id !== vendorId));
      return deleted;
    } catch (err: any) {
      throw new Error(err?.message || "Failed to delete vendor");
    }
  };

  return {
    vendors,
    isLoading,
    error,
    refresh: fetchVendors,
    fetchVendors,
    addVendor,
    createVendor: addVendor,
    updateVendor,
    deleteVendor,
  };
}
