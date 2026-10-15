# 00 - Project Architecture & Folder Structure

## 📌 1. Bird's Eye View: Ye Project Kya Hai?

Yeh project ek **Enterprise Resource Planning (ERP)** aur modern **QuickBooks Alternative** web application hai (jiska naam **Meridian ERP** rakha gaya hai). 

Iske andar business ke tamam core financial & operational modules shamil hain:
- Invoicing & Billing
- Customers & Vendors management
- Sales Orders & Purchase Orders
- Banking & Transactions Reconciliation
- Payroll, Employees & Time Tracking
- Inventory & Products
- Financial Analytics, Reports, Taxes
- AI Assistant (Natural Language Financial Queries)

---

## 🏗️ 2. Folder Structure & Separation of Concerns

Project ka folder structure **Clean Architecture** aur **Separation of Concerns (SoC)** ke usool par banaya gaya hai:

```text
Quickbook-erp-frontend/
├── src/
│   ├── app/                 # Next.js App Router (Routing, Layouts, Page Wrappers)
│   │   ├── (dashboard)/     # Route Group: Dashboard layout share karne wale tamam modules
│   │   │   ├── invoices/    # /invoices page
│   │   │   ├── customers/   # /customers page
│   │   │   ├── banking/     # /banking page
│   │   │   └── ... (24+ modules)
│   │   ├── globals.css      # CSS Variables, Dark mode tokens & global styles
│   │   ├── layout.tsx       # Root HTML shell
│   │   └── page.tsx         # Landing page wrapper
│   │
│   ├── components/          # Reusable UI Blocks & Shell components
│   │   ├── layout/          # Sidebar.tsx, Topbar.tsx
│   │   ├── ChartReveal.tsx  # Smooth chart animations
│   │   └── ui.tsx           # Design system (Buttons, Modals, Badges, Tables, Inputs)
│   │
│   ├── views/               # Complete Page Business Logic & UI Views (Presentation Layer)
│   │   ├── Dashboard.tsx
│   │   ├── Invoices.tsx
│   │   ├── AIAssistant.tsx
│   │   └── ... (26 view components)
│   │
│   ├── services/            # API Layer (HTTP Requests, Fetch, Data Layer)
│   │   ├── apiClient.ts     # Central fetch wrapper with auth & JSON handling
│   │   ├── invoiceService.ts
│   │   ├── customerService.ts
│   │   └── ...
│   │
│   ├── hooks/               # Custom React Hooks (State + Service Binding)
│   │   ├── useInvoices.ts
│   │   └── useCustomers.ts
│   │
│   ├── types/               # TypeScript Definitions & Domain Models
│   │   └── index.ts         # Invoice, Customer, Employee, Account interfaces
│   │
│   └── data/                # Mock Data (Testing & offline prototype data)
│       └── mock.ts          # Ready-to-use dataset
```

---

## 🎯 3. Folder-by-Folder: "Kyun banaya?" (Purpose)

### A. `src/app/` vs `src/views/` (Separation of Routing from UI)
- **Kyun banaya?**
  Next.js App Router mein agar aap 500 lines ka UI code seedha `src/app/invoices/page.tsx` ke andar likhenge to testing, code refactoring aur code readability mushkil ho jati hai.
- **Pattern:**
  - `src/app/invoices/page.tsx` sirf ek chhota sa wrapper banata hai (Router layer).
  - Asal heavy UI aur logic `src/views/Invoices.tsx` mein rehti hai.
  - Kal ko agar aap Next.js se Vite/Remix par migrate karna chahein ya React Native mein view reuse karna chahein to sirf `views/` utha kar le jayenge!

### B. `src/services/` (Data Access Layer)
- **Kyun banaya?**
  Direct UI ke button click par `fetch('/api/invoices')` likhna bad practice hai. Kal ko agar API URL badle, auth token header lagana ho, ya error format change ho to 50 files mein change karna padega.
- **Solution:** 
  Tamam network calls `src/services/` ke andar isolate hain.

### C. `src/hooks/` (State Management Layer)
- **Kyun banaya?**
  Components ko data fetch karne ke liye bar bar `useState(loading)`, `useState(error)`, `useEffect` na likhna pade. Hook ek line mein tamam states (`data`, `isLoading`, `error`, `addInvoice`) provide karta hai.

---

## 🏢 4. Real-World Business Scenario Example

### 💼 Scenario: "Hamari Company ka ERP Prototype ready hai, ab Real Node.js/Postgres backend se connect karna hai"

**Problem (Agar bad architecture ho):**
Agar aapne har UI component ke button click aur `useEffect` ke andar direct `fetch()` call kiya hota, to backend badalne ke liye aapko 50 alag-alag React components open karke modify karne padte. Isme bugs aane ke 100% chances hote.

**Solution (Is project ka Architecture):**
Is project mein:
1. `src/views/Invoices.tsx` sirf `useInvoices()` hook ko call karta hai.
2. `useInvoices()` hook sirf `src/services/invoiceService.ts` ko call karta hai.
3. `invoiceService.ts` sirf `apiClient.ts` ko call karta hai.

Aapko **UI ka ek bhi line change nahi karna padega**! Sirf `invoiceService.ts` mein mock promise ki jagah `apiClient.get('/invoices')` likhein, aur poora project live backend se connect ho jayega!

---

👉 **Agla Module:** [01 - Next.js App Router & Layouts](./01-nextjs-app-router-and-routing.md)
