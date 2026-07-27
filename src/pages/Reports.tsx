import { useState } from "react"
import {
  BarChart3, TrendingUp, FileText, Download, Calendar,
  PieChart, ArrowUpRight, ArrowDownRight, ChevronRight,
} from "lucide-react"
import {
  BarChart, Bar, LineChart, Line, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts"
import { revenueData } from "../data/mock"
import { Button, Card, Tabs, SectionHeader, fmtCurrency } from "../components/ui"
import { ChartReveal } from "../components/ChartReveal"

const REPORT_CARDS = [
  { id: "pl", title: "Profit & Loss", icon: <TrendingUp size={16} />, desc: "Revenue, expenses, and net income by period", category: "Financial" },
  { id: "bs", title: "Balance Sheet", icon: <BarChart3 size={16} />, desc: "Assets, liabilities, and equity snapshot", category: "Financial" },
  { id: "cf", title: "Cash Flow Statement", icon: <ArrowUpRight size={16} />, desc: "Operating, investing, and financing activities", category: "Financial" },
  { id: "ar-aging", title: "AR Aging Report", icon: <FileText size={16} />, desc: "Outstanding invoices by age", category: "Receivables" },
  { id: "ap-aging", title: "AP Aging Report", icon: <FileText size={16} />, desc: "Outstanding bills by age", category: "Payables" },
  { id: "expense-detail", title: "Expense Detail", icon: <PieChart size={16} />, desc: "Expenses by category and employee", category: "Expenses" },
  { id: "sales-tax", title: "Sales Tax Report", icon: <FileText size={16} />, desc: "Taxable sales and tax collected", category: "Tax" },
  { id: "payroll-summary", title: "Payroll Summary", icon: <BarChart3 size={16} />, desc: "Compensation by department and period", category: "Payroll" },
  { id: "customer-revenue", title: "Revenue by Customer", icon: <TrendingUp size={16} />, desc: "Top customers by revenue and growth", category: "Revenue" },
  { id: "vendor-spend", title: "Spend by Vendor", icon: <BarChart3 size={16} />, desc: "Top vendors by spend category", category: "Expenses" },
  { id: "budget-vs-actual", title: "Budget vs Actual", icon: <TrendingUp size={16} />, desc: "Variance analysis against budget", category: "Analysis" },
  { id: "trial-balance", title: "Trial Balance", icon: <FileText size={16} />, desc: "All account balances at a point in time", category: "Financial" },
]

const chartTooltipStyle = {
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "6px",
  fontSize: "12px",
  color: "var(--color-text)",
}

export default function Reports() {
  const [tab, setTab] = useState("pl")
  const [period, setPeriod] = useState("ytd")

  const plData = revenueData.map((d) => ({
    ...d,
    gross_margin: Math.round(((d.revenue - d.expenses) / d.revenue) * 100),
  }))

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Reports"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Calendar size={13} />}>Period: YTD 2024</Button>
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export PDF</Button>
          </div>
        }
      />

      {/* Report cards */}
      <div>
        <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] mb-3">Standard Reports</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {REPORT_CARDS.map((report) => (
            <button
              key={report.id}
              onClick={() => setTab(report.id)}
              className={`text-left p-4 rounded-[var(--radius-lg)] border transition-base cursor-pointer ${tab === report.id ? "border-[var(--color-accent)] bg-[var(--color-accent-subtle)]" : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-text-secondary)]"}`}
            >
              <div className={`w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center mb-2.5 ${tab === report.id ? "bg-[var(--color-accent)] text-white" : "bg-[var(--color-border-subtle)] text-[var(--color-text-tertiary)]"}`}>
                {report.icon}
              </div>
              <div className="text-[12px] font-semibold text-[var(--color-text)]">{report.title}</div>
              <div className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5 leading-4">{report.desc}</div>
              <div className="mt-2">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[var(--color-text-tertiary)] px-1.5 py-0.5 bg-[var(--color-border-subtle)] rounded">{report.category}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* P&L Report */}
      {tab === "pl" && (
        <div className="flex flex-col gap-4">
          <Card padding="none">
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <div>
                <h3 className="text-[14px] font-semibold text-[var(--color-text)]">Profit & Loss</h3>
                <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">January–December 2024</p>
              </div>
              <div className="flex gap-2">
                {["Jan–Mar", "Apr–Jun", "Jul–Sep", "Oct–Dec", "YTD"].map((p) => (
                  <button key={p} onClick={() => setPeriod(p)} className={`px-2.5 py-1 rounded-[var(--radius-sm)] text-[11px] font-medium cursor-pointer transition-base ${period === p ? "bg-[var(--color-primary)] text-[var(--color-primary-fg)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)]"}`}>{p}</button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] text-left w-[40%]">Account</th>
                    {["Q1", "Q2", "Q3", "Q4", "Total"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] text-right">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Revenue", q1: 894000, q2: 1064000, q3: 1211000, q4: 1396000, isHeader: true },
                    { label: "Product Revenue", q1: 620000, q2: 750000, q3: 860000, q4: 980000, indent: true },
                    { label: "Services Revenue", q1: 274000, q2: 314000, q3: 351000, q4: 416000, indent: true },
                    { label: "Cost of Revenue", q1: -220000, q2: -254000, q3: -292000, q4: -320000, isHeader: true },
                    { label: "Gross Profit", q1: 674000, q2: 810000, q3: 919000, q4: 1076000, isBold: true },
                    { label: "Operating Expenses", q1: -597000, q2: -638000, q3: -668000, q4: -740000, isHeader: true },
                    { label: "Payroll & Benefits", q1: -418000, q2: -447000, q3: -467000, q4: -518000, indent: true },
                    { label: "Sales & Marketing", q1: -68000, q2: -72000, q3: -78000, q4: -84000, indent: true },
                    { label: "G&A", q1: -89000, q2: -94000, q3: -98000, q4: -112000, indent: true },
                    { label: "R&D", q1: -22000, q2: -25000, q3: -25000, q4: -26000, indent: true },
                    { label: "Operating Income (EBIT)", q1: 77000, q2: 172000, q3: 251000, q4: 336000, isBold: true, highlight: true },
                    { label: "Interest Income", q1: 6000, q2: 7000, q3: 7000, q4: 8000, indent: true },
                    { label: "Net Income", q1: 83000, q2: 179000, q3: 258000, q4: 344000, isBold: true },
                  ].map((row) => {
                    const total = row.q1 + row.q2 + row.q3 + row.q4
                    return (
                      <tr key={row.label} className={`border-b border-[var(--color-border-subtle)] ${row.highlight ? "bg-[var(--color-accent-subtle)]" : ""} ${row.isHeader ? "bg-[var(--color-bg)]" : ""}`}>
                        <td className={`px-5 py-2.5 text-[12px] ${row.indent ? "pl-8 text-[var(--color-text-secondary)]" : row.isBold ? "font-semibold text-[var(--color-text)]" : "font-medium text-[var(--color-text)]"}`}>{row.label}</td>
                        {[row.q1, row.q2, row.q3, row.q4, total].map((v, i) => (
                          <td key={i} className={`px-4 py-2.5 text-[12px] tabnum text-right ${v < 0 ? "text-[var(--color-danger-text)]" : row.isBold ? "font-semibold text-[var(--color-text)]" : "text-[var(--color-text-secondary)]"}`}>
                            {v < 0 ? `(${fmtCurrency(Math.abs(v))})` : fmtCurrency(v)}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Chart */}
          <Card padding="none">
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[var(--color-text)]">Monthly Revenue & Profit</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-[var(--color-accent)]" />
                  <span className="text-[11px] text-[var(--color-text-tertiary)]">Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-[var(--color-success)]" />
                  <span className="text-[11px] text-[var(--color-text-tertiary)]">Profit</span>
                </div>
              </div>
            </div>
            <div className="p-5">
              <ChartReveal className="h-[280px]" delay={80}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={plData} margin={{ top: 8, right: 4, left: -20, bottom: 0 }} barGap={3} barCategoryGap="18%">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v) => [fmtCurrency(Number(v ?? 0)), ""]} />
                  <Bar dataKey="revenue" name="Revenue" fill="#14968C" radius={[4, 4, 0, 0]} animationBegin={80} animationDuration={1100} />
                  <Bar dataKey="profit" name="Profit" fill="#14A3B8" radius={[4, 4, 0, 0]} animationBegin={180} animationDuration={1200} />
                </BarChart>
              </ResponsiveContainer>
              </ChartReveal>
            </div>
          </Card>
        </div>
      )}

      {tab !== "pl" && (
        <Card>
          <div className="flex items-center justify-center py-16 flex-col gap-3">
            <BarChart3 size={24} className="text-[var(--color-text-tertiary)]" />
            <p className="text-[14px] font-medium text-[var(--color-text)]">{REPORT_CARDS.find((r) => r.id === tab)?.title}</p>
            <p className="text-[13px] text-[var(--color-text-secondary)]">{REPORT_CARDS.find((r) => r.id === tab)?.desc}</p>
            <Button variant="primary" size="sm" icon={<Download size={13} />}>Generate Report</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
