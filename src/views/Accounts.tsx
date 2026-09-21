"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  Landmark,
  Building2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  Code,
  DollarSign,
  Layers,
  ArrowUpRight,
  TrendingDown,
  X,
  Play,
  FileSpreadsheet,
} from "lucide-react";
import { useAccounts } from "@/hooks/useAccounts";
import { accountService } from "@/services/accountService";
import type {
  QBOAccount,
  CreateAccountInput,
  UpdateAccountInput,
} from "@/types/account";
import {
  Button,
  Card,
  Badge,
  Input,
  Select,
  Textarea,
  Modal,
  SectionHeader,
  fmtCurrency,
  EmptyState,
} from "@/components/ui";

const ACCOUNT_TYPES = [
  { value: "Bank", label: "Bank", classification: "Asset" },
  { value: "Accounts Receivable", label: "Accounts Receivable (A/R)", classification: "Asset" },
  { value: "Other Current Asset", label: "Other Current Asset", classification: "Asset" },
  { value: "Fixed Asset", label: "Fixed Asset", classification: "Asset" },
  { value: "Other Asset", label: "Other Asset", classification: "Asset" },
  { value: "Accounts Payable", label: "Accounts Payable (A/P)", classification: "Liability" },
  { value: "Credit Card", label: "Credit Card", classification: "Liability" },
  { value: "Other Current Liability", label: "Other Current Liability", classification: "Liability" },
  { value: "Long Term Liability", label: "Long Term Liability", classification: "Liability" },
  { value: "Equity", label: "Equity", classification: "Equity" },
  { value: "Income", label: "Income", classification: "Revenue" },
  { value: "Cost of Goods Sold", label: "Cost of Goods Sold (COGS)", classification: "Expense" },
  { value: "Expense", label: "Expense", classification: "Expense" },
  { value: "Other Income", label: "Other Income", classification: "Revenue" },
  { value: "Other Expense", label: "Other Expense", classification: "Expense" },
];

const CLASSIFICATIONS = [
  { value: "Asset", label: "Asset" },
  { value: "Liability", label: "Liability" },
  { value: "Equity", label: "Equity" },
  { value: "Revenue", label: "Revenue" },
  { value: "Expense", label: "Expense" },
];

const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "PKR", label: "PKR - Pakistani Rupee" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
];

