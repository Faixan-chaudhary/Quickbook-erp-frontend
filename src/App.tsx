import { useState, useEffect } from "react"
import type { Page } from "./data/mock"
import Sidebar from "./components/Sidebar"
import Topbar from "./components/Topbar"
import Landing from "./pages/Landing"
import Dashboard from "./pages/Dashboard"
import Invoices from "./pages/Invoices"
import Estimates from "./pages/Estimates"
import Customers from "./pages/Customers"
import Banking from "./pages/Banking"
import Expenses from "./pages/Expenses"
import Bills from "./pages/Bills"
import Vendors from "./pages/Vendors"
import Products from "./pages/Products"
import Inventory from "./pages/Inventory"
import PurchaseOrders from "./pages/PurchaseOrders"
import Payments from "./pages/Payments"
import Payroll from "./pages/Payroll"
import Employees from "./pages/Employees"
import Taxes from "./pages/Taxes"
import Projects from "./pages/Projects"
import TimeTracking from "./pages/TimeTracking"
import Reports from "./pages/Reports"
import AIAssistant from "./pages/AIAssistant"
import Analytics from "./pages/Analytics"
import Automation from "./pages/Automation"
import Documents from "./pages/Documents"
import Settings from "./pages/Settings"
import GenericPage from "./pages/GenericPage"

export default function App() {
  const [page, setPage] = useState<Page>("landing")
  const [darkMode, setDarkMode] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [settingsSection, setSettingsSection] = useState("company")

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const navigate = (p: Page) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const openSettings = (section: string) => {
    setSettingsSection(section)
    setPage("settings")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (page === "landing") {
    return (
      <Landing
        onGetStarted={() => navigate("dashboard")}
      />
    )
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />
      case "invoices": return <Invoices />
      case "estimates": return <Estimates />
      case "customers": return <Customers />
      case "banking": return <Banking />
      case "expenses": return <Expenses />
      case "bills": return <Bills />
      case "vendors": return <Vendors />
      case "products": return <Products />
      case "inventory": return <Inventory />
      case "purchase-orders": return <PurchaseOrders />
      case "payments": return <Payments />
      case "payroll": return <Payroll />
      case "employees": return <Employees />
      case "taxes": return <Taxes />
      case "projects": return <Projects />
      case "time-tracking": return <TimeTracking />
      case "reports": return <Reports />
      case "ai-assistant": return <AIAssistant />
      case "analytics": return <Analytics />
      case "automation": return <Automation />
      case "documents": return <Documents />
      case "settings": return <Settings initialSection={settingsSection} />
      default: return <GenericPage page={page} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
      <Sidebar
        currentPage={page}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          currentPage={page}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(!darkMode)}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          onNavigate={navigate}
          onOpenSettings={openSettings}
        />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
