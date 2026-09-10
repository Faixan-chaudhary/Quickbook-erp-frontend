import React, { Suspense } from "react";
import type { Metadata } from "next";
import VerifyOtpView from "@/views/VerifyOtp";

export const metadata: Metadata = {
  title: "Verify Account • Arca ERP",
  description: "Verify your email address with the OTP code sent to your inbox to activate your Arca ERP account.",
};

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#E6F4F2]">
          <div className="w-6 h-6 border-2 border-[#14968C] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyOtpView />
    </Suspense>
  );
}
