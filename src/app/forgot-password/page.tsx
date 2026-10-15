import React, { Suspense } from "react";
import type { Metadata } from "next";
import ResetPasswordView from "@/views/ResetPassword";

export const metadata: Metadata = {
  title: "Forgot Password • Arca ERP",
  description: "Reset your Arca ERP account password using your authentication code.",
};

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#E6F4F2]">
          <div className="w-6 h-6 border-2 border-[#14968C] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordView />
    </Suspense>
  );
}
