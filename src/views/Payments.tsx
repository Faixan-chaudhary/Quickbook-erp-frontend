"use client";

import { useState } from "react"
import { Plus, Search, Download, Filter, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { payments } from "../data/mock"
import {
  Button, Badge, Card, Tabs, SectionHeader, Pagination,
  fmtCurrency, fmtDate, statusBadge,
} from "../components/ui"

export default function Payments() {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = payments.filter((p) => {
    const matchTab =
      tab === "all" ||
      (tab === "incoming" && p.type === "incoming") ||
      (tab === "outgoing" && p.type === "outgoing") ||
      p.status === tab
    const matchSearch =
      search === "" ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.party.toLowerCase().includes(search.toLowerCase()) ||
      p.ref.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const incoming = payments.filter((p) => p.type === "incoming" && p.status === "completed")
  const outgoing = payments.filter((p) => p.type === "outgoing" && p.status === "completed")

  const tabs = [
    { id: "all", label: "All", count: payments.length },
    { id: "incoming", label: "Incoming", count: payments.filter((p) => p.type === "incoming").length },
    { id: "outgoing", label: "Outgoing", count: payments.filter((p) => p.type === "outgoing").length },
    { id: "scheduled", label: "Scheduled", count: payments.filter((p) => p.status === "scheduled").length },
    { id: "pending", label: "Pending", count: payments.filter((p) => p.status === "pending").length },
    { id: "failed", label: "Failed", count: payments.filter((p) => p.status === "failed").length },
  ]

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Payments"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />}>Record Payment</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Incoming (completed)", value: fmtCurrency(incoming.reduce((s, p) => s + p.amount, 0)), sub: `${incoming.length} payments`, positive: true },
          { label: "Outgoing (completed)", value: fmtCurrency(outgoing.reduce((s, p) => s + p.amount, 0)), sub: `${outgoing.length} payments` },
          { label: "Scheduled", value: fmtCurrency(payments.filter((p) => p.status === "scheduled").reduce((s, p) => s + p.amount, 0)), sub: `${payments.filter((p) => p.status === "scheduled").length} upcoming` },
          { label: "Failed / Needs retry", value: fmtCurrency(payments.filter((p) => p.status === "failed").reduce((s, p) => s + p.amount, 0)), sub: `${payments.filter((p) => p.status === "failed").length} failed`, danger: true },
        ].map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{stat.label}</span>
            <span className={`text-[20px] font-semibold tabnum tracking-tight ${(stat as { danger?: boolean }).danger ? "text-[var(--color-danger)]" : (stat as { positive?: boolean }).positive ? "text-[var(--color-success)]" : "text-[var(--color-text)]"}`}>{stat.value}</span>
            {stat.sub ? <span className="text-[11px] text-[var(--color-text-tertiary)]">{stat.sub}</span> : null}
          </Card>
        ))}
      </div>

      <Card padding="none">
        <Tabs tabs={tabs} active={tab} onChange={(t) => { setTab(t); setPage(1) }} className="px-5" />
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--color-border)]">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search party, ref, or payment #..."
              className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base"
            />
          </div>
          <Button variant="secondary" size="sm" icon={<Filter size={13} />}>Filter</Button>
          <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} payments</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {["Payment", "Type", "Party", "Reference", "Method", "Date", "Account", "Amount", "Status"].map((h) => (
                  <th key={h} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${h === "Amount" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((pay) => {
                const [variant, label] = statusBadge(pay.status)
                return (
                  <tr key={pay.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer">
                    <td className="px-5 py-3 text-[13px] font-mono text-[var(--color-text)] whitespace-nowrap">{pay.id}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${pay.type === "incoming" ? "text-[var(--color-success)]" : "text-[var(--color-warning-text)]"}`}>
                        {pay.type === "incoming" ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                        {pay.type === "incoming" ? "In" : "Out"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-[var(--color-text)] max-w-[160px] truncate">{pay.party}</td>
                    <td className="px-5 py-3 text-[12px] font-mono text-[var(--color-text-secondary)]">{pay.ref}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{pay.method}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)] whitespace-nowrap">{fmtDate(pay.date)}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)] max-w-[120px] truncate">{pay.account}</td>
                    <td className={`px-5 py-3 text-[13px] font-semibold tabnum text-right ${pay.type === "incoming" ? "text-[var(--color-success)]" : "text-[var(--color-text)]"}`}>
                      {pay.type === "incoming" ? "+" : "−"}{fmtCurrency(pay.amount)}
                    </td>
                    <td className="px-5 py-3"><Badge variant={variant} size="sm" dot>{label}</Badge></td>
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
