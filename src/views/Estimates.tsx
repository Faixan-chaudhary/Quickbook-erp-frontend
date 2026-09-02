"use client";

import { useState } from "react"
import { Plus, Search, Download, Filter, FileCheck, ArrowRightLeft } from "lucide-react"
import { estimates } from "../data/mock"
import {
  Button, Badge, Card, Tabs, SectionHeader, Pagination,
  fmtCurrency, fmtDate, statusBadge,
} from "../components/ui"

export default function Estimates() {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = estimates.filter((e) => {
    const matchTab = tab === "all" || e.status === tab
    const matchSearch =
      search === "" ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.customer.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const countByStatus = (s: string) => estimates.filter((e) => e.status === s).length

  const tabs = [
    { id: "all", label: "All", count: estimates.length },
    { id: "draft", label: "Draft", count: countByStatus("draft") },
    { id: "sent", label: "Sent", count: countByStatus("sent") },
    { id: "accepted", label: "Accepted", count: countByStatus("accepted") },
    { id: "converted", label: "Converted", count: countByStatus("converted") },
    { id: "declined", label: "Declined", count: countByStatus("declined") },
  ]

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Estimates"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />}>New Estimate</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Estimates", value: fmtCurrency(estimates.reduce((s, e) => s + e.total, 0)), sub: `${estimates.length} estimates` },
          { label: "Open Pipeline", value: fmtCurrency(estimates.filter((e) => ["sent", "viewed", "draft"].includes(e.status)).reduce((s, e) => s + e.total, 0)), sub: `${estimates.filter((e) => ["sent", "viewed", "draft"].includes(e.status)).length} open` },
          { label: "Accepted", value: fmtCurrency(estimates.filter((e) => e.status === "accepted").reduce((s, e) => s + e.total, 0)), sub: `${countByStatus("accepted")} accepted` },
          { label: "Converted", value: fmtCurrency(estimates.filter((e) => e.status === "converted").reduce((s, e) => s + e.total, 0)), sub: `${countByStatus("converted")} converted` },
        ].map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{stat.label}</span>
            <span className="text-[20px] font-semibold tabnum tracking-tight text-[var(--color-text)]">{stat.value}</span>
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
              placeholder="Search by customer or estimate #..."
              className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base"
            />
          </div>
          <Button variant="secondary" size="sm" icon={<Filter size={13} />}>Filter</Button>
          <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} results</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {["Estimate #", "Customer", "Issue Date", "Expiry", "Items", "Amount", "Status", ""].map((h) => (
                  <th key={h || "actions"} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${h === "Amount" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((est) => {
                const [variant, label] = statusBadge(est.status)
                return (
                  <tr key={est.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer">
                    <td className="px-5 py-3 text-[13px] font-mono text-[var(--color-text)] whitespace-nowrap">{est.id}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-[9px] font-bold text-teal-700 shrink-0">
                          {est.customer[0]}
                        </div>
                        <span className="text-[13px] text-[var(--color-text)] max-w-[180px] truncate">{est.customer}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)] whitespace-nowrap">{fmtDate(est.issueDate)}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)] whitespace-nowrap">{fmtDate(est.expiryDate)}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{est.items}</td>
                    <td className="px-5 py-3 text-[13px] font-semibold tabnum text-right">{fmtCurrency(est.total)}</td>
                    <td className="px-5 py-3"><Badge variant={variant} size="sm" dot>{label}</Badge></td>
                    <td className="px-5 py-3">
                      {est.status === "accepted" && (
                        <Button variant="ghost" size="xs" icon={<ArrowRightLeft size={11} />}>Create SO</Button>
                      )}
                      {est.status === "draft" && (
                        <Button variant="ghost" size="xs" icon={<FileCheck size={11} />}>Send</Button>
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
