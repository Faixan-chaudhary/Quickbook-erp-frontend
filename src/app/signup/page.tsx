import type { Metadata } from "next";
import SignUpView from "@/views/SignUp";

export const metadata: Metadata = {
  title: "Sign Up • Start Free Trial | Arca ERP",
  description: "Create your Arca ERP account and automate invoices, payments, banking, and payroll.",
};

export default function SignUpPage() {
  return <SignUpView />;
}
