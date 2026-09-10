"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import type { SignUpRequest } from "@/types";

/**
 * Reusable mutation hook for user registration
 */
export function useSignup() {
  const router = useRouter();

  return useMutation({
    mutationFn: (formData: SignUpRequest) => authService.signup(formData),
    onSuccess: (data, variables) => {
      const email = data?.email || variables?.email || "";
      
      // Save TOTP QR code and secret in browser session storage for the verify-otp page
      if (typeof window !== "undefined" && data) {
        sessionStorage.setItem(
          "arca_totp_data",
          JSON.stringify({
            email,
            totp_qr_code: data.totp_qr_code || null,
            totp_secret: data.totp_secret || null,
            totp_auth_url: data.totp_auth_url || null,
          })
        );
      }

      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
      }, 500);
    },
  });
}

/**
 * Reusable mutation hook for OTP verification
 */
export function useVerifyOtp() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      authService.verifyOtp(email, otp),
    onSuccess: () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("arca_totp_data");
      }
      setTimeout(() => {
        router.push("/dashboard");
      }, 600);
    },
  });
}

/**
 * Reusable mutation hook for user login
 */
export function useSignin() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signinEmail(email, password),
    onSuccess: () => {
      router.push("/dashboard");
    },
  });
}

/**
 * Reusable mutation hook for user logout
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSettled: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("arca_user_profile");
        localStorage.removeItem("arca_company_profile");
        localStorage.removeItem("user_email");
        localStorage.removeItem("company_name");
        sessionStorage.clear();
      }
      queryClient.clear();
      router.push("/");
    },
  });
}

/**
 * Unified auth hook combining mutations and state
 */
export function useAuth() {
  const signupMutation = useSignup();
  const signinMutation = useSignin();
  const logoutMutation = useLogout();

  return {
    // Direct mutation objects
    signupMutation,
    signinMutation,
    logoutMutation,

    // Trigger functions
    signup: signupMutation.mutateAsync,
    signin: signinMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,

    // Status flags
    isLoading:
      signupMutation.isPending ||
      signinMutation.isPending ||
      logoutMutation.isPending,
    isPending:
      signupMutation.isPending ||
      signinMutation.isPending ||
      logoutMutation.isPending,

    // Error & Success feedback
    error:
      signupMutation.error?.message ||
      signinMutation.error?.message ||
      logoutMutation.error?.message ||
      null,
    success: signupMutation.isSuccess
      ? "Account created successfully! Redirecting..."
      : null,

    // Reset state
    clearError: () => {
      signupMutation.reset();
      signinMutation.reset();
      logoutMutation.reset();
    },
  };
}


