"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Download,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Users,
  TrendingUp,
  DollarSign,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
  AlertCircle,
  Building,
  UserCheck,
} from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import type {
  QBOCustomer,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/types/customer";
import {
  Button,
  Badge,
  Card,
  Input,
  Textarea,
  Modal,
  SectionHeader,
  Pagination,
  fmtCurrency,
  fmtDate,
  statusBadge,
  Avatar,
  EmptyState,
} from "../components/ui";

export default function Customers() {
  const {
    customers: liveCustomers,
    isLoading,
    error,
    refresh,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  } = useCustomers();

  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "active" | "balance" | "inactive">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [activeCustomer, setActiveCustomer] = useState<QBOCustomer | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<QBOCustomer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<QBOCustomer | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    DisplayName: string;
    GivenName: string;
    FamilyName: string;
    CompanyName: string;
    Email: string;
    Phone: string;
    City: string;
    Country: string;
    Line1: string;
    Balance: string;
    Notes: string;
    Active: boolean;
  }>({
    DisplayName: "",
    GivenName: "",
    FamilyName: "",
    CompanyName: "",
    Email: "",
    Phone: "",
    City: "",
    Country: "United States",
    Line1: "",
    Balance: "0",
    Notes: "",
    Active: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Metrics
  const totalCustomers = liveCustomers.length;
  const activeCount = liveCustomers.filter((c) => c.Active !== false).length;
  const totalAR = liveCustomers.reduce((s, c) => s + (c.Balance || 0), 0);
  const customersWithBalance = liveCustomers.filter((c) => (c.Balance || 0) > 0).length;

  // Filtered List
  const filtered = useMemo(() => {
    return liveCustomers.filter((c) => {
      // Tab filter
      if (selectedTab === "active" && c.Active === false) return false;
      if (selectedTab === "inactive" && c.Active !== false) return false;
      if (selectedTab === "balance" && (c.Balance || 0) <= 0) return false;

      // Search match
      if (search.trim()) {
        const q = search.toLowerCase();
        const nameMatch = c.DisplayName?.toLowerCase().includes(q);
        const compMatch = c.CompanyName?.toLowerCase().includes(q);
        const emailMatch = c.PrimaryEmailAddr?.Address?.toLowerCase().includes(q);
        const cityMatch = c.BillAddr?.City?.toLowerCase().includes(q);
        const phoneMatch = c.PrimaryPhone?.FreeFormNumber?.includes(q);
        return nameMatch || compMatch || emailMatch || cityMatch || phoneMatch;
      }

      return true;
    });
  }, [liveCustomers, selectedTab, search]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openCreateModal = () => {
    setEditingCustomer(null);
    setFormData({
      DisplayName: "",
      GivenName: "",
      FamilyName: "",
      CompanyName: "",
      Email: "",
      Phone: "",
      City: "",
      Country: "United States",
      Line1: "",
      Balance: "0",
      Notes: "",
      Active: true,
    });
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (c: QBOCustomer) => {
    setEditingCustomer(c);
    setFormData({
      DisplayName: c.DisplayName || "",
      GivenName: c.GivenName || "",
      FamilyName: c.FamilyName || "",
      CompanyName: c.CompanyName || "",
      Email: c.PrimaryEmailAddr?.Address || "",
      Phone: c.PrimaryPhone?.FreeFormNumber || "",
      City: c.BillAddr?.City || "",
      Country: c.BillAddr?.Country || "United States",
      Line1: c.BillAddr?.Line1 || "",
      Balance: String(c.Balance || 0),
      Notes: c.Notes || "",
      Active: c.Active !== false,
    });
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  const handleSaveCustomer = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.DisplayName.trim()) {
      setFormError("Display Name is required.");
      return;
    }

    try {
      setFormLoading(true);
      setFormError(null);

      if (editingCustomer && editingCustomer.Id) {
        // Update
        await updateCustomer({
          Id: editingCustomer.Id,
          SyncToken: editingCustomer.SyncToken || "0",
          DisplayName: formData.DisplayName.trim(),
          GivenName: formData.GivenName.trim() || undefined,
          FamilyName: formData.FamilyName.trim() || undefined,
          CompanyName: formData.CompanyName.trim() || undefined,
          PrimaryEmailAddr: formData.Email ? { Address: formData.Email.trim() } : undefined,
          PrimaryPhone: formData.Phone ? { FreeFormNumber: formData.Phone.trim() } : undefined,
          BillAddr: {
            Line1: formData.Line1.trim() || undefined,
            City: formData.City.trim() || undefined,
            Country: formData.Country.trim() || undefined,
          },
          Balance: parseFloat(formData.Balance) || 0,
          Notes: formData.Notes.trim() || undefined,
          Active: formData.Active,
        });
      } else {
        // Create
        await createCustomer({
          DisplayName: formData.DisplayName.trim(),
          GivenName: formData.GivenName.trim() || undefined,
          FamilyName: formData.FamilyName.trim() || undefined,
          CompanyName: formData.CompanyName.trim() || undefined,
          PrimaryEmailAddr: formData.Email ? { Address: formData.Email.trim() } : undefined,
          PrimaryPhone: formData.Phone ? { FreeFormNumber: formData.Phone.trim() } : undefined,
          BillAddr: {
            Line1: formData.Line1.trim() || undefined,
            City: formData.City.trim() || undefined,
            Country: formData.Country.trim() || undefined,
          },
          Balance: parseFloat(formData.Balance) || 0,
          Notes: formData.Notes.trim() || undefined,
          Active: formData.Active,
        });
      }

      setIsCreateModalOpen(false);
      await refresh();
    } catch (err: any) {
      setFormError(err.message || "Failed to save customer");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!deletingCustomer?.Id) return;
    try {
      setFormLoading(true);
      await deleteCustomer(deletingCustomer.Id);
      setDeletingCustomer(null);
      if (activeCustomer?.Id === deletingCustomer.Id) {
        setActiveCustomer(null);
      }
      await refresh();
    } catch (err: any) {
      alert(err.message || "Failed to deactivate customer");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Customers"
        subtitle="QuickBooks customer accounts, receivables, and contact directory."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw size={13} className={isLoading ? "animate-spin" : ""} />}
              onClick={() => refresh()}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={13} />}
              onClick={openCreateModal}
            >
              Add Customer
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
            Total Customers
          </span>
          <span className="text-[20px] font-semibold tabnum text-[var(--color-text)]">
            {totalCustomers}
          </span>
          <span className="text-[11px] text-[var(--color-text-tertiary)]">
            {activeCount} active
          </span>
        </Card>

        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
            Total Receivables (A/R)
          </span>
          <span className="text-[20px] font-semibold tabnum text-[var(--color-text)]">
            {fmtCurrency(totalAR)}
          </span>
        </Card>

        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
            Open Balance Accounts
          </span>
          <span className="text-[20px] font-semibold tabnum text-[var(--color-warning)]">
            {customersWithBalance}
          </span>
        </Card>

        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
            Inactive / Archived
          </span>
          <span className="text-[20px] font-semibold tabnum text-[var(--color-text-tertiary)]">
            {liveCustomers.filter((c) => c.Active === false).length}
          </span>
        </Card>
      </div>

      <div className="flex gap-4 items-start">
        {/* Main Table Card */}
        <Card padding="none" className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 px-5 py-3 border-b border-[var(--color-border)]">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, city..."
                className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-[12px]">
              {[
                { id: "all", label: "All" },
                { id: "active", label: "Active" },
                { id: "balance", label: "With Balance" },
                { id: "inactive", label: "Inactive" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`px-2.5 py-1 rounded-[var(--radius-md)] transition-base font-medium cursor-pointer ${
                    selectedTab === tab.id
                      ? "bg-[var(--color-accent)] text-white"
                      : "bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-border-subtle)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">
              {filtered.length} {filtered.length === 1 ? "customer" : "customers"}
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="m-4 p-3 rounded-[var(--radius-md)] bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[var(--color-danger-text)] text-[12px] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
              <Button size="xs" variant="secondary" onClick={() => refresh()}>
                Retry
              </Button>
            </div>
          )}

          {/* Content */}
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3 text-[var(--color-text-secondary)]">
              <RefreshCw size={24} className="animate-spin text-[var(--color-accent)]" />
              <span className="text-[13px]">Loading customers...</span>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Users size={24} />}
              title="No customers found"
              description={
                search
                  ? `No customers match "${search}".`
                  : "Start by adding your first customer to QuickBooks."
              }
              action={
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus size={13} />}
                  onClick={openCreateModal}
                >
                  Add Customer
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                    <th className="w-10 px-4 py-2.5">
                      <input
                        type="checkbox"
                        checked={selected.size > 0 && selected.size === filtered.length}
                        onChange={() =>
                          selected.size === filtered.length
                            ? setSelected(new Set())
                            : setSelected(new Set(filtered.map((c) => c.Id || c.DisplayName)))
                        }
                        className="rounded accent-[var(--color-accent)]"
                      />
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      Customer / Company
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      Email
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      Phone / Location
                    </th>
                    <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      Open Balance
                    </th>
                    <th className="px-4 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      Status
                    </th>
                    <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((customer) => {
                    const id = customer.Id || customer.DisplayName;
                    const isSelected = selected.has(id);
                    const isActive = customer.Active !== false;
                    const balance = customer.Balance || 0;

                    return (
                      <tr
                        key={id}
                        onClick={() =>
                          setActiveCustomer(activeCustomer?.Id === customer.Id ? null : customer)
                        }
                        className={`border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] cursor-pointer transition-base group ${
                          isSelected ? "bg-[var(--color-accent-subtle)]" : ""
                        } ${activeCustomer?.Id === customer.Id ? "bg-[var(--color-border-subtle)]" : ""}`}
                      >
                        <td
                          className="w-10 px-4 py-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelect(id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(id)}
                            className="rounded accent-[var(--color-accent)]"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={customer.DisplayName} size="sm" />
                            <div>
                              <div className="text-[13px] font-medium text-[var(--color-text)]">
                                {customer.DisplayName}
                              </div>
                              {customer.CompanyName && (
                                <div className="text-[11px] text-[var(--color-text-tertiary)] flex items-center gap-1">
                                  <Building size={10} />
                                  {customer.CompanyName}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-[var(--color-text-secondary)]">
                          {customer.PrimaryEmailAddr?.Address || "—"}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-[var(--color-text-secondary)]">
                          {customer.BillAddr?.City ? (
                            <div className="flex items-center gap-1">
                              <MapPin size={10} className="text-[var(--color-text-tertiary)]" />
                              <span>
                                {customer.BillAddr.City}
                                {customer.BillAddr.Country ? `, ${customer.BillAddr.Country}` : ""}
                              </span>
                            </div>
                          ) : customer.PrimaryPhone?.FreeFormNumber ? (
                            <div className="flex items-center gap-1">
                              <Phone size={10} className="text-[var(--color-text-tertiary)]" />
                              <span>{customer.PrimaryPhone.FreeFormNumber}</span>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`text-[13px] font-semibold tabnum ${
                              balance > 0 ? "text-[var(--color-text)]" : "text-[var(--color-text-tertiary)]"
                            }`}
                          >
                            {fmtCurrency(balance)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={isActive ? "success" : "neutral"} size="sm" dot>
                            {isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(customer);
                              }}
                              className="p-1.5 rounded hover:bg-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-base cursor-pointer"
                              title="Edit Customer"
                            >
                              <Edit2 size={13} />
                            </button>
                            {isActive && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingCustomer(customer);
                                }}
                                className="p-1.5 rounded hover:bg-[var(--color-danger-bg)] text-[var(--color-danger)] transition-base cursor-pointer"
                                title="Deactivate Customer"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Customer Detail Drawer */}
        {activeCustomer && (
          <Card className="w-80 shrink-0 flex flex-col gap-4 sticky top-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar name={activeCustomer.DisplayName} size="md" />
                <div>
                  <h3 className="text-[14px] font-semibold text-[var(--color-text)]">
                    {activeCustomer.DisplayName}
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-tertiary)]">
                    ID: {activeCustomer.Id || "—"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setActiveCustomer(null)}
              >
                ✕
              </Button>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-border)] text-[12px]">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Open Balance:</span>
                <span className="font-semibold text-[var(--color-text)]">
                  {fmtCurrency(activeCustomer.Balance || 0)}
                </span>
              </div>
              {activeCustomer.CompanyName && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Company:</span>
                  <span className="text-[var(--color-text)]">{activeCustomer.CompanyName}</span>
                </div>
              )}
              {activeCustomer.PrimaryEmailAddr?.Address && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Email:</span>
                  <span className="text-[var(--color-text)] truncate max-w-[150px]">
                    {activeCustomer.PrimaryEmailAddr.Address}
                  </span>
                </div>
              )}
              {activeCustomer.PrimaryPhone?.FreeFormNumber && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Phone:</span>
                  <span className="text-[var(--color-text)]">
                    {activeCustomer.PrimaryPhone.FreeFormNumber}
                  </span>
                </div>
              )}
              {activeCustomer.BillAddr?.City && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">City:</span>
                  <span className="text-[var(--color-text)]">
                    {activeCustomer.BillAddr.City}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-[var(--color-border)]">
              <Button
                variant="secondary"
                size="sm"
                full
                icon={<Edit2 size={12} />}
                onClick={() => openEditModal(activeCustomer)}
              >
                Edit
              </Button>
              {activeCustomer.Active !== false && (
                <Button
                  variant="danger"
                  size="sm"
                  full
                  icon={<Trash2 size={12} />}
                  onClick={() => setDeletingCustomer(activeCustomer)}
                >
                  Deactivate
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* ─── Add / Edit Customer Modal ─── */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => !formLoading && setIsCreateModalOpen(false)}
        title={editingCustomer ? "Edit Customer" : "Add New Customer"}
        description="QuickBooks Online customer profile and billing configuration."
        width="lg"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSaveCustomer()}
              disabled={formLoading}
              icon={formLoading ? <RefreshCw size={13} className="animate-spin" /> : undefined}
            >
              {formLoading
                ? "Saving..."
                : editingCustomer
                ? "Update Customer"
                : "Create Customer"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveCustomer} className="flex flex-col gap-4 py-2">
          {formError && (
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[var(--color-danger-text)] text-[12px] flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Display Name / Contact Name"
              required
              placeholder="e.g. Acme Corp / John Doe"
              value={formData.DisplayName}
              onChange={(e) => setFormData({ ...formData, DisplayName: e.target.value })}
            />

            <Input
              label="Company Name (Optional)"
              placeholder="e.g. Acme Holdings Inc."
              value={formData.CompanyName}
              onChange={(e) => setFormData({ ...formData, CompanyName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="e.g. John"
              value={formData.GivenName}
              onChange={(e) => setFormData({ ...formData, GivenName: e.target.value })}
            />

            <Input
              label="Last Name"
              placeholder="e.g. Doe"
              value={formData.FamilyName}
              onChange={(e) => setFormData({ ...formData, FamilyName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="billing@customer.com"
              value={formData.Email}
              onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
            />

            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              value={formData.Phone}
              onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Street Address"
              placeholder="123 Business Way"
              value={formData.Line1}
              onChange={(e) => setFormData({ ...formData, Line1: e.target.value })}
            />

            <Input
              label="City"
              placeholder="New York"
              value={formData.City}
              onChange={(e) => setFormData({ ...formData, City: e.target.value })}
            />

            <Input
              label="Country"
              placeholder="United States"
              value={formData.Country}
              onChange={(e) => setFormData({ ...formData, Country: e.target.value })}
            />
          </div>

          <Input
            label="Opening Balance"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.Balance}
            onChange={(e) => setFormData({ ...formData, Balance: e.target.value })}
          />

          <Textarea
            label="Internal Notes"
            placeholder="Special customer terms, credit limit notes..."
            value={formData.Notes}
            onChange={(e) => setFormData({ ...formData, Notes: e.target.value })}
          />

          {editingCustomer && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="custActiveToggle"
                checked={formData.Active}
                onChange={(e) => setFormData({ ...formData, Active: e.target.checked })}
                className="rounded accent-[var(--color-accent)]"
              />
              <label
                htmlFor="custActiveToggle"
                className="text-[12px] font-medium text-[var(--color-text)] cursor-pointer select-none"
              >
                Customer is Active
              </label>
            </div>
          )}
        </form>
      </Modal>

      {/* ─── Deactivate Confirmation Modal ─── */}
      <Modal
        open={Boolean(deletingCustomer)}
        onClose={() => setDeletingCustomer(null)}
        title="Deactivate Customer"
        description="In QuickBooks Online, deleting a customer sets Active = false so past invoices and payments remain preserved."
        width="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeletingCustomer(null)}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteCustomer}
              disabled={formLoading}
              icon={formLoading ? <RefreshCw size={13} className="animate-spin" /> : undefined}
            >
              {formLoading ? "Deactivating..." : "Deactivate Customer"}
            </Button>
          </div>
        }
      >
        <div className="py-2 text-[13px] text-[var(--color-text)]">
          Are you sure you want to deactivate customer{" "}
          <span className="font-semibold text-[var(--color-danger)]">
            {deletingCustomer?.DisplayName}
          </span>
          ?
        </div>
      </Modal>
    </div>
  );
}
