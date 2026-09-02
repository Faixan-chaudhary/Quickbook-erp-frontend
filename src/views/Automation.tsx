"use client";

import { useState } from "react"
import { Plus, Search, Filter, Zap, Play, Pause } from "lucide-react"
import { automations } from "../data/mock"
import {
  Button, Badge, Card, Tabs, SectionHeader, Pagination,
  fmtDate, statusBadge,
} from "../components/ui"

export default function Automation() {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const categories = ["all", ...Array.from(new Set(automations.map((a) => a.category)))]

  const filtered = automations.filter((a) => {
    const matchTab =
      tab === "all" ||
      a.status === tab ||
      a.category === tab
    const matchSearch =
      search === "" ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.trigger.toLowerCase().includes(search.toLowerCase()) ||
      a.action.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const enabled = automations.filter((a) => a.status === "enabled").length
  const totalRuns = automations.reduce((s, a) => s + a.runs, 0)

  const tabs = [
    { id: "all", label: "All", count: automations.length },
    { id: "enabled", label: "Enabled", count: enabled },
    { id: "disabled", label: "Disabled", count: automations.filter((a) => a.status === "disabled").length },
    ...categories.filter((c) => c !== "all").map((c) => ({
      id: c,
      label: c,
      count: automations.filter((a) => a.category === c).length,
    })),
  ]

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Automation"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Filter size={13} />}>Templates</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />}>New Automation</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Rules", value: String(enabled), sub: `${automations.length} total` },
          { label: "Total Runs", value: totalRuns.toLocaleString(), sub: "" },
          { label: "Categories", value: String(categories.length - 1), sub: "" },
          { label: "Avg runs / rule", value: String(Math.round(totalRuns / automations.length)), sub: "" },
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
              placeholder="Search automations..."
              className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base"
            />
          </div>
          <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} rules</div>
        </div>

        <div className="divide-y divide-[var(--color-border-subtle)]">
          {filtered.map((auto) => {
            const [variant, label] = statusBadge(auto.status)
            return (
              <div key={auto.id} className="px-5 py-4 flex items-start gap-4 hover:bg-[var(--color-border-subtle)] transition-base">
                <div className={`w-9 h-9 rounded-[var(--radius-lg)] flex items-center justify-center shrink-0 ${auto.status === "enabled" ? "bg-[var(--color-accent-subtle)] text-[var(--color-primary)]" : "bg-[var(--color-border-subtle)] text-[var(--color-text-tertiary)]"}`}>
                  <Zap size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[13px] font-semibold text-[var(--color-text)]">{auto.name}</h3>
                    <Badge variant={variant} size="sm" dot>{label}</Badge>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">{auto.category}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[12px] text-[var(--color-text-secondary)]">
                    <span><span className="font-medium text-[var(--color-text-tertiary)]">IF</span> {auto.trigger}</span>
                    <span className="hidden sm:inline text-[var(--color-text-tertiary)]">→</span>
                    <span><span className="font-medium text-[var(--color-text-tertiary)]">THEN</span> {auto.action}</span>
                  </div>
                  <div className="mt-1.5 text-[11px] text-[var(--color-text-tertiary)]">
                    {auto.runs} runs · Last run {fmtDate(auto.lastRun)}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {auto.status === "enabled" ? (
                    <Button variant="ghost" size="xs" icon={<Pause size={11} />}>Pause</Button>
                  ) : (
                    <Button variant="ghost" size="xs" icon={<Play size={11} />}>Enable</Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <Pagination page={page} pageSize={10} total={filtered.length} onChange={setPage} />
      </Card>
    </div>
  )
}
