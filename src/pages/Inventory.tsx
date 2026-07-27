import { useState } from "react"
import { Plus, Search, Download, Filter, Package, AlertTriangle } from "lucide-react"
import { inventoryItems } from "../data/mock"
import {
  Button, Badge, Card, Tabs, SectionHeader, Pagination,
  fmtCurrency, statusBadge,
} from "../components/ui"

export default function Inventory() {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = inventoryItems.filter((item) => {
    const matchTab = tab === "all" || item.status === tab
    const matchSearch =
      search === "" ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const countByStatus = (s: string) => inventoryItems.filter((i) => i.status === s).length
  const totalValue = inventoryItems.reduce((s, i) => s + i.value, 0)

  const tabs = [
    { id: "all", label: "All", count: inventoryItems.length },
    { id: "in-stock", label: "In Stock", count: countByStatus("in-stock") },
    { id: "low-stock", label: "Low Stock", count: countByStatus("low-stock") },
    { id: "out-of-stock", label: "Out of Stock", count: countByStatus("out-of-stock") },
  ]

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Inventory"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />}>Add Item</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "SKUs", value: String(inventoryItems.length), sub: `${countByStatus("in-stock")} in stock` },
          { label: "Inventory Value", value: fmtCurrency(totalValue), sub: "" },
          { label: "Low Stock Alerts", value: String(countByStatus("low-stock")), sub: "", warn: true },
          { label: "Out of Stock", value: String(countByStatus("out-of-stock")), sub: "", danger: true },
        ].map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{stat.label}</span>
            <span className={`text-[20px] font-semibold tabnum tracking-tight ${(stat as { danger?: boolean }).danger ? "text-[var(--color-danger)]" : (stat as { warn?: boolean }).warn ? "text-[var(--color-warning)]" : "text-[var(--color-text)]"}`}>{stat.value}</span>
            {stat.sub ? <span className="text-[11px] text-[var(--color-text-tertiary)]">{stat.sub}</span> : null}
          </Card>
        ))}
      </div>

      {(countByStatus("low-stock") > 0 || countByStatus("out-of-stock") > 0) && (
        <Card className="flex items-center gap-3 bg-[var(--color-warning-bg)] border-[var(--color-warning-border)]">
          <AlertTriangle size={16} className="text-[var(--color-warning)] shrink-0" />
          <p className="text-[13px] text-[var(--color-warning-text)]">
            {countByStatus("low-stock") + countByStatus("out-of-stock")} items below reorder point.
          </p>
          <Button variant="secondary" size="sm" className="ml-auto shrink-0">Create POs</Button>
        </Card>
      )}

      <Card padding="none">
        <Tabs tabs={tabs} active={tab} onChange={(t) => { setTab(t); setPage(1) }} className="px-5" />
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--color-border)]">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, SKU, category..."
              className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base"
            />
          </div>
          <Button variant="secondary" size="sm" icon={<Filter size={13} />}>Filter</Button>
          <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} items</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {["Item", "SKU", "Category", "Location", "Qty", "Reorder At", "Unit Cost", "Value", "Status"].map((h) => (
                  <th key={h} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${["Qty", "Reorder At", "Unit Cost", "Value"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => {
                const [variant, label] = statusBadge(item.status)
                return (
                  <tr key={item.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-[var(--radius-md)] bg-[var(--color-border-subtle)] flex items-center justify-center shrink-0">
                          <Package size={12} className="text-[var(--color-text-tertiary)]" />
                        </div>
                        <span className="text-[13px] font-medium text-[var(--color-text)] max-w-[200px] truncate">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[12px] font-mono text-[var(--color-text-secondary)]">{item.sku}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{item.category}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{item.location}</td>
                    <td className="px-5 py-3 text-[13px] font-semibold tabnum text-right">{item.qty}</td>
                    <td className="px-5 py-3 text-[12px] tabnum text-right text-[var(--color-text-secondary)]">{item.reorderPoint}</td>
                    <td className="px-5 py-3 text-[12px] tabnum text-right text-[var(--color-text-secondary)]">{fmtCurrency(item.unitCost)}</td>
                    <td className="px-5 py-3 text-[13px] font-semibold tabnum text-right">{fmtCurrency(item.value)}</td>
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
