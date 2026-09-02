"use client";

import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  Plus,
  Command,
  RefreshCw,
  Keyboard,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { user } from "@/data/mock";
import { Avatar, Badge } from "@/components/ui";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/estimates": "Estimates",
  "/sales-orders": "Sales Orders",
  "/invoices": "Invoices",
  "/customers": "Customers",
  "/products": "Products & Services",
  "/inventory": "Inventory",
  "/bills": "Bills",
  "/expenses": "Expenses",
  "/purchase-orders": "Purchase Orders",
  "/vendors": "Vendors",
  "/banking": "Banking",
  "/payments": "Payments",
  "/payroll": "Payroll",
  "/employees": "Employees",
  "/taxes": "Taxes",
  "/reports": "Reports",
  "/ai-assistant": "AI Copilot",
  "/analytics": "Analytics",
  "/automation": "Automation",
  "/documents": "Documents",
  "/settings": "Settings",
  "/projects": "Projects",
  "/time-tracking": "Time Tracking",
};

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
];

interface TopbarProps {
  darkMode: boolean;
  onToggleDark: () => void;
  onToggleSidebar: () => void;
}

export default function Topbar({
  darkMode,
  onToggleDark,
  onToggleSidebar,
}: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const title = (pathname ? PAGE_TITLES[pathname] : null) || "Dashboard";
  const menuOpen = notifOpen || userOpen;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navigateTo = (href: string) => {
    router.push(href);
    setSearchOpen(false);
    setUserOpen(false);
  };

  return (
    <>
      <header
        className={`h-[56px] flex items-center gap-3 px-4 bg-[var(--color-surface)] border-b border-[var(--color-border)] shrink-0 relative ${
          menuOpen ? "z-50" : "z-20"
        }`}
      >
        <button
          onClick={onToggleSidebar}
          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)] transition-base cursor-pointer"
          title="Toggle Sidebar"
        >
          <Menu size={15} />
        </button>

        <span className="text-[14px] font-semibold text-[var(--color-text)] hidden sm:block">
          {title}
        </span>

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
          <button
            onClick={() => navigateTo("/invoices")}
            className="h-7 px-2.5 flex items-center gap-1.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-fg)] rounded-[var(--radius-md)] text-[12px] font-medium transition-base cursor-pointer"
          >
            <Plus size={13} />
            <span className="hidden sm:inline">New Invoice</span>
          </button>

          <button
            onClick={() => router.refresh()}
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={13} />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen(!notifOpen);
                setUserOpen(false);
              }}
              className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer relative"
            >
              <Bell size={14} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-danger)] rounded-full" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-9 w-80 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] z-50">
                <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[var(--color-text)]">
                    Notifications
                  </span>
                  <button className="text-[11px] text-[var(--color-accent)] cursor-pointer hover:underline">
                    Mark all read
                  </button>
                </div>
                <div className="divide-y divide-[var(--color-border-subtle)]">
                  {[
                    {
                      title: "Invoice INV-2024-0841 overdue",
                      desc: "Titanium Capital Partners — $156,000",
                      time: "2h ago",
                      type: "danger",
                    },
                    {
                      title: "Payroll scheduled for Dec 27",
                      desc: "$192,400 — 8 employees",
                      time: "4h ago",
                      type: "info",
                    },
                    {
                      title: "AWS bill received",
                      desc: "$28,400 due Nov 30",
                      time: "1d ago",
                      type: "warning",
                    },
                    {
                      title: "Bank sync completed",
                      desc: "12 new transactions matched",
                      time: "2d ago",
                      type: "success",
                    },
                  ].map((n, i) => (
                    <div
                      key={i}
                      className="px-4 py-3 hover:bg-[var(--color-border-subtle)] cursor-pointer transition-base"
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            n.type === "danger"
                              ? "bg-[var(--color-danger)]"
                              : n.type === "warning"
                                ? "bg-[var(--color-warning)]"
                                : n.type === "success"
                                  ? "bg-[var(--color-success)]"
                                  : "bg-[var(--color-info)]"
                          }`}
                        />
                        <div>
                          <p className="text-[12px] font-medium text-[var(--color-text)]">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                            {n.desc}
                          </p>
                          <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">
                            {n.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDark}
            className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer"
            title="Toggle Theme"
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setUserOpen(!userOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-1.5 cursor-pointer ml-1"
            >
              <Avatar name={user.name} size="sm" />
              <ChevronDown
                size={11}
                className="text-[var(--color-text-tertiary)] hidden sm:block"
              />
            </button>
            {userOpen && (
              <div className="absolute right-0 top-9 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] z-50 py-1">
                <div className="px-3 py-2.5 border-b border-[var(--color-border-subtle)]">
                  <p className="text-[12px] font-medium text-[var(--color-text)]">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-[var(--color-text-tertiary)]">
                    {user.email}
                  </p>
                  <Badge variant="neutral" size="sm" className="mt-1">
                    {user.role}
                  </Badge>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo("/settings")}
                  className="w-full text-left px-3 py-2 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)] transition-base cursor-pointer"
                >
                  Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserOpen(false);
                    setShortcutsOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 text-[13px] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)] transition-base cursor-pointer"
                >
                  Keyboard Shortcuts
                </button>
                <div className="border-t border-[var(--color-border-subtle)] mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => navigateTo("/")}
                    className="w-full text-left px-3 py-2 text-[13px] text-[var(--color-danger-text)] hover:bg-[var(--color-danger-bg)] transition-base cursor-pointer"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
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
              <Search
                size={16}
                className="text-[var(--color-text-tertiary)] shrink-0"
              />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search invoices, customers, transactions..."
                className="flex-1 bg-transparent text-[14px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] outline-none"
              />
              <kbd className="text-[10px] text-[var(--color-text-tertiary)] border border-[var(--color-border)] px-1.5 py-0.5 rounded">
                Esc
              </kbd>
            </div>
            <div className="py-2">
              <div className="px-4 py-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-1.5">
                  Quick Navigation
                </p>
                {[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Invoices", href: "/invoices" },
                  { label: "Estimates", href: "/estimates" },
                  { label: "Sales Orders", href: "/sales-orders" },
                  { label: "Customers", href: "/customers" },
                  { label: "Banking", href: "/banking" },
                  { label: "Expenses", href: "/expenses" },
                  { label: "Bills", href: "/bills" },
                  { label: "Payroll", href: "/payroll" },
                  { label: "AI Copilot", href: "/ai-assistant" },
                  { label: "Reports", href: "/reports" },
                  { label: "Settings", href: "/settings" },
                ]
                  .filter((item) =>
                    item.label.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item) => (
                    <button
                      key={item.href}
                      onClick={() => navigateTo(item.href)}
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

      {/* Shortcuts Modal */}
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
                <h2 className="text-[15px] font-semibold text-[var(--color-text)]">
                  Keyboard Shortcuts
                </h2>
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
                <div
                  key={s.label}
                  className="flex items-center justify-between px-2 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-border-subtle)]"
                >
                  <span className="text-[13px] text-[var(--color-text-secondary)]">
                    {s.label}
                  </span>
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
          onClick={() => {
            setNotifOpen(false);
            setUserOpen(false);
          }}
        />
      )}
    </>
  );
}
