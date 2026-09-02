"use client";

import { useState } from "react"
import {
  Plus, Search, RefreshCw, Link2, ArrowUpRight, ArrowDownLeft,
  Building2, CreditCard, Landmark, CheckSquare, AlertCircle,
  Download, Filter, MoreHorizontal, CheckCircle2, Clock,
} from "lucide-react"
import { accounts, transactions } from "../data/mock"
import {
  Button, Card, Badge, Tabs, SectionHeader, fmtCurrency, fmtDate,
  statusBadge, Pagination,
} from "../components/ui"

const ACCOUNT_ICONS: Record<string, React.ReactNode> = {
  checking: <Landmark size={16} />,
  savings: <Building2 size={16} />,
  credit: <CreditCard size={16} />,
  cash: <CheckSquare size={16} />,
}

export default function Banking() {
  const [activeAccount, setActiveAccount] = useState<string | null>(null)
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const totalBalance = accounts
    .filter((a) => a.type !== "credit")
    .reduce((s, a) => s + a.balance, 0)
  const creditTotal = accounts
    .filter((a) => a.type === "credit")
    .reduce((s, a) => s + Math.abs(a.balance), 0)

  const filteredTxns = transactions.filter((t) => {
    const matchTab = tab === "all" || (tab === "credits" && t.type === "credit") || (tab === "debits" && t.type === "debit") || (tab === "unreconciled" && !t.reconciled)
    const matchSearch = search === "" || t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Banking"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<RefreshCw size={13} />}>Sync All</Button>
            <Button variant="primary" size="sm" icon={<Link2 size={13} />}>Connect Account</Button>
          </div>
        }
      />

      {/* Account cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {accounts.map((account) => {
          const active = activeAccount === account.id
          return (
            <div
              key={account.id}
              onClick={() => setActiveAccount(active ? null : account.id)}
              className={`cursor-pointer rounded-[var(--radius-lg)] border transition-base p-4 flex flex-col gap-3 ${active ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)]" : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-text-secondary)]"}`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center ${active ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-border-subtle)] text-[var(--color-text-tertiary)]"}`}>
                  {ACCOUNT_ICONS[account.type]}
                </div>
                <Badge variant={statusBadge(account.status)[0]} size="sm">{statusBadge(account.status)[1]}</Badge>
              </div>
              <div>
                <div className="text-[12px] font-medium text-[var(--color-text)] truncate">{account.name}</div>
                <div className="text-[11px] text-[var(--color-text-tertiary)]">{account.institution}{account.number ? ` · ${account.number}` : ""}</div>
              </div>
              <div>
                <div className={`text-[18px] font-semibold tabnum tracking-tight ${account.balance < 0 ? "text-[var(--color-danger)]" : "text-[var(--color-text)]"}`}>
                  {fmtCurrency(account.balance)}
                </div>
                <div className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">Last sync: {account.lastSync}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">Total Cash & Savings</span>
          <span className="text-[20px] font-semibold tabnum text-[var(--color-text)]">{fmtCurrency(totalBalance)}</span>
        </Card>
        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">Credit Utilization</span>
          <span className="text-[20px] font-semibold tabnum text-[var(--color-text)]">{fmtCurrency(creditTotal)}</span>
          <div className="mt-1 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden w-full">
            <div className="h-full bg-[var(--color-warning)] rounded-full" style={{ width: "42%" }} />
          </div>
        </Card>
        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">Unreconciled Txns</span>
          <span className="text-[20px] font-semibold tabnum text-[var(--color-warning)]">
            {transactions.filter((t) => !t.reconciled).length}
          </span>
        </Card>
        <Card className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">This Month Cash In</span>
          <span className="text-[20px] font-semibold tabnum text-[var(--color-success)]">
            {fmtCurrency(transactions.filter((t) => t.type === "credit").reduce((s, t) => s + t.amount, 0))}
          </span>
        </Card>
      </div>

      {/* Transactions */}
      <Card padding="none">
        <Tabs
          tabs={[
            { id: "all", label: "All Transactions", count: transactions.length },
            { id: "credits", label: "Credits", count: transactions.filter((t) => t.type === "credit").length },
            { id: "debits", label: "Debits", count: transactions.filter((t) => t.type === "debit").length },
            { id: "unreconciled", label: "Unreconciled", count: transactions.filter((t) => !t.reconciled).length },
          ]}
          active={tab}
          onChange={(t) => { setTab(t); setPage(1) }}
          className="px-5"
        />

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--color-border)]">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base"
            />
          </div>
          <Button variant="secondary" size="sm" icon={<Filter size={13} />}>Filter</Button>
          <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
          <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">{filteredTxns.length} transactions</div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {["Date", "Description", "Category", "Account", "Amount", "Balance", "Status"].map((h) => (
                  <th key={h} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${["Amount", "Balance"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map((txn) => (
                <tr key={txn.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer group">
                  <td className="px-5 py-3 text-[12px] text-[var(--color-text-tertiary)] whitespace-nowrap">{fmtDate(txn.date)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${txn.type === "credit" ? "bg-[var(--color-success-bg)] text-[var(--color-success)]" : "bg-[var(--color-danger-bg)] text-[var(--color-danger)]"}`}>
                        {txn.type === "credit" ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                      </div>
                      <span className="text-[13px] text-[var(--color-text)] max-w-[280px] truncate">{txn.description}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">{txn.category}</span>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)] whitespace-nowrap">{txn.account}</td>
                  <td className={`px-5 py-3 text-[13px] font-semibold tabnum text-right whitespace-nowrap ${txn.type === "credit" ? "text-[var(--color-success)]" : "text-[var(--color-text)]"}`}>
                    {txn.type === "credit" ? "+" : "−"}{fmtCurrency(Math.abs(txn.amount))}
                  </td>
                  <td className="px-5 py-3 text-[12px] tabnum text-right text-[var(--color-text-tertiary)] whitespace-nowrap">{fmtCurrency(txn.balance)}</td>
                  <td className="px-5 py-3">
                    {txn.reconciled ? (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-[var(--color-success)]" />
                        <span className="text-[11px] text-[var(--color-success)]">Reconciled</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-[var(--color-warning)]" />
                        <Button variant="secondary" size="xs">Reconcile</Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageSize={10} total={filteredTxns.length} onChange={setPage} />
      </Card>
    </div>
  )
}
