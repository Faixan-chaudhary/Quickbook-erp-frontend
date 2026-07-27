import {
  Menu, Search, Bell, Moon, Sun, ChevronDown,
  Plus, Command, RefreshCw, Keyboard, X,
} from "lucide-react"
import { useState } from "react"
import type { Page } from "../data/mock"
import { user } from "../data/mock"
import { Avatar, Badge } from "./ui"

const PAGE_TITLES: Partial<Record<Page, string>> = {
  dashboard: "Dashboard",
  invoices: "Invoices",
  estimates: "Estimates",
  customers: "Customers",
  products: "Products & Services",
  inventory: "Inventory",
  bills: "Bills",
  expenses: "Expenses",
  "purchase-orders": "Purchase Orders",
  vendors: "Vendors",
  banking: "Banking",
  payments: "Payments",
  payroll: "Payroll",
  employees: "Employees",
  taxes: "Taxes",
  reports: "Reports",
  "ai-assistant": "AI Copilot",
  analytics: "Analytics",
  automation: "Automation",
  documents: "Documents",
  settings: "Settings",
  projects: "Projects",
  "time-tracking": "Time Tracking",
}

const SHORTCUTS = [
  { keys: ["⌘", "K"], label: "Open search" },
  { keys: ["⌘", "N"], label: "Create new invoice" },
  { keys: ["G", "D"], label: "Go to Dashboard" },
  { keys: ["G", "I"], label: "Go to Invoices" },
  { keys: ["G", "C"], label: "Go to Customers" },
  { keys: ["G", "B"], label: "Go to Banking" },
  { keys: ["G", "A"], label: "Open AI Copilot" },
  { keys: ["G", "S"], label: "Open Settings" },
  { keys: ["?"], label: "Show keyboard shortcuts" },
  { keys: ["Esc"], label: "Close dialog / menu" },
]

interface TopbarProps {
  currentPage: Page
  darkMode: boolean
  onToggleDark: () => void
  onToggleSidebar: () => void
  onNavigate: (page: Page) => void
  onOpenSettings?: (section: string) => void
}

