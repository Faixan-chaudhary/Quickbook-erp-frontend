# 04 - Custom React Hooks & State Management

## 📌 1. Custom Hooks Kya Hain Aur Kyun Banaye?

React mein jab multiple components ko same data-fetching logic, loading spinners, aur error handling ki zaroorat hoti hai, to hum us logic ko **Custom Hook** (`useInvoices`, `useCustomers`) mein encapsulate kar dete hain.

### Benefits:
- **Clean Components:** View file mein 50 lines ki state management ki jagah sirf `const { invoices, isLoading, addInvoice } = useInvoices();` likhna hota hai.
- **Single Source of Truth:** Logic duplicate nahi hoti.
- **Easy Unit Testing:** Hook ko UI se alag test kiya ja sakta hai.

---

## 🔍 2. Deep Dive: `src/hooks/useInvoices.ts`

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Invoice } from "@/types";
import { getInvoices, createInvoice as createInvoiceApi } from "@/services/invoiceService";

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Reusable fetch function with useCallback
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

  // 2. Initial mount fetch with race-condition cleanup
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

    // Cleanup: Component unmount hone par state update nahi hogi
    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Action function (Add Invoice)
  const addInvoice = async (newInvoice: Omit<Invoice, "id">) => {
    try {
      const created = await createInvoiceApi(newInvoice);
      setInvoices((prev) => [created, ...prev]); // State update immediately
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
```

---

## 🛡️ 3. Critical Pattern: `isMounted` Flag Cleanup

### Kyun Use Kiya?
Agar user Invoices page par aaye aur data fetch hone se pehle hi Customers page par chala jaye (unmount ho jaye), to asynchronously aane wala response unmounted component par `setInvoices` call karne ki koshish karega.
Isse console mein warning aati hai: *"Can't perform a React state update on an unmounted component"*.

`isMounted = false` cleanup function is memory leak aur warning ko 100% block karta hai!

---

## 🏢 4. Real-World Business Scenario Example

### 💼 Scenario: "Accountant ek naya invoice create karta hai ($5,000 ka)"

**Problem (Poor State Management):**
Naya invoice save karne ke baad page freeze ho jata hai aur list refresh karne ke liye accountant ko poora page F5 (reload) karna padta hai.

**Solution (Meridian ERP Hook Pattern):**
`addInvoice()` method `createInvoiceApi()` ko call karta hai aur jaise hi success milti hai:
```typescript
setInvoices((prev) => [created, ...prev]);
```
Naya invoice foran invoices list ke top par show ho jata hai, badge *"Sent"* ya *"Pending"* show ho jata hai, aur user ka modal smoothly close ho jata hai bina page reload kiye!

---

👉 **Agla Module:** [05 - Reusable UI Components, Styling & Recharts](./05-reusable-ui-components-and-styling.md)
