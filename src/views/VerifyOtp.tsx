"use client";

import React, { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  KeyRound,
  Mail,
  Coins,
  ArrowRight,
  AlertCircle,
  Check,
  Copy,
  RotateCw,
} from "lucide-react";
import { useVerifyOtp } from "@/hooks/useAuth";
import { authService } from "@/services/authService";

interface TotpSessionData {
  email?: string;
  totp_qr_code?: string | null;
  totp_secret?: string | null;
  totp_auth_url?: string | null;
}

export default function VerifyOtpView() {
  const router = useRouter();

  // State variables
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [totpQrCode, setTotpQrCode] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Countdown timer for OTP expiration (60 seconds)
  const [countdown, setCountdown] = useState(60);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [resendStatus, setResendStatus] = useState<{ text: string; isError: boolean } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Hook to call POST /api/auth/verify-otp
  const {
    mutate: verify,
    isPending: isVerifying,
    error,
    isSuccess,
    reset: clearError,
  } = useVerifyOtp();

  // 1. Guard: Only accessible once right after signup with active registration session
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("arca_totp_data");
        if (stored) {
          const parsed: TotpSessionData = JSON.parse(stored);
          if (parsed.email) {
            setEmail(parsed.email);
            if (parsed.totp_qr_code) setTotpQrCode(parsed.totp_qr_code);
            if (parsed.totp_secret) setTotpSecret(parsed.totp_secret);
            setIsAuthorized(true);
            return;
          }
        }
        // If no active registration verification session, redirect to signin
        setIsAuthorized(false);
        router.replace("/signin");
      } catch {
        setIsAuthorized(false);
        router.replace("/signin");
      }
    }
  }, [router]);

  // 2. Timer countdown effect (ticks down every 1 second)
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  // 3. Copy secret key to clipboard
  const handleCopySecret = async () => {
    if (!totpSecret) return;
    try {
      await navigator.clipboard.writeText(totpSecret);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  // 4. Feature: Regenerate OTP and QR Code using POST /api/v1/auth/resend-otp
  const handleRegenerateOtp = async () => {
    if (!email.trim() || isRegenerating) return;

    try {
      setIsRegenerating(true);
      setResendStatus(null);
      setValidationError(null);
      clearError();

      const response = await authService.resendOtp(email.trim());

      // Update state if new QR code or secret is returned
      if (response?.totp_qr_code) setTotpQrCode(response.totp_qr_code);
      if (response?.totp_secret) setTotpSecret(response.totp_secret);

      // Save updated data to sessionStorage
      if (typeof window !== "undefined" && response?.totp_qr_code) {
        sessionStorage.setItem(
          "arca_totp_data",
          JSON.stringify({
            email,
            totp_qr_code: response.totp_qr_code || totpQrCode,
            totp_secret: response.totp_secret || totpSecret,
          })
        );
      }

      setResendStatus({
        text: "New QR code & verification key generated! Enter the fresh code from your app.",
        isError: false,
      });
      setCountdown(60); // Reset countdown timer back to 60s
      setOtp(""); // Clear previous OTP input
    } catch (err: any) {
      setResendStatus({
        text: err.message || "Failed to regenerate code. Please try again.",
        isError: true,
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  // 5. Submit verification code to API with expiration protection
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email.trim()) {
      setValidationError("Session expired. Please sign up again.");
      return;
    }

    if (countdown <= 0) {
      setValidationError("Verification code has expired. Please click 'Expired • Regenerate' to get a fresh code.");
      return;
    }

    if (!otp.trim() || otp.trim().length < 6) {
      setValidationError("Please enter the complete 6-digit verification code.");
      return;
    }

    verify({ email: email.trim(), otp: otp.trim() });
  };

  const errorMessage = validationError || error?.message || null;

  // Render spinner while verifying authorization session
  if (isAuthorized === false || isAuthorized === null) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#E6F4F2]">
        <div className="w-6 h-6 border-2 border-[#14968C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          <div className="text-center mb-3">
            <h1 className="text-[22px] sm:text-[24px] font-bold tracking-tight bg-gradient-to-r from-[#0B3D3A] via-[#14968C] to-[#0E7490] bg-clip-text text-transparent">
              Verify Account
            </h1>
            <p className="text-[12.5px] text-[#5A7D7E] mt-0.5 font-normal">
              Scan the QR code with your Authenticator app & enter the 6-digit code.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-3 p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[12px] flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5 text-[#DC2626]" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Resend / Regenerate Feedback Alert */}
          {resendStatus && (
            <div
              className={`mb-3 p-2.5 rounded-lg text-[12px] flex items-center gap-2 border ${
                resendStatus.isError
                  ? "bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]"
                  : "bg-[#F0FDFA] border-[#99F6E4] text-[#0F766E]"
              }`}
            >
              {resendStatus.isError ? (
                <AlertCircle size={14} className="shrink-0 text-[#DC2626]" />
              ) : (
                <Check size={14} className="shrink-0 text-[#14968C]" />
              )}
              <span>{resendStatus.text}</span>
            </div>
          )}

          {/* Success Alert */}
          {isSuccess && (
            <div className="mb-3 p-2.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[12px] flex items-center gap-2">
              <Check size={14} className="shrink-0 text-[#059669]" />
              <span>Account verified successfully! Transferring to Dashboard...</span>
            </div>
          )}

          {/* Compact QR Code Box */}
          {totpQrCode && (
            <div className="mb-3 p-2.5 bg-[#F8FBFA] border border-[#D9E6E6] rounded-lg flex flex-col items-center">
              <div className="w-28 h-28 bg-white p-1 rounded-md border border-[#D9E6E6] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={totpQrCode}
                  alt="Authenticator QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Manual Key */}
              {totpSecret && (
                <div className="mt-1.5 flex items-center gap-1 text-[11px]">
                  <span className="text-[#5A7D7E] text-[10.5px]">Key:</span>
                  <code className="font-mono font-bold text-[#0E4441] bg-white border border-[#D9E6E6] px-1.5 py-0.5 rounded text-[10.5px] tracking-wider">
                    {totpSecret}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className="text-[#14968C] hover:text-[#0B3D3A] p-0.5 cursor-pointer"
                    title="Copy Key"
                  >
                    {isCopied ? <Check size={11} className="text-[#059669]" /> : <Copy size={11} />}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Verification Code Form */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3">
            {/* Work Email Field (Read-only from active signup session) */}
            <div>
              <label className="flex items-center gap-1 text-[11.5px] font-semibold text-[#0E4441] tracking-wide mb-1">
                <span>Account Email</span>
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8AA8A9] pointer-events-none" />
                <input
                  type="email"
                  readOnly
                  tabIndex={-1}
                  value={email}
                  className="w-full pl-8 pr-2.5 py-1.5 text-[12.5px] font-medium text-[#1A5556] bg-[#F1F7F6] border border-[#D9E6E6] rounded-md outline-none cursor-default select-none"
                />
              </div>
            </div>

            {/* 6-Digit Code Input & Live Timer / Regenerate Button */}
            <div>
              <div className="flex items-center justify-between text-[11.5px] font-semibold text-[#0E4441] tracking-wide mb-1">
                <span className="flex items-center gap-1">
                  <span>6-Digit Code</span>
                  <span className="text-[#14968C] text-[11px] font-bold leading-none">*</span>
                </span>
                
                {/* Live Expiration Countdown / Regenerate Trigger */}
                {countdown > 0 ? (
                  <span className="text-[10.5px] font-normal text-[#5A7D7E]">
                    Expires in <span className="font-semibold text-[#14968C]">{countdown}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleRegenerateOtp}
                    disabled={isRegenerating}
                    className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#DC2626] hover:text-[#991B1B] cursor-pointer"
                  >
                    <RotateCw size={10} className={isRegenerating ? "animate-spin" : ""} />
                    <span>Expired • Regenerate</span>
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
                    if (error) clearError();
                  }}
                  className="w-full pl-8 pr-2.5 py-1.5 text-[12.5px] font-medium text-[#1A5556] placeholder:text-[11.5px] placeholder:font-normal placeholder:text-[#9AB6B4] bg-[#F8FBFA] hover:bg-white focus:bg-white border border-[#D9E6E6] rounded-md focus:outline-none focus:border-[#14968C] focus:ring-1.5 focus:ring-[#14968C]/15 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isVerifying || isSuccess}
                className="w-full h-9 rounded-md bg-gradient-to-r from-[#14968C] to-[#0F766E] hover:from-[#0F766E] hover:to-[#0D6B64] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 shadow-xs hover:shadow transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>

            {/* Manual Regenerate QR Code Link */}
            <div className="text-center pt-0.5">
              <button
                type="button"
                onClick={handleRegenerateOtp}
                disabled={isRegenerating}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#14968C] hover:text-[#0B3D3A] transition-colors cursor-pointer disabled:opacity-50"
              >
                <RotateCw size={11} className={isRegenerating ? "animate-spin" : ""} />
                <span>{isRegenerating ? "Regenerating..." : "Regenerate QR Code & Key"}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
