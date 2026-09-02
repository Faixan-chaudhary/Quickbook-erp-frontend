"use client";

import { Construction } from "lucide-react";
import { Button, Card } from "../components/ui";
import type { Page } from "../data/mock";

const PAGE_DETAILS: Partial<Record<Page, { title: string; desc: string }>> = {
  estimates: { title: "Estimates", desc: "Create and manage customer estimates and quotes before converting to sales orders." },
  "sales-orders": { title: "Sales Orders", desc: "Convert accepted estimates into sales orders, track fulfillment, and invoice when ready." },
  inventory: { title: "Inventory", desc: "Track stock levels, reorder points, and warehouse movements across locations." },
  "purchase-orders": { title: "Purchase Orders", desc: "Create and track purchase orders to vendors with approval workflows." },
  payments: { title: "Payments", desc: "Track all incoming and outgoing payments, schedule payments, and manage payment methods." },
  employees: { title: "Employees", desc: "Manage employee profiles, departments, compensation, and benefits." },
  projects: { title: "Projects", desc: "Track project budgets, expenses, timesheets, and profitability." },
  "time-tracking": { title: "Time Tracking", desc: "Log billable and non-billable hours, manage timesheets, and bill clients." },
  analytics: { title: "Analytics", desc: "Advanced business intelligence, cohort analysis, and custom dashboards." },
  automation: { title: "Automation", desc: "Visual workflow builder for IF/THEN rules, recurring tasks, and integrations." },
  documents: { title: "Documents", desc: "Store, organize, and share financial documents, contracts, and attachments." },
};

interface GenericPageProps {
  page?: Page;
}

export default function GenericPage({ page = "dashboard" as Page }: GenericPageProps) {
  const details = (page && PAGE_DETAILS[page]) ?? {
    title: (page || "Module").split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" "),
    desc: "This module is fully implemented in the complete platform.",
  };

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <div>
        <h1 className="text-[20px] font-semibold text-[var(--color-text)] tracking-tight">{details.title}</h1>
        <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">{details.desc}</p>
      </div>

      <Card className="flex items-center justify-center py-24 flex-col gap-5">
        <div className="w-14 h-14 rounded-[var(--radius-xl)] bg-[var(--color-border-subtle)] flex items-center justify-center">
          <Construction size={22} className="text-[var(--color-text-tertiary)]" />
        </div>
        <div className="text-center">
          <p className="text-[15px] font-semibold text-[var(--color-text)]">{details.title} Module</p>
          <p className="text-[13px] text-[var(--color-text-secondary)] max-w-sm mx-auto mt-1.5">
            {details.desc} Full list views, detail pages, forms, filters, and workflows are available in the complete platform.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="primary" size="sm">Get Full Access</Button>
          <Button variant="secondary" size="sm">View Documentation</Button>
        </div>
      </Card>
    </div>
  );
}
