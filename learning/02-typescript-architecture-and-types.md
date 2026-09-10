# 02 - TypeScript Domain Modeling & Types

## 📌 1. ERP Application Mein TypeScript Ka Role

Financial software (jaise ERPs, QuickBooks, SAP) mein sabse ahem cheez **Data Accuracy** hoti hai. Agar kisi calculation mein `number` ki jagah `string` pass ho jaye ya mandatory fields (jaise `customerId`, `taxRate`, `dueDate`) miss ho jayein to business ka balance sheet kharab ho sakta hai.

TypeScript humein **Compile-Time Type Safety** aur **IntelliSense Autocomplete** deta hai.

---

## 🏛️ 2. Domain Models Structure (`src/types/index.ts`)

Is project ke tamam business objects `src/types/index.ts` ke andar define kiye gaye hain.

### Example Models:

```typescript
// 1. Customer Entity
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  balance: number;
  status: string;
  totalInvoiced: number;
  lastPayment: string;
  creditLimit: number;
}

// 2. Invoice Entity
export interface Invoice {
  id: string;
  customer: string;
  customerId: string;
  amount: number;
  tax: number;
  total: number;
  status: string;
  dueDate: string;
  issueDate: string;
  paidDate: string | null; // Nullable agar invoice abhi unpaid hai
  items: number;
  currency: string;
}

// 3. Page Union Type (Route Safety)
export type Page =
  | "landing"
  | "dashboard"
  | "invoices"
  | "customers"
  | "banking"
  | "expenses"
  | "reports"
  | "ai-assistant"
  | "settings";
```

---

## 🧰 3. Important TypeScript Utility Types Used

### A. `Omit<Type, Keys>`
- **Kyun use kiya?**
  Jab naya Invoice create kiya jata hai, to ID backend ya system generate karta hai. Frontend user se ID input nahi karwate.
- **Implementation in Code:**
  ```typescript
  export async function createInvoice(newInvoice: Omit<Invoice, "id">): Promise<Invoice> {
    // newInvoice mein id ke ilawa Invoice ke tamam fields required honge!
  }
  ```

### B. Union Types & String Literals
- **Kyun use kiya?**
  Typo prevention ke liye. Agar developer `"invoic"` ya `"customr"` likhega to TypeScript foran error de dega.

### C. `Record<Keys, Type>`
- **Kyun use kiya?**
  Dynamic key-value pairs (jaise HTTP headers) ko strongly type karne ke liye:
  ```typescript
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  ```

---

## 🏢 4. Real-World Business Scenario Example

### 💼 Scenario: "Invoice Status Update: Payment Received"

**Problem (Plain JavaScript mein):**
Developer ne code likha:
```javascript
invoice.paidDate = new Date();
invoice.total = invoice.amount + invoice.tax; // Agar tax "50" (string) hua to 1000 + "50" = "100050" ban jayega!
```
Plain JS ne $1050 ki jagah $100,050 charge kar diya!

**Solution (TypeScript in Meridian ERP):**
TypeScript ensure karta hai:
1. `tax` aur `amount` dono strictly `number` type hain.
2. `paidDate` ya to `string` hoga ya `null`.
3. Koi bhi developer galat data type pass nahi kar sakta, warna project compile (build) hi nahi hoga!

---

👉 **Agla Module:** [03 - Service Layer & API Client Pattern](./03-api-services-and-architecture-pattern.md)
