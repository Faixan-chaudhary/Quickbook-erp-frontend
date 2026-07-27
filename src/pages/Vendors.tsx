import { useState } from "react"
import { Plus, Search, Download, Building2, ExternalLink, Mail } from "lucide-react"
import { vendors } from "../data/mock"
import { Button, Card, Badge, SectionHeader, fmtCurrency, fmtDate, statusBadge, Avatar, Pagination } from "../components/ui"

export default function Vendors() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = vendors.filter(
    (v) => search === "" || v.name.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Vendors"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />}>Add Vendor</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Vendors", value: String(vendors.length), sub: `${vendors.filter((v) => v.status === "active").length} active` },
          { label: "Total Spend (YTD)", value: fmtCurrency(vendors.reduce((s, v) => s + v.totalSpend, 0)), sub: "" },
          { label: "Outstanding AP", value: fmtCurrency(vendors.reduce((s, v) => s + v.balance, 0)), sub: "" },
          { label: "Largest Vendor", value: "AWS", sub: fmtCurrency(342000) + " YTD" },
        ].map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{stat.label}</span>
            <span className="text-[20px] font-semibold tabnum tracking-tight text-[var(--color-text)]">{stat.value}</span>
            {stat.sub ? <span className="text-[11px] text-[var(--color-text-tertiary)]">{stat.sub}</span> : null}
          </Card>
        ))}
      </div>

      <Card padding="none">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--color-border)]">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vendors..." className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base" />
          </div>
          <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} vendors</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {["Vendor", "Category", "Payment Terms", "Balance", "Total Spend (YTD)", "Status", ""].map((h) => (
                  <th key={h} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${["Balance", "Total Spend (YTD)"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((vendor) => {
                const [variant, label] = statusBadge(vendor.status)
                return (
                  <tr key={vendor.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={vendor.name} size="sm" />
                        <div>
                          <div className="text-[13px] font-medium text-[var(--color-text)]">{vendor.name}</div>
                          <div className="text-[11px] text-[var(--color-text-tertiary)]">{vendor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">{vendor.category}</span>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{vendor.paymentTerms}</td>
                    <td className={`px-5 py-3 text-[13px] font-medium tabnum text-right ${vendor.balance > 0 ? "text-[var(--color-text)]" : "text-[var(--color-text-tertiary)]"}`}>{fmtCurrency(vendor.balance)}</td>
                    <td className="px-5 py-3 text-[13px] tabnum text-right text-[var(--color-text-secondary)]">{fmtCurrency(vendor.totalSpend)}</td>
                    <td className="px-5 py-3"><Badge variant={variant} size="sm" dot>{label}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-base">
                        <Button variant="ghost" size="xs" icon={<Mail size={11} />}>Email</Button>
                        <Button variant="secondary" size="xs">Create Bill</Button>
                      </div>
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
