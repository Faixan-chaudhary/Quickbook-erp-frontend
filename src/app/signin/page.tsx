import React, { Suspense } from "react";
import type { Metadata } from "next";
import SignInView from "@/views/SignIn";

export const metadata: Metadata = {
  title: "Sign In • Arca ERP",
  description: "Sign in to your Arca ERP account to manage invoices, payments, banking, and accounting.",
};

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#E6F4F2]">
          <div className="w-6 h-6 border-2 border-[#14968C] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignInView />
    </Suspense>
  );
}
