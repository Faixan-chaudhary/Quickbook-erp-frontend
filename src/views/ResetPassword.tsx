"use client";

import React, { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Lock,
  KeyRound,
  Mail,
  Eye,
  EyeOff,
  Coins,
  ArrowRight,
  AlertCircle,
  Check,
  RotateCw,
} from "lucide-react";
import { useResetPassword, useForgotPassword } from "@/hooks/useAuth";

const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;

export default function ResetPasswordView() {
  const searchParams = useSearchParams();
  const queryEmail = searchParams.get("email") || "";

  // Form states
  const [email, setEmail] = useState(queryEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Expiration countdown timer (60 seconds)
  const [countdown, setCountdown] = useState(60);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  // Mutations
  const {
    mutate: resetPassword,
    isPending: isSubmitting,
    error: resetError,
    isSuccess: isResetSuccess,
    reset: clearResetError,
  } = useResetPassword();

  const {
    mutate: sendForgotOtp,
    isPending: isResending,
    error: forgotError,
  } = useForgotPassword();

  // 1. On page load, read cached email and auto-trigger OTP request
  useEffect(() => {
    let targetEmail = queryEmail;
    if (!targetEmail && typeof window !== "undefined") {
      targetEmail = localStorage.getItem("user_email") || "";
      if (targetEmail) setEmail(targetEmail);
    }

    if (targetEmail.trim()) {
      sendForgotOtp(targetEmail.trim(), {
        onSuccess: () => {
          setResendNotice("Verification code sent to your authenticating app.");
          setCountdown(60);
        },
      });
    }
  }, [queryEmail, sendForgotOtp]);

  // 2. Countdown timer effect
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // 3. Handle manual resend / regenerate OTP code
  const handleResendOtp = () => {
    if (!email.trim() || isResending) return;
    setValidationError(null);
    clearResetError();
    setResendNotice(null);

    sendForgotOtp(email.trim(), {
      onSuccess: () => {
        setResendNotice("New verification code sent to your authenticating app!");
        setCountdown(60);
        setOtp("");
      },
      onError: (err: any) => {
        setValidationError(err.message || "Failed to resend verification code.");
      },
    });
  };

  // 4. Handle "Done" button submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearResetError();

    if (!email.trim()) {
      setValidationError("Email is required.");
      return;
    }

    if (countdown <= 0) {
      setValidationError("Verification code has expired. Please click 'Resend Code' to get a fresh code.");
      return;
    }

    if (!otp.trim() || otp.trim().length < 6) {
      setValidationError("Please enter the complete 6-digit verification code.");
      return;
    }

    if (!newPassword) {
      setValidationError("New password is required.");
      return;
    }

    if (!PASSWORD_REGEX.test(newPassword)) {
      setValidationError(
        "Password must be at least 6 characters long and contain both letters and numbers."
      );
      return;
    }

    resetPassword({
      email: email.trim(),
      otp: otp.trim(),
      new_password: newPassword,
    });
  };

  const errorMessage = validationError || resetError?.message || forgotError?.message || null;

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
              Reset Password
            </h1>
            <p className="text-[12.5px] text-[#5A7D7E] mt-0.5 font-normal">
              Enter your authentication code and choose a new password.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-3.5 p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[12px] flex items-start gap-2 animate-fadeIn">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-[#DC2626]" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Resend Notice Alert */}
          {resendNotice && !errorMessage && !isResetSuccess && (
            <div className="mb-3.5 p-2.5 rounded-lg bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] text-[12px] flex items-center gap-2">
              <Check size={14} className="shrink-0 text-[#14968C]" />
              <span>{resendNotice}</span>
            </div>
          )}

          {/* Success Alert */}
          {isResetSuccess && (
            <div className="mb-3.5 p-2.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[12px] flex items-center gap-2">
              <Check size={14} className="shrink-0 text-[#059669]" />
              <span>Password changed successfully! Redirecting to Sign In...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3">
            {/* Field 1: Work Email */}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 text-[12.5px] font-medium text-[#1A5556] placeholder:text-[11.5px] placeholder:font-normal placeholder:text-[#9AB6B4] bg-[#F8FBFA] hover:bg-white focus:bg-white border border-[#D9E6E6] rounded-md focus:outline-none focus:border-[#14968C] focus:ring-1.5 focus:ring-[#14968C]/15 transition-all"
                />
              </div>
            </div>

            {/* Field 2: 6-Digit OTP & Live Expiration Countdown */}
            <div>
              <div className="flex items-center justify-between text-[11.5px] font-semibold text-[#0E4441] tracking-wide mb-1">
                <span className="flex items-center gap-1">
                  <span>6-Digit Verification Code</span>
                  <span className="text-[#14968C] text-[11px] font-bold leading-none">*</span>
                </span>

                {/* Expiration Timer & Resend Trigger */}
                {countdown > 0 ? (
                  <span className="text-[10.5px] font-normal text-[#5A7D7E]">
                    Expires in <span className="font-semibold text-[#14968C]">{countdown}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#DC2626] hover:text-[#991B1B] cursor-pointer"
                  >
                    <RotateCw size={10} className={isResending ? "animate-spin" : ""} />
                    <span>Expired • Resend Code</span>
                  </button>
                )}
              </div>

              <div className="relative">
                <KeyRound size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8AA8A9] pointer-events-none" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/[^0-9]/g, ""));
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full pl-8 pr-2.5 py-1.5 text-[12.5px] font-medium text-[#1A5556] placeholder:text-[11.5px] placeholder:font-normal placeholder:text-[#9AB6B4] bg-[#F8FBFA] hover:bg-white focus:bg-white border border-[#D9E6E6] rounded-md focus:outline-none focus:border-[#14968C] focus:ring-1.5 focus:ring-[#14968C]/15 transition-all tracking-wider"
                />
              </div>
            </div>

            {/* Field 3: New Password */}
            <div>
              <label className="flex items-center gap-1 text-[11.5px] font-semibold text-[#0E4441] tracking-wide mb-1">
                <span>New Password</span>
                <span className="text-[#14968C] text-[11px] font-bold leading-none">*</span>
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8AA8A9] pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="At least 6 chars (letters & numbers)"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (validationError) setValidationError(null);
                  }}
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

            {/* Submit "Done" Button */}
            <div className="pt-1.5">
              <button
                type="submit"
                disabled={isSubmitting || isResetSuccess}
                className="w-full h-9 rounded-md bg-gradient-to-r from-[#14968C] to-[#0F766E] hover:from-[#0F766E] hover:to-[#0D6B64] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Done</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Bottom Footer & Back to Sign In Link */}
          <div className="pt-3.5 mt-3.5 border-t border-[#E8F1F0] flex items-center justify-center text-[12px] text-[#5A7D7E]">
            <div className="flex items-center gap-1.5">
              <span>Remembered password?</span>
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
