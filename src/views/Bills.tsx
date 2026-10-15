"use client";

import { useState } from "react"
import { Plus, Search, Download, Filter, Receipt, AlertCircle } from "lucide-react"
import { bills } from "../data/mock"
import {
  Button, Card, Badge, Tabs, SectionHeader, fmtCurrency, fmtDate,
  statusBadge, Pagination, EmptyState,
} from "../components/ui"

export default function Bills() {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = bills.filter((b) => {
    const matchTab = tab === "all" || b.status === tab
    const matchSearch = search === "" || b.vendor.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const overdueTotal = bills.filter((b) => b.status === "overdue").reduce((s, b) => s + b.amount, 0)
  const pendingTotal = bills.filter((b) => b.status === "pending").reduce((s, b) => s + b.amount, 0)

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Bills"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />}>New Bill</Button>
          </div>
        }
      />

      {bills.filter((b) => b.status === "overdue").length > 0 && (
        <div className="flex items-center gap-3 p-3.5 bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] rounded-[var(--radius-lg)]">
          <AlertCircle size={15} className="text-[var(--color-danger)] shrink-0" />
          <div className="flex-1">
            <span className="text-[13px] font-medium text-[var(--color-danger-text)]">
              {bills.filter((b) => b.status === "overdue").length} overdue bill{bills.filter((b) => b.status === "overdue").length > 1 ? "s" : ""} · {fmtCurrency(overdueTotal)} past due
            </span>
            <span className="text-[12px] text-[var(--color-danger-text)] opacity-80 ml-2">Late payments may affect vendor relationships.</span>
          </div>
          <Button variant="danger" size="sm">Pay Now</Button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Bills", value: fmtCurrency(bills.reduce((s, b) => s + b.amount, 0)), sub: `${bills.length} bills` },
          { label: "Overdue", value: fmtCurrency(overdueTotal), sub: `${bills.filter((b) => b.status === "overdue").length} bills`, danger: true },
          { label: "Due Soon (30 days)", value: fmtCurrency(pendingTotal), sub: `${bills.filter((b) => b.status === "pending").length} bills` },
          { label: "Paid (MTD)", value: fmtCurrency(bills.filter((b) => b.status === "paid").reduce((s, b) => s + b.amount, 0)), sub: `${bills.filter((b) => b.status === "paid").length} bills` },
        ].map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{stat.label}</span>
            <span className={`text-[20px] font-semibold tabnum tracking-tight ${(stat as {danger?: boolean}).danger ? "text-[var(--color-danger)]" : "text-[var(--color-text)]"}`}>{stat.value}</span>
            {stat.sub ? <span className="text-[11px] text-[var(--color-text-tertiary)]">{stat.sub}</span> : null}
          </Card>
        ))}
      </div>

      <Card padding="none">
        <Tabs
          tabs={[
            { id: "all", label: "All", count: bills.length },
            { id: "overdue", label: "Overdue", count: bills.filter((b) => b.status === "overdue").length },
            { id: "pending", label: "Pending", count: bills.filter((b) => b.status === "pending").length },
            { id: "paid", label: "Paid", count: bills.filter((b) => b.status === "paid").length },
          ]}
          active={tab}
          onChange={(t) => { setTab(t); setPage(1) }}
          className="px-5"
        />
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--color-border)]">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bills..." className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base" />
          </div>
          <Button variant="secondary" size="sm" icon={<Filter size={13} />}>Filter</Button>
          {selected.size > 0 && (
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--color-border)]">
              <span className="text-[12px] text-[var(--color-text-secondary)]">{selected.size} selected</span>
              <Button variant="primary" size="sm">Pay Selected</Button>
            </div>
          )}
          <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} bills · {fmtCurrency(filtered.reduce((s, b) => s + b.amount, 0))}</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="w-10 px-5 py-2.5">
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={() => selected.size === filtered.length ? setSelected(new Set()) : setSelected(new Set(filtered.map((b) => b.id)))} className="rounded accent-[var(--color-accent)]" />
                </th>
                {["Bill #", "Vendor", "Category", "Issue Date", "Due Date", "Amount", "Status", ""].map((h) => (
                  <th key={h} className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${h === "Amount" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((bill) => {
                const [variant, label] = statusBadge(bill.status)
                const isSelected = selected.has(bill.id)
                return (
                  <tr key={bill.id} className={`border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer group ${isSelected ? "bg-[var(--color-accent-subtle)]" : ""}`}>
                    <td className="w-10 px-5 py-3" onClick={(e) => { e.stopPropagation(); const next = new Set(selected); isSelected ? next.delete(bill.id) : next.add(bill.id); setSelected(next) }}>
                      <input type="checkbox" checked={isSelected} onChange={() => {}} className="rounded accent-[var(--color-accent)]" />
                    </td>
                    <td className="px-4 py-3 text-[13px] font-mono text-[var(--color-text)]">{bill.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-[var(--color-border-subtle)] flex items-center justify-center shrink-0">
                          <Receipt size={11} className="text-[var(--color-text-tertiary)]" />
                        </div>
                        <span className="text-[13px] text-[var(--color-text)] max-w-[180px] truncate">{bill.vendor}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">{bill.category}</span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--color-text-secondary)]">{fmtDate(bill.issueDate)}</td>
                    <td className={`px-4 py-3 text-[12px] ${bill.status === "overdue" ? "text-[var(--color-danger)] font-medium" : "text-[var(--color-text-secondary)]"}`}>{fmtDate(bill.dueDate)}</td>
                    <td className="px-4 py-3 text-[13px] font-medium tabnum text-right">{fmtCurrency(bill.amount)}</td>
                    <td className="px-4 py-3"><Badge variant={variant} size="sm" dot>{label}</Badge></td>
                    <td className="px-4 py-3">
                      {bill.status !== "paid" && (
                        <Button variant="primary" size="xs" className="opacity-0 group-hover:opacity-100 transition-base">Pay</Button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageSize={10} total={filtered.length} onChange={setPage} />
      </Card>
    </div>
  )
}
