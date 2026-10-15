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
  Check,
  Plus,
  Loader2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar } from "@/components/ui";
import { useUserAndCompany } from "@/hooks/useUserAndCompany";
import { companyService, type CompanyInfoResponse } from "@/services/companyService";
import { CompanySetupModal } from "@/components/company/CompanySetupModal";

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
      { id: "accounts", href: "/accounts", label: "Chart of Accounts", icon: <Wallet size={14} /> },
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
  const queryClient = useQueryClient();
  const [collapsed_groups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [switchingCompanyId, setSwitchingCompanyId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    userName,
    userRole,
    companyName,
    companyId,
    company,
    userEmail,
    userPhone,
    refetchCompany,
  } = useUserAndCompany();

  // Fetch all companies accessible by current user
  const { data: userCompanies = [] } = useQuery<CompanyInfoResponse[]>({
    queryKey: ["user-companies"],
    queryFn: () => companyService.getUserCompanies(),
    staleTime: 5 * 60 * 1000, // 5 minutes caching
    refetchOnWindowFocus: false, // Prevents duplicate API call on focus
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCompanyDropdown(false);
      }
    }
    if (showCompanyDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCompanyDropdown]);

  // Combine fetched user companies and ensure active company is present
  const companiesList: CompanyInfoResponse[] = (() => {
    const list = Array.isArray(userCompanies) ? [...userCompanies] : [];
    if (
      company &&
      !list.some(
        (c) =>
          (c.id && c.id === company.id) ||
          (c.name && c.name.toLowerCase() === company.name?.toLowerCase())
      )
    ) {
      list.unshift(company as CompanyInfoResponse);
    } else if (list.length === 0 && companyName) {
      list.push({ id: companyId || "me", name: companyName } as CompanyInfoResponse);
    }
    return list;
  })();

  const handleSwitchCompany = async (targetCompany: CompanyInfoResponse) => {
    if (!targetCompany.id || targetCompany.id === companyId) {
      setShowCompanyDropdown(false);
      return;
    }

    try {
      setSwitchingCompanyId(targetCompany.id);
      await companyService.switchCompany(targetCompany.id);

      if (typeof window !== "undefined") {
        localStorage.setItem("company_id", targetCompany.id);
        if (targetCompany.name) {
          localStorage.setItem("company_name", targetCompany.name);
        }
        localStorage.setItem("arca_company_profile", JSON.stringify(targetCompany));
      }

      // Optimistically update cache and invalidate smoothly once (prevents duplicate spam)
      queryClient.setQueryData(["company-profile-me"], targetCompany);
      queryClient.invalidateQueries({ queryKey: ["company-profile-me"] });
      queryClient.invalidateQueries({ queryKey: ["company-preferences", targetCompany.id] });
      queryClient.invalidateQueries({ queryKey: ["user-companies"] });
      setShowCompanyDropdown(false);

    } catch (err) {
      console.error("Failed to switch company:", err);
    } finally {
      setSwitchingCompanyId(null);
    }
  };

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
              Arca ERP
            </span>
          )}
        </Link>
      </div>

      {/* Company selector */}
      {!collapsed && (
        <div className="px-2 py-2 border-b border-[var(--color-border)] shrink-0 relative z-30" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowCompanyDropdown((prev) => !prev)}
            className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-border-subtle)] transition-base group cursor-pointer ${
              showCompanyDropdown ? "bg-[var(--color-border-subtle)]" : ""
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="w-5 h-5 rounded-[var(--radius-sm)] bg-[var(--color-primary)] flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                {companyName ? companyName.charAt(0).toUpperCase() : "C"}
              </span>
              <span className="text-[12px] font-medium text-[var(--color-text)] truncate">
                {companyName || "Select Company"}
              </span>
            </div>
            <ChevronDown
              size={12}
              className={`text-[var(--color-text-tertiary)] shrink-0 transition-transform duration-200 ${
                showCompanyDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Company Switcher Dropdown */}
          {showCompanyDropdown && (
            <div className="absolute left-2 right-2 top-[calc(100%+4px)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-lg py-1 z-50">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                Companies
              </div>

              <div className="max-h-[160px] overflow-y-auto hide-scrollbar py-0.5">
                {companiesList.map((c) => {
                  const isActive =
                    (c.id && c.id === companyId) ||
                    (!companyId && c.name?.toLowerCase() === companyName.toLowerCase());
                  const isSwitching = switchingCompanyId === c.id;

                  return (
                    <button
                      key={c.id || c.name}
                      type="button"
                      onClick={() => handleSwitchCompany(c)}
                      disabled={isSwitching}
                      className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 text-left text-[12px] transition-colors cursor-pointer ${
                        isActive
                          ? "bg-[var(--color-accent-subtle)] text-[var(--color-primary)] font-medium"
                          : "text-[var(--color-text)] hover:bg-[var(--color-border-subtle)]"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-4 h-4 rounded-[var(--radius-sm)] flex items-center justify-center text-[8px] font-bold shrink-0 ${
                            isActive
                              ? "bg-[var(--color-primary)] text-white"
                              : "bg-[var(--color-border)] text-[var(--color-text-secondary)]"
                          }`}
                        >
                          {c.name ? c.name.charAt(0).toUpperCase() : "C"}
                        </span>
                        <span className="truncate">{c.name}</span>
                      </div>
                      {isSwitching ? (
                        <Loader2 size={11} className="animate-spin text-[var(--color-primary)] shrink-0" />
                      ) : isActive ? (
                        <Check size={12} className="text-[var(--color-primary)] shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              <div className="my-1 border-t border-[var(--color-border)]" />

              <button
                type="button"
                onClick={() => {
                  setShowCompanyDropdown(false);
                  setShowRegisterModal(true);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[12px] font-medium text-[var(--color-primary)] hover:bg-[var(--color-accent-subtle)] transition-colors cursor-pointer"
              >
                <Plus size={13} className="shrink-0" />
                <span className="truncate">Register New Company</span>
              </button>
            </div>
          )}
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
            <Avatar name={userName} size="sm" />
            <div className="overflow-hidden min-w-0 flex-1">
              <div className="text-[12px] font-medium text-[var(--color-text)] truncate">
                {userName}
              </div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] truncate">
                {userRole}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Register New Company Modal */}
      {showRegisterModal && (
        <CompanySetupModal
          open={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          mode="register"
          userEmail={userEmail}
          userPhone={userPhone}
          onSuccess={() => {
            setShowRegisterModal(false);
          }}
        />
      )}
    </aside>
  );
}
