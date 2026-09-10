import { apiClient } from "./apiClient";
import type { SignUpRequest, SignUpResponse, TokenResponse } from "@/types";

/**
 * Authentication Service
 * Handles user registration, login, logout, and token operations.
 */

export const authService = {
  /**
   * Register a new business account
   * POST /api/v1/auth/signup
   */
  async signup(payload: SignUpRequest): Promise<SignUpResponse> {
    return apiClient<SignUpResponse>("/api/v1/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email.trim(),
        password: payload.password,
        company_name: payload.company_name.trim(),
        phone: payload.phone.trim(),
        country: payload.country || "United States",
        currency: payload.currency || "USD",
        plan: payload.plan || "Essentials",
      }),
    });
  },

  /**
   * Sign in with Email and Password
   * Calls secure Next.js handler which sets HttpOnly auth cookies (zero localStorage usage)
   * POST /api/auth/signin -> POST /api/v1/auth/signin/email
   */
  async signinEmail(email: string, password: string): Promise<TokenResponse> {
    return apiClient<TokenResponse>("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), password }),
    });
  },

  /**
   * Verify registration OTP code
   * POST /api/v1/auth/verify-otp
   */
  async verifyOtp(email: string, otp: string): Promise<TokenResponse> {
    return apiClient<TokenResponse>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
    });
  },

  /**
   * Resend / Regenerate OTP & QR Code
   * POST /api/v1/auth/resend-otp
   */
  async resendOtp(email: string): Promise<{
    message?: string;
    totp_qr_code?: string;
    totp_secret?: string;
    totp_auth_url?: string;
  }> {
    return apiClient("/api/v1/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email: email.trim() }),
    });
  },

  /**
   * Request password reset OTP
   * POST /api/v1/auth/forgot-password
   */
  async forgotPassword(email: string): Promise<{ message?: string }> {
    return apiClient<{ message?: string }>("/api/v1/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: email.trim() }),
    });
  },

  /**
   * Verify OTP and set new password
   * POST /api/v1/auth/reset-password
   */
  async resetPassword(payload: {
    email: string;
    otp: string;
    new_password: string;
  }): Promise<{ message?: string }> {
    return apiClient<{ message?: string }>("/api/v1/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email.trim(),
        otp: payload.otp.trim(),
        new_password: payload.new_password,
      }),
    });
  },

  /**
   * Logout user and clear HttpOnly cookies
   * POST /api/auth/logout -> POST /api/v1/auth/logout
   */
  async logout(): Promise<{ message: string }> {
    return apiClient<{ message: string }>("/api/auth/logout", {
      method: "POST",
    });
  },
};