export default function Accounts() {
  const { accounts, isLoading, error, refresh, createAccount, updateAccount, deleteAccount } =
    useAccounts();

  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [activeOnly, setActiveOnly] = useState(false);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<QBOAccount | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<QBOAccount | null>(null);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<CreateAccountInput>>({
    Name: "",
    AccountType: "Bank",
    Classification: "Asset",
    AccountSubType: "Checking",
    AcctNum: "",
    CurrentBalance: 0,
    Description: "",
    CurrencyRef: { value: "USD", name: "USD" },
    Active: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Query state
  const [queryString, setQueryString] = useState("SELECT * FROM Account");
  const [queryResults, setQueryResults] = useState<QBOAccount[] | null>(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);

  // Metrics
  const metrics = useMemo(() => {
    const total = accounts.length;
    const active = accounts.filter((a) => a.Active !== false).length;
    const assetsBalance = accounts
      .filter((a) => a.Classification === "Asset" || a.AccountType === "Bank")
      .reduce((sum, a) => sum + (a.CurrentBalance || 0), 0);
    const liabilitiesBalance = accounts
      .filter((a) => a.Classification === "Liability" || a.AccountType === "Credit Card")
      .reduce((sum, a) => sum + Math.abs(a.CurrentBalance || 0), 0);

    return { total, active, assetsBalance, liabilitiesBalance };
  }, [accounts]);

  // Filtered Accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      // Active filter
      if (activeOnly && acc.Active === false) return false;

      // Category filter
      if (selectedFilter !== "all") {
        if (selectedFilter === "bank" && acc.AccountType !== "Bank") return false;
        if (selectedFilter === "asset" && acc.Classification !== "Asset" && acc.AccountType !== "Bank") return false;
        if (selectedFilter === "liability" && acc.Classification !== "Liability") return false;
        if (selectedFilter === "equity" && acc.Classification !== "Equity") return false;
        if (selectedFilter === "revenue" && acc.Classification !== "Revenue" && acc.AccountType !== "Income") return false;
        if (selectedFilter === "expense" && acc.Classification !== "Expense" && acc.AccountType !== "Expense") return false;
        if (selectedFilter === "inactive" && acc.Active !== false) return false;
      }

      // Search match
      if (search.trim()) {
        const query = search.toLowerCase();
        const nameMatch = acc.Name.toLowerCase().includes(query);
        const typeMatch = acc.AccountType?.toLowerCase().includes(query);
        const subMatch = acc.AccountSubType?.toLowerCase().includes(query);
        const numMatch = acc.AcctNum?.toLowerCase().includes(query);
        const descMatch = acc.Description?.toLowerCase().includes(query);
        return nameMatch || typeMatch || subMatch || numMatch || descMatch;
      }

      return true;
    });
  }, [accounts, selectedFilter, activeOnly, search]);

  // Open Create Form
  const openCreateModal = () => {
    setEditingAccount(null);
    setFormData({
      Name: "",
      AccountType: "Bank",
      Classification: "Asset",
      AccountSubType: "Checking",
      AcctNum: "",
      CurrentBalance: 0,
      Description: "",
      CurrencyRef: { value: "USD", name: "USD" },
      Active: true,
    });
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  // Open Edit Form
  const openEditModal = (acc: QBOAccount) => {
    setEditingAccount(acc);
    setFormData({
      Name: acc.Name,
      AccountType: acc.AccountType,
      Classification: acc.Classification || "Asset",
      AccountSubType: acc.AccountSubType || "",
      AcctNum: acc.AcctNum || "",
      CurrentBalance: acc.CurrentBalance || 0,
      Description: acc.Description || "",
      CurrencyRef: acc.CurrencyRef || { value: "USD", name: "USD" },
      Active: acc.Active !== false,
    });
    setFormError(null);
    setIsCreateModalOpen(true);
  };

  // Save Account (Create or Update)
  const handleSaveAccount = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.Name?.trim()) {
      setFormError("Account name is required.");
      return;
    }

    try {
      setFormLoading(true);
      setFormError(null);

      if (editingAccount && editingAccount.Id) {
        // Update
        await updateAccount({
          Id: editingAccount.Id,
          SyncToken: editingAccount.SyncToken || "0",
          Name: formData.Name,
          AccountType: formData.AccountType,
          AccountSubType: formData.AccountSubType,
          Classification: formData.Classification,
          AcctNum: formData.AcctNum,
          CurrentBalance: formData.CurrentBalance,
          Description: formData.Description,
          CurrencyRef: formData.CurrencyRef,
          Active: formData.Active,
        });
      } else {
        // Create
        await createAccount({
          Name: formData.Name,
          AccountType: formData.AccountType || "Bank",
          AccountSubType: formData.AccountSubType || "Checking",
          Classification: formData.Classification || "Asset",
          AcctNum: formData.AcctNum,
          CurrentBalance: Number(formData.CurrentBalance) || 0,
          Description: formData.Description,
          CurrencyRef: formData.CurrencyRef,
          Active: formData.Active,
        });
      }

      setIsCreateModalOpen(false);
      await refresh();
    } catch (err: any) {
      setFormError(err.message || "Failed to save account.");
    } finally {
      setFormLoading(false);
    }
  };

  // Confirm Delete
  const handleDeleteAccount = async () => {
    if (!deletingAccount?.Id) return;
    try {
      setFormLoading(true);
      await deleteAccount(deletingAccount.Id);
      setDeletingAccount(null);
      await refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete account");
    } finally {
      setFormLoading(false);
    }
  };

  // Run Query
  const handleExecuteQuery = async () => {
    if (!queryString.trim()) return;
    try {
      setQueryLoading(true);
      setQueryError(null);
      const results = await accountService.queryAccounts(queryString);
      setQueryResults(results);
    } catch (err: any) {
      setQueryError(err.message || "Failed to execute query");
      setQueryResults(null);
    } finally {
      setQueryLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      {/* Header */}
      <SectionHeader
        title="Chart of Accounts"
        subtitle="Manage your ledger, bank accounts, liabilities, and view real-time QuickBooks sync data."
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<Code size={13} />}
              onClick={() => {
                setIsQueryModalOpen(true);
                handleExecuteQuery();
              }}
            >
              QBO Query Explorer
            </Button>
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
              Add Account
            </Button>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
            Total Accounts
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-[20px] font-semibold tabnum text-[var(--color-text)]">
              {metrics.total}
            </span>
            <span className="text-[11px] text-[var(--color-text-tertiary)]">
              {metrics.active} active
            </span>
          </div>
        </Card>

        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
            Total Cash & Assets
          </span>
          <span className="text-[20px] font-semibold tabnum text-[var(--color-success)]">
            {fmtCurrency(metrics.assetsBalance)}
          </span>
        </Card>

        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
            Total Liabilities
          </span>
          <span className="text-[20px] font-semibold tabnum text-[var(--color-danger)]">
            {fmtCurrency(metrics.liabilitiesBalance)}
          </span>
        </Card>

        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">
            Net Ledger Position
          </span>
          <span
            className={`text-[20px] font-semibold tabnum ${
              metrics.assetsBalance - metrics.liabilitiesBalance >= 0
                ? "text-[var(--color-text)]"
                : "text-[var(--color-danger)]"
            }`}
          >
            {fmtCurrency(metrics.assetsBalance - metrics.liabilitiesBalance)}
          </span>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card padding="none" className="flex flex-col">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b border-[var(--color-border)]">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, number, type..."
              className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[12px]">
            {[
              { id: "all", label: "All" },
              { id: "bank", label: "Bank" },
              { id: "asset", label: "Assets" },
              { id: "liability", label: "Liabilities" },
              { id: "equity", label: "Equity" },
              { id: "revenue", label: "Revenue" },
              { id: "expense", label: "Expenses" },
              { id: "inactive", label: "Inactive" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-2.5 py-1 rounded-[var(--radius-md)] transition-base font-medium cursor-pointer ${
                  selectedFilter === tab.id
                    ? "bg-[var(--color-accent)] text-white"
                    : "bg-[var(--color-bg)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-border-subtle)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-[12px] text-[var(--color-text-tertiary)] ml-auto">
            {filteredAccounts.length} {filteredAccounts.length === 1 ? "account" : "accounts"}
          </div>
        </div>

        {/* Error message */}
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
            <span className="text-[13px]">Loading QuickBooks accounts...</span>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <EmptyState
            icon={<FileSpreadsheet size={24} />}
            title="No accounts found"
            description={
              search
                ? `No accounts matched "${search}".`
                : "Your Chart of Accounts is currently empty or loading from QuickBooks."
            }
            action={
              <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={openCreateModal}>
                Create Account
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    Account Name
                  </th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    Account #
                  </th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    Type
                  </th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    Detail Type
                  </th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    Classification
                  </th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)]">
                    Balance
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
                {filteredAccounts.map((acc) => {
                  const isBank = acc.AccountType === "Bank";
                  const isCredit = acc.AccountType === "Credit Card";
                  const isActive = acc.Active !== false;

                  return (
                    <tr
                      key={acc.Id || acc.Name}
                      className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base group"
                    >
                      {/* Name */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 ${
                              isBank
                                ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent)]"
                                : isCredit
                                ? "bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]"
                                : "bg-[var(--color-border-subtle)] text-[var(--color-text-tertiary)]"
                            }`}
                          >
                            {isBank ? (
                              <Landmark size={13} />
                            ) : isCredit ? (
                              <CreditCard size={13} />
                            ) : (
                              <Layers size={13} />
                            )}
                          </div>
                          <div>
                            <div className="text-[13px] font-medium text-[var(--color-text)]">
                              {acc.Name}
                            </div>
                            {acc.Description && (
                              <div className="text-[11px] text-[var(--color-text-tertiary)] truncate max-w-xs">
                                {acc.Description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Number */}
                      <td className="px-4 py-3 text-[12px] font-mono text-[var(--color-text-secondary)]">
                        {acc.AcctNum || "—"}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3 text-[12px] font-medium text-[var(--color-text)]">
                        {acc.AccountType}
                      </td>

                      {/* Detail Type / Subtype */}
                      <td className="px-4 py-3 text-[12px] text-[var(--color-text-secondary)]">
                        {acc.AccountSubType || "—"}
                      </td>

                      {/* Classification */}
                      <td className="px-4 py-3">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">
                          {acc.Classification || "Asset"}
                        </span>
                      </td>

                      {/* Balance */}
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`text-[13px] font-semibold tabnum ${
                            (acc.CurrentBalance || 0) < 0
                              ? "text-[var(--color-danger)]"
                              : "text-[var(--color-text)]"
                          }`}
                        >
                          {fmtCurrency(acc.CurrentBalance || 0)}
                        </span>
                        <div className="text-[10px] text-[var(--color-text-tertiary)] uppercase">
                          {acc.CurrencyRef?.value || "USD"}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant={isActive ? "success" : "neutral"}
                          size="sm"
                          dot
                        >
                          {isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(acc)}
                            className="p-1.5 rounded hover:bg-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-base cursor-pointer"
                            title="Edit Account"
                          >
                            <Edit2 size={13} />
                          </button>
                          {isActive && (
                            <button
                              onClick={() => setDeletingAccount(acc)}
                              className="p-1.5 rounded hover:bg-[var(--color-danger-bg)] text-[var(--color-danger)] transition-base cursor-pointer"
                              title="Soft-Delete / Deactivate"
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

      {/* ─── Create / Edit Account Modal ─── */}
      <Modal
        open={isCreateModalOpen}
        onClose={() => !formLoading && setIsCreateModalOpen(false)}
        title={editingAccount ? "Edit Account" : "Add New Account"}
        description="Configure QuickBooks chart of accounts entity attributes."
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
              onClick={handleSaveAccount}
              disabled={formLoading}
              icon={formLoading ? <RefreshCw size={13} className="animate-spin" /> : undefined}
            >
              {formLoading ? "Saving..." : editingAccount ? "Update Account" : "Create Account"}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveAccount} className="flex flex-col gap-4 py-2">
          {formError && (
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[var(--color-danger-text)] text-[12px] flex items-center gap-2">
              <AlertCircle size={14} />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Account Name"
              required
              placeholder="e.g. Business Checking, Office Supplies"
              value={formData.Name}
              onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
            />

            <Input
              label="Account Number"
              placeholder="e.g. 1001, 5200"
              value={formData.AcctNum || ""}
              onChange={(e) => setFormData({ ...formData, AcctNum: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Account Type"
              value={formData.AccountType}
              onChange={(e) => {
                const selectedType = e.target.value;
                const match = ACCOUNT_TYPES.find((t) => t.value === selectedType);
                setFormData({
                  ...formData,
                  AccountType: selectedType,
                  Classification: match?.classification || formData.Classification,
                });
              }}
              options={ACCOUNT_TYPES.map((t) => ({ value: t.value, label: t.label }))}
            />

            <Select
              label="Classification"
              value={formData.Classification}
              onChange={(e) => setFormData({ ...formData, Classification: e.target.value })}
              options={CLASSIFICATIONS}
            />

            <Input
              label="Detail Type / SubType"
              placeholder="e.g. Checking, Savings"
              value={formData.AccountSubType || ""}
              onChange={(e) => setFormData({ ...formData, AccountSubType: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Opening / Current Balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.CurrentBalance}
              onChange={(e) =>
                setFormData({ ...formData, CurrentBalance: parseFloat(e.target.value) || 0 })
              }
            />

            <Select
              label="Currency"
              value={formData.CurrencyRef?.value || "USD"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  CurrencyRef: { value: e.target.value, name: e.target.value },
                })
              }
              options={CURRENCIES}
            />
          </div>

          <Textarea
            label="Description (Optional)"
            placeholder="Add notes or specific ledger tracking guidelines..."
            value={formData.Description || ""}
            onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
          />

          {editingAccount && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="accActiveToggle"
                checked={formData.Active}
                onChange={(e) => setFormData({ ...formData, Active: e.target.checked })}
                className="rounded accent-[var(--color-accent)]"
              />
              <label
                htmlFor="accActiveToggle"
                className="text-[12px] font-medium text-[var(--color-text)] cursor-pointer select-none"
              >
                Account is Active
              </label>
            </div>
          )}
        </form>
      </Modal>

      {/* ─── Delete Confirmation Modal ─── */}
      <Modal
        open={Boolean(deletingAccount)}
        onClose={() => setDeletingAccount(null)}
        title="Soft-Delete Account"
        description="In QuickBooks Online, deleting an account deactivates it (Active = false) to preserve ledger integrity."
        width="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDeletingAccount(null)}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteAccount}
              disabled={formLoading}
              icon={formLoading ? <RefreshCw size={13} className="animate-spin" /> : undefined}
            >
              {formLoading ? "Deactivating..." : "Deactivate Account"}
            </Button>
          </div>
        }
      >
        <div className="py-2 text-[13px] text-[var(--color-text)]">
          Are you sure you want to deactivate{" "}
          <span className="font-semibold text-[var(--color-danger)]">
            {deletingAccount?.Name}
          </span>
          ?
        </div>
      </Modal>

      {/* ─── QuickBooks Query Explorer Modal ─── */}
      <Modal
        open={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        title="QuickBooks Query Explorer"
        description="Execute real-time QuickBooks SQL-like queries against the account ledger API."
        width="xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="text-[11px] text-[var(--color-text-tertiary)]">
              Endpoint: <code className="font-mono">GET /v3/company/&#123;company_id&#125;/query</code>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setIsQueryModalOpen(false)}>
              Close
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-3 py-2">
          <div className="flex items-center gap-2">
            <input
              value={queryString}
              onChange={(e) => setQueryString(e.target.value)}
              placeholder="e.g. SELECT * FROM Account WHERE Active = true"
              className="flex-1 h-9 px-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] font-mono text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
            />
            <Button
              variant="primary"
              size="md"
              icon={queryLoading ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
              onClick={handleExecuteQuery}
              disabled={queryLoading}
            >
              Run Query
            </Button>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-[var(--color-text-tertiary)] font-medium mr-1">
              Sample queries:
            </span>
            {[
              "SELECT * FROM Account",
              "SELECT * FROM Account WHERE Active = true",
              "SELECT * FROM Account WHERE AccountType = 'Bank'",
              "SELECT * FROM Account WHERE Classification = 'Expense'",
            ].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setQueryString(q);
                }}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)] transition-base cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Query Output */}
          {queryError && (
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[var(--color-danger-text)] text-[12px]">
              {queryError}
            </div>
          )}

          <div className="mt-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-3 max-h-80 overflow-auto font-mono text-[11px] text-[var(--color-text)]">
            {queryLoading ? (
              <div className="flex items-center justify-center p-6 gap-2 text-[var(--color-text-secondary)]">
                <RefreshCw size={14} className="animate-spin" />
                <span>Executing query...</span>
              </div>
            ) : queryResults ? (
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(queryResults, null, 2)}
              </pre>
            ) : (
              <div className="text-[var(--color-text-tertiary)] text-center py-6">
                Click &quot;Run Query&quot; to inspect live QuickBooks response payload.
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
