# 01 - Next.js App Router, Layouts & Routing

## 📌 1. Next.js App Router Kya Hai Aur Kyun Use Kiya?

Next.js ka **App Router (`src/app`)** modern React 19 / Server Components architecture par mabni hai. 
Is project mein Next.js use karne ke main reasons:
1. **File-System Based Routing:** Kisi extra routing library (jaise `react-router-dom`) ki zaroorat nahi hoti. Sirf folder banao aur page ready!
2. **Nested Layouts:** Sidebar aur Topbar ko bar bar reload kiye baghair pages switch hote hain.
3. **Route Groups:** URL clean rakhne ke liye folders ko organize karna.

---

## 📂 2. Route Groups: `src/app/(dashboard)/`

Aapne dekha hoga ke folder ka naam `(dashboard)` hai (parentheses `()` ke sath).

### Parentheses `()` ka matlab:
Next.js mein jab kisi folder ke gird brackets `()` lagate hain to use **Route Group** kehte hain. Iska matlab hota hai:
- Ye folder URL path ka hissa **nahi** banega.
- Example: `src/app/(dashboard)/invoices/page.tsx` ka URL banega:
  👉 `/invoices` (na ke `/dashboard/invoices`)

### Kyun Use Kiya? (Purpose):
- Taake hum Dashboard ke tamam 24 pages ke liye **ek common `layout.tsx`** share kar sakein (Sidebar + Topbar + Dark mode state).
- Magar landing page (`src/app/page.tsx`) par humein Sidebar nahi chahiye, isliye landing page Route Group se bahir rehta hai.

---

## 🖼️ 3. Nested Layouts Flow

```text
src/app/layout.tsx (Root Layout: HTML, Body, Global CSS, Fonts)
       │
       ├── src/app/page.tsx  --> (Landing Page: Full Width, No Sidebar)
       │
       └── src/app/(dashboard)/layout.tsx (Dashboard Layout: Sidebar + Topbar + Main Area)
                │
                ├── /dashboard      --> (Dashboard Overview)
                ├── /invoices       --> (Invoices Grid & Modal)
                ├── /customers      --> (Customers Directory)
                └── ... (Other ERP modules)
```

### Code Snippet: `src/app/(dashboard)/layout.tsx`
```tsx
"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(!darkMode)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
```

---

## ⚡ 4. Client Components vs Server Components

Next.js App Router mein by default tamam components **Server Components** hote hain.

### Kab `"use client"` lagana zaroori hai?
1. Jab aap React Hooks use karein (`useState`, `useEffect`, `useCallback`, `useRouter`).
2. Jab aap browser event listeners use karein (`onClick`, `onChange`, `onSubmit`).
3. Jab aap browser APIs access karein (`localStorage`, `document.documentElement`).

Is project mein interactive dashboards aur real-time forms hone ki wajah se layout aur views par `"use client"` lagaya gaya hai.

---

## 🏢 5. Real-World Business Scenario Example

### 💼 Scenario: "User Invoices se Customers page par jump karta hai"

**Problem (Traditional Multi-Page App mein):**
User jab navigation link par click karta tha to poora page white blink (flicker) hota tha, Sidebar dobara se fetch/render hota tha, scroll position reset ho jati thi.

**Solution (Next.js Dashboard Layout):**
Next.js nested layouts ki madad se:
1. `Sidebar` aur `Topbar` screen par freeze rehte hain (unka state destroy nahi hota).
2. Sirf beech ka `<main>` area swap hota hai.
3. User ko lagta hai ke wo ek desktop application (jaise QuickBooks Desktop) use kar raha hai bina kisi page reload delay ke!

---

👉 **Agla Module:** [02 - TypeScript Domain Modeling & Types](./02-typescript-architecture-and-types.md)
