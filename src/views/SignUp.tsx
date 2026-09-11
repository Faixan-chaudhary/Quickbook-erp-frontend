"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Building2,
  Mail,
  Lock,
  Phone,
  Globe2,
  Coins,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { useSignup } from "@/hooks/useAuth";
import type { SignUpRequest } from "@/types";
import {
  COUNTRIES_DATA,
  type CountryData,
  findCountryByPhoneNumber,
  findCountryByCode,
  updatePhoneForCountry,
  fetchOpenSourceCountries,
} from "@/data/countryData";

/**
 * Regex Patterns for Junior Developers to understand:
 * - EMAIL_REGEX: Checks standard email format (user@domain.com)
 * - PASSWORD_REGEX: Requires at least 6 characters, at least 1 letter, and at least 1 number
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

// Available subscription plans
const PLANS = [
  { id: "Simple Start", name: "Simple Start", price: "$15/mo" },
  { id: "Essentials", name: "Essentials", price: "$30/mo" },
  { id: "Plus", name: "Plus", price: "$45/mo" },
  { id: "Advanced", name: "Advanced", price: "$100/mo" },
];

const initialFormData: SignUpRequest = {
  name: "",
  company_name: "",
  email: "",
  password: "",
  phone: "+1 ",
  country: "US",
  currency: "USD",
  plan: "Essentials",
};

export default function SignUpView() {
  const router = useRouter();

  // API signup mutation hook
  const {
    mutate: signup,
    isPending: isLoading,
    error,
    isSuccess,
    reset: clearError,
  } = useSignup();

  const errorMessage = (error as any)?.message || null;

  // Form input states
  const [formData, setFormData] = useState<SignUpRequest>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [countriesList, setCountriesList] = useState<CountryData[]>(COUNTRIES_DATA);
  const [validationError, setValidationError] = useState<string | null>(null);

  // 1. Fetch countries from open-source REST Countries API on page load (with offline fallback)
  useEffect(() => {
    setFormData(initialFormData);
    fetchOpenSourceCountries().then((data) => {
      if (data && data.length > 0) {
        setCountriesList(data);
      }
    });
  }, []);

  // 2. Handle generic text changes (Company Name, etc.)
  const handleFieldChange = (field: keyof SignUpRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationError) setValidationError(null);
    if (error) clearError();
  };

  /**
   * 3. Feature: When user types phone number:
   * - Block letters/strings (only allow digits 0-9, optional '+' at start, and spaces)
   * - Auto-detect country from dial code (e.g., +92 -> Pakistan, +971 -> UAE)
   * - Auto-select matching country in dropdown
   * - Auto-set primary currency to that country's currency
   */
  const handlePhoneChange = (inputVal: string) => {
    // Only allow numbers, '+', and spaces (strips out any letters/strings)
    let sanitized = inputVal.replace(/[^0-9+ ]/g, "");

    // Ensure '+' only appears at the beginning
    if (sanitized.includes("+")) {
      const hasLeadingPlus = sanitized.startsWith("+");
      sanitized = sanitized.replace(/\+/g, "");
      if (hasLeadingPlus) {
        sanitized = "+" + sanitized;
      }
    }

    // Detect matching country from the entered phone number
    const matchedCountry = findCountryByPhoneNumber(sanitized);

    if (matchedCountry) {
      setFormData((prev) => ({
        ...prev,
        phone: sanitized,
        country: matchedCountry.code,
        currency: matchedCountry.currency,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        phone: sanitized,
      }));
    }

    if (validationError) setValidationError(null);
    if (error) clearError();
  };

  /**
   * Prevent typing letters directly from the keyboard in phone input
   */
  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow control keys (Backspace, Tab, Delete, Arrow navigation, Copy/Paste)
    if (
      ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(e.key) ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }

    // Block any key that is not a digit (0-9), '+', or space
    if (!/^[0-9+ ]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  /**
   * 4. Feature: When user changes Country from dropdown:
   * - Auto-set phone number dial code for that country
   * - Auto-set primary currency for that country
   */
  const handleCountryChange = (countryCode: string) => {
    const selectedCountry =
      countriesList.find((c) => c.code === countryCode) ||
      findCountryByCode(countryCode);

    const updatedPhone = updatePhoneForCountry(formData.phone || "", countryCode);
    const updatedCurrency = selectedCountry ? selectedCountry.currency : formData.currency;

    setFormData((prev) => ({
      ...prev,
      country: countryCode,
      currency: updatedCurrency,
      phone: updatedPhone,
    }));

    if (validationError) setValidationError(null);
    if (error) clearError();
  };

  /**
   * 5. Form submission with Regex & Required validation
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate Required: Full Name
    if (!formData.name || !formData.name.trim()) {
      setValidationError("Full Name is required.");
      return;
    }

    // Validate Required: Company Name
    if (!formData.company_name.trim()) {
      setValidationError("Company Name is required.");
      return;
    }

    // Validate Required & Regex: Work Email
    if (!formData.email.trim()) {
      setValidationError("Work Email is required.");
      return;
    }
    if (!EMAIL_REGEX.test(formData.email.trim())) {
      setValidationError("Please enter a valid work email address (e.g. name@company.com).");
      return;
    }

    // Validate Required & Regex: Password
    if (!formData.password) {
      setValidationError("Password is required.");
      return;
    }
    if (!PASSWORD_REGEX.test(formData.password)) {
      setValidationError(
        "Password must be at least 6 characters long and contain both letters and numbers."
      );
      return;
    }

    // Validate Required: Phone Number
    if (!formData.phone || !formData.phone.trim() || formData.phone.trim().length < 6) {
      setValidationError("Please enter a valid phone number with your country code.");
      return;
    }

    // Validate Required: Country & Currency
    if (!formData.country) {
      setValidationError("Please select your country.");
      return;
    }
    if (!formData.currency) {
      setValidationError("Please select your primary currency.");
      return;
    }

    // Prepare complete payload (including the selected plan)
    const payload: SignUpRequest = {
      name: formData.name?.trim(),
      user_name: formData.name?.trim(),
      full_name: formData.name?.trim(),
      company_name: formData.company_name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phone: formData.phone.trim(),
      country: formData.country,
      currency: formData.currency,
      plan: formData.plan || "Essentials",
    };

    if (typeof window !== "undefined") {
      if (formData.name) localStorage.setItem("user_name", formData.name.trim());
      localStorage.setItem("user_email", formData.email.trim());
      localStorage.setItem("company_name", formData.company_name.trim());
    }

    signup(payload);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#E6F4F2] via-[#F2FAF9] to-[#E0F2F0] text-[#1A5556] flex items-center justify-center p-4 sm:p-6 selection:bg-[#14968C] selection:text-white antialiased relative overflow-hidden">
      <main className="w-full max-w-xl mx-auto relative z-10">
        <div className="bg-white rounded-2xl border border-[#D9E6E6] shadow-sm p-5 sm:p-7">
          {/* Top Brand Logo */}
          <div className="flex items-center justify-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#14968C] flex items-center justify-center text-white shadow-xs">
              <Coins size={15} />
            </div>
            <span className="text-[17px] font-bold tracking-tight text-[#0B3D3A]">
              Arca <span className="text-[#14968C] font-semibold text-[13px]">ERP</span>
            </span>
          </div>

          {/* Heading */}
          <div className="text-center mb-4">
            <h1 className="text-[22px] sm:text-[24px] font-bold tracking-tight bg-gradient-to-r from-[#0B3D3A] via-[#14968C] to-[#0E7490] bg-clip-text text-transparent">
              Create an Account
            </h1>
            <p className="text-[12.5px] text-[#5A7D7E] mt-0.5 font-normal">
              Start your 30-day free trial. No credit card required.
            </p>
          </div>

          {/* Frontend Validation Alert */}
          {validationError && (
            <div className="mb-3.5 p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[12px] flex items-start gap-2 animate-fadeIn">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-[#DC2626]" />
              <div className="flex-1 font-medium">{validationError}</div>
            </div>
          )}

          {/* Backend API Error Alert */}
          {errorMessage && (
            <div className="mb-3.5 p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[12px] flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-[#DC2626]" />
              <div className="flex-1">
                <span>{errorMessage}</span>
                {errorMessage.includes("database") || errorMessage.includes("500") ? (
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard")}
                    className="block mt-0.5 font-semibold underline text-[#7F1D1D] hover:text-black cursor-pointer"
                  >
                    Bypass to view live interactive ERP dashboard →
                  </button>
                ) : null}
              </div>
            </div>
          )}

          {/* Success Alert */}
          {isSuccess && (
            <div className="mb-3.5 p-2.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[12px] flex items-center gap-2">
              <Check size={14} className="shrink-0 text-[#059669]" />
              <span>Account created! Redirecting to verification...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3">
            {/* Row 1: Full Name & Work Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1 text-[11.5px] font-semibold text-[#0E4441] tracking-wide mb-1">
                  <span>Full Name</span>
                  <span className="text-[#14968C] text-[11px] font-bold leading-none">*</span>
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8AA8A9] pointer-events-none" />
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    placeholder="e.g. John Doe"
                    value={formData.name || ""}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 text-[12.5px] font-medium text-[#1A5556] placeholder:text-[11.5px] placeholder:font-normal placeholder:text-[#9AB6B4] bg-[#F8FBFA] hover:bg-white focus:bg-white border border-[#D9E6E6] rounded-md focus:outline-none focus:border-[#14968C] focus:ring-1.5 focus:ring-[#14968C]/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1 text-[11.5px] font-semibold text-[#0E4441] tracking-wide mb-1">
                  <span>Work Email</span>
                  <span className="text-[#14968C] text-[11px] font-bold leading-none">*</span>
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8AA8A9] pointer-events-none" />
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => handleFieldChange("email", e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 text-[12.5px] font-medium text-[#1A5556] placeholder:text-[11.5px] placeholder:font-normal placeholder:text-[#9AB6B4] bg-[#F8FBFA] hover:bg-white focus:bg-white border border-[#D9E6E6] rounded-md focus:outline-none focus:border-[#14968C] focus:ring-1.5 focus:ring-[#14968C]/15 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Company Name & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1 text-[11.5px] font-semibold text-[#0E4441] tracking-wide mb-1">
                  <span>Company Name</span>
                  <span className="text-[#14968C] text-[11px] font-bold leading-none">*</span>
                </label>
                <div className="relative">
                  <Building2 size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8AA8A9] pointer-events-none" />
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    placeholder="Apex Global or Acme Inc"
                    value={formData.company_name}
                    onChange={(e) => handleFieldChange("company_name", e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 text-[12.5px] font-medium text-[#1A5556] placeholder:text-[11.5px] placeholder:font-normal placeholder:text-[#9AB6B4] bg-[#F8FBFA] hover:bg-white focus:bg-white border border-[#D9E6E6] rounded-md focus:outline-none focus:border-[#14968C] focus:ring-1.5 focus:ring-[#14968C]/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1 text-[11.5px] font-semibold text-[#0E4441] tracking-wide mb-1">
                  <span>Country</span>
                  <span className="text-[#14968C] text-[11px] font-bold leading-none">*</span>
                </label>
                <div className="relative">
                  <Globe2 size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8AA8A9] pointer-events-none" />
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 text-[12.5px] font-medium text-[#1A5556] bg-[#F8FBFA] hover:bg-white focus:bg-white border border-[#D9E6E6] rounded-md focus:outline-none focus:border-[#14968C] focus:ring-1.5 focus:ring-[#14968C]/15 transition-all cursor-pointer"
                  >
                    {countriesList.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Row 3: Phone Number & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1 text-[11.5px] font-semibold text-[#0E4441] tracking-wide mb-1">
                  <span>Phone Number</span>
                  <span className="text-[#14968C] text-[11px] font-bold leading-none">*</span>
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8AA8A9] pointer-events-none" />
                  <input
                    type="tel"
                    inputMode="tel"
                    required
                    autoComplete="off"
                    placeholder="+1 555 019 2834"
                    value={formData.phone || ""}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onKeyDown={handlePhoneKeyDown}
                    className="w-full pl-8 pr-2.5 py-1.5 text-[12.5px] font-medium text-[#1A5556] placeholder:text-[11.5px] placeholder:font-normal placeholder:text-[#9AB6B4] bg-[#F8FBFA] hover:bg-white focus:bg-white border border-[#D9E6E6] rounded-md focus:outline-none focus:border-[#14968C] focus:ring-1.5 focus:ring-[#14968C]/15 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1 text-[11.5px] font-semibold text-[#0E4441] tracking-wide mb-1">
                  <span>Password</span>
                  <span className="text-[#14968C] text-[11px] font-bold leading-none">*</span>
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8AA8A9] pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="At least 6 chars (letters & numbers)"
                    value={formData.password}
                    onChange={(e) => handleFieldChange("password", e.target.value)}
                    className="w-full pl-8 pr-8 py-1.5 text-[12.5px] font-medium text-[#1A5556] placeholder:text-[11.5px] placeholder:font-normal placeholder:text-[#9AB6B4] bg-[#F8FBFA] hover:bg-white focus:bg-white border border-[#D9E6E6] rounded-md focus:outline-none focus:border-[#14968C] focus:ring-1.5 focus:ring-[#14968C]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8AA8A9] hover:text-[#1A5556] cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Row 4: ERP Plan Selector (Included in API payload) */}
            <div className="pt-0.5">
              <label className="flex items-center justify-between text-[11.5px] font-semibold text-[#0E4441] tracking-wide mb-1">
                <span className="flex items-center gap-1">
                  <span>Select Plan</span>
                  <span className="text-[#14968C] text-[11px] font-bold leading-none">*</span>
                </span>
                <span className="text-[9.5px] font-medium text-[#0F766E] bg-[#E6F4F2] border border-[#14968C]/20 px-1.5 py-0.5 rounded leading-none">
                  30 days free
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {PLANS.map((p) => {
                  const isSelected = formData.plan === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleFieldChange("plan", p.id)}
                      className={`p-1.5 rounded-md border text-left transition-all cursor-pointer relative ${isSelected
                          ? "border-[#14968C] bg-[#F0FDFF] text-[#0F766E] font-semibold ring-1 ring-[#14968C]"
                          : "border-[#D9E6E6] bg-[#F8FBFA] text-[#5A7D7E] hover:border-[#14968C]/60 hover:bg-white"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11.5px] font-bold">{p.name}</span>
                        {isSelected && <Check size={11} className="text-[#14968C]" />}
                      </div>
                      <div className="text-[10.5px] text-[#14968C] font-semibold mt-0.5">
                        {p.price}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-1.5">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-9 rounded-md bg-gradient-to-r from-[#14968C] to-[#0F766E] hover:from-[#0F766E] hover:to-[#0D6B64] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Workspace Free</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Footer & Sign In Link */}
          <div className="pt-3.5 mt-3.5 border-t border-[#E8F1F0] flex items-center justify-center text-[12px] text-[#5A7D7E]">
            <div className="flex items-center gap-1.5">
              <span>Already registered?</span>
              <Link
                href="/signin"
                className="inline-flex items-center gap-1 font-semibold text-[#14968C] hover:text-[#0B3D3A] transition-colors duration-200 group"
              >
                <span>Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
