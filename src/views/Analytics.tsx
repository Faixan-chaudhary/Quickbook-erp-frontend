"use client";

import { TrendingUp, TrendingDown, Download } from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts"
import { analyticsMetrics, cohortData, revenueData } from "../data/mock"
import {
  Button, Card, SectionHeader, fmtCurrency, pctChange,
} from "../components/ui"
import { AnimateIn, ChartReveal } from "../components/ChartReveal"

function formatMetric(value: number, format: string) {
  if (format === "currency") return fmtCurrency(value)
  if (format === "percent") return `${value}%`
  if (format === "months") return `${value} mo`
  return String(value)
}

function cohortColor(value: number | null) {
  if (value === null) return "transparent"
  if (value >= 95) return "rgba(20, 150, 140, 0.85)"
  if (value >= 90) return "rgba(20, 150, 140, 0.65)"
  if (value >= 85) return "rgba(20, 150, 140, 0.45)"
  return "rgba(20, 150, 140, 0.25)"
}

export default function Analytics() {
  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Analytics"
        action={<Button variant="secondary" size="sm" icon={<Download size={13} />}>Export report</Button>}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {analyticsMetrics.map((m, i) => {
          const change = pctChange(m.value, m.previous)
          const inverted = m.label === "Customer Churn" || m.label === "CAC Payback"
          const positive = inverted ? change <= 0 : change >= 0
          return (
            <AnimateIn key={m.label} delay={i * 40}>
              <Card className="flex flex-col gap-1.5 h-full transition-base hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
                <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{m.label}</span>
                <span className="text-[20px] font-semibold tabnum tracking-tight text-[var(--color-text)]">
                  {formatMetric(m.value, m.format)}
                </span>
                <span className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${positive ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
                  {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                  {change > 0 ? "+" : ""}{change}%
                </span>
              </Card>
            </AnimateIn>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[var(--color-text)]">Revenue vs Expenses</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#14968C]" />
                <span className="text-[11px] text-[var(--color-text-tertiary)]">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="text-[11px] text-[var(--color-text-tertiary)]">Expenses</span>
              </div>
            </div>
          </div>
          <div className="h-[280px]">
            <ChartReveal className="h-full" delay={60}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14968C" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#14968C" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                    formatter={(value) => fmtCurrency(Number(value))}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#14968C" fill="url(#revGrad)" strokeWidth={2.5} name="Revenue" animationBegin={80} animationDuration={1200} />
                  <Area type="monotone" dataKey="expenses" stroke="#F59E0B" fill="url(#expGrad)" strokeWidth={2} name="Expenses" animationBegin={180} animationDuration={1300} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartReveal>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[14px] font-semibold text-[var(--color-text)]">Monthly Profit</h3>
            <span className="text-[11px] text-[var(--color-text-tertiary)]">Last 12 months</span>
          </div>
          <div className="h-[280px]">
            <ChartReveal className="h-full" delay={120}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                    formatter={(value) => fmtCurrency(Number(value))}
                  />
                  <Bar dataKey="profit" fill="#14968C" radius={[5, 5, 0, 0]} name="Profit" animationBegin={100} animationDuration={1100} />
                </BarChart>
              </ResponsiveContainer>
            </ChartReveal>
          </div>
        </Card>
      </div>

      <AnimateIn delay={80}>
        <Card>
          <div className="mb-4">
            <h3 className="text-[14px] font-semibold text-[var(--color-text)]">Customer Retention Cohorts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] text-left">Cohort</th>
                  {["M0", "M1", "M2", "M3", "M4", "M5"].map((m) => (
                    <th key={m} className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] text-center">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohortData.map((row, rowIdx) => (
                  <tr key={row.cohort}>
                    <td className="px-3 py-2 text-[12px] font-medium text-[var(--color-text)] whitespace-nowrap">{row.cohort}</td>
                    {([row.m0, row.m1, row.m2, row.m3, row.m4, row.m5] as (number | null)[]).map((val, i) => (
                      <td key={i} className="px-2 py-1.5">
                        <div
                          className="h-9 rounded-[var(--radius-md)] flex items-center justify-center text-[12px] font-semibold tabnum chart-bar-grow"
                          style={{
                            background: cohortColor(val),
                            color: val === null ? "transparent" : val >= 90 ? "#fff" : "var(--color-text)",
                            animationDelay: `${rowIdx * 60 + i * 40}ms`,
                            transformOrigin: "center",
                          }}
                        >
                          {val !== null ? `${val}%` : ""}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </AnimateIn>
    </div>
  )
}
