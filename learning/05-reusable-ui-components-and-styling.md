# 05 - Reusable UI Components, Styling & Recharts

## 📌 1. Design System Approach (`src/components/ui.tsx`)

Enterprise ERP applications mein visual consistency aur readability sabse important hoti hai. 

Meridian ERP mein har page ke liye alag se buttons ya tables banane ki bajaye ek **Design System (`src/components/ui.tsx`)** tayyar kiya gaya hai:

| Component | Purpose / Kyun Banaya? |
|-----------|------------------------|
| `StatCard` | Financial KPIs (Total Revenue, Outstanding Invoices, Net Profit) show karne ke liye with growth percentage indicators. |
| `Badge` | Status indicators (Paid, Pending, Overdue, Active, Draft) ke consistent colors ke liye. |
| `Button` | Primary, Secondary, Outline, Danger variants with loading spinners. |
| `Modal` / `Dialog` | Forms (Create Invoice, Add Customer) open karne ke liye with backdrop blur. |
| `Table` | Striped, bordered data grid with sort & filter capabilities. |
| `Input` / `Select` | Form inputs with focus rings, helper text, aur dark mode compatibility. |

---

## 🎨 2. Styling System: Tailwind CSS v4 & CSS Variables

Project mein **Tailwind CSS v4** aur **CSS Variables** (`globals.css`) ka combination use kiya gaya hai:

```css
/* src/app/globals.css */
:root {
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-border: #e2e8f0;
  --color-text-main: #0f172a;
  --color-text-muted: #64748b;
  --color-primary: #0d9488; /* Teal 600 - Fresh & modern finance branding */
}

.dark {
  --color-bg: #0b0f19;
  --color-surface: #111827;
  --color-border: #1f2937;
  --color-text-main: #f9fafb;
  --color-text-muted: #9ca3af;
  --color-primary: #14b8a6;
}
```

### Dark Mode Toggle Mechanism:
`src/app/(dashboard)/layout.tsx` mein:
```tsx
const [darkMode, setDarkMode] = useState(false);

useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}, [darkMode]);
```
Jab bhi user Topbar se moon/sun icon click karta hai, HTML root par `dark` class toggle hoti hai aur poora theme instantly switch ho jata hai!

---

## 📊 3. Financial Data Visualizations (Recharts)

Accounting data ko tabular dekhne ke sath visual trends dekhna zaroori hota hai. Is project mein `recharts` library use ki gayi hai:

1. **AreaChart / Spline Charts:** Monthly Cashflow & Revenue growth trends.
2. **BarChart:** Revenue vs Expenses comparison.
3. **PieChart / DonutChart:** Expense breakdown by category (Rent, Salaries, Software, Marketing).
4. **`ChartReveal.tsx`:** Charts ko render karte waqt smooth fade-in aur scale animation provide karta hai.

---

## 🏢 4. Real-World Business Scenario Example

### 💼 Scenario: "CFO wants to analyze Q3 Cash Flow at midnight in Dark Mode"

**Problem (Generic HTML Tables & High Contrast white screens):**
Data ko samajhne ke liye 500 rows scroll karni padti hain aur white screen aankhon par chubhti hai.

**Solution (Meridian ERP UI):**
1. CFO Topbar se **Dark Mode** toggle karta hai (Sleek slate-900 background).
2. Dashboard ke top par **`StatCard`** use 1 second mein batata hai: *"$142,500 (+14.2% from last month)"*.
3. **Recharts AreaChart** visual curve show karta hai ke kis month expenses revenue se zyada the.

---

👉 **Agla Module:** [06 - End-to-End ERP Business Workflow Case Study](./06-full-erp-workflow-case-study.md)
