import { useState } from "react"
import { Plus, Search, Download, Filter, Briefcase } from "lucide-react"
import { projects } from "../data/mock"
import {
  Button, Badge, Card, Tabs, SectionHeader, Pagination,
  fmtCurrency, fmtDate, statusBadge,
} from "../components/ui"

export default function Projects() {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = projects.filter((p) => {
    const matchTab = tab === "all" || p.status === tab
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.manager.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const countByStatus = (s: string) => projects.filter((p) => p.status === s).length
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0)
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0)
  const totalBillable = projects.reduce((s, p) => s + p.billable, 0)

  const tabs = [
    { id: "all", label: "All", count: projects.length },
    { id: "open", label: "Open", count: countByStatus("open") },
    { id: "in-progress", label: "In Progress", count: countByStatus("in-progress") },
    { id: "on-hold", label: "On Hold", count: countByStatus("on-hold") },
    { id: "completed", label: "Completed", count: countByStatus("completed") },
  ]

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Projects"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />}>New Project</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Projects", value: String(countByStatus("in-progress") + countByStatus("open")), sub: `${projects.length} total` },
          { label: "Total Budget", value: fmtCurrency(totalBudget), sub: `${fmtCurrency(totalSpent)} spent` },
          { label: "Billable Amount", value: fmtCurrency(totalBillable), sub: "" },
          { label: "Budget Used", value: `${Math.round((totalSpent / totalBudget) * 100)}%`, sub: "" },
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
              placeholder="Search project, client, manager..."
              className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base"
            />
          </div>
          <Button variant="secondary" size="sm" icon={<Filter size={13} />}>Filter</Button>
          <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} projects</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {["Project", "Client", "Manager", "Timeline", "Budget", "Spent", "Progress", "Status"].map((h) => (
                  <th key={h} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${["Budget", "Spent"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((prj) => {
                const [variant, label] = statusBadge(prj.status)
                const overBudget = prj.spent > prj.budget
                return (
                  <tr key={prj.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-[var(--radius-md)] bg-[var(--color-accent-subtle)] flex items-center justify-center shrink-0">
                          <Briefcase size={12} className="text-[var(--color-primary)]" />
                        </div>
                        <span className="text-[13px] font-medium text-[var(--color-text)] max-w-[220px] truncate">{prj.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)] max-w-[140px] truncate">{prj.client}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{prj.manager}</td>
                    <td className="px-5 py-3 text-[11px] text-[var(--color-text-secondary)] whitespace-nowrap">
                      {fmtDate(prj.startDate)} → {fmtDate(prj.endDate)}
                    </td>
                    <td className="px-5 py-3 text-[13px] tabnum text-right text-[var(--color-text-secondary)]">{fmtCurrency(prj.budget)}</td>
                    <td className={`px-5 py-3 text-[13px] font-semibold tabnum text-right ${overBudget ? "text-[var(--color-danger)]" : "text-[var(--color-text)]"}`}>{fmtCurrency(prj.spent)}</td>
                    <td className="px-5 py-3 min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-[var(--color-border-subtle)] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[var(--color-primary)]"
                            style={{ width: `${prj.progress}%` }}
                          />
                        </div>
                        <span className="text-[11px] tabnum text-[var(--color-text-secondary)] w-8">{prj.progress}%</span>
                      </div>
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
