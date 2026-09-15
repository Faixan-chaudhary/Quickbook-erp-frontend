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
  Loader2,
  AlertCircle,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  Lock,
} from "lucide-react";
import { company as mockCompany, user, employees } from "../data/mock";
import { Button, Card, Badge, Input, SectionHeader, Avatar, Select, ToggleSwitch, Textarea } from "../components/ui";
import { useUserAndCompany } from "@/hooks/useUserAndCompany";
import { useCompanyPreferences } from "@/hooks/useCompanyPreferences";
import { useQueryClient } from "@tanstack/react-query";
import {
  companyService,
  getDefaultPreferencesByCompanyType,
  type CompanyInfoUpdate,
} from "@/services/companyService";
import type { PreferencesDetail, BusinessType } from "@/types/preferences";

const NAV_ITEMS = [
  { id: "profile", label: "Profile Settings", icon: <UserCircle size={14} /> },
  { id: "company", label: "Company Profile", icon: <Building2 size={14} /> },
  { id: "preferences", label: "Preferences", icon: <SlidersHorizontal size={14} /> },
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
  const {
    userName,
    userEmail,
    userPhone,
    userRole,
    companyName,
    companyCurrency,
    company,
    refetchCompany,
  } = useUserAndCompany();
  const queryClient = useQueryClient();

  const companyId =
    company?.id ||
    (typeof window !== "undefined" ? localStorage.getItem("company_id") || "" : "") ||
    "me";

  // Company Profile form state backed by live API
  const [companyForm, setCompanyForm] = useState<CompanyInfoUpdate>({
    name: "",
    legal_name: "",
    tax_id: "",
    website: "",
    phone: "",
    email: "",
    line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "United States",
    currency: "USD",
    fiscal_year_start_month: "January",
  });
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [companySaving, setCompanySaving] = useState(false);
  const [companySaved, setCompanySaved] = useState(false);

  // Cached Company Preferences isolated strictly by companyId
  const {
    data: cachedPrefsResponse,
    isLoading: prefsQueryLoading,
    error: prefsQueryError,
  } = useCompanyPreferences(companyId);

  // Editable Preferences form state
  const [preferences, setPreferences] = useState<PreferencesDetail>(() =>
    getDefaultPreferencesByCompanyType("general", companyCurrency || "USD")
  );
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsSaved, setPrefsSaved] = useState(false);
  const [prefsError, setPrefsError] = useState<string | null>(null);
  const [isHomeCurrencySaved, setIsHomeCurrencySaved] = useState<boolean>(false);

  // Synchronize preferences whenever active company changes or new cached data arrives
  useEffect(() => {
    if (companyId) {
      const rawPrefs = cachedPrefsResponse?.Preferences;
      const defaults = getDefaultPreferencesByCompanyType("general", companyCurrency || "USD");

      setPreferences({
        ...defaults,
        ...(rawPrefs || {}),
        AccountingInfoPrefs: {
          ...defaults.AccountingInfoPrefs,
          ...(rawPrefs?.AccountingInfoPrefs || {}),
        },
        CurrencyPrefs: {
          ...defaults.CurrencyPrefs,
          ...(rawPrefs?.CurrencyPrefs || {}),
        },
        ProductAndServicesPrefs: {
          ...defaults.ProductAndServicesPrefs,
          ...(rawPrefs?.ProductAndServicesPrefs || {}),
        },
        SalesFormsPrefs: {
          ...defaults.SalesFormsPrefs,
          ...(rawPrefs?.SalesFormsPrefs || {}),
        },
        TaxPrefs: {
          ...defaults.TaxPrefs,
          ...(rawPrefs?.TaxPrefs || {}),
        },
      });

      setIsHomeCurrencySaved(Boolean(rawPrefs?.CurrencyPrefs?.HomeCurrency?.value));
    }
  }, [companyId, cachedPrefsResponse, companyCurrency]);

  // Generic preference section updater
  const updatePreference = <
    K extends keyof Omit<PreferencesDetail, "Id" | "SyncToken" | "domain">,
    F extends keyof PreferencesDetail[K]
  >(
    section: K,
    field: F,
    value: PreferencesDetail[K][F]
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Preset applicator based on company type
  const applyPreset = (type: BusinessType) => {
    const currentCurrency =
      preferences.CurrencyPrefs?.HomeCurrency?.value ||
      companyForm.currency ||
      companyCurrency ||
      "USD";
    const preset = getDefaultPreferencesByCompanyType(type, currentCurrency);
    setPreferences((prev) => ({
      ...prev,
      AccountingInfoPrefs: { ...prev.AccountingInfoPrefs, ...preset.AccountingInfoPrefs },
      ProductAndServicesPrefs: { ...prev.ProductAndServicesPrefs, ...preset.ProductAndServicesPrefs },
      SalesFormsPrefs: { ...prev.SalesFormsPrefs, ...preset.SalesFormsPrefs },
      TaxPrefs: { ...prev.TaxPrefs, ...preset.TaxPrefs },
      CurrencyPrefs: { ...prev.CurrencyPrefs, ...preset.CurrencyPrefs },
    }));
  };

  // Submit updated preferences to backend API (only called on explicit user Save action)
  const handleSavePreferences = async () => {
    setPrefsError(null);
    try {
      setPrefsSaving(true);
      const res = await companyService.updatePreferences(companyId, {
        Preferences: preferences,
        AccountingInfoPrefs: preferences.AccountingInfoPrefs,
        CurrencyPrefs: preferences.CurrencyPrefs,
        ProductAndServicesPrefs: preferences.ProductAndServicesPrefs,
        SalesFormsPrefs: preferences.SalesFormsPrefs,
        TaxPrefs: preferences.TaxPrefs,
        SyncToken: preferences.SyncToken || "0",
      });

      if (res?.Preferences) {
        setPreferences((prev) => ({
          ...prev,
          ...res.Preferences,
        }));
        // Update company-scoped localStorage and React Query cache directly
        if (typeof window !== "undefined" && companyId && companyId !== "me") {
          localStorage.setItem(`arca_company_preferences_${companyId}`, JSON.stringify(res.Preferences));
        }
        queryClient.setQueryData(["company-preferences", companyId], res);
      }

      setIsHomeCurrencySaved(true);
      setPrefsSaved(true);
      setTimeout(() => setPrefsSaved(false), 3000);
    } catch (err: any) {
      setPrefsError(err.message || "Failed to update company preferences");
    } finally {
      setPrefsSaving(false);
    }
  };




  useEffect(() => {
    if (initialSection) setActiveSection(initialSection);
  }, [initialSection]);

  // Prepopulate company profile fields from live backend data and signup caches
  useEffect(() => {
    const storedCompName =
      typeof window !== "undefined"
        ? localStorage.getItem("company_name") || localStorage.getItem("company") || ""
        : "";
    const storedPhone =
      typeof window !== "undefined"
        ? localStorage.getItem("user_phone") || localStorage.getItem("phone") || ""
        : "";
    const storedEmail =
      typeof window !== "undefined"
        ? localStorage.getItem("user_email") || localStorage.getItem("email") || ""
        : "";

    const resolvedName = company?.name || companyName || storedCompName || "";
    const resolvedPhone = company?.phone || userPhone || storedPhone || "";
    const resolvedEmail = company?.email || userEmail || storedEmail || "";

    setCompanyForm({
      name: resolvedName,
      legal_name: company?.legal_name || resolvedName || "",
      tax_id: company?.tax_id || "",
      website: company?.website || "",
      phone: resolvedPhone,
      email: resolvedEmail,
      line1: company?.line1 || "",
      city: company?.city || "",
      state: company?.state || "",
      postal_code: company?.postal_code || "",
      country: company?.country || "United States",
      currency: company?.currency || "USD",
      fiscal_year_start_month: company?.fiscal_year_start_month || "January",
    });
  }, [company, companyName, userEmail, userPhone]);


  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Validate and submit updated company information to backend API
  const handleSaveCompany = async () => {
    setCompanyError(null);

    if (!companyForm.name.trim()) {
      setCompanyError("Company Name is required.");
      return;
    }
    if (!companyForm.legal_name.trim()) {
      setCompanyError("Legal Registered Name is required.");
      return;
    }
    if (!companyForm.email.trim()) {
      setCompanyError("Business Email is required.");
      return;
    }
    if (!companyForm.phone.trim()) {
      setCompanyError("Phone number is required.");
      return;
    }
    if (!companyForm.tax_id.trim()) {
      setCompanyError("Tax ID / EIN is required.");
      return;
    }
    if (!companyForm.website.trim()) {
      setCompanyError("Company Website is required.");
      return;
    }
    if (!companyForm.line1.trim()) {
      setCompanyError("Street Address is required.");
      return;
    }
    if (!companyForm.city.trim()) {
      setCompanyError("City is required.");
      return;
    }
    if (!companyForm.state.trim()) {
      setCompanyError("State / Province is required.");
      return;
    }
    if (!companyForm.postal_code.trim()) {
      setCompanyError("Postal Code is required.");
      return;
    }

    const companyId =
      company?.id ||
      (typeof window !== "undefined" ? localStorage.getItem("company_id") || "" : "") ||
      "me";

    try {
      setCompanySaving(true);
      const updated = await companyService.updateCompanyInfo(companyId, {
        name: companyForm.name.trim(),
        legal_name: companyForm.legal_name.trim(),
        phone: companyForm.phone.trim(),
        email: companyForm.email.trim(),
        website: companyForm.website.trim(),
        tax_id: companyForm.tax_id.trim(),
        fiscal_year_start_month: companyForm.fiscal_year_start_month,
        line1: companyForm.line1.trim(),
        city: companyForm.city.trim(),
        state: companyForm.state.trim(),
        postal_code: companyForm.postal_code.trim(),
        country: companyForm.country.trim(),
        currency: companyForm.currency.trim(),
      });

      queryClient.setQueryData(["company-profile-me"], updated);
      queryClient.invalidateQueries({ queryKey: ["company-profile-me"] });

      if (typeof window !== "undefined") {
        localStorage.setItem("arca_company_profile", JSON.stringify(updated));
        if (updated.name) localStorage.setItem("company_name", updated.name);
        if (updated.id) localStorage.setItem("company_id", updated.id);
      }


      setCompanySaved(true);
      if (refetchCompany) refetchCompany();
      setTimeout(() => setCompanySaved(false), 3000);
    } catch (err: any) {
      setCompanyError(err.message || "Failed to update company information");
    } finally {
      setCompanySaving(false);
    }
  };


  return (
    <div className="px-6 py-3 flex flex-col gap-4 w-full">
      {/* Sticky Settings Header */}
      <div className="sticky top-0 z-20 bg-[var(--color-bg)]/95 backdrop-blur-xs py-2.5 -mx-6 px-6 border-b border-[var(--color-border)]/60 flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-bold text-[var(--color-text)] tracking-tight">
            Settings
          </h1>
          <p className="text-[12px] text-[var(--color-text-secondary)]">
            Manage your organization profile, team members, and system preferences.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-5 relative">
        {/* Sidebar nav - Aligned panel card */}
        <div className="w-56 shrink-0 sticky top-[68px] self-start bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-2 flex flex-col gap-0.5 shadow-xs">
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-tertiary)]">
            Preferences
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-md)] text-[13px] font-medium cursor-pointer transition-base text-left ${
                  isActive
                    ? "bg-[var(--color-primary-subtle)] text-[var(--color-primary)] font-semibold shadow-2xs"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)]"
                }`}
              >
                <span
                  className={`shrink-0 ${
                    isActive
                      ? "text-[var(--color-primary)]"
                      : "text-[var(--color-text-tertiary)]"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {activeSection === "profile" && (
            <Card>
              <div className="flex items-center justify-between mb-4">
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
              <div className="flex items-center gap-4 p-3 rounded-[var(--radius-md)] bg-[var(--color-border-subtle)]/40 border border-[var(--color-border)] mb-4">
                <Avatar name={userName || user.name} size="md" />
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
                  <Button variant="secondary" size="sm" icon={<Upload size={13} />}>
                    Change Photo
                  </Button>
                  <p className="text-[11px] text-[var(--color-text-tertiary)]">
                    PNG or JPG · Max 2MB
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
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
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-[14px] font-semibold text-[var(--color-text)]">
                      Company Information
                    </h3>
                    <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">
                      Manage your legal business entity and contact information.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={
                      companySaving ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : companySaved ? (
                        <Check size={13} />
                      ) : (
                        <Save size={13} />
                      )
                    }
                    disabled={companySaving}
                    onClick={handleSaveCompany}
                  >
                    {companySaving ? "Saving..." : companySaved ? "Saved!" : "Save Changes"}
                  </Button>
                </div>

                {/* Company Error Alert */}
                {companyError && (
                  <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[12px] text-[var(--color-danger-text)] mb-4">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <div className="font-medium">{companyError}</div>
                  </div>
                )}

                {/* Company Success Alert */}
                {companySaved && (
                  <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] bg-[var(--color-success-bg)] border border-[var(--color-success-border)] text-[12px] text-[var(--color-success-text)] mb-4">
                    <Check size={15} className="mt-0.5 shrink-0" />
                    <div className="font-medium">Company profile updated successfully!</div>
                  </div>
                )}

                {/* Logo uploader row - compact & elevated */}
                <div className="flex items-center gap-4 p-3 rounded-[var(--radius-md)] bg-[var(--color-border-subtle)]/40 border border-[var(--color-border)] mb-4">
                  <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center shrink-0 shadow-xs">
                    <span className="text-[18px] font-bold text-[var(--color-primary)]">
                      {((companyForm.name || companyName || "M")).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1">
                    <Button variant="secondary" size="sm" icon={<Upload size={13} />}>
                      Upload Logo
                    </Button>
                    <p className="text-[11px] text-[var(--color-text-tertiary)]">
                      PNG or JPG · Max 2MB · Recommended 256×256px
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <Input
                    label="Company Name"
                    required
                    value={companyForm.name}
                    onChange={(e) =>
                      setCompanyForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                  <Input
                    label="Legal Registered Name"
                    required
                    value={companyForm.legal_name}
                    onChange={(e) =>
                      setCompanyForm((prev) => ({ ...prev, legal_name: e.target.value }))
                    }
                  />
                  <Input
                    label="Tax ID / EIN"
                    required
                    value={companyForm.tax_id}
                    onChange={(e) =>
                      setCompanyForm((prev) => ({ ...prev, tax_id: e.target.value }))
                    }
                  />
                  <Input
                    label="Company Website"
                    required
                    value={companyForm.website}
                    onChange={(e) =>
                      setCompanyForm((prev) => ({ ...prev, website: e.target.value }))
                    }
                  />
                  <Input
                    label="Phone"
                    required
                    value={companyForm.phone}
                    onChange={(e) =>
                      setCompanyForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                  <Input
                    label="Business Email"
                    required
                    value={companyForm.email}
                    onChange={(e) =>
                      setCompanyForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                  <div className="col-span-1 md:col-span-2">
                    <Input
                      label="Street Address"
                      required
                      value={companyForm.line1}
                      onChange={(e) =>
                        setCompanyForm((prev) => ({ ...prev, line1: e.target.value }))
                      }
                    />
                  </div>
                  <Input
                    label="City"
                    required
                    value={companyForm.city}
                    onChange={(e) =>
                      setCompanyForm((prev) => ({ ...prev, city: e.target.value }))
                    }
                  />
                  <Input
                    label="State / Province"
                    required
                    value={companyForm.state}
                    onChange={(e) =>
                      setCompanyForm((prev) => ({ ...prev, state: e.target.value }))
                    }
                  />
                  <Input
                    label="Postal / Zip Code"
                    required
                    value={companyForm.postal_code}
                    onChange={(e) =>
                      setCompanyForm((prev) => ({ ...prev, postal_code: e.target.value }))
                    }
                  />
                  <Input
                    label="Country"
                    required
                    value={companyForm.country}
                    onChange={(e) =>
                      setCompanyForm((prev) => ({ ...prev, country: e.target.value }))
                    }
                  />
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-[14px] font-semibold text-[var(--color-text)]">
                      Accounting Settings
                    </h3>
                    <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">
                      Configure your fiscal calendar and base monetary unit.
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={companySaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    disabled={companySaving}
                    onClick={handleSaveCompany}
                  >
                    Save Accounting
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-[var(--color-text)]">
                      Fiscal Year Start Month <span className="text-[var(--color-danger)] ml-0.5">*</span>
                    </label>
                    <select
                      value={companyForm.fiscal_year_start_month}
                      onChange={(e) =>
                        setCompanyForm((prev) => ({
                          ...prev,
                          fiscal_year_start_month: e.target.value,
                        }))
                      }
                      className="h-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] px-3 focus:outline-none focus:border-[var(--color-accent)] transition-base cursor-pointer"
                    >
                      {[
                        "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"
                      ].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-[var(--color-text)]">
                      Base Currency <span className="text-[var(--color-danger)] ml-0.5">*</span>
                    </label>
                    <Input
                      value={companyForm.currency}
                      onChange={(e) =>
                        setCompanyForm((prev) => ({ ...prev, currency: e.target.value }))
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-[var(--color-text)]">
                      Tax System
                    </label>
                    <div className="h-8 bg-[var(--color-border-subtle)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text-secondary)] px-3 flex items-center">
                      Accrual Basis
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-medium text-[var(--color-text)]">
                      Date Format
                    </label>
                    <div className="h-8 bg-[var(--color-border-subtle)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text-secondary)] px-3 flex items-center">
                      MM/DD/YYYY
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeSection === "preferences" && (
            <div className="flex flex-col gap-4">
              {/* Preferences Header Card with Quick Presets & Save Action */}
              <Card>
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-[14px] font-semibold text-[var(--color-text)]">
                      Company Preferences
                    </h3>
                    <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">
                      Configure accounting rules, currency, sales form features, inventory, and tax defaults.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={
                        prefsSaving ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : prefsSaved ? (
                          <Check size={13} />
                        ) : (
                          <Save size={13} />
                        )
                      }
                      disabled={prefsSaving || (prefsQueryLoading && !cachedPrefsResponse)}
                      onClick={handleSavePreferences}
                    >
                      {prefsSaving ? "Saving..." : prefsSaved ? "Saved!" : "Save Preferences"}
                    </Button>
                  </div>
                </div>

                {/* Company Type Preset Selector Bar */}
                <div className="mt-4 pt-3.5 border-t border-[var(--color-border)]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-text-secondary)]">
                    <Sparkles size={14} className="text-[var(--color-accent)] shrink-0" />
                    <span>Quick Business Presets:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => applyPreset("services")}
                    >
                      Service Company
                    </Button>
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => applyPreset("product_sales")}
                    >
                      Product & Retail
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={<RefreshCw size={11} />}
                      onClick={() => applyPreset("general")}
                    >
                      Standard QBO
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Error Alert */}
              {(prefsError || prefsQueryError) && (
                <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[12px] text-[var(--color-danger-text)]">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <div className="font-medium">{prefsError || (prefsQueryError as Error)?.message || "Failed to load preferences"}</div>
                </div>
              )}

              {/* Success Alert */}
              {prefsSaved && (
                <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] bg-[var(--color-success-bg)] border border-[var(--color-success-border)] text-[12px] text-[var(--color-success-text)]">
                  <Check size={15} className="mt-0.5 shrink-0" />
                  <div className="font-medium">Company preferences saved successfully!</div>
                </div>
              )}

              {prefsQueryLoading && !cachedPrefsResponse ? (
                <Card className="flex flex-col items-center justify-center py-14 gap-3">
                  <Loader2 size={24} className="animate-spin text-[var(--color-accent)]" />
                  <p className="text-[13px] text-[var(--color-text-secondary)]">
                    Loading company preferences...
                  </p>
                </Card>
              ) : (

                <>
                  {/* A. Accounting Information */}
                  <Card>
                    <div className="mb-4">
                      <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-text)]">
                        Accounting Information
                      </h4>
                      <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                        Manage terminology, fiscal period start, and departmental tracking.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-4 pb-4 border-b border-[var(--color-border)]/60">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-medium text-[var(--color-text)]">
                          Fiscal Year Start Month
                        </label>
                        <select
                          value={preferences.AccountingInfoPrefs?.FirstMonthOfFiscalYear || "January"}
                          onChange={(e) =>
                            updatePreference(
                              "AccountingInfoPrefs",
                              "FirstMonthOfFiscalYear",
                              e.target.value
                            )
                          }
                          className="h-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] px-3 focus:outline-none focus:border-[var(--color-accent)] transition-base cursor-pointer"
                        >
                          {[
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December",
                          ].map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-medium text-[var(--color-text)]">
                          Customer Terminology
                        </label>
                        <select
                          value={preferences.AccountingInfoPrefs?.CustomerTerminology || "Customers"}
                          onChange={(e) =>
                            updatePreference(
                              "AccountingInfoPrefs",
                              "CustomerTerminology",
                              e.target.value
                            )
                          }
                          className="h-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] px-3 focus:outline-none focus:border-[var(--color-accent)] transition-base cursor-pointer"
                        >
                          {["Customers", "Clients", "Donors", "Guests", "Members", "Tenants"].map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-medium text-[var(--color-text)]">
                          Department Terminology
                        </label>
                        <select
                          value={preferences.AccountingInfoPrefs?.DepartmentTerminology || "Department"}
                          onChange={(e) =>
                            updatePreference(
                              "AccountingInfoPrefs",
                              "DepartmentTerminology",
                              e.target.value
                            )
                          }
                          className="h-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] px-3 focus:outline-none focus:border-[var(--color-accent)] transition-base cursor-pointer"
                        >
                          {["Department", "Location", "Division", "Business Unit", "Branch"].map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col divide-y divide-[var(--color-border-subtle)]">
                      <ToggleSwitch
                        label="Track Departments"
                        description="Enable department, location, or branch categorization on sales and expense forms."
                        checked={Boolean(preferences.AccountingInfoPrefs?.TrackDepartments)}
                        onChange={(val) =>
                          updatePreference("AccountingInfoPrefs", "TrackDepartments", val)
                        }
                      />
                      <ToggleSwitch
                        label="Class Tracking Per Transaction"
                        description="Assign one overall tracking class to entire invoices, bills, and payments."
                        checked={Boolean(preferences.AccountingInfoPrefs?.ClassTrackingPerTxn)}
                        onChange={(val) =>
                          updatePreference("AccountingInfoPrefs", "ClassTrackingPerTxn", val)
                        }
                      />
                      <ToggleSwitch
                        label="Class Tracking Per Line Item"
                        description="Assign separate tracking classes to individual item lines on transactions."
                        checked={Boolean(preferences.AccountingInfoPrefs?.ClassTrackingPerTxnLine)}
                        onChange={(val) =>
                          updatePreference("AccountingInfoPrefs", "ClassTrackingPerTxnLine", val)
                        }
                      />
                    </div>
                  </Card>

                  {/* B. Currency Preferences */}
                  {(() => {
                    const CURRENCY_LIST = [
                      { code: "USD", name: "US Dollar", symbol: "$", label: "Dollar" },
                      { code: "EUR", name: "Euro", symbol: "€", label: "Euro" },
                      { code: "GBP", name: "British Pound", symbol: "£", label: "Pound" },
                      { code: "PKR", name: "Pakistani Rupee", symbol: "₨", label: "PKR" },
                    ];
                    const CURRENCY_MAP: Record<string, { code: string; name: string; symbol: string; label: string }> = {
                      USD: { code: "USD", name: "US Dollar", symbol: "$", label: "Dollar" },
                      EUR: { code: "EUR", name: "Euro", symbol: "€", label: "Euro" },
                      GBP: { code: "GBP", name: "British Pound", symbol: "£", label: "Pound" },
                      PKR: { code: "PKR", name: "Pakistani Rupee", symbol: "₨", label: "PKR" },
                    };

                    const currentCurCode = (preferences.CurrencyPrefs?.HomeCurrency?.value || "USD").toUpperCase();
                    const currentCurName =
                      CURRENCY_MAP[currentCurCode]?.name ||
                      preferences.CurrencyPrefs?.HomeCurrency?.name ||
                      "US Dollar";

                    return (
                      <Card>
                        <div className="mb-4">
                          <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-text)]">
                            Currency Preferences
                          </h4>
                          <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                            Select your primary home currency and configure global multi-currency transaction support.
                          </p>
                        </div>

                        {/* Before & After Home Currency Status Banner */}
                        {isHomeCurrencySaved ? (
                          <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] bg-[var(--color-primary-subtle)] border border-[var(--color-primary)]/30 text-[12px] text-[var(--color-text)] mb-3.5">
                            <Lock size={15} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
                            <div className="leading-relaxed">
                              <span className="font-semibold text-[var(--color-primary)]">Home Currency Has Been Set:</span> Base Home Currency is permanently locked as <strong>{currentCurCode} ({currentCurName})</strong> for accounting ledger and tax compliance. To invoice or record bills in foreign currencies, enable the <strong>Multi-Currency Enabled</strong> toggle below.
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] bg-[var(--color-warning-bg)] border border-[var(--color-warning-border)] text-[12px] text-[var(--color-warning-text)] mb-3.5">
                            <AlertCircle size={15} className="mt-0.5 shrink-0" />
                            <div className="leading-relaxed">
                              <span className="font-semibold">Before Saving Note:</span> Please select your organization&apos;s base currency carefully. Once saved to the system, the base Home Currency becomes permanent for financial ledger integrity and cannot be modified.
                            </div>
                          </div>
                        )}

                        {/* Currency Selector Toggle Buttons */}
                        <div className="flex flex-col gap-2 mb-4">
                          <div className="flex items-center justify-between">
                            <label className="text-[12px] font-medium text-[var(--color-text)]">
                              Home Currency Selection
                            </label>
                            {isHomeCurrencySaved && (
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-1 bg-[var(--color-primary-subtle)] px-2 py-0.5 rounded-full">
                                <Lock size={10} /> Locked & Active
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {CURRENCY_LIST.map((cur) => {
                              const isSelected = currentCurCode === cur.code;
                              return (
                                <button
                                  key={cur.code}
                                  type="button"
                                  disabled={isHomeCurrencySaved}
                                  onClick={() =>
                                    updatePreference("CurrencyPrefs", "HomeCurrency", {
                                      value: cur.code,
                                      name: cur.name,
                                    })
                                  }
                                  className={`flex items-center justify-between px-3 py-2.5 rounded-[var(--radius-md)] border text-left transition-base ${
                                    isHomeCurrencySaved ? "cursor-not-allowed" : "cursor-pointer"
                                  } ${
                                    isSelected
                                      ? "bg-[var(--color-primary-subtle)] border-[var(--color-primary)] text-[var(--color-primary)] font-semibold shadow-2xs ring-1 ring-[var(--color-primary)]"
                                      : isHomeCurrencySaved
                                      ? "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-tertiary)] opacity-40"
                                      : "bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-tertiary)] hover:text-[var(--color-text)]"
                                  }`}
                                >
                                  <div className="flex flex-col">
                                    <span className="text-[13px] font-medium flex items-center gap-1">
                                      <span>{cur.label}</span>
                                      <span className="text-[11px] opacity-75 font-normal">({cur.symbol})</span>
                                    </span>
                                    <span className="text-[10px] opacity-75 truncate">{cur.name}</span>
                                  </div>
                                  <span
                                    className={`text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0 ml-1 flex items-center gap-1 ${
                                      isSelected
                                        ? "bg-[var(--color-primary)] text-white"
                                        : "bg-[var(--color-border-subtle)] text-[var(--color-text-tertiary)]"
                                    }`}
                                  >
                                    {isHomeCurrencySaved && isSelected && <Lock size={9} />}
                                    {cur.code}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <Input
                            label="Selected Currency Code"
                            value={currentCurCode}
                            readOnly
                            className="bg-[var(--color-border-subtle)]/50 cursor-not-allowed font-medium font-mono"
                            helper="Auto-selected based on active currency toggle."
                          />
                          <Input
                            label="Selected Currency Name"
                            value={currentCurName}
                            readOnly
                            className="bg-[var(--color-border-subtle)]/50 cursor-not-allowed font-medium"
                            helper="Display label for your organization's base currency."
                          />
                        </div>

                        <div className="pt-2 border-t border-[var(--color-border-subtle)]">
                          <ToggleSwitch
                            label="Multi-Currency Enabled"
                            description="Enable invoicing and bank account tracking across multiple international currencies."
                            checked={Boolean(preferences.CurrencyPrefs?.MultiCurrencyEnabled)}
                            onChange={(val) =>
                              updatePreference("CurrencyPrefs", "MultiCurrencyEnabled", val)
                            }
                          />
                        </div>
                      </Card>
                    );
                  })()}



                  {/* C. Products and Services */}
                  <Card>
                    <div className="mb-4">
                      <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-text)]">
                        Products & Services
                      </h4>
                      <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                        Configure item catalogs, purchase ordering, and live inventory quantity tracking.
                      </p>
                    </div>

                    <div className="flex flex-col divide-y divide-[var(--color-border-subtle)]">
                      <ToggleSwitch
                        label="For Sales Forms"
                        description="Allow selecting items from your product & service catalog on invoices and estimates."
                        checked={Boolean(preferences.ProductAndServicesPrefs?.ForSales)}
                        onChange={(val) =>
                          updatePreference("ProductAndServicesPrefs", "ForSales", val)
                        }
                      />
                      <ToggleSwitch
                        label="For Purchase Forms"
                        description="Allow selecting product catalog items on vendor bills, expenses, and purchase orders."
                        checked={Boolean(preferences.ProductAndServicesPrefs?.ForPurchase)}
                        onChange={(val) =>
                          updatePreference("ProductAndServicesPrefs", "ForPurchase", val)
                        }
                      />
                      <ToggleSwitch
                        label="Inventory and Purchase Orders"
                        description="Enable perpetual inventory tracking, reorder levels, and purchase order generation."
                        checked={Boolean(preferences.ProductAndServicesPrefs?.InventoryAndPurchaseOrder)}
                        onChange={(val) =>
                          updatePreference("ProductAndServicesPrefs", "InventoryAndPurchaseOrder", val)
                        }
                      />
                      <ToggleSwitch
                        label="Quantity With Price & Rate"
                        description="Show quantity, unit price, and total rate calculation columns on form lines."
                        checked={Boolean(preferences.ProductAndServicesPrefs?.QuantityWithPriceAndRate)}
                        onChange={(val) =>
                          updatePreference("ProductAndServicesPrefs", "QuantityWithPriceAndRate", val)
                        }
                      />
                      <ToggleSwitch
                        label="Quantity On Hand"
                        description="Track available stock levels and display current quantity on hand warnings."
                        checked={Boolean(preferences.ProductAndServicesPrefs?.QuantityOnHand)}
                        onChange={(val) =>
                          updatePreference("ProductAndServicesPrefs", "QuantityOnHand", val)
                        }
                      />
                    </div>
                  </Card>

                  {/* D. Sales Forms */}
                  <Card>
                    <div className="mb-4">
                      <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-text)]">
                        Sales Forms & Invoicing
                      </h4>
                      <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                        Configure payment terms, discounts, customer memo defaults, and automated credit application.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-medium text-[var(--color-text)]">
                          Default Payment Terms
                        </label>
                        <select
                          value={preferences.SalesFormsPrefs?.DefaultTerms?.value || "Net 30"}
                          onChange={(e) =>
                            updatePreference("SalesFormsPrefs", "DefaultTerms", {
                              value: e.target.value,
                              name: e.target.value,
                            })
                          }
                          className="h-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] px-3 focus:outline-none focus:border-[var(--color-accent)] transition-base cursor-pointer"
                        >
                          {["Due on Receipt", "Net 15", "Net 30", "Net 45", "Net 60"].map((term) => (
                            <option key={term} value={term}>{term}</option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-medium text-[var(--color-text)]">
                          Default Customer Memo
                        </label>
                        <Input
                          value={preferences.SalesFormsPrefs?.DefaultCustomerMessage || ""}
                          onChange={(e) =>
                            updatePreference(
                              "SalesFormsPrefs",
                              "DefaultCustomerMessage",
                              e.target.value
                            )
                          }
                          placeholder="Thank you for your business and have a great day!"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col divide-y divide-[var(--color-border-subtle)]">
                      <ToggleSwitch
                        label="Custom Transaction Numbers"
                        description="Allow manually typing custom invoice and receipt numbers instead of auto-numbering."
                        checked={Boolean(preferences.SalesFormsPrefs?.CustomTxnNumbers)}
                        onChange={(val) =>
                          updatePreference("SalesFormsPrefs", "CustomTxnNumbers", val)
                        }
                      />
                      <ToggleSwitch
                        label="Allow Deposits on Invoices"
                        description="Enable receiving initial customer deposits and advances directly on invoice documents."
                        checked={Boolean(preferences.SalesFormsPrefs?.AllowDeposit)}
                        onChange={(val) =>
                          updatePreference("SalesFormsPrefs", "AllowDeposit", val)
                        }
                      />
                      <ToggleSwitch
                        label="Allow Discounts"
                        description="Enable percentage or fixed discount fields on invoice lines and order totals."
                        checked={Boolean(preferences.SalesFormsPrefs?.AllowDiscount)}
                        onChange={(val) =>
                          updatePreference("SalesFormsPrefs", "AllowDiscount", val)
                        }
                      />
                      <ToggleSwitch
                        label="Auto-Apply Customer Credits"
                        description="Automatically allocate open customer credit balances to newly created invoices."
                        checked={Boolean(preferences.SalesFormsPrefs?.AutoApplyCredit)}
                        onChange={(val) =>
                          updatePreference("SalesFormsPrefs", "AutoApplyCredit", val)
                        }
                      />
                      <ToggleSwitch
                        label="Auto-Apply Received Payments"
                        description="Automatically match and apply incoming payments to outstanding unpaid invoices."
                        checked={Boolean(preferences.SalesFormsPrefs?.AutoApplyPayments)}
                        onChange={(val) =>
                          updatePreference("SalesFormsPrefs", "AutoApplyPayments", val)
                        }
                      />
                    </div>
                  </Card>

                  {/* E. Tax Preferences */}
                  <Card>
                    <div className="mb-4">
                      <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--color-text)]">
                        Tax Preferences
                      </h4>
                      <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                        Configure sales tax calculation and automated 3rd-party tax partner engines.
                      </p>
                    </div>

                    <div className="flex flex-col divide-y divide-[var(--color-border-subtle)]">
                      <ToggleSwitch
                        label="Using Sales Tax"
                        description="Enable sales tax calculation and tax rate selection on taxable transactions."
                        checked={Boolean(preferences.TaxPrefs?.UsingSalesTax)}
                        onChange={(val) =>
                          updatePreference("TaxPrefs", "UsingSalesTax", val)
                        }
                      />
                      <ToggleSwitch
                        label="Partner Tax Engine Enabled"
                        description="Connect automated third-party sales tax compliance and rate lookup engines."
                        checked={Boolean(preferences.TaxPrefs?.PartnerTaxEnabled)}
                        onChange={(val) =>
                          updatePreference("TaxPrefs", "PartnerTaxEnabled", val)
                        }
                      />
                    </div>
                  </Card>

                  {/* Bottom Save Button Action */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button
                      variant="primary"
                      size="md"
                      icon={
                        prefsSaving ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : prefsSaved ? (
                          <Check size={13} />
                        ) : (
                          <Save size={13} />
                        )
                      }
                      disabled={prefsSaving || (prefsQueryLoading && !cachedPrefsResponse)}
                      onClick={handleSavePreferences}
                    >
                      {prefsSaving ? "Saving Changes..." : prefsSaved ? "Saved Successfully!" : "Save Preferences"}
                    </Button>
                  </div>
                </>
              )}

            </div>
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
