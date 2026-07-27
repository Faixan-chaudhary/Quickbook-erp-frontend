import { useState } from "react"
import {
  Plus, Search, Download, Filter, MoreHorizontal, Send,
  Eye, Edit2, Trash2, Copy, CheckSquare, FileText, ArrowUpDown,
} from "lucide-react"
import { invoices } from "../data/mock"
import {
  Button, Badge, Card, Tabs, Input, SectionHeader, Pagination,
  fmtCurrency, fmtDate, statusBadge, EmptyState,
} from "../components/ui"

export default function Invoices() {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  const filtered = invoices.filter((inv) => {
    const matchTab = tab === "all" || inv.status === tab
    const matchSearch =
      search === "" ||
      inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const totalAmount = filtered.reduce((s, i) => s + i.total, 0)
  const countByStatus = (s: string) => invoices.filter((i) => i.status === s).length

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map((i) => i.id)))
  }

  const tabs = [
    { id: "all", label: "All", count: invoices.length },
    { id: "draft", label: "Draft", count: countByStatus("draft") },
    { id: "sent", label: "Sent", count: countByStatus("sent") },
    { id: "viewed", label: "Viewed", count: countByStatus("viewed") },
    { id: "overdue", label: "Overdue", count: countByStatus("overdue") },
    { id: "paid", label: "Paid", count: countByStatus("paid") },
  ]

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Invoices"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />}>New Invoice</Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Invoiced", value: fmtCurrency(invoices.reduce((s, i) => s + i.total, 0)), sub: `${invoices.length} invoices` },
          { label: "Outstanding", value: fmtCurrency(invoices.filter((i) => ["sent", "viewed"].includes(i.status)).reduce((s, i) => s + i.total, 0)), sub: `${invoices.filter((i) => ["sent", "viewed"].includes(i.status)).length} invoices` },
          { label: "Overdue", value: fmtCurrency(invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.total, 0)), sub: `${invoices.filter((i) => i.status === "overdue").length} invoices`, danger: true },
          { label: "Collected (YTD)", value: fmtCurrency(invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.total, 0)), sub: `${invoices.filter((i) => i.status === "paid").length} invoices` },
        ].map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{stat.label}</span>
            <span className={`text-[20px] font-semibold tabnum tracking-tight ${(stat as { danger?: boolean }).danger ? "text-[var(--color-danger)]" : "text-[var(--color-text)]"}`}>{stat.value}</span>
            {stat.sub ? <span className="text-[11px] text-[var(--color-text-tertiary)]">{stat.sub}</span> : null}
          </Card>
        ))}
      </div>

      {/* Table card */}
      <Card padding="none">
        {/* Tabs */}
        <Tabs tabs={tabs} active={tab} onChange={(t) => { setTab(t); setPage(1) }} className="px-5" />

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--color-border)]">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer or invoice #..."
              className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base"
            />
          </div>
          <Button variant="secondary" size="sm" icon={<Filter size={13} />}>Filter</Button>
          <Button variant="secondary" size="sm" icon={<ArrowUpDown size={13} />}>Sort</Button>
          {selected.size > 0 && (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-[var(--color-border)]">
              <span className="text-[12px] text-[var(--color-text-secondary)]">{selected.size} selected</span>
              <Button variant="ghost" size="sm" icon={<Send size={12} />}>Send</Button>
              <Button variant="ghost" size="sm" icon={<Download size={12} />}>Export</Button>
              <Button variant="danger" size="sm" icon={<Trash2 size={12} />}>Delete</Button>
            </div>
          )}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} results · {fmtCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileText size={20} />}
            title="No invoices found"
            description="No matching invoices."
            action={<Button variant="primary" size="sm" icon={<Plus size={13} />}>New Invoice</Button>}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="w-10 px-5 py-2.5">
                      <input
                        type="checkbox"
                        checked={selected.size === filtered.length && filtered.length > 0}
                        onChange={toggleAll}
                        className="rounded accent-[var(--color-accent)]"
                      />
                    </th>
                    {["Invoice #", "Customer", "Issue Date", "Due Date", "Amount", "Tax", "Total", "Status", ""].map((h) => (
                      <th
                        key={h}
                        className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] whitespace-nowrap ${["Amount", "Tax", "Total"].includes(h) ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((inv) => {
                    const [variant, label] = statusBadge(inv.status)
                    const isSelected = selected.has(inv.id)
                    return (
                      <tr
                        key={inv.id}
                        className={`border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer group ${isSelected ? "bg-[var(--color-accent-subtle)]" : ""}`}
                      >
                        <td className="w-10 px-5 py-3" onClick={(e) => { e.stopPropagation(); toggleSelect(inv.id) }}>
                          <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(inv.id)} className="rounded accent-[var(--color-accent)]" />
                        </td>
                        <td className="px-4 py-3 text-[13px] font-mono text-[var(--color-text)] whitespace-nowrap">{inv.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-[9px] font-bold text-teal-700 shrink-0">
                              {inv.customer[0]}
                            </div>
                            <span className="text-[13px] text-[var(--color-text)] max-w-[180px] truncate">{inv.customer}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[12px] text-[var(--color-text-secondary)] whitespace-nowrap">{fmtDate(inv.issueDate)}</td>
                        <td className={`px-4 py-3 text-[12px] whitespace-nowrap ${inv.status === "overdue" ? "text-[var(--color-danger)] font-medium" : "text-[var(--color-text-secondary)]"}`}>{fmtDate(inv.dueDate)}</td>
                        <td className="px-4 py-3 text-[13px] tabnum text-right text-[var(--color-text-secondary)]">{fmtCurrency(inv.amount)}</td>
                        <td className="px-4 py-3 text-[13px] tabnum text-right text-[var(--color-text-secondary)]">{fmtCurrency(inv.tax)}</td>
                        <td className="px-4 py-3 text-[13px] font-medium tabnum text-right text-[var(--color-text)]">{fmtCurrency(inv.total)}</td>
                        <td className="px-4 py-3"><Badge variant={variant} size="sm" dot>{label}</Badge></td>
                        <td className="px-4 py-3 relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === inv.id ? null : inv.id) }}
                            className="w-6 h-6 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-tertiary)] hover:bg-[var(--color-border)] opacity-0 group-hover:opacity-100 transition-base cursor-pointer"
                          >
                            <MoreHorizontal size={14} />
                          </button>
                          {activeMenu === inv.id && (
                            <div className="absolute right-4 top-10 w-44 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] z-20 py-1">
                              {[
                                { icon: <Eye size={13} />, label: "View" },
                                { icon: <Edit2 size={13} />, label: "Edit" },
                                { icon: <Send size={13} />, label: "Send" },
                                { icon: <Copy size={13} />, label: "Duplicate" },
                                { icon: <Download size={13} />, label: "Download PDF" },
                                { icon: <Trash2 size={13} />, label: "Delete", danger: true },
                              ].map((action) => (
                                <button
                                  key={action.label}
                                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-[12px] cursor-pointer transition-base ${(action as { danger?: boolean }).danger ? "text-[var(--color-danger-text)] hover:bg-[var(--color-danger-bg)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)]"}`}
                                >
                                  {action.icon} {action.label}
                                </button>
                              ))}
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
          </>
        )}
      </Card>

      {activeMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
      )}
    </div>
  )
}
