"use client";

import React, { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Coins,
  ArrowRight,
  AlertCircle,
  Check,
} from "lucide-react";
import { useSignin } from "@/hooks/useAuth";

const initialFormData = {
  email: "",
  password: "",
};

export default function SignInView() {
  const router = useRouter();
  const { mutate: signin, isPending: isLoading, error, isSuccess, reset: clearError } = useSignin();
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Extract clean error message
  const errorMessage = error?.message || null;

  // Clear state on initial mount & wipe any browser autofill
  useEffect(() => {
    setFormData(initialFormData);
    const timer = setTimeout(() => {
      setFormData(initialFormData);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (field: "email" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...formData };
    if (typeof window !== "undefined") {
      localStorage.setItem("user_email", formData.email.trim());
    }
    setFormData(initialFormData); // Clear inputs immediately on submit
    signin(payload, {
      onSuccess: () => {
        setFormData(initialFormData);
      },
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#E6F4F2] via-[#F2FAF9] to-[#E0F2F0] text-[#1A5556] flex items-center justify-center p-4 sm:p-6 selection:bg-[#14968C] selection:text-white antialiased relative overflow-hidden">
      <main className="w-full max-w-md mx-auto relative z-10">
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
              Welcome Back
            </h1>
            <p className="text-[12.5px] text-[#5A7D7E] mt-0.5 font-normal">
              Sign in to manage your finances, invoices, and operations.
            </p>
          </div>

          {/* Error Alert */}
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
              <span>Signed in successfully! Redirecting to dashboard...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3">
            {/* Hidden dummy fields to consume aggressive browser autofill */}
            <input
              type="text"
              name="fake_user"
              tabIndex={-1}
              autoComplete="off"
              className="sr-only opacity-0 absolute -top-96 -left-96 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="password"
              name="fake_pass"
              tabIndex={-1}
              autoComplete="new-password"
              className="sr-only opacity-0 absolute -top-96 -left-96 pointer-events-none"
              aria-hidden="true"
            />

            {/* Work Email */}
            <div>
              <label className="flex items-center gap-1 text-[11.5px] font-semibold text-[#0E4441] tracking-wide mb-1">
                <span>Work Email</span>
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8AA8A9] pointer-events-none" />
                <input
                  type="email"
                  name="user_login_email"
                  required
                  autoComplete="off"
                  autoCapitalize="none"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-[12.5px] font-medium text-[#1A5556] placeholder:text-[11.5px] placeholder:font-normal placeholder:text-[#9AB6B4] bg-[#F8FBFA] hover:bg-white focus:bg-white border border-[#D9E6E6] rounded-md focus:outline-none focus:border-[#14968C] focus:ring-1.5 focus:ring-[#14968C]/15 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center justify-between text-[11.5px] font-semibold text-[#0E4441] tracking-wide mb-1">
                <span className="flex items-center gap-1">
                  <span>Password</span>
                </span>
                <Link
                  href="/dashboard"
                  className="text-[11px] font-medium text-[#14968C] hover:text-[#0B3D3A] transition-colors duration-200"
                >
                  Forgot password?
                </Link>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8AA8A9] pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="user_login_password"
                  required
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
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

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[#D9E6E6] text-[#14968C] focus:ring-[#14968C]/20 accent-[#14968C] cursor-pointer"
                />
                <span className="text-[11.5px] font-medium text-[#5A7D7E]">Remember this device</span>
              </label>
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
                    <span>Sign In to Dashboard</span>

                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Footer & Sign Up Link */}
          <div className="pt-3.5 mt-3.5 border-t border-[#E8F1F0] flex items-center justify-center text-[12px] text-[#5A7D7E]">
            <div className="flex items-center gap-1.5">
              <span>Don't have an account?</span>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1 font-semibold text-[#14968C] hover:text-[#0B3D3A] transition-colors duration-200 group"
              >
                <span>Create an Account</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
