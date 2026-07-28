import { useState } from "react"
import { Plus, Search, Download, Filter, ClipboardList, FileText, PackageCheck } from "lucide-react"
import { salesOrders } from "../data/mock"
import {
  Button, Badge, Card, Tabs, SectionHeader, Pagination,
  fmtCurrency, fmtDate, statusBadge,
} from "../components/ui"

export default function SalesOrders() {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = salesOrders.filter((so) => {
    const matchTab = tab === "all" || so.status === tab
    const matchSearch =
      search === "" ||
      so.id.toLowerCase().includes(search.toLowerCase()) ||
      so.customer.toLowerCase().includes(search.toLowerCase()) ||
      (so.estimateId?.toLowerCase().includes(search.toLowerCase()) ?? false)
    return matchTab && matchSearch
  })

  const countByStatus = (s: string) => salesOrders.filter((o) => o.status === s).length
  const openStatuses = ["draft", "confirmed", "partially-fulfilled"]

  const tabs = [
    { id: "all", label: "All", count: salesOrders.length },
    { id: "draft", label: "Draft", count: countByStatus("draft") },
    { id: "confirmed", label: "Confirmed", count: countByStatus("confirmed") },
    { id: "partially-fulfilled", label: "Partial", count: countByStatus("partially-fulfilled") },
    { id: "fulfilled", label: "Fulfilled", count: countByStatus("fulfilled") },
    { id: "invoiced", label: "Invoiced", count: countByStatus("invoiced") },
    { id: "cancelled", label: "Cancelled", count: countByStatus("cancelled") },
  ]

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Sales Orders"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />}>New Sales Order</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Orders", value: fmtCurrency(salesOrders.reduce((s, o) => s + o.total, 0)), sub: `${salesOrders.length} orders` },
          { label: "Open Pipeline", value: fmtCurrency(salesOrders.filter((o) => openStatuses.includes(o.status)).reduce((s, o) => s + o.total, 0)), sub: `${salesOrders.filter((o) => openStatuses.includes(o.status)).length} open` },
          { label: "Fulfilled", value: fmtCurrency(salesOrders.filter((o) => o.status === "fulfilled").reduce((s, o) => s + o.total, 0)), sub: `${countByStatus("fulfilled")} ready to invoice` },
          { label: "Invoiced", value: fmtCurrency(salesOrders.filter((o) => o.status === "invoiced").reduce((s, o) => s + o.total, 0)), sub: `${countByStatus("invoiced")} converted` },
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
              placeholder="Search by customer, SO #, or estimate..."
              className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base"
            />
          </div>
          <Button variant="secondary" size="sm" icon={<Filter size={13} />}>Filter</Button>
          <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} orders</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {["SO #", "Customer", "Estimate", "Order Date", "Expected", "Fulfilled", "Amount", "Status", ""].map((h) => (
                  <th key={h || "actions"} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${h === "Amount" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((so) => {
                const [variant, label] = statusBadge(so.status)
                return (
                  <tr key={so.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer">
                    <td className="px-5 py-3 text-[13px] font-mono text-[var(--color-text)] whitespace-nowrap">{so.id}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[9px] font-bold text-indigo-700 shrink-0">
                          {so.customer[0]}
                        </div>
                        <span className="text-[13px] text-[var(--color-text)] max-w-[180px] truncate">{so.customer}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[12px] font-mono text-[var(--color-text-secondary)] whitespace-nowrap">
                      {so.estimateId ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)] whitespace-nowrap">{fmtDate(so.orderDate)}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)] whitespace-nowrap">{fmtDate(so.expectedDate)}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{so.fulfilled}/{so.items}</td>
                    <td className="px-5 py-3 text-[13px] font-semibold tabnum text-right">{fmtCurrency(so.total)}</td>
                    <td className="px-5 py-3"><Badge variant={variant} size="sm" dot>{label}</Badge></td>
                    <td className="px-5 py-3">
                      {so.status === "fulfilled" && (
                        <Button variant="ghost" size="xs" icon={<FileText size={11} />}>Invoice</Button>
                      )}
                      {so.status === "confirmed" && (
                        <Button variant="ghost" size="xs" icon={<PackageCheck size={11} />}>Fulfill</Button>
                      )}
                      {so.status === "draft" && (
                        <Button variant="ghost" size="xs" icon={<ClipboardList size={11} />}>Confirm</Button>
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
