import { useState } from "react"
import { Plus, Search, Download, Package, DollarSign, TrendingUp } from "lucide-react"
import { products } from "../data/mock"
import { Button, Card, Badge, SectionHeader, fmtCurrency, statusBadge, Pagination } from "../components/ui"

export default function Products() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = products.filter(
    (p) => search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Products & Services"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />}>Add Product</Button>
          </div>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">Total Items</span>
          <span className="text-[20px] font-semibold tabnum">{products.length}</span>
          <span className="text-[11px] text-[var(--color-text-tertiary)]">{products.filter((p) => p.status === "active").length} active</span>
        </Card>
        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">Total Revenue (YTD)</span>
          <span className="text-[20px] font-semibold tabnum">{fmtCurrency(products.reduce((s, p) => s + p.revenue, 0))}</span>
          <span className="text-[11px] text-[var(--color-text-tertiary)]">All products</span>
        </Card>
        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">Top Product</span>
          <span className="text-[13px] font-semibold text-[var(--color-text)]">Enterprise Plan</span>
          <span className="text-[11px] text-[var(--color-text-tertiary)]">{fmtCurrency(419916)} revenue</span>
        </Card>
        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">Avg Price</span>
          <span className="text-[20px] font-semibold tabnum">{fmtCurrency(Math.round(products.reduce((s, p) => s + p.price, 0) / products.length))}</span>
          <span className="text-[11px] text-[var(--color-text-tertiary)]">Per unit</span>
        </Card>
      </div>
      <Card padding="none">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--color-border)]">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base" />
          </div>
          <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} products</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {["Product / Service", "SKU", "Type", "Unit Price", "Unit", "Taxable", "YTD Revenue", "Status"].map((h) => (
                  <th key={h} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${["Unit Price", "YTD Revenue"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const [variant, label] = statusBadge(product.status)
                return (
                  <tr key={product.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-[var(--radius-md)] bg-[var(--color-border-subtle)] flex items-center justify-center shrink-0">
                          <Package size={12} className="text-[var(--color-text-tertiary)]" />
                        </div>
                        <span className="text-[13px] font-medium text-[var(--color-text)] max-w-[220px] truncate">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[12px] font-mono text-[var(--color-text-secondary)]">{product.sku}</td>
                    <td className="px-5 py-3"><span className="text-[11px] capitalize px-2 py-0.5 rounded bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">{product.type}</span></td>
                    <td className="px-5 py-3 text-[13px] font-medium tabnum text-right">{fmtCurrency(product.price)}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{product.unit}</td>
                    <td className="px-5 py-3"><Badge variant={product.taxable ? "warning" : "neutral"} size="sm">{product.taxable ? "Taxable" : "Non-taxable"}</Badge></td>
                    <td className="px-5 py-3 text-[13px] font-semibold tabnum text-right text-[var(--color-text)]">{fmtCurrency(product.revenue)}</td>
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
