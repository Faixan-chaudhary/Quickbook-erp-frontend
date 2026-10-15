# 📚 Meridian ERP - Complete Project Learning Guide

Assalam-o-Alaikum! Is folder (`learning/`) ke andar is project (**Quickbook ERP / Meridian ERP**) ka mukammal, step-by-step aur scenario-based learning roadmap tayyar kiya gaya hai. 

Is guide ka maqsad ye hai ke aapko pata chale ke is project mein **kya use hua hai**, **kyun use hua hai (Purpose)**, **kaise implement kiya gaya hai**, aur **real-world business scenarios** mein iska kya faida hota hai.

---

## 📑 Learning Modules Index

| # | Topic | File Link | Description |
|---|-------|-----------|-------------|
| **00** | **Project Architecture & Folder Structure** | [00-overview-and-architecture.md](./00-overview-and-architecture.md) | Project ka bird-eye view, folder structure, design patterns (Clean Architecture, Separation of Concerns). |
| **01** | **Next.js App Router & Layouts** | [01-nextjs-app-router-and-routing.md](./01-nextjs-app-router-and-routing.md) | Route Groups `(dashboard)`, Nested Layouts, Client vs Server components, Hydration. |
| **02** | **TypeScript Domain Modeling & Types** | [02-typescript-architecture-and-types.md](./02-typescript-architecture-and-types.md) | Strong typing, Enums, Union Types, Utility types (`Omit`, `Record`), Type safety in ERP. |
| **03** | **Service Layer & API Client Pattern** | [03-api-services-and-architecture-pattern.md](./03-api-services-and-architecture-pattern.md) | `apiClient`, Service files, Mock Data to Real Backend transition roadmap. |
| **04** | **Custom React Hooks & Async State** | [04-custom-react-hooks-and-state-management.md](./04-custom-react-hooks-and-state-management.md) | `useInvoices`, `useCustomers`, Loading/Error states, cleanup pattern, optimistic updates. |
| **05** | **Design System, Tailwind CSS & Recharts** | [05-reusable-ui-components-and-styling.md](./05-reusable-ui-components-and-styling.md) | Dark mode, CSS Variables, `src/components/ui.tsx`, Recharts data visualization. |
| **06** | **End-to-End ERP Business Workflow & Case Study** | [06-full-erp-workflow-case-study.md](./06-full-erp-workflow-case-study.md) | Customer -> Estimate -> Order -> Invoice -> Payment -> Bank -> AI Assistant flow. |

---

## 🛠️ Project Tech Stack Summary

1. **Framework:** Next.js 16 (App Router)
2. **UI Library:** React 19
3. **Language:** TypeScript 5.7+
4. **Styling:** Tailwind CSS v4 + Vanilla CSS Variables (Dark/Light mode support)
5. **Icons:** Lucide React (`lucide-react`)
6. **Charts & Analytics:** Recharts
7. **State & Logic Pattern:** Custom React Hooks + Service Layer Pattern

---

👉 **Start reading from [00-overview-and-architecture.md](./00-overview-and-architecture.md)**
