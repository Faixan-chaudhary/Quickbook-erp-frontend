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
  Building2,
  TrendingUp,
  DollarSign,
  ChevronRight,
  Edit2,
  Trash2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useVendors } from "@/hooks/useVendors";
import type {
  QBOVendor,
  CreateVendorInput,
  UpdateVendorInput,
} from "@/types/vendor";
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

export default function Vendors() {
  const {
    vendors: liveVendors,
    isLoading,
    error,
    refresh,
    createVendor,
    updateVendor,
    deleteVendor,
  } = useVendors();

  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState<"all" | "active" | "balance" | "inactive">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [activeVendor, setActiveVendor] = useState<QBOVendor | null>(null);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<QBOVendor | null>(null);
  const [deletingVendor, setDeletingVendor] = useState<QBOVendor | null>(null);

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
    AcctNum: string;
    Balance: string;
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
    AcctNum: "",
    Balance: "0",
    Active: true,
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Metrics
  const totalVendors = liveVendors.length;
  const activeCount = liveVendors.filter((v) => v.Active !== false).length;
  const totalAP = liveVendors.reduce((s, v) => s + (v.Balance || 0), 0);
  const vendorsWithBalance = liveVendors.filter((v) => (v.Balance || 0) > 0).length;

  // Filtered List
  const filtered = useMemo(() => {
    return liveVendors.filter((v) => {
      if (selectedTab === "active" && v.Active === false) return false;
      if (selectedTab === "inactive" && v.Active !== false) return false;
      if (selectedTab === "balance" && (v.Balance || 0) <= 0) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const nameMatch = v.DisplayName?.toLowerCase().includes(q);
        const compMatch = v.CompanyName?.toLowerCase().includes(q);
        const emailMatch = v.PrimaryEmailAddr?.Address?.toLowerCase().includes(q);
        const cityMatch = v.BillAddr?.City?.toLowerCase().includes(q);
        const numMatch = v.AcctNum?.toLowerCase().includes(q);
        return nameMatch || compMatch || emailMatch || cityMatch || numMatch;
      }

      return true;
    });
  }, [liveVendors, selectedTab, search]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openCreateModal = () => {
    setEditingVendor(null);
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
      AcctNum: "",
      Balance: "0",
      Active: true,
    });
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (v: QBOVendor) => {
    setEditingVendor(v);
    setFormData({
      DisplayName: v.DisplayName || "",
      GivenName: v.GivenName || "",
      FamilyName: v.FamilyName || "",
      CompanyName: v.CompanyName || "",
      Email: v.PrimaryEmailAddr?.Address || "",
      Phone: v.PrimaryPhone?.FreeFormNumber || "",
      City: v.BillAddr?.City || "",
      Country: v.BillAddr?.Country || "United States",
      Line1: v.BillAddr?.Line1 || "",
      AcctNum: v.AcctNum || "",
      Balance: String(v.Balance || 0),
      Active: v.Active !== false,
    });
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  const handleSaveVendor = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.DisplayName.trim()) {
      setFormError("Display Name is required.");
      return;
    }

    try {
      setFormLoading(true);
      setFormError(null);

      if (editingVendor && editingVendor.Id) {
        // Update
        await updateVendor({
          Id: editingVendor.Id,
          SyncToken: editingVendor.SyncToken || "0",
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
          AcctNum: formData.AcctNum.trim() || undefined,
          Balance: parseFloat(formData.Balance) || 0,
          Active: formData.Active,
        });
      } else {
        // Create
        await createVendor({
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
          AcctNum: formData.AcctNum.trim() || undefined,
          Balance: parseFloat(formData.Balance) || 0,
          Active: formData.Active,
        });
      }

      setIsCreateModalOpen(false);
      await refresh();
    } catch (err: any) {
      setFormError(err.message || "Failed to save vendor");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteVendor = async () => {
    if (!deletingVendor?.Id) return;
    try {
      setFormLoading(true);
      await deleteVendor(deletingVendor.Id);
      setDeletingVendor(null);
      if (activeVendor?.Id === deletingVendor.Id) {
        setActiveVendor(null);
      }
      await refresh();
    } catch (err: any) {
      alert(err.message || "Failed to deactivate vendor");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Vendors"
        subtitle="Manage supplier records, payables (A/P), and business vendors."
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
              Add Vendor
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
            Total Vendors
          </span>
          <span className="text-[20px] font-semibold tabnum text-[var(--color-text)]">
            {totalVendors}
          </span>
          <span className="text-[11px] text-[var(--color-text-tertiary)]">
            {activeCount} active
          </span>
        </Card>

        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
            Outstanding Payables (A/P)
          </span>
          <span className="text-[20px] font-semibold tabnum text-[var(--color-danger)]">
            {fmtCurrency(totalAP)}
          </span>
        </Card>

        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
            Open Payables Vendors
          </span>
          <span className="text-[20px] font-semibold tabnum text-[var(--color-warning)]">
            {vendorsWithBalance}
          </span>
        </Card>

        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
            Inactive / Archived
          </span>
          <span className="text-[20px] font-semibold tabnum text-[var(--color-text-tertiary)]">
            {liveVendors.filter((v) => v.Active === false).length}
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
                placeholder="Search by vendor, email, acct #..."
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
              {filtered.length} {filtered.length === 1 ? "vendor" : "vendors"}
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

          {/* Table Content */}
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center gap-3 text-[var(--color-text-secondary)]">
              <RefreshCw size={24} className="animate-spin text-[var(--color-accent)]" />
              <span className="text-[13px]">Loading QuickBooks vendors...</span>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Building2 size={24} />}
              title="No vendors found"
              description={
                search
                  ? `No vendors matched "${search}".`
                  : "Start by adding your first supplier / vendor."
              }
              action={
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus size={13} />}
                  onClick={openCreateModal}
                >
                  Add Vendor
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
                            : setSelected(new Set(filtered.map((v) => v.Id || v.DisplayName)))
                        }
                        className="rounded accent-[var(--color-accent)]"
                      />
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      Vendor / Company
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      Account #
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      Email
                    </th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      Phone / City
                    </th>
                    <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                      Open AP Balance
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
                  {filtered.map((vendor) => {
                    const id = vendor.Id || vendor.DisplayName;
                    const isSelected = selected.has(id);
                    const isActive = vendor.Active !== false;
                    const balance = vendor.Balance || 0;

                    return (
                      <tr
                        key={id}
                        onClick={() =>
                          setActiveVendor(activeVendor?.Id === vendor.Id ? null : vendor)
                        }
                        className={`border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] cursor-pointer transition-base group ${
                          isSelected ? "bg-[var(--color-accent-subtle)]" : ""
                        } ${activeVendor?.Id === vendor.Id ? "bg-[var(--color-border-subtle)]" : ""}`}
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
                            <Avatar name={vendor.DisplayName} size="sm" />
                            <div>
                              <div className="text-[13px] font-medium text-[var(--color-text)]">
                                {vendor.DisplayName}
                              </div>
                              {vendor.CompanyName && (
                                <div className="text-[11px] text-[var(--color-text-tertiary)]">
                                  {vendor.CompanyName}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[12px] font-mono text-[var(--color-text-secondary)]">
                          {vendor.AcctNum || "—"}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-[var(--color-text-secondary)]">
                          {vendor.PrimaryEmailAddr?.Address || "—"}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-[var(--color-text-secondary)]">
                          {vendor.BillAddr?.City ? (
                            <div className="flex items-center gap-1">
                              <MapPin size={10} className="text-[var(--color-text-tertiary)]" />
                              <span>{vendor.BillAddr.City}</span>
                            </div>
                          ) : vendor.PrimaryPhone?.FreeFormNumber ? (
                            <div className="flex items-center gap-1">
                              <Phone size={10} className="text-[var(--color-text-tertiary)]" />
                              <span>{vendor.PrimaryPhone.FreeFormNumber}</span>
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`text-[13px] font-semibold tabnum ${
                              balance > 0 ? "text-[var(--color-danger)]" : "text-[var(--color-text-tertiary)]"
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
                                openEditModal(vendor);
                              }}
                              className="p-1.5 rounded hover:bg-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-base cursor-pointer"
                              title="Edit Vendor"
                            >
                              <Edit2 size={13} />
                            </button>
                            {isActive && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletingVendor(vendor);
                                }}
                                className="p-1.5 rounded hover:bg-[var(--color-danger-bg)] text-[var(--color-danger)] transition-base cursor-pointer"
                                title="Deactivate Vendor"
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

        {/* Vendor Detail Drawer */}
        {activeVendor && (
          <Card className="w-80 shrink-0 flex flex-col gap-4 sticky top-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar name={activeVendor.DisplayName} size="md" />
                <div>
                  <h3 className="text-[14px] font-semibold text-[var(--color-text)]">
                    {activeVendor.DisplayName}
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-tertiary)]">
                    ID: {activeVendor.Id || "—"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setActiveVendor(null)}
              >
                ✕
              </Button>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-border)] text-[12px]">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">Outstanding AP:</span>
                <span className="font-semibold text-[var(--color-danger)]">
                  {fmtCurrency(activeVendor.Balance || 0)}
                </span>
              </div>
              {activeVendor.CompanyName && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Company:</span>
                  <span className="text-[var(--color-text)]">{activeVendor.CompanyName}</span>
                </div>
              )}
              {activeVendor.AcctNum && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Account #:</span>
                  <span className="text-[var(--color-text)] font-mono">{activeVendor.AcctNum}</span>
                </div>
              )}
              {activeVendor.PrimaryEmailAddr?.Address && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Email:</span>
                  <span className="text-[var(--color-text)] truncate max-w-[150px]">
                    {activeVendor.PrimaryEmailAddr.Address}
                  </span>
                </div>
              )}
              {activeVendor.PrimaryPhone?.FreeFormNumber && (
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-secondary)]">Phone:</span>
                  <span className="text-[var(--color-text)]">
                    {activeVendor.PrimaryPhone.FreeFormNumber}
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
                onClick={() => openEditModal(activeVendor)}
              >
                Edit
              </Button>
              {activeVendor.Active !== false && (
                <Button
                  variant="danger"
                  size="sm"
                  full
                  icon={<Trash2 size={12} />}
                  onClick={() => setDeletingVendor(activeVendor)}
                >
                  Deactivate
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* ─── Add / Edit Vendor Modal ─── */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => !formLoading && setIsCreateModalOpen(false)}
        title={editingVendor ? "Edit Vendor" : "Add New Vendor"}
        description="QuickBooks Online supplier record and payable profile."
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
              onClick={() => handleSaveVendor()}
              disabled={formLoading}
              icon={formLoading ? <RefreshCw size={13} className="animate-spin" /> : undefined}
            >
              {formLoading
                ? "Saving..."
                : editingVendor
                ? "Update Vendor"
                : "Create Vendor"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveVendor} className="flex flex-col gap-4 py-2">
          {formError && (
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[var(--color-danger-text)] text-[12px] flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Display Name / Supplier Name"
              required
              placeholder="e.g. Amazon Web Services, Office Depot"
              value={formData.DisplayName}
              onChange={(e) => setFormData({ ...formData, DisplayName: e.target.value })}
            />

            <Input
              label="Company Name (Optional)"
              placeholder="e.g. AWS Inc."
              value={formData.CompanyName}
              onChange={(e) => setFormData({ ...formData, CompanyName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Contact First Name"
              placeholder="e.g. Jane"
              value={formData.GivenName}
              onChange={(e) => setFormData({ ...formData, GivenName: e.target.value })}
            />

            <Input
              label="Contact Last Name"
              placeholder="e.g. Smith"
              value={formData.FamilyName}
              onChange={(e) => setFormData({ ...formData, FamilyName: e.target.value })}
            />

            <Input
              label="Account Number (Acct #)"
              placeholder="e.g. V-1002"
              value={formData.AcctNum}
              onChange={(e) => setFormData({ ...formData, AcctNum: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="billing@supplier.com"
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
              placeholder="456 Vendor Blvd"
              value={formData.Line1}
              onChange={(e) => setFormData({ ...formData, Line1: e.target.value })}
            />

            <Input
              label="City"
              placeholder="Seattle"
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
            label="Initial Outstanding Balance (A/P)"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.Balance}
            onChange={(e) => setFormData({ ...formData, Balance: e.target.value })}
          />

          {editingVendor && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="vendorActiveToggle"
                checked={formData.Active}
                onChange={(e) => setFormData({ ...formData, Active: e.target.checked })}
                className="rounded accent-[var(--color-accent)]"
              />
              <label
                htmlFor="vendorActiveToggle"
                className="text-[12px] font-medium text-[var(--color-text)] cursor-pointer select-none"
              >
                Vendor is Active
              </label>
            </div>
          )}
        </form>
      </Modal>

      {/* ─── Deactivate Confirmation Modal ─── */}
      <Modal
        open={Boolean(deletingVendor)}
        onClose={() => setDeletingVendor(null)}
        title="Deactivate Vendor"
        description="In QuickBooks Online, deleting a vendor marks them Active = false so existing bills and expenses remain linked."
        width="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeletingVendor(null)}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteVendor}
              disabled={formLoading}
              icon={formLoading ? <RefreshCw size={13} className="animate-spin" /> : undefined}
            >
              {formLoading ? "Deactivating..." : "Deactivate Vendor"}
            </Button>
          </div>
        }
      >
        <div className="py-2 text-[13px] text-[var(--color-text)]">
          Are you sure you want to deactivate vendor{" "}
          <span className="font-semibold text-[var(--color-danger)]">
            {deletingVendor?.DisplayName}
          </span>
          ?
        </div>
      </Modal>
    </div>
  );
}
