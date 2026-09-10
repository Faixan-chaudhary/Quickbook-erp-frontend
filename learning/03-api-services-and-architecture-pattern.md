# 03 - Service Layer & API Client Pattern

## 📌 1. Service Layer Pattern Kya Hai?

**Service Layer** application ka wo hissa hota hai jo data mangwane (Fetch), data bhejne (Create/Update), aur business logic handle karne ke liye zimmedar hota hai.

UI Components ko is baat se koi gharaz nahi hona chahiye ke data **Mock Array** se aa raha hai, **REST API** se, ya **Firebase/GraphQL** se. UI ka kaam sirf data show karna hai.

---

## 🌐 2. Central API Client (`src/services/apiClient.ts`)

Project mein ek centralized fetch wrapper banaya gaya hai:

```typescript
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Future JWT Token support:
  // const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  // if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
```

### Is Client ke Fawaid (Why it is used):
1. **Generics `<T>`:** Response automatically target type (e.g. `Invoice[]`) mein cast ho jata hai.
2. **Auto Headers:** `"Content-Type": "application/json"` har request par khud lag jata hai.
3. **Global Error Handling:** Agar status 400 ya 500 aaye to central jagah se error throw hota hai.
4. **Environment-Driven Base URL:** `.env.local` mein `NEXT_PUBLIC_API_URL=https://api.myerp.com` set karne se tamam endpoints update ho jate hain.

---

## 📄 3. Domain Services (e.g., `src/services/invoiceService.ts`)

Services har module ke specific operations define karti hain:

```typescript
import { invoices as initialInvoices } from "@/data/mock";
import type { Invoice } from "@/types";

let mockInvoicesData: Invoice[] = [...initialInvoices];

// 1. Get all invoices
export async function getInvoices(): Promise<Invoice[]> {
  // Mock Mode: Simulating 100ms network delay
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockInvoicesData]), 100);
  });

  // 👉 REAL BACKEND SWITCH:
  // return apiClient<Invoice[]>('/invoices');
}

// 2. Create invoice
export async function createInvoice(newInvoice: Omit<Invoice, "id">): Promise<Invoice> {
  const created: Invoice = {
    ...newInvoice,
    id: `INV-2024-${String(mockInvoicesData.length + 848).padStart(4, "0")}`,
  };
  mockInvoicesData = [created, ...mockInvoicesData];
  return created;

  // 👉 REAL BACKEND SWITCH:
  // return apiClient<Invoice>('/invoices', { method: 'POST', body: JSON.stringify(newInvoice) });
}
```

---

## 🏢 4. Real-World Business Scenario Example

### 💼 Scenario: "Backend Team ne API mein JWT Authentication Token lagana zaroori kar diya"

**Problem (Agar direct components mein `fetch` likha hota):**
Aapko project ki 40 alag-alag screens open karke har fetch call ke header mein `Authorization: Bearer ${token}` add karna padta.

**Solution (Service Layer):**
Aapko sirf **`src/services/apiClient.ts`** mein **2 lines** uncomment karni hain:
```typescript
const token = localStorage.getItem("token");
if (token) headers["Authorization"] = `Bearer ${token}`;
```
Poore ERP ke tamam 24+ modules mein automatically Bearer Token jana shuru ho jayega!

---

👉 **Agla Module:** [04 - Custom React Hooks & State Management](./04-custom-react-hooks-and-state-management.md)
