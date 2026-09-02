"use client";

import { useState } from "react"
import {
  Plus, Search, Download, Filter, MoreHorizontal,
  Mail, Phone, MapPin, Users, TrendingUp, DollarSign,
  ChevronRight, Edit2, Trash2, Eye,
} from "lucide-react"
import { customers } from "../data/mock"
import {
  Button, Badge, Card, Input, SectionHeader, Pagination,
  fmtCurrency, fmtDate, statusBadge, Avatar, EmptyState,
} from "../components/ui"

export default function Customers() {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [activeCustomer, setActiveCustomer] = useState<typeof customers[0] | null>(null)
  const [view, setView] = useState<"table" | "grid">("table")

  const filtered = customers.filter(
    (c) =>
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()),
  )

  const totalCustomers = customers.length
  const activeCount = customers.filter((c) => c.status === "active").length
  const totalAR = customers.reduce((s, c) => s + c.balance, 0)

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Customers"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />}>Add Customer</Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Customers", value: String(totalCustomers), icon: <Users size={14} />, sub: `${activeCount} active` },
          { label: "Total AR Balance", value: fmtCurrency(totalAR), icon: <DollarSign size={14} />, sub: "" },
          { label: "Avg Revenue / Customer", value: fmtCurrency(Math.round(customers.reduce((s, c) => s + c.totalInvoiced, 0) / customers.length)), icon: <TrendingUp size={14} />, sub: "" },
          { label: "Overdue Customers", value: String(customers.filter((c) => c.status === "overdue").length), icon: <TrendingUp size={14} />, sub: "", danger: true },
        ].map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{stat.label}</span>
            <span className={`text-[20px] font-semibold tabnum tracking-tight ${(stat as {danger?: boolean}).danger ? "text-[var(--color-danger)]" : "text-[var(--color-text)]"}`}>{stat.value}</span>
            {stat.sub ? <span className="text-[11px] text-[var(--color-text-tertiary)]">{stat.sub}</span> : null}
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        {/* Table */}
        <Card padding="none" className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--color-border)]">
            <div className="relative flex-1 max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, city..."
                className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base"
              />
            </div>
            <Button variant="secondary" size="sm" icon={<Filter size={13} />}>Filter</Button>
            {selected.size > 0 && (
              <div className="flex items-center gap-2 pl-2 border-l border-[var(--color-border)]">
                <span className="text-[12px] text-[var(--color-text-secondary)]">{selected.size} selected</span>
                <Button variant="ghost" size="sm" icon={<Mail size={12} />}>Email</Button>
                <Button variant="danger" size="sm" icon={<Trash2 size={12} />}>Delete</Button>
              </div>
            )}
            <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} customers</div>
          </div>

          {filtered.length === 0 ? (
            <EmptyState icon={<Users size={20} />} title="No customers found" description="No matching customers." action={<Button variant="primary" size="sm" icon={<Plus size={13} />}>Add Customer</Button>} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="w-10 px-5 py-2.5">
                        <input type="checkbox" checked={selected.size === filtered.length} onChange={() => selected.size === filtered.length ? setSelected(new Set()) : setSelected(new Set(filtered.map((c) => c.id)))} className="rounded accent-[var(--color-accent)]" />
                      </th>
                      {["Customer", "Email", "Location", "Total Invoiced", "Balance", "Status", ""].map((h) => (
                        <th key={h} className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${["Total Invoiced", "Balance"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((customer) => {
                      const [variant, label] = statusBadge(customer.status)
                      const isSelected = selected.has(customer.id)
                      return (
                        <tr
                          key={customer.id}
                          onClick={() => setActiveCustomer(activeCustomer?.id === customer.id ? null : customer)}
                          className={`border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] cursor-pointer transition-base group ${isSelected ? "bg-[var(--color-accent-subtle)]" : ""} ${activeCustomer?.id === customer.id ? "bg-[var(--color-border-subtle)]" : ""}`}
                        >
                          <td className="w-10 px-5 py-3" onClick={(e) => { e.stopPropagation(); toggleSelect(customer.id) }}>
                            <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(customer.id)} className="rounded accent-[var(--color-accent)]" />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={customer.name} size="sm" />
                              <div>
                                <div className="text-[13px] font-medium text-[var(--color-text)]">{customer.name}</div>
                                <div className="text-[11px] text-[var(--color-text-tertiary)]">{customer.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[12px] text-[var(--color-text-secondary)]">{customer.email}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <MapPin size={10} className="text-[var(--color-text-tertiary)]" />
                              <span className="text-[12px] text-[var(--color-text-secondary)]">{customer.city}, {customer.country}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-[13px] tabnum text-right text-[var(--color-text-secondary)]">{fmtCurrency(customer.totalInvoiced)}</td>
                          <td className={`px-4 py-3 text-[13px] font-medium tabnum text-right ${customer.balance > 0 ? "text-[var(--color-text)]" : "text-[var(--color-text-tertiary)]"}`}>{fmtCurrency(customer.balance)}</td>
                          <td className="px-4 py-3"><Badge variant={variant} size="sm" dot>{label}</Badge></td>
                          <td className="px-4 py-3">
                            <ChevronRight size={13} className="text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 transition-base" />
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

        {/* Detail panel */}
        {activeCustomer && (
          <div className="w-80 shrink-0 flex flex-col gap-3">
            <Card>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={activeCustomer.name} size="lg" />
                  <div>
                    <h3 className="text-[14px] font-semibold text-[var(--color-text)]">{activeCustomer.name}</h3>
                    <p className="text-[11px] text-[var(--color-text-tertiary)]">{activeCustomer.id}</p>
                  </div>
                </div>
                <button onClick={() => setActiveCustomer(null)} className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] cursor-pointer">✕</button>
              </div>
              <div className="mt-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Mail size={12} className="text-[var(--color-text-tertiary)] shrink-0" />
                  <span className="text-[12px] text-[var(--color-text-secondary)] truncate">{activeCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-[var(--color-text-tertiary)] shrink-0" />
                  <span className="text-[12px] text-[var(--color-text-secondary)]">{activeCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-[var(--color-text-tertiary)] shrink-0" />
                  <span className="text-[12px] text-[var(--color-text-secondary)]">{activeCustomer.city}, {activeCustomer.country}</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" size="sm" icon={<Edit2 size={12} />} full>Edit</Button>
                <Button variant="primary" size="sm" icon={<Plus size={12} />} full>Invoice</Button>
              </div>
            </Card>

            <Card>
              <h4 className="text-[12px] font-semibold text-[var(--color-text)] mb-3">Financial Summary</h4>
              <div className="space-y-2">
                {[
                  { label: "Total Invoiced", value: fmtCurrency(activeCustomer.totalInvoiced) },
                  { label: "Outstanding Balance", value: fmtCurrency(activeCustomer.balance) },
                  { label: "Credit Limit", value: fmtCurrency(activeCustomer.creditLimit) },
                  { label: "Last Payment", value: activeCustomer.lastPayment ? fmtDate(activeCustomer.lastPayment) : "—" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-[var(--color-border-subtle)] last:border-0">
                    <span className="text-[12px] text-[var(--color-text-secondary)]">{row.label}</span>
                    <span className="text-[12px] font-medium text-[var(--color-text)] tabnum">{row.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h4 className="text-[12px] font-semibold text-[var(--color-text)] mb-3">Status</h4>
              <div className="flex items-center gap-2">
                <Badge variant={statusBadge(activeCustomer.status)[0]} dot>{statusBadge(activeCustomer.status)[1]}</Badge>
                {activeCustomer.balance > 0 && activeCustomer.balance > activeCustomer.creditLimit * 0.8 && (
                  <Badge variant="warning" size="sm">Near credit limit</Badge>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
