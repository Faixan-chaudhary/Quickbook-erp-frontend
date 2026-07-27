import { useState } from "react"
import {
  Plus, Search, Upload, Filter, Download, MoreHorizontal,
  Receipt, CheckCircle2, Clock, XCircle, Camera, Sparkles,
} from "lucide-react"
import { expenses } from "../data/mock"
import {
  Button, Card, Badge, Tabs, SectionHeader, fmtCurrency, fmtDate,
  statusBadge, Avatar, Pagination, EmptyState,
} from "../components/ui"

const CATEGORIES = ["All", "Travel", "Meals & Entertainment", "Software", "Office Supplies", "Training & Development", "Conferences"]

export default function Expenses() {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [showUpload, setShowUpload] = useState(false)

  const filtered = expenses.filter((e) => {
    const matchTab = tab === "all" || e.status === tab
    const matchSearch = search === "" || e.description.toLowerCase().includes(search.toLowerCase()) || e.employee.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === "All" || e.category === category
    return matchTab && matchSearch && matchCat
  })

  const totalAmount = filtered.reduce((s, e) => s + e.amount, 0)
  const pendingAmount = expenses.filter((e) => e.status === "pending").reduce((s, e) => s + e.amount, 0)
  const approvedAmount = expenses.filter((e) => e.status === "approved").reduce((s, e) => s + e.amount, 0)

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Expenses"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Camera size={13} />} onClick={() => setShowUpload(true)}>
              Scan Receipt
            </Button>
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />}>Add Expense</Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total (YTD)", value: fmtCurrency(expenses.reduce((s, e) => s + e.amount, 0)), sub: `${expenses.length} expenses` },
          { label: "Pending Approval", value: fmtCurrency(pendingAmount), sub: `${expenses.filter((e) => e.status === "pending").length} expenses`, warn: true },
          { label: "Approved (YTD)", value: fmtCurrency(approvedAmount), sub: `${expenses.filter((e) => e.status === "approved").length} expenses` },
          { label: "Missing Receipts", value: String(expenses.filter((e) => !e.receipt).length), sub: "", warn: true },
        ].map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{stat.label}</span>
            <span className={`text-[20px] font-semibold tabnum tracking-tight ${(stat as {warn?: boolean}).warn ? "text-[var(--color-warning)]" : "text-[var(--color-text)]"}`}>{stat.value}</span>
            {stat.sub ? <span className="text-[11px] text-[var(--color-text-tertiary)]">{stat.sub}</span> : null}
          </Card>
        ))}
      </div>

      {/* OCR Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowUpload(false)}>
          <div className="w-full max-w-md bg-[var(--color-surface)] rounded-[var(--radius-xl)] border border-[var(--color-border)] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[var(--radius-md)] bg-[var(--color-ai-bg)] flex items-center justify-center">
                  <Sparkles size={14} className="text-[var(--color-ai)]" />
                </div>
                <h3 className="text-[14px] font-semibold text-[var(--color-text)]">AI Receipt Scanner</h3>
              </div>
              <button onClick={() => setShowUpload(false)} className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] cursor-pointer">✕</button>
            </div>
            <div className="border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] p-8 text-center cursor-pointer hover:border-[var(--color-accent)] transition-base">
              <Upload size={24} className="mx-auto text-[var(--color-text-tertiary)] mb-3" />
              <p className="text-[13px] font-medium text-[var(--color-text)]">Drop receipt here or click to upload</p>
              <p className="text-[11px] text-[var(--color-text-tertiary)] mt-1">AI will automatically extract vendor, date, amount, and category</p>
              <p className="text-[10px] text-[var(--color-text-tertiary)] mt-2">JPG, PNG, PDF · Max 10MB</p>
            </div>
            <div className="mt-4 p-3 bg-[var(--color-ai-bg)] rounded-[var(--radius-md)]">
              <div className="flex items-start gap-2">
                <Sparkles size={12} className="text-[var(--color-ai)] mt-0.5 shrink-0" />
                <p className="text-[11px] text-[var(--color-ai-text)]">
                  AI auto-extracts: merchant name, total, tax, date, and suggests the expense category based on your existing patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card padding="none">
        <Tabs
          tabs={[
            { id: "all", label: "All", count: expenses.length },
            { id: "pending", label: "Pending", count: expenses.filter((e) => e.status === "pending").length },
            { id: "approved", label: "Approved", count: expenses.filter((e) => e.status === "approved").length },
          ]}
          active={tab}
          onChange={(t) => { setTab(t); setPage(1) }}
          className="px-5"
        />

        <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--color-border)]">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search expenses..." className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base" />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] px-3 focus:outline-none focus:border-[var(--color-accent)] transition-base cursor-pointer"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
          {selected.size > 0 && (
            <div className="flex items-center gap-2 pl-2 border-l border-[var(--color-border)]">
              <span className="text-[12px] text-[var(--color-text-secondary)]">{selected.size} selected</span>
              <Button variant="accent" size="sm" icon={<CheckCircle2 size={12} />}>Approve</Button>
              <Button variant="danger" size="sm" icon={<XCircle size={12} />}>Reject</Button>
            </div>
          )}
          <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} · {fmtCurrency(totalAmount)}</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="w-10 px-5 py-2.5">
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={() => selected.size === filtered.length ? setSelected(new Set()) : setSelected(new Set(filtered.map((e) => e.id)))} className="rounded accent-[var(--color-accent)]" />
                </th>
                {["Expense", "Employee", "Category", "Date", "Receipt", "Amount", "Status", ""].map((h) => (
                  <th key={h} className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${h === "Amount" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((exp) => {
                const [variant, label] = statusBadge(exp.status)
                const isSelected = selected.has(exp.id)
                return (
                  <tr key={exp.id} className={`border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer group ${isSelected ? "bg-[var(--color-accent-subtle)]" : ""}`}>
                    <td className="w-10 px-5 py-3" onClick={(e) => { e.stopPropagation(); const next = new Set(selected); isSelected ? next.delete(exp.id) : next.add(exp.id); setSelected(next) }}>
                      <input type="checkbox" checked={isSelected} onChange={() => {}} className="rounded accent-[var(--color-accent)]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-[var(--radius-md)] bg-[var(--color-border-subtle)] flex items-center justify-center shrink-0">
                          <Receipt size={12} className="text-[var(--color-text-tertiary)]" />
                        </div>
                        <div>
                          <div className="text-[13px] text-[var(--color-text)] max-w-[200px] truncate">{exp.description}</div>
                          <div className="text-[10px] text-[var(--color-text-tertiary)]">{exp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={exp.employee} size="xs" />
                        <span className="text-[12px] text-[var(--color-text-secondary)]">{exp.employee}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">{exp.category}</span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--color-text-tertiary)]">{fmtDate(exp.date)}</td>
                    <td className="px-4 py-3">
                      {exp.receipt ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-[var(--color-success)]" />
                          <span className="text-[11px] text-[var(--color-success)]">Attached</span>
                        </div>
                      ) : (
                        <Button variant="secondary" size="xs" icon={<Upload size={10} />}>Upload</Button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[13px] font-medium tabnum text-right">{fmtCurrency(exp.amount)}</td>
                    <td className="px-4 py-3"><Badge variant={variant} size="sm" dot>{label}</Badge></td>
                    <td className="px-4 py-3">
                      {exp.status === "pending" && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-base">
                          <Button variant="accent" size="xs">Approve</Button>
                          <Button variant="danger" size="xs">Reject</Button>
                        </div>
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
