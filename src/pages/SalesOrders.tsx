import { useMemo, useState } from "react"
import { Plus, Search, Download, Filter, ClipboardList, FileText, PackageCheck, Trash2 } from "lucide-react"
import { salesOrders as initialSalesOrders, customers, estimates, products } from "../data/mock"
import {
  Button, Badge, Card, Tabs, SectionHeader, Pagination, Modal, Input, Select, Textarea,
  fmtCurrency, fmtDate, statusBadge, EmptyState,
} from "../components/ui"

type SalesOrder = (typeof initialSalesOrders)[number]

type LineItem = {
  id: string
  productId: string
  description: string
  qty: number
  rate: number
}

const emptyForm = {
  customerId: "",
  estimateId: "",
  orderDate: new Date().toISOString().slice(0, 10),
  expectedDate: "",
  notes: "",
}

function nextOrderId(orders: SalesOrder[]) {
  const nums = orders.map((o) => Number(o.id.split("-").pop())).filter((n) => !Number.isNaN(n))
  const next = (Math.max(0, ...nums) + 1).toString().padStart(4, "0")
  return `SO-2024-${next}`
}

export default function SalesOrders() {
  const [orders, setOrders] = useState<SalesOrder[]>(initialSalesOrders)
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [lines, setLines] = useState<LineItem[]>([
    { id: "line-1", productId: "", description: "", qty: 1, rate: 0 },
  ])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2500)
  }

  const filtered = orders.filter((so) => {
    const matchTab = tab === "all" || so.status === tab
    const matchSearch =
      search === "" ||
      so.id.toLowerCase().includes(search.toLowerCase()) ||
      so.customer.toLowerCase().includes(search.toLowerCase()) ||
      (so.estimateId?.toLowerCase().includes(search.toLowerCase()) ?? false)
    return matchTab && matchSearch
  })

  const paged = filtered.slice((page - 1) * 10, page * 10)

  const countByStatus = (s: string) => orders.filter((o) => o.status === s).length
  const openStatuses = ["draft", "confirmed", "partially-fulfilled"]

  const customerOptions = [
    { value: "", label: "Select customer..." },
    ...customers.filter((c) => c.status === "active").map((c) => ({ value: c.id, label: c.name })),
  ]

  const estimateOptions = useMemo(() => {
    const related = estimates.filter(
      (e) =>
        (!form.customerId || e.customerId === form.customerId) &&
        ["accepted", "sent", "viewed"].includes(e.status),
    )
    return [
      { value: "", label: "None (direct order)" },
      ...related.map((e) => ({ value: e.id, label: `${e.id} — ${fmtCurrency(e.total)}` })),
    ]
  }, [form.customerId])

  const productOptions = [
    { value: "", label: "Select product..." },
    ...products.filter((p) => p.status === "active").map((p) => ({ value: p.id, label: `${p.name} (${fmtCurrency(p.price)})` })),
  ]

  const lineTotal = lines.reduce((s, l) => s + l.qty * l.rate, 0)
  const taxTotal = Math.round(lineTotal * 0.08)
  const grandTotal = lineTotal + taxTotal

  const tabs = [
    { id: "all", label: "All", count: orders.length },
    { id: "draft", label: "Draft", count: countByStatus("draft") },
    { id: "confirmed", label: "Confirmed", count: countByStatus("confirmed") },
    { id: "partially-fulfilled", label: "Partial", count: countByStatus("partially-fulfilled") },
    { id: "fulfilled", label: "Fulfilled", count: countByStatus("fulfilled") },
    { id: "invoiced", label: "Invoiced", count: countByStatus("invoiced") },
    { id: "cancelled", label: "Cancelled", count: countByStatus("cancelled") },
  ]

  const openModal = () => {
    setForm(emptyForm)
    setLines([{ id: "line-1", productId: "", description: "", qty: 1, rate: 0 }])
    setErrors({})
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setErrors({})
  }

  const updateLine = (id: string, patch: Partial<LineItem>) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)))
  }

  const onProductChange = (lineId: string, productId: string) => {
    const product = products.find((p) => p.id === productId)
    updateLine(lineId, {
      productId,
      description: product?.name ?? "",
      rate: product?.price ?? 0,
    })
  }

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      { id: `line-${Date.now()}`, productId: "", description: "", qty: 1, rate: 0 },
    ])
  }

  const removeLine = (id: string) => {
    setLines((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.id !== id)))
  }

  const onEstimateChange = (estimateId: string) => {
    setForm((f) => ({ ...f, estimateId }))
    const est = estimates.find((e) => e.id === estimateId)
    if (!est) return
    setForm((f) => ({
      ...f,
      estimateId,
      customerId: est.customerId,
      expectedDate: est.expiryDate,
    }))
    setLines([
      {
        id: "line-est",
        productId: "",
        description: `From ${est.id}`,
        qty: est.items,
        rate: Math.round(est.amount / Math.max(1, est.items)),
      },
    ])
  }

  const validate = () => {
    const next: Record<string, string> = {}
    if (!form.customerId) next.customerId = "Customer is required"
    if (!form.orderDate) next.orderDate = "Order date is required"
    if (!form.expectedDate) next.expectedDate = "Expected date is required"
    if (lines.every((l) => !l.description || l.qty <= 0 || l.rate <= 0)) {
      next.lines = "Add at least one valid line item"
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const saveOrder = (asConfirmed: boolean) => {
    if (!validate()) return
    const customer = customers.find((c) => c.id === form.customerId)
    if (!customer) return

    const order: SalesOrder = {
      id: nextOrderId(orders),
      customer: customer.name,
      customerId: customer.id,
      estimateId: form.estimateId || null,
      amount: lineTotal,
      tax: taxTotal,
      total: grandTotal,
      status: asConfirmed ? "confirmed" : "draft",
      orderDate: form.orderDate,
      expectedDate: form.expectedDate,
      items: lines.filter((l) => l.description).length,
      fulfilled: 0,
    }

    setOrders((prev) => [order, ...prev])
    closeModal()
    setTab(asConfirmed ? "confirmed" : "draft")
    setPage(1)
    showToast(`${order.id} created as ${asConfirmed ? "Confirmed" : "Draft"}`)
  }

  const updateStatus = (id: string, status: SalesOrder["status"]) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        if (status === "fulfilled") return { ...o, status, fulfilled: o.items }
        if (status === "partially-fulfilled") return { ...o, status, fulfilled: Math.max(1, Math.floor(o.items / 2)) }
        return { ...o, status }
      }),
    )
    const labels: Record<string, string> = {
      confirmed: "confirmed",
      fulfilled: "marked fulfilled",
      invoiced: "converted to invoice",
      "partially-fulfilled": "partially fulfilled",
    }
    showToast(`${id} ${labels[status] ?? `updated to ${status}`}`)
  }

  return (
    <div className="p-6 flex flex-col gap-5 w-full relative">
      {toast && (
        <div className="fixed bottom-5 right-5 z-[110] px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-text)] text-[var(--color-surface)] text-[13px] font-medium shadow-lg">
          {toast}
        </div>
      )}

      <SectionHeader
        title="Sales Orders"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={openModal}>
              New Sales Order
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Orders", value: fmtCurrency(orders.reduce((s, o) => s + o.total, 0)), sub: `${orders.length} orders` },
          { label: "Open Pipeline", value: fmtCurrency(orders.filter((o) => openStatuses.includes(o.status)).reduce((s, o) => s + o.total, 0)), sub: `${orders.filter((o) => openStatuses.includes(o.status)).length} open` },
          { label: "Fulfilled", value: fmtCurrency(orders.filter((o) => o.status === "fulfilled").reduce((s, o) => s + o.total, 0)), sub: `${countByStatus("fulfilled")} ready to invoice` },
          { label: "Invoiced", value: fmtCurrency(orders.filter((o) => o.status === "invoiced").reduce((s, o) => s + o.total, 0)), sub: `${countByStatus("invoiced")} converted` },
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
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by customer, SO #, or estimate..."
              className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base"
            />
          </div>
          <Button variant="secondary" size="sm" icon={<Filter size={13} />}>Filter</Button>
          <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} orders</div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={20} />}
            title="No sales orders found"
            description="Create a sales order from an accepted estimate or as a direct customer order."
            action={<Button variant="primary" size="sm" icon={<Plus size={13} />} onClick={openModal}>New Sales Order</Button>}
          />
        ) : (
          <>
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
                  {paged.map((so) => {
                    const [variant, label] = statusBadge(so.status)
                    return (
                      <tr key={so.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base">
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
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            {so.status === "draft" && (
                              <Button variant="ghost" size="xs" icon={<ClipboardList size={11} />} onClick={() => updateStatus(so.id, "confirmed")}>Confirm</Button>
                            )}
                            {so.status === "confirmed" && (
                              <Button variant="ghost" size="xs" icon={<PackageCheck size={11} />} onClick={() => updateStatus(so.id, "fulfilled")}>Fulfill</Button>
                            )}
                            {so.status === "partially-fulfilled" && (
                              <Button variant="ghost" size="xs" icon={<PackageCheck size={11} />} onClick={() => updateStatus(so.id, "fulfilled")}>Complete</Button>
                            )}
                            {so.status === "fulfilled" && (
                              <Button variant="ghost" size="xs" icon={<FileText size={11} />} onClick={() => updateStatus(so.id, "invoiced")}>Invoice</Button>
                            )}
                          </div>
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

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="New Sales Order"
        description="Create a sales order from an estimate or directly for a customer."
        width="xl"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={closeModal}>Cancel</Button>
            <Button variant="secondary" size="sm" onClick={() => saveOrder(false)}>Save as Draft</Button>
            <Button variant="primary" size="sm" onClick={() => saveOrder(true)}>Confirm Order</Button>
          </>
        }
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Customer"
              required
              options={customerOptions}
              value={form.customerId}
              error={errors.customerId}
              onChange={(e) => setForm((f) => ({ ...f, customerId: e.target.value, estimateId: "" }))}
            />
            <Select
              label="Linked Estimate"
              options={estimateOptions}
              value={form.estimateId}
              onChange={(e) => onEstimateChange(e.target.value)}
            />
            <Input
              label="Order Date"
              type="date"
              required
              value={form.orderDate}
              error={errors.orderDate}
              onChange={(e) => setForm((f) => ({ ...f, orderDate: e.target.value }))}
            />
            <Input
              label="Expected Fulfillment"
              type="date"
              required
              value={form.expectedDate}
              error={errors.expectedDate}
              onChange={(e) => setForm((f) => ({ ...f, expectedDate: e.target.value }))}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] font-medium text-[var(--color-text)]">Line Items</label>
              <Button variant="ghost" size="xs" icon={<Plus size={11} />} onClick={addLine}>Add line</Button>
            </div>
            {errors.lines && <p className="text-[11px] text-[var(--color-danger)] mb-2">{errors.lines}</p>}
            <div className="border border-[var(--color-border)] rounded-[var(--radius-md)] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[var(--color-border-subtle)] border-b border-[var(--color-border)]">
                    {["Product", "Description", "Qty", "Rate", "Amount", ""].map((h) => (
                      <th key={h || "rm"} className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${["Qty", "Rate", "Amount"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line) => (
                    <tr key={line.id} className="border-b border-[var(--color-border-subtle)] last:border-0">
                      <td className="px-2 py-2 min-w-[180px]">
                        <select
                          value={line.productId}
                          onChange={(e) => onProductChange(line.id, e.target.value)}
                          className="w-full h-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[12px] text-[var(--color-text)] px-2 focus:outline-none focus:border-[var(--color-accent)]"
                        >
                          {productOptions.map((o) => (
                            <option key={o.value || "empty"} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-2 py-2">
                        <input
                          value={line.description}
                          onChange={(e) => updateLine(line.id, { description: e.target.value })}
                          placeholder="Description"
                          className="w-full h-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[12px] text-[var(--color-text)] px-2 focus:outline-none focus:border-[var(--color-accent)]"
                        />
                      </td>
                      <td className="px-2 py-2 w-20">
                        <input
                          type="number"
                          min={1}
                          value={line.qty}
                          onChange={(e) => updateLine(line.id, { qty: Number(e.target.value) || 0 })}
                          className="w-full h-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[12px] text-[var(--color-text)] px-2 text-right tabnum focus:outline-none focus:border-[var(--color-accent)]"
                        />
                      </td>
                      <td className="px-2 py-2 w-28">
                        <input
                          type="number"
                          min={0}
                          value={line.rate}
                          onChange={(e) => updateLine(line.id, { rate: Number(e.target.value) || 0 })}
                          className="w-full h-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[12px] text-[var(--color-text)] px-2 text-right tabnum focus:outline-none focus:border-[var(--color-accent)]"
                        />
                      </td>
                      <td className="px-3 py-2 text-[12px] font-medium tabnum text-right whitespace-nowrap">
                        {fmtCurrency(line.qty * line.rate)}
                      </td>
                      <td className="px-2 py-2">
                        <button
                          type="button"
                          onClick={() => removeLine(line.id)}
                          disabled={lines.length <= 1}
                          className="w-7 h-7 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4">
            <Textarea
              label="Notes"
              placeholder="Delivery notes, special instructions..."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
            <div className="flex flex-col gap-2 p-3 rounded-[var(--radius-md)] bg-[var(--color-border-subtle)]">
              <div className="flex justify-between text-[12px]">
                <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                <span className="tabnum font-medium text-[var(--color-text)]">{fmtCurrency(lineTotal)}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-[var(--color-text-secondary)]">Tax (8%)</span>
                <span className="tabnum font-medium text-[var(--color-text)]">{fmtCurrency(taxTotal)}</span>
              </div>
              <div className="flex justify-between text-[13px] pt-2 border-t border-[var(--color-border)]">
                <span className="font-semibold text-[var(--color-text)]">Total</span>
                <span className="tabnum font-semibold text-[var(--color-text)]">{fmtCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
