"use client";

import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  ShoppingCart,
  Receipt,
  CreditCard,
  Building2,
  Landmark,
  DollarSign,
  Users2,
  Calculator,
  FolderOpen,
  Clock,
  BarChart3,
  Sparkles,
  TrendingUp,
  Zap,
  Settings,
  ChevronDown,
  ChevronRight,
  Layers,
  FileCheck,
  Briefcase,
  ArrowLeftRight,
  Bot,
  Wallet,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { company, user } from "@/data/mock";
import { Avatar } from "@/components/ui";

interface NavItem {
  id: string;
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      {
        id: "dashboard",
        href: "/dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard size={14} />,
      },
    ],
  },
  {
    id: "revenue",
    label: "Revenue",
    items: [
      { id: "estimates", href: "/estimates", label: "Estimates", icon: <FileCheck size={14} /> },
      {
        id: "sales-orders",
        href: "/sales-orders",
        label: "Sales Orders",
        icon: <ClipboardList size={14} />,
      },
      { id: "invoices", href: "/invoices", label: "Invoices", icon: <FileText size={14} /> },
      { id: "customers", href: "/customers", label: "Customers", icon: <Users size={14} /> },
      { id: "products", href: "/products", label: "Products", icon: <Package size={14} /> },
    ],
  },
  {
    id: "payables",
    label: "Payables",
    items: [
      { id: "bills", href: "/bills", label: "Bills", icon: <Receipt size={14} /> },
      { id: "expenses", href: "/expenses", label: "Expenses", icon: <CreditCard size={14} /> },
      {
        id: "purchase-orders",
        href: "/purchase-orders",
        label: "Purchase Orders",
        icon: <ShoppingCart size={14} />,
      },
      { id: "vendors", href: "/vendors", label: "Vendors", icon: <Building2 size={14} /> },
    ],
  },
  {
    id: "cash",
    label: "Cash & Banking",
    items: [
      { id: "banking", href: "/banking", label: "Banking", icon: <Landmark size={14} /> },
      { id: "payments", href: "/payments", label: "Payments", icon: <ArrowLeftRight size={14} /> },
      { id: "payroll", href: "/payroll", label: "Payroll", icon: <DollarSign size={14} /> },
      { id: "employees", href: "/employees", label: "Employees", icon: <Users2 size={14} /> },
    ],
  },
  {
    id: "compliance",
    label: "Compliance",
    items: [
      { id: "taxes", href: "/taxes", label: "Taxes", icon: <Calculator size={14} /> },
      { id: "reports", href: "/reports", label: "Reports", icon: <BarChart3 size={14} /> },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      { id: "inventory", href: "/inventory", label: "Inventory", icon: <Layers size={14} /> },
      { id: "projects", href: "/projects", label: "Projects", icon: <Briefcase size={14} /> },
      {
        id: "time-tracking",
        href: "/time-tracking",
        label: "Time Tracking",
        icon: <Clock size={14} />,
      },
      { id: "documents", href: "/documents", label: "Documents", icon: <FolderOpen size={14} /> },
    ],
  },
  {
    id: "intelligence",
    label: "Intelligence",
    items: [
      { id: "ai-assistant", href: "/ai-assistant", label: "AI Copilot", icon: <Bot size={14} /> },
      { id: "analytics", href: "/analytics", label: "Analytics", icon: <TrendingUp size={14} /> },
      { id: "automation", href: "/automation", label: "Automation", icon: <Zap size={14} /> },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed_groups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (id: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const w = collapsed ? "w-[56px]" : "w-[200px]";

  return (
    <aside
      className={`${w} shrink-0 h-screen flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)] transition-all duration-200 overflow-hidden select-none`}
    >
      {/* Logo */}
      <div className="h-[56px] flex items-center px-4 border-b border-[var(--color-border)] shrink-0">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-[var(--radius-md)] logo-shine flex items-center justify-center shrink-0">
            <Wallet size={14} className="text-[var(--color-primary-fg)]" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-[14px] text-[var(--color-text)] tracking-tight whitespace-nowrap">
              Meridian ERP
            </span>
          )}
        </Link>
      </div>

      {/* Company selector */}
      {!collapsed && (
        <div className="px-3 py-2 border-b border-[var(--color-border)] shrink-0">
          <button className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-border-subtle)] transition-base group cursor-pointer">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="w-5 h-5 rounded-[var(--radius-sm)] bg-[var(--color-primary)] flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                M
              </span>
              <span className="text-[12px] font-medium text-[var(--color-text)] truncate">
                {company.name}
              </span>
            </div>
            <ChevronDown
              size={12}
              className="text-[var(--color-text-tertiary)] shrink-0"
            />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto hide-scrollbar py-2 px-2">
        {navGroups.map((group) => {
          const isCollapsed = collapsed_groups.has(group.id);
          return (
            <div key={group.id} className="mb-3">
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between px-2 py-1 mb-0.5 cursor-pointer group"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)] transition-base">
                    {group.label}
                  </span>
                  {isCollapsed ? (
                    <ChevronRight
                      size={10}
                      className="text-[var(--color-text-tertiary)]"
                    />
                  ) : (
                    <ChevronDown
                      size={10}
                      className="text-[var(--color-text-tertiary)]"
                    />
                  )}
                </button>
              )}
              {!isCollapsed && (
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const active =
                      pathname === item.href ||
                      (item.href !== "/" && pathname?.startsWith(item.href));
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-[var(--radius-md)] transition-base cursor-pointer text-left ${
                          active
                            ? "bg-[var(--color-accent-subtle)] text-[var(--color-primary)]"
                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)]"
                        } ${collapsed ? "justify-center" : ""}`}
                      >
                        <span
                          className={`shrink-0 ${active ? "text-[var(--color-primary)]" : ""}`}
                        >
                          {item.icon}
                        </span>
                        {!collapsed && (
                          <span className="text-[13px] font-medium truncate">
                            {item.label}
                          </span>
                        )}
                        {active && !collapsed && (
                          <span className="ml-auto w-1 h-1 rounded-full bg-[var(--color-accent)] shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer / User */}
      <div className="p-2 border-t border-[var(--color-border)] shrink-0 flex flex-col gap-1">
        <Link
          href="/settings"
          className={`flex items-center gap-2.5 px-2 py-1.5 rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)] transition-base cursor-pointer ${
            pathname === "/settings" ? "bg-[var(--color-accent-subtle)] text-[var(--color-primary)]" : ""
          } ${collapsed ? "justify-center" : ""}`}
        >
          <Settings size={14} className="shrink-0" />
          {!collapsed && (
            <span className="text-[13px] font-medium">Settings</span>
          )}
        </Link>

        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-1.5 mt-1 rounded-[var(--radius-md)] bg-[var(--color-border-subtle)]">
            <Avatar name={user.name} size="sm" />
            <div className="overflow-hidden min-w-0 flex-1">
              <div className="text-[12px] font-medium text-[var(--color-text)] truncate">
                {user.name}
              </div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] truncate">
                {user.role}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
