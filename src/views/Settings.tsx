"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Users,
  CreditCard,
  Bell,
  Shield,
  Globe,
  Link2,
  UserCircle,
  Check,
  Upload,
  Save,
  Plus,
  Trash2,
  Key,
  Smartphone,
} from "lucide-react";
import { company, user, employees } from "../data/mock";
import { Button, Card, Badge, Input, SectionHeader, Avatar } from "../components/ui";
import { useUserAndCompany } from "@/hooks/useUserAndCompany";

const NAV_ITEMS = [
  { id: "profile", label: "Profile Settings", icon: <UserCircle size={14} /> },
  { id: "company", label: "Company Profile", icon: <Building2 size={14} /> },
  { id: "users", label: "Users & Roles", icon: <Users size={14} /> },
  { id: "billing", label: "Subscription & Billing", icon: <CreditCard size={14} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={14} /> },
  { id: "security", label: "Security & 2FA", icon: <Shield size={14} /> },
  { id: "integrations", label: "Integrations", icon: <Link2 size={14} /> },
  { id: "localization", label: "Localization", icon: <Globe size={14} /> },
];

interface SettingsProps {
  initialSection?: string;
}

export default function Settings({ initialSection = "company" }: SettingsProps) {
  const [activeSection, setActiveSection] = useState(initialSection);
  const [saved, setSaved] = useState(false);
  const { userName, userEmail, userRole, companyName, companyCurrency } = useUserAndCompany();

  useEffect(() => {
    if (initialSection) setActiveSection(initialSection);
  }, [initialSection]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader title="Settings" />

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-56 shrink-0 flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] text-[13px] font-medium cursor-pointer transition-base text-left ${
                activeSection === item.id
                  ? "bg-[var(--color-border-subtle)] text-[var(--color-text)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)]"
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {item.label}
              {activeSection === item.id && (
                <span className="ml-auto w-1 h-1 rounded-full bg-[var(--color-accent)]" />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {activeSection === "profile" && (
            <Card>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[14px] font-semibold text-[var(--color-text)]">Your Profile</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={saved ? <Check size={13} /> : <Save size={13} />}
                  onClick={handleSave}
                >
                  {saved ? "Saved!" : "Save Changes"}
                </Button>
              </div>
              <div className="flex items-start gap-5 mb-5">
                <Avatar name={userName || user.name} size="lg" />
                <div>
                  <Button variant="secondary" size="sm" icon={<Upload size={13} />}>
                    Change Photo
                  </Button>
                  <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1.5">
                    PNG or JPG · Max 2MB
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" defaultValue={userName || user.name} />
                <Input label="Email" defaultValue={userEmail || user.email} />
                <Input label="Role" defaultValue={userRole || user.role} />
                <Input label="Phone" defaultValue="+1 (415) 882-4401" />
                <Input label="Job Title" defaultValue="Chief Financial Officer" />
                <Input label="Timezone" defaultValue="America/Los_Angeles (PST)" />
              </div>
            </Card>
          )}

          {activeSection === "company" && (
            <>
              <Card>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[14px] font-semibold text-[var(--color-text)]">
                    Company Information
                  </h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={saved ? <Check size={13} /> : <Save size={13} />}
                    onClick={handleSave}
                  >
                    {saved ? "Saved!" : "Save Changes"}
                  </Button>
                </div>
                <div className="flex items-start gap-5 mb-5">
                  <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-[var(--color-border-subtle)] flex items-center justify-center shrink-0">
                    <span className="text-[24px] font-bold text-[var(--color-primary)]">
                      {(companyName || "M").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <Button variant="secondary" size="sm" icon={<Upload size={13} />}>
                      Upload Logo
                    </Button>
                    <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1.5">
                      PNG or JPG · Max 2MB · Recommended 256×256px
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Company Name" defaultValue={companyName || company.name} />
                  <Input label="Legal Name" defaultValue={companyName || company.legalName} />
                  <Input label="Tax ID / EIN" defaultValue={company.taxId} />
                  <Input label="Industry" defaultValue={company.industry} />
                  <Input label="Website" defaultValue={company.website} />
                  <Input label="Phone" defaultValue={company.phone} />
                  <div className="col-span-2">
                    <Input label="Business Address" defaultValue={company.address} />
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="text-[14px] font-semibold text-[var(--color-text)] mb-4">
                  Accounting Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Fiscal Year", value: "January – December" },
                    { label: "Base Currency", value: `${companyCurrency || "USD"} – Default Currency` },
                    { label: "Tax System", value: "Accrual Basis" },
                    { label: "Date Format", value: "MM/DD/YYYY" },
                    { label: "Number Format", value: "1,000.00" },
                    { label: "Timezone", value: "America/Los_Angeles (PST)" },
                  ].map((field) => (
                    <div key={field.label} className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-medium text-[var(--color-text)]">
                        {field.label}
                      </label>
                      <select className="h-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] px-3 focus:outline-none focus:border-[var(--color-accent)] transition-base cursor-pointer">
                        <option>{field.value}</option>
                      </select>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {activeSection === "users" && (
            <Card padding="none">
              <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <h3 className="text-[14px] font-semibold text-[var(--color-text)]">
                    Team Members
                  </h3>
                  <p className="text-[12px] text-[var(--color-text-tertiary)] mt-0.5">
                    {employees.length} members
                  </p>
                </div>
                <Button variant="primary" size="sm" icon={<Plus size={13} />}>
                  Invite Member
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      {["Member", "Role", "Department", "Status", "Last Active", ""].map((h) => (
                        <th
                          key={h || "actions"}
                          className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] text-left"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr
                        key={emp.id}
                        className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={emp.name} size="sm" />
                            <div>
                              <div className="text-[13px] font-medium text-[var(--color-text)]">
                                {emp.name}
                              </div>
                              <div className="text-[11px] text-[var(--color-text-tertiary)]">
                                {emp.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <select
                            className="text-[12px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-sm)] px-2 py-1 focus:outline-none text-[var(--color-text)]"
                            defaultValue={emp.title === "CFO" ? "Admin" : "Staff"}
                          >
                            {["Admin", "Manager", "Staff", "Viewer", "Accountant"].map((r) => (
                              <option key={r}>{r}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-[11px] px-2 py-0.5 rounded bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">
                            {emp.department}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <Badge variant="success" size="sm" dot>
                            Active
                          </Badge>
                        </td>
                        <td className="px-5 py-3 text-[12px] text-[var(--color-text-tertiary)]">
                          2 hours ago
                        </td>
                        <td className="px-5 py-3">
                          <Button variant="ghost" size="xs" icon={<Trash2 size={11} />}>
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeSection === "billing" && (
            <div className="flex flex-col gap-4">
              <Card>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[14px] font-semibold text-[var(--color-text)]">
                        Enterprise Plan
                      </h3>
                      <Badge variant="ai">Current</Badge>
                    </div>
                    <p className="text-[12px] text-[var(--color-text-tertiary)]">
                      Unlimited users, multi-company, API access, dedicated support
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[20px] font-bold tabnum text-[var(--color-text)]">
                      $1,200
                    </div>
                    <div className="text-[11px] text-[var(--color-text-tertiary)]">
                      per month · billed annually
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: "Users", value: `${employees.length} / Unlimited` },
                    { label: "Companies", value: "3 active" },
                    { label: "Storage", value: "142 GB / 1 TB" },
                    { label: "API Calls", value: "48K / 100K" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-3 bg-[var(--color-bg)] rounded-[var(--radius-md)] border border-[var(--color-border)]"
                    >
                      <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-text-tertiary)]">
                        {stat.label}
                      </div>
                      <div className="text-[13px] font-semibold text-[var(--color-text)] mt-1">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    Manage Plan
                  </Button>
                  <Button variant="secondary" size="sm">
                    View Invoices
                  </Button>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-semibold text-[var(--color-text)]">
                    Payment Method
                  </h3>
                  <Button variant="secondary" size="sm">
                    Update
                  </Button>
                </div>
                <div className="flex items-center gap-3 p-3.5 border border-[var(--color-border)] rounded-[var(--radius-md)]">
                  <div className="w-10 h-7 bg-[var(--color-border-subtle)] rounded flex items-center justify-center">
                    <CreditCard size={14} className="text-[var(--color-text-tertiary)]" />
                  </div>
                  <div>
                    <div className="text-[13px] font-medium text-[var(--color-text)]">
                      Visa ending in 4242
                    </div>
                    <div className="text-[11px] text-[var(--color-text-tertiary)]">
                      Expires 03/2027 · Next charge Dec 1, 2025
                    </div>
                  </div>
                  <Badge variant="success" size="sm" className="ml-auto">
                    Primary
                  </Badge>
                </div>
              </Card>
            </div>
          )}

          {activeSection === "security" && (
            <div className="flex flex-col gap-4">
              <Card>
                <h3 className="text-[14px] font-semibold text-[var(--color-text)] mb-4">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-start justify-between p-4 border border-[var(--color-success-border)] bg-[var(--color-success-bg)] rounded-[var(--radius-md)]">
                  <div className="flex items-start gap-3">
                    <Smartphone
                      size={15}
                      className="text-[var(--color-success)] mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-[13px] font-medium text-[var(--color-success-text)]">
                        2FA is enabled
                      </p>
                      <p className="text-[12px] text-[var(--color-success-text)] opacity-80 mt-0.5">
                        Authenticator app · Last verified 2 days ago
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">
                    Manage
                  </Button>
                </div>
              </Card>

              <Card>
                <h3 className="text-[14px] font-semibold text-[var(--color-text)] mb-4">
                  API Keys
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      name: "Production API Key",
                      created: "Jan 15, 2024",
                      lastUsed: "2 hours ago",
                      scopes: ["read", "write"],
                    },
                    {
                      name: "Analytics Read Key",
                      created: "Mar 22, 2024",
                      lastUsed: "1 day ago",
                      scopes: ["read"],
                    },
                  ].map((key) => (
                    <div
                      key={key.name}
                      className="flex items-center justify-between p-3.5 border border-[var(--color-border)] rounded-[var(--radius-md)]"
                    >
                      <div className="flex items-center gap-3">
                        <Key size={14} className="text-[var(--color-text-tertiary)] shrink-0" />
                        <div>
                          <div className="text-[12px] font-medium text-[var(--color-text)]">
                            {key.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-[var(--color-text-tertiary)]">
                              Created {key.created} · Last used {key.lastUsed}
                            </span>
                            {key.scopes.map((s) => (
                              <span
                                key={s}
                                className="text-[9px] uppercase px-1.5 py-0.5 bg-[var(--color-border-subtle)] rounded text-[var(--color-text-tertiary)] font-semibold"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button variant="danger" size="xs" icon={<Trash2 size={11} />}>
                        Revoke
                      </Button>
                    </div>
                  ))}
                  <Button variant="secondary" size="sm" icon={<Plus size={13} />}>
                    Generate New Key
                  </Button>
                </div>
              </Card>

              <Card>
                <h3 className="text-[14px] font-semibold text-[var(--color-text)] mb-4">
                  Audit Log
                </h3>
                <div className="space-y-2">
                  {[
                    {
                      action: "Invoice INV-2024-0847 marked overdue",
                      user: "System",
                      time: "2 hours ago",
                    },
                    {
                      action: "Payroll Run PAY-2024-11 processed",
                      user: "Jordan Avery",
                      time: "1 day ago",
                    },
                    {
                      action: "User Marcus Chen role updated to Manager",
                      user: "Jordan Avery",
                      time: "3 days ago",
                    },
                    {
                      action: "Bank account SVB Operating connected",
                      user: "Jordan Avery",
                      time: "5 days ago",
                    },
                    {
                      action: "Invoice INV-2024-0845 paid in full",
                      user: "System (Bank sync)",
                      time: "6 days ago",
                    },
                  ].map((log) => (
                    <div
                      key={log.action}
                      className="flex items-center justify-between py-2 border-b border-[var(--color-border-subtle)] last:border-0"
                    >
                      <div>
                        <span className="text-[12px] text-[var(--color-text)]">{log.action}</span>
                        <span className="text-[11px] text-[var(--color-text-tertiary)] ml-2">
                          by {log.user}
                        </span>
                      </div>
                      <span className="text-[11px] text-[var(--color-text-tertiary)] shrink-0">
                        {log.time}
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="mt-3">
                  View full audit log
                </Button>
              </Card>
            </div>
          )}

          {activeSection === "notifications" && (
            <Card>
              <h3 className="text-[14px] font-semibold text-[var(--color-text)] mb-4">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {[
                  {
                    section: "Invoices & Payments",
                    items: [
                      "Invoice sent",
                      "Invoice viewed",
                      "Invoice overdue",
                      "Payment received",
                    ],
                  },
                  {
                    section: "Banking & Cash",
                    items: [
                      "New transaction synced",
                      "Low cash alert",
                      "Reconciliation required",
                    ],
                  },
                  {
                    section: "Payroll",
                    items: ["Payroll scheduled", "Payroll processed", "Direct deposit sent"],
                  },
                  {
                    section: "AI Insights",
                    items: ["New AI insight", "Anomaly detected", "Monthly summary ready"],
                  },
                ].map((group) => (
                  <div key={group.section}>
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-2">
                      {group.section}
                    </h4>
                    <div className="space-y-2">
                      {group.items.map((item) => (
                        <div key={item} className="flex items-center justify-between py-1.5">
                          <span className="text-[13px] text-[var(--color-text)]">{item}</span>
                          <div className="flex items-center gap-3">
                            {["Email", "Push", "Slack"].map((channel) => (
                              <label key={channel} className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  defaultChecked={channel !== "Slack"}
                                  className="rounded accent-[var(--color-accent)]"
                                />
                                <span className="text-[11px] text-[var(--color-text-tertiary)]">
                                  {channel}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="primary" size="sm">
                  Save Preferences
                </Button>
              </div>
            </Card>
          )}

          {activeSection === "integrations" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  name: "Slack",
                  desc: "Get notifications and alerts in Slack channels",
                  connected: true,
                  category: "Communication",
                },
                {
                  name: "Stripe",
                  desc: "Sync payment data and reconcile automatically",
                  connected: true,
                  category: "Payments",
                },
                {
                  name: "Gusto",
                  desc: "Sync payroll data and employee information",
                  connected: false,
                  category: "HR & Payroll",
                },
                {
                  name: "Zapier",
                  desc: "Connect to 5,000+ apps with no-code workflows",
                  connected: false,
                  category: "Automation",
                },
                {
                  name: "QuickBooks Export",
                  desc: "Export data compatible with QuickBooks format",
                  connected: false,
                  category: "Accounting",
                },
                {
                  name: "Salesforce",
                  desc: "Sync customers, deals, and invoice data",
                  connected: true,
                  category: "CRM",
                },
                {
                  name: "HubSpot",
                  desc: "Sync contacts and deal pipeline",
                  connected: false,
                  category: "CRM",
                },
                {
                  name: "Plaid",
                  desc: "Connect and sync bank accounts in real-time",
                  connected: true,
                  category: "Banking",
                },
              ].map((integration) => (
                <Card key={integration.name} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--color-border-subtle)] flex items-center justify-center shrink-0">
                    <span className="text-[14px] font-bold text-[var(--color-text-secondary)]">
                      {integration.name[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[13px] font-semibold text-[var(--color-text)]">
                          {integration.name}
                        </p>
                        <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">
                          {integration.desc}
                        </p>
                        <span className="mt-1.5 inline-block text-[9px] uppercase tracking-wider font-semibold text-[var(--color-text-tertiary)] px-1.5 py-0.5 bg-[var(--color-border-subtle)] rounded">
                          {integration.category}
                        </span>
                      </div>
                      <Button
                        variant={integration.connected ? "secondary" : "accent"}
                        size="xs"
                      >
                        {integration.connected ? "Manage" : "Connect"}
                      </Button>
                    </div>
                    {integration.connected && (
                      <div className="flex items-center gap-1 mt-2">
                        <Check size={10} className="text-[var(--color-success)]" />
                        <span className="text-[10px] text-[var(--color-success)]">
                          Connected · Syncing
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeSection === "localization" && (
            <Card>
              <h3 className="text-[14px] font-semibold text-[var(--color-text)] mb-4">
                Localization Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: "Default Language",
                    options: [
                      "English (US)",
                      "English (UK)",
                      "Spanish",
                      "French",
                      "German",
                      "Japanese",
                      "Chinese",
                    ],
                  },
                  {
                    label: "Base Currency",
                    options: [
                      "USD – US Dollar",
                      "EUR – Euro",
                      "GBP – British Pound",
                      "JPY – Japanese Yen",
                      "CAD – Canadian Dollar",
                    ],
                  },
                  {
                    label: "Date Format",
                    options: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"],
                  },
                  {
                    label: "Number Format",
                    options: ["1,000.00", "1.000,00", "1 000,00"],
                  },
                  {
                    label: "Fiscal Year Start",
                    options: ["January", "April", "July", "October"],
                  },
                  {
                    label: "First Day of Week",
                    options: ["Sunday", "Monday"],
                  },
                ].map((field) => (
                  <div key={field.label} className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-[var(--color-text)]">
                      {field.label}
                    </label>
                    <select className="h-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] px-3 focus:outline-none focus:border-[var(--color-accent)] transition-base cursor-pointer">
                      {field.options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="primary" size="sm" icon={<Save size={13} />}>
                  Save
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
