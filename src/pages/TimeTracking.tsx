import { useState } from "react"
import { Plus, Search, Download, Filter, Clock } from "lucide-react"
import { timeEntries } from "../data/mock"
import {
  Button, Badge, Card, Tabs, SectionHeader, Pagination,
  fmtCurrency, fmtDate, statusBadge,
} from "../components/ui"

export default function TimeTracking() {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = timeEntries.filter((t) => {
    const matchTab =
      tab === "all" ||
      t.status === tab ||
      (tab === "billable" && t.billable) ||
      (tab === "non-billable" && !t.billable)
    const matchSearch =
      search === "" ||
      t.employee.toLowerCase().includes(search.toLowerCase()) ||
      t.project.toLowerCase().includes(search.toLowerCase()) ||
      t.task.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const totalHours = timeEntries.reduce((s, t) => s + t.hours, 0)
  const billableHours = timeEntries.filter((t) => t.billable).reduce((s, t) => s + t.hours, 0)
  const billableValue = timeEntries.filter((t) => t.billable).reduce((s, t) => s + t.hours * t.rate, 0)
  const pending = timeEntries.filter((t) => t.status === "pending").length

  const tabs = [
    { id: "all", label: "All", count: timeEntries.length },
    { id: "pending", label: "Pending", count: pending },
    { id: "approved", label: "Approved", count: timeEntries.filter((t) => t.status === "approved").length },
    { id: "billable", label: "Billable", count: timeEntries.filter((t) => t.billable).length },
    { id: "non-billable", label: "Non-billable", count: timeEntries.filter((t) => !t.billable).length },
  ]

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Time Tracking"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />}>Log Time</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Hours", value: `${totalHours.toFixed(1)}h`, sub: "" },
          { label: "Billable Hours", value: `${billableHours.toFixed(1)}h`, sub: `${Math.round((billableHours / totalHours) * 100)}% of total` },
          { label: "Billable Value", value: fmtCurrency(Math.round(billableValue)), sub: "" },
          { label: "Pending Approval", value: String(pending), sub: "", warn: true },
        ].map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{stat.label}</span>
            <span className={`text-[20px] font-semibold tabnum tracking-tight ${(stat as { warn?: boolean }).warn ? "text-[var(--color-warning)]" : "text-[var(--color-text)]"}`}>{stat.value}</span>
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
              placeholder="Search employee, project, task..."
              className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base"
            />
          </div>
          <Button variant="secondary" size="sm" icon={<Filter size={13} />}>Filter</Button>
          <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} entries</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {["Date", "Employee", "Project", "Task", "Hours", "Rate", "Value", "Type", "Status"].map((h) => (
                  <th key={h} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${["Hours", "Rate", "Value"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const [variant, label] = statusBadge(entry.status)
                return (
                  <tr key={entry.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer">
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)] whitespace-nowrap">{fmtDate(entry.date)}</td>
                    <td className="px-5 py-3 text-[13px] font-medium text-[var(--color-text)]">{entry.employee}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)] max-w-[180px] truncate">{entry.project}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <Clock size={11} className="text-[var(--color-text-tertiary)]" />
                        <span className="text-[12px] text-[var(--color-text)]">{entry.task}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[13px] font-semibold tabnum text-right">{entry.hours.toFixed(1)}</td>
                    <td className="px-5 py-3 text-[12px] tabnum text-right text-[var(--color-text-secondary)]">
                      {entry.rate ? fmtCurrency(entry.rate) : "—"}
                    </td>
                    <td className="px-5 py-3 text-[13px] font-semibold tabnum text-right">
                      {entry.billable ? fmtCurrency(Math.round(entry.hours * entry.rate)) : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={entry.billable ? "success" : "neutral"} size="sm">
                        {entry.billable ? "Billable" : "Non-billable"}
                      </Badge>
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
