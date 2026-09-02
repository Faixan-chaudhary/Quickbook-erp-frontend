import { vendors as initialVendors } from "@/data/mock";
import type { Vendor } from "@/types";

let mockVendorsData: Vendor[] = [...initialVendors];

export async function getVendors(): Promise<Vendor[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockVendorsData]), 100);
  });
}
