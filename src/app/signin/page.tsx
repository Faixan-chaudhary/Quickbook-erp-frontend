import type { Metadata } from "next";
import SignInView from "@/views/SignIn";

export const metadata: Metadata = {
  title: "Sign In • Arca ERP",
  description: "Sign in to your Arca ERP account to manage invoices, payments, banking, and accounting.",
};

export default function SignInPage() {
  return <SignInView />;
}