export default function Topbar({
  currentPage,
  darkMode,
  onToggleDark,
  onToggleSidebar,
  onNavigate,
  onOpenSettings,
}: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  const title = PAGE_TITLES[currentPage] ?? currentPage
  const menuOpen = notifOpen || userOpen

  const goSettings = (section: string) => {
    setUserOpen(false)
    if (onOpenSettings) onOpenSettings(section)
    else onNavigate("settings")
  }

  return (
    <>
      <header className={`h-[56px] flex items-center gap-3 px-4 bg-[var(--color-surface)] border-b border-[var(--color-border)] shrink-0 relative ${menuOpen ? "z-50" : "z-20"}`}>
        <button
          onClick={onToggleSidebar}
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)] transition-base cursor-pointer"
        >
          <Menu size={15} />
        </button>

        <span className="text-[14px] font-semibold text-[var(--color-text)] hidden sm:block">{title}</span>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 h-7 px-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[12px] text-[var(--color-text-tertiary)] hover:border-[var(--color-text-secondary)] transition-base cursor-pointer ml-4 min-w-[180px] hidden md:flex"
        >
          <Search size={13} />
          <span>Search...</span>
          <span className="ml-auto flex items-center gap-0.5 text-[10px] text-[var(--color-text-tertiary)]">
            <Command size={10} />K
          </span>
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          <button className="h-7 px-2.5 flex items-center gap-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-fg)] rounded-[var(--radius-md)] text-[12px] font-medium transition-base cursor-pointer">
            <Plus size={13} />
            <span className="hidden sm:inline">New</span>
          </button>

          <button
            onClick={() => {}}
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer"
          >
            <RefreshCw size={13} />
          </button>

          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false) }}
              className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer relative"
            >
              <Bell size={14} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-danger)] rounded-full" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-9 w-80 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] z-50">
                <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[var(--color-text)]">Notifications</span>
                  <button className="text-[11px] text-[var(--color-accent)] cursor-pointer hover:underline">Mark all read</button>
                </div>
                <div className="divide-y divide-[var(--color-border-subtle)]">
                  {[
                    { title: "Invoice INV-2024-0841 overdue", desc: "Titanium Capital Partners — $156,000", time: "2h ago", type: "danger" },
                    { title: "Payroll scheduled for Dec 27", desc: "$192,400 — 8 employees", time: "4h ago", type: "info" },
                    { title: "AWS bill received", desc: "$28,400 due Nov 30", time: "1d ago", type: "warning" },
                    { title: "Bank sync completed", desc: "12 new transactions matched", time: "2d ago", type: "success" },
                  ].map((n, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-[var(--color-border-subtle)] cursor-pointer transition-base">
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.type === "danger" ? "bg-[var(--color-danger)]" : n.type === "warning" ? "bg-[var(--color-warning)]" : n.type === "success" ? "bg-[var(--color-success)]" : "bg-[var(--color-info)]"}`}
                        />
                        <div>
                          <p className="text-[12px] font-medium text-[var(--color-text)]">{n.title}</p>
                          <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">{n.desc}</p>
                          <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-[var(--color-border)]">
                  <button className="text-[12px] text-[var(--color-accent)] w-full text-center cursor-pointer hover:underline">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onToggleDark}
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer"
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <div className="relative">
            <button
              onClick={() => { setUserOpen(!userOpen); setNotifOpen(false) }}
              className="flex items-center gap-1.5 cursor-pointer ml-1"
            >
              <Avatar name={user.name} size="sm" />
              <ChevronDown size={11} className="text-[var(--color-text-tertiary)] hidden sm:block" />
            </button>
            {userOpen && (
              <div className="absolute right-0 top-9 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] z-50 py-1">
                <div className="px-3 py-2.5 border-b border-[var(--color-border-subtle)]">
                  <p className="text-[12px] font-medium text-[var(--color-text)]">{user.name}</p>
                  <p className="text-[11px] text-[var(--color-text-tertiary)]">{user.email}</p>
                  <Badge variant="neutral" size="sm" className="mt-1">{user.role}</Badge>
                </div>
                <button
                  type="button"
                  onClick={() => goSettings("profile")}
                  className="w-full text-left px-3 py-2 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)] transition-base cursor-pointer"
                >
                  Profile Settings
                </button>
                <button
                  type="button"
                  onClick={() => goSettings("billing")}
                  className="w-full text-left px-3 py-2 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)] transition-base cursor-pointer"
                >
                  Billing & Plan
                </button>
                <button
                  type="button"
                  onClick={() => { setUserOpen(false); setShortcutsOpen(true) }}
                  className="w-full text-left px-3 py-2 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)] transition-base cursor-pointer"
                >
                  Keyboard Shortcuts
                </button>
                <div className="border-t border-[var(--color-border-subtle)] mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => { setUserOpen(false); onNavigate("landing") }}
                    className="w-full text-left px-3 py-2 text-[13px] text-[var(--color-danger-text)] hover:bg-[var(--color-danger-bg)] transition-base cursor-pointer"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-20"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-lg)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-border)]">
              <Search size={16} className="text-[var(--color-text-tertiary)] shrink-0" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search invoices, customers, transactions..."
                className="flex-1 bg-transparent text-[14px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] outline-none"
              />
              <kbd className="text-[10px] text-[var(--color-text-tertiary)] border border-[var(--color-border)] px-1.5 py-0.5 rounded">Esc</kbd>
            </div>
            <div className="py-2">
              <div className="px-4 py-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-1.5">Quick Navigation</p>
                {[
                  { label: "Dashboard", page: "dashboard" as Page },
                  { label: "Invoices", page: "invoices" as Page },
                  { label: "Banking", page: "banking" as Page },
                  { label: "Payroll", page: "payroll" as Page },
                  { label: "AI Copilot", page: "ai-assistant" as Page },
                  { label: "Reports", page: "reports" as Page },
                  { label: "Settings", page: "settings" as Page },
                ].map((item) => (
                  <button
                    key={item.page}
                    onClick={() => { onNavigate(item.page); setSearchOpen(false) }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-[var(--radius-md)] text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)] transition-base cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {shortcutsOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center p-4"
          onClick={() => setShortcutsOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-lg)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard size={16} className="text-[var(--color-primary)]" />
                <h2 className="text-[15px] font-semibold text-[var(--color-text)]">Keyboard Shortcuts</h2>
              </div>
              <button
                type="button"
                onClick={() => setShortcutsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto">
              {SHORTCUTS.map((s) => (
                <div key={s.label} className="flex items-center justify-between px-2 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-border-subtle)]">
                  <span className="text-[13px] text-[var(--color-text-secondary)]">{s.label}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((k) => (
                      <kbd
                        key={k}
                        className="min-w-[24px] h-6 px-1.5 flex items-center justify-center text-[11px] font-medium text-[var(--color-text)] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)]"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setNotifOpen(false); setUserOpen(false) }}
        />
      )}
    </>
  )
}
