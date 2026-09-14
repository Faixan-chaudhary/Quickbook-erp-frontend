"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  Lock,
  Globe,
  FileText,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Coins,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Modal, Button, Input, Select } from "@/components/ui";
import {
  companyService,
  type CompanyInfoUpdate,
  type CompanyInfoResponse,
} from "@/services/companyService";

interface CompanySetupModalProps {
  open: boolean;
  onClose: () => void;
  company?: CompanyInfoResponse | null;
  companyName?: string;
  userEmail?: string;
  userPhone?: string;
  onSuccess?: () => void;
  mode?: "setup" | "register";
}

const MONTHS = [
  { value: "January", label: "January" },
  { value: "February", label: "February" },
  { value: "March", label: "March" },
  { value: "April", label: "April" },
  { value: "May", label: "May" },
  { value: "June", label: "June" },
  { value: "July", label: "July" },
  { value: "August", label: "August" },
  { value: "September", label: "September" },
  { value: "October", label: "October" },
  { value: "November", label: "November" },
  { value: "December", label: "December" },
];

export function CompanySetupModal({
  open,
  onClose,
  company,
  companyName,
  userEmail,
  userPhone,
  onSuccess,
  mode = "setup",
}: CompanySetupModalProps) {
  const queryClient = useQueryClient();

  // Form state holding all 13 fields required by the backend API
  const [formData, setFormData] = useState<CompanyInfoUpdate>({
    name: "",
    legal_name: "",
    phone: "",
    email: "",
    website: "",
    tax_id: "",
    fiscal_year_start_month: "January",
    line1: "",
    city: "",
    state: "",
    postal_code: "",
    country: "United States",
    currency: "USD",
  });

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Pre-fill existing company details collected during signup or reset for new registration
  useEffect(() => {
    if (open) {
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
      const storedCountry =
        typeof window !== "undefined"
          ? localStorage.getItem("user_country") || localStorage.getItem("country") || ""
          : "";
      const storedCurrency =
        typeof window !== "undefined"
          ? localStorage.getItem("user_currency") || localStorage.getItem("currency") || ""
          : "";

      const resolvedName =
        company?.name ||
        (company as any)?.company_name ||
        (company as any)?.legal_name ||
        companyName ||
        storedCompName ||
        "";

      const resolvedPhone =
        company?.phone ||
        userPhone ||
        storedPhone ||
        "";

      const resolvedEmail =
        company?.email ||
        userEmail ||
        storedEmail ||
        "";

      const resolvedCountry =
        company?.country ||
        storedCountry ||
        "United States";

      const resolvedCurrency =
        company?.currency ||
        storedCurrency ||
        "USD";

      if (mode === "register") {
        setFormData({
          name: "",
          legal_name: "",
          phone: resolvedPhone,
          email: resolvedEmail,
          website: "",
          tax_id: "",
          fiscal_year_start_month: "January",
          line1: "",
          city: "",
          state: "",
          postal_code: "",
          country: resolvedCountry,
          currency: resolvedCurrency,
        });
      } else {
        // Setup mode: populate all fields from signup/current company
        setFormData({
          name: resolvedName,
          legal_name: company?.legal_name || resolvedName || "",
          phone: resolvedPhone,
          email: resolvedEmail,
          country: resolvedCountry,
          currency: resolvedCurrency,
          tax_id: company?.tax_id || "",
          website: company?.website || "",
          fiscal_year_start_month: company?.fiscal_year_start_month || "January",
          line1: company?.line1 || "",
          city: company?.city || "",
          state: company?.state || "",
          postal_code: company?.postal_code || "",
        });
      }
      setValidationError(null);
      setSuccessMessage(null);
    }
  }, [open, company, companyName, userEmail, userPhone, mode]);


  // Simple input handler
  const handleChange = (field: keyof CompanyInfoUpdate, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationError) setValidationError(null);
  };

  // Form submission with simple field validation
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    // Validate that all required fields are filled with signup fallbacks
    const effectiveName = (
      formData.name ||
      companyName ||
      company?.name ||
      (typeof window !== "undefined"
        ? localStorage.getItem("company_name") || localStorage.getItem("company") || ""
        : "")
    ).trim();

    if (!effectiveName) {
      setValidationError("Company Name is required.");
      return;
    }

    const effectiveLegalName = (
      formData.legal_name ||
      company?.legal_name ||
      effectiveName
    ).trim();

    const effectiveEmail = (
      formData.email ||
      userEmail ||
      company?.email ||
      (typeof window !== "undefined"
        ? localStorage.getItem("user_email") || localStorage.getItem("email") || ""
        : "")
    ).trim();

    if (!effectiveEmail) {
      setValidationError("Business Email is required.");
      return;
    }

    const effectivePhone = (
      formData.phone ||
      userPhone ||
      company?.phone ||
      (typeof window !== "undefined"
        ? localStorage.getItem("user_phone") || localStorage.getItem("phone") || ""
        : "")
    ).trim();

    if (!effectivePhone) {
      setValidationError("Phone Number is required.");
      return;
    }
    if (!formData.tax_id.trim()) {
      setValidationError("Tax ID / EIN is required.");
      return;
    }
    if (!formData.website.trim()) {
      setValidationError("Company Website is required (e.g. https://yourcompany.com).");
      return;
    }
    if (!formData.line1.trim()) {
      setValidationError("Street Address is required.");
      return;
    }
    if (!formData.city.trim()) {
      setValidationError("City is required.");
      return;
    }
    if (!formData.state.trim()) {
      setValidationError("State / Province is required.");
      return;
    }
    if (!formData.postal_code.trim()) {
      setValidationError("Postal / Zip Code is required.");
      return;
    }
    if (!formData.country.trim()) {
      setValidationError("Country is required.");
      return;
    }
    if (!formData.currency.trim()) {
      setValidationError("Currency is required.");
      return;
    }

    const companyId =
      company?.id ||
      (typeof window !== "undefined" ? localStorage.getItem("company_id") || "" : "") ||
      "me";

    try {
      setIsSubmitting(true);

      let updatedCompany: CompanyInfoResponse;
      if (mode === "register") {
        updatedCompany = await companyService.registerCompany({
          name: effectiveName,
          company_name: effectiveName,
          legal_name: effectiveLegalName,
          phone: effectivePhone,
          email: effectiveEmail,
          website: formData.website.trim(),
          tax_id: formData.tax_id.trim(),
          fiscal_year_start_month: formData.fiscal_year_start_month,
          line1: formData.line1.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postal_code: formData.postal_code.trim(),
          country: formData.country.trim() || "US",
          currency: formData.currency.trim() || "USD",
          plan: "Simple Start",
        });
      } else {
        updatedCompany = await companyService.updateCompanyInfo(
          companyId,
          {
            name: effectiveName,
            legal_name: effectiveLegalName,
            phone: effectivePhone,
            email: effectiveEmail,
            website: formData.website.trim(),
            tax_id: formData.tax_id.trim(),
            fiscal_year_start_month: formData.fiscal_year_start_month,
            line1: formData.line1.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            postal_code: formData.postal_code.trim(),
            country: formData.country.trim(),
            currency: formData.currency.trim(),
          }
        );
      }

      // Update React Query cache so company profile reflects immediately across the whole app
      queryClient.setQueryData(["company-profile-me"], updatedCompany);
      queryClient.invalidateQueries({ queryKey: ["company-profile-me"] });
      queryClient.invalidateQueries({ queryKey: ["user-companies"] });

      // Update localStorage cached profile
      if (typeof window !== "undefined") {
        localStorage.setItem("arca_company_profile", JSON.stringify(updatedCompany));
        if (updatedCompany.name) {
          localStorage.setItem("company_name", updatedCompany.name);
        }
        if (updatedCompany.id) {
          localStorage.setItem("company_id", updatedCompany.id);
        }
        if (effectivePhone) {
          localStorage.setItem("user_phone", effectivePhone);
        }
      }

      setSuccessMessage(
        mode === "register"
          ? "Company successfully registered and activated!"
          : "Company setup successfully completed!"
      );

      // Trigger success callback to hide alert and close modal
      if (onSuccess) onSuccess();

      setTimeout(() => {
        onClose();
      }, 500);

    } catch (err: any) {
      setValidationError(
        err.message || "Failed to save company setup. Please verify your details."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "register" ? "Register New Company" : "Complete Company Setup"}
      description={
        mode === "register"
          ? "Enter your business details below to create and switch to your new company."
          : "Provide your registered business details to activate full ERP features, invoicing, and tax reports."
      }
      width="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <p className="text-[11px] text-[var(--color-text-tertiary)] flex items-center gap-1">
            <Lock size={12} /> Data is secured and saved to your company profile.
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
              icon={
                isSubmitting ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={13} />
                )
              }
            >
              {isSubmitting
                ? mode === "register"
                  ? "Registering..."
                  : "Saving Setup..."
                : mode === "register"
                ? "Register Company"
                : "Submit Setup"}
            </Button>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error Alert */}
        {validationError && (
          <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] text-[12px] text-[var(--color-danger-text)]">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            <div className="font-medium">{validationError}</div>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="flex items-start gap-2.5 p-3 rounded-[var(--radius-md)] bg-[var(--color-success-bg)] border border-[var(--color-success-border)] text-[12px] text-[var(--color-success-text)]">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
            <div className="font-medium">{successMessage}</div>
          </div>
        )}

        {/* SECTION 1: Registered Signup Details / New Company Details */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] flex items-center gap-1.5">
              <Building2 size={13} />
              {mode === "register" ? "Company Information" : "Registration Details"}
            </span>
            {mode !== "register" && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)] font-medium flex items-center gap-1">
                <Lock size={10} />
                Pre-filled from Signup
              </span>
            )}
          </div>

          {mode === "register" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                label="Company Name"
                required
                placeholder="e.g. Apex Global Logistics"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <Input
                label="Business Email"
                required
                type="email"
                placeholder="e.g. contact@apexlogistics.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              <Input
                label="Phone Number"
                required
                placeholder="e.g. +1 555 123 4567"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Country"
                  required
                  placeholder="e.g. United States"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                />
                <Input
                  label="Currency"
                  required
                  placeholder="e.g. USD"
                  value={formData.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-[var(--radius-lg)] bg-[var(--color-surface-secondary,var(--color-border-subtle))] border border-[var(--color-border)]">
              <div>
                <label className="text-[11px] font-medium text-[var(--color-text-secondary)]">
                  Company Name
                </label>
                {formData.name ? (
                  <div className="text-[13px] font-semibold text-[var(--color-text)] mt-0.5 truncate">
                    {formData.name}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter company name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full mt-1 h-7 px-2 text-[12px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                  />
                )}
              </div>
              <div>
                <label className="text-[11px] font-medium text-[var(--color-text-secondary)]">
                  Email
                </label>
                {formData.email ? (
                  <div className="text-[13px] font-medium text-[var(--color-text)] mt-0.5 truncate">
                    {formData.email}
                  </div>
                ) : (
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full mt-1 h-7 px-2 text-[12px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                  />
                )}
              </div>
              <div>
                <label className="text-[11px] font-medium text-[var(--color-text-secondary)]">
                  Phone
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone (e.g. +1 555...)"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full mt-1 h-7 px-2 text-[12px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-[var(--color-text-secondary)]">
                  Country
                </label>
                <div className="text-[13px] font-medium text-[var(--color-text)] mt-0.5">
                  {formData.country || "United States"}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-[var(--color-text-secondary)]">
                  Base Currency
                </label>
                <div className="text-[13px] font-medium text-[var(--color-text)] mt-0.5">
                  {formData.currency || "USD"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Legal & Identification Information */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] flex items-center gap-1.5 mb-2.5">
            <FileText size={13} />
            Legal & Tax Information
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Legal Business Name"
              required
              placeholder="e.g. Acme Corporation LLC"
              value={formData.legal_name}
              onChange={(e) => handleChange("legal_name", e.target.value)}
            />
            <Input
              label="Tax ID / EIN / VAT"
              required
              placeholder="e.g. 12-3456789"
              value={formData.tax_id}
              onChange={(e) => handleChange("tax_id", e.target.value)}
            />
            <Input
              label="Company Website"
              required
              placeholder="e.g. https://acme.com"
              value={formData.website}
              onChange={(e) => handleChange("website", e.target.value)}
            />
            <Select
              label="Fiscal Year Start Month"
              options={MONTHS}
              value={formData.fiscal_year_start_month}
              onChange={(e) =>
                handleChange("fiscal_year_start_month", e.target.value)
              }
            />
          </div>
        </div>

        {/* SECTION 3: Business Address */}
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] flex items-center gap-1.5 mb-2.5">
            <MapPin size={13} />
            Business Address
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Input
                label="Street Address"
                required
                placeholder="e.g. 100 Montgomery St, Suite 500"
                value={formData.line1}
                onChange={(e) => handleChange("line1", e.target.value)}
              />
            </div>
            <Input
              label="City"
              required
              placeholder="e.g. San Francisco"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
            <Input
              label="State / Province"
              required
              placeholder="e.g. California"
              value={formData.state}
              onChange={(e) => handleChange("state", e.target.value)}
            />
            <Input
              label="Postal / Zip Code"
              required
              placeholder="e.g. 94104"
              value={formData.postal_code}
              onChange={(e) => handleChange("postal_code", e.target.value)}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
