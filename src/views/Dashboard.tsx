"use client";

import {
  ComposedChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
  Line,
} from "recharts";
import {
  TrendingUp, ArrowUpRight, ArrowDownRight,
  AlertCircle, CheckCircle2, Info, Calendar,
  FileText, ChevronRight, Target, RefreshCw,
  ArrowRight, Brain,
} from "lucide-react";
import { revenueData, cashFlowData, expenseCategoryData, kpis, invoices, aiInsights, transactions } from "../data/mock";
import { Card, Badge, Button, fmtCurrency, fmtDateShort, statusBadge } from "../components/ui";
import { AnimateIn, ChartReveal } from "../components/ChartReveal";
import { useUserAndCompany } from "@/hooks/useUserAndCompany";

function KPICard({ label, value, prev, current, delay = 0 }: {
  label: string;
  value: string;
  prev: number;
  current: number;
  delay?: number;
}) {
  const pct = prev === 0 ? 0 : Math.round(((current - prev) / prev) * 100);
  const up = pct >= 0;
  return (
    <AnimateIn delay={delay}>
      <Card className="flex flex-col gap-2.5 h-full transition-base hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
        <span className="text-[12px] font-medium text-[var(--color-text-secondary)]">{label}</span>
        <div className="text-[22px] font-semibold text-[var(--color-text)] tabnum tracking-tight">{value}</div>
        <div className="flex items-center gap-1">
          {up ? (
            <ArrowUpRight size={12} className="text-[var(--color-success)]" />
          ) : (
            <ArrowDownRight size={12} className="text-[var(--color-danger)]" />
          )}
          <span className={`text-[11px] font-medium ${up ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
            {up ? "+" : ""}{pct}%
          </span>
        </div>
      </Card>
    </AnimateIn>
  );
}

const chartTooltipStyle = {
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "var(--color-text)",
  boxShadow: "var(--shadow-md)",
};

const CHART = {
  teal: "#14968C",
  tealSoft: "#5EC4BB",
  cyan: "#14A3B8",
  amber: "#F59E0B",
  rose: "#E11D48",
  roseSoft: "#FB7185",
};

function tipFormatter(value: unknown) {
  return [fmtCurrency(Number(value ?? 0)), ""] as [string, string];
}

export default function Dashboard() {
  const today = new Date();
  const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 18 ? "Good afternoon" : "Good evening";
  const { userName, companyName } = useUserAndCompany();

  const totalInflow = cashFlowData.reduce((s, d) => s + d.inflow, 0);
  const totalOutflow = cashFlowData.reduce((s, d) => s + d.outflow, 0);
  const netCash = totalInflow - totalOutflow;
  const expenseTotal = expenseCategoryData.reduce((s, c) => s + c.value, 0);

  return (
    <div className="p-6 flex flex-col gap-6 w-full">
      {/* Dynamic Header Greeting & Company Name */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-[var(--color-text)] tracking-tight">
            {greeting}, {userName.split(" ")[0]}
          </h1>
          <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5 font-medium">
            {companyName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<RefreshCw size={13} />}>Sync</Button>
          <Button variant="secondary" size="sm" icon={<Calendar size={13} />}>
            Nov 2024
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KPICard label="Annual Revenue" value={fmtCurrency(kpis.revenue.current)} prev={kpis.revenue.previous} current={kpis.revenue.current} delay={0} />
        <KPICard label="Total Expenses" value={fmtCurrency(kpis.expenses.current)} prev={kpis.expenses.previous} current={kpis.expenses.current} delay={40} />
        <KPICard label="Net Profit" value={fmtCurrency(kpis.profit.current)} prev={kpis.profit.previous} current={kpis.profit.current} delay={80} />
        <KPICard label="Cash & Equivalents" value={fmtCurrency(kpis.cashBalance.current)} prev={kpis.cashBalance.previous} current={kpis.cashBalance.current} delay={120} />
        <KPICard label="Accounts Receivable" value={fmtCurrency(kpis.arBalance.current)} prev={kpis.arBalance.previous} current={kpis.arBalance.current} delay={160} />
        <KPICard label="Accounts Payable" value={fmtCurrency(kpis.apBalance.current)} prev={kpis.apBalance.previous} current={kpis.apBalance.current} delay={200} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <Card className="lg:col-span-2 flex flex-col" padding="none">
          <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--color-border)]">
            <h3 className="text-[13px] font-semibold text-[var(--color-text)]">Revenue vs Expenses</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: CHART.teal }} />
                <span className="text-[11px] text-[var(--color-text-tertiary)]">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: CHART.amber }} />
                <span className="text-[11px] text-[var(--color-text-tertiary)]">Expenses</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: CHART.cyan }} />
                <span className="text-[11px] text-[var(--color-text-tertiary)]">Profit</span>
              </div>
            </div>
          </div>
          <div className="p-4 flex-1 min-h-[280px]">
            <ChartReveal className="min-h-[248px]" delay={80}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART.teal} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={CHART.teal} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART.amber} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={CHART.amber} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={chartTooltipStyle} formatter={tipFormatter} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke={CHART.teal} strokeWidth={2.5} fill="url(#revFill)" animationBegin={80} animationDuration={1200} animationEasing="ease-out" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke={CHART.amber} strokeWidth={2} fill="url(#expFill)" animationBegin={180} animationDuration={1300} animationEasing="ease-out" />
                <Line type="monotone" dataKey="profit" name="Profit" stroke={CHART.cyan} strokeWidth={2} dot={false} animationBegin={280} animationDuration={1400} />
              </ComposedChart>
            </ResponsiveContainer>
            </ChartReveal>
          </div>
        </Card>

        <Card padding="none" className="flex flex-col">
          <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-[var(--color-text)]">Expense Breakdown</h3>
            <span className="text-[12px] font-semibold tabnum text-[var(--color-text)]">{fmtCurrency(expenseTotal)}</span>
          </div>
          <div className="p-4 flex flex-col flex-1 gap-3">
            <AnimateIn>
            <div className="relative h-[160px]">
              <ChartReveal className="h-full min-h-[160px]" delay={120}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                    animationBegin={120}
                    animationDuration={1400}
                  >
                    {expenseCategoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} formatter={tipFormatter} />
                </PieChart>
              </ResponsiveContainer>
              </ChartReveal>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-[var(--color-text-tertiary)]">YTD</span>
                <span className="text-[14px] font-bold tabnum text-[var(--color-text)]">{fmtCurrency(expenseTotal)}</span>
              </div>
            </div>
            <div className="space-y-2 flex-1 mt-3">
              {expenseCategoryData.slice(0, 5).map((cat, i) => {
                const pct = Math.round((cat.value / expenseTotal) * 100);
                return (
                  <div key={cat.name} className="flex flex-col gap-1" style={{ animationDelay: `${200 + i * 60}ms` }}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="text-[11px] text-[var(--color-text-secondary)] truncate">{cat.name}</span>
                      </div>
                      <span className="text-[11px] font-medium tabnum text-[var(--color-text)] shrink-0">{pct}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-[var(--color-border-subtle)] overflow-hidden">
                      <div
                        className="h-full rounded-full chart-bar-grow"
                        style={{ width: `${pct}%`, backgroundColor: cat.color, animationDelay: `${220 + i * 70}ms` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            </AnimateIn>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <Card padding="none" className="flex flex-col min-h-[420px]">
          <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-[var(--color-text)]">Cash Flow</h3>
            <span className={`text-[12px] font-semibold tabnum ${netCash >= 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}>
              Net {netCash >= 0 ? "+" : ""}{fmtCurrency(netCash)}
            </span>
          </div>
          <div className="p-4 flex flex-col flex-1 gap-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-[var(--radius-lg)] bg-[var(--color-success-bg)] border border-[var(--color-success-border)] p-3">
                <div className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-success-text)]">Inflow</div>
                <div className="text-[16px] font-bold tabnum text-[var(--color-success)] mt-0.5">{fmtCurrency(totalInflow)}</div>
              </div>
              <div className="rounded-[var(--radius-lg)] bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] p-3">
                <div className="text-[10px] font-medium uppercase tracking-wide text-[var(--color-danger-text)]">Outflow</div>
                <div className="text-[16px] font-bold tabnum text-[var(--color-danger)] mt-0.5">{fmtCurrency(totalOutflow)}</div>
              </div>
            </div>

            <div className="flex-1 min-h-[220px]">
              <ChartReveal className="min-h-[220px]" delay={100}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }} barGap={2} barCategoryGap="18%">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={tipFormatter} cursor={{ fill: "var(--color-border-subtle)" }} />
                  <Bar dataKey="inflow" name="Inflow" fill={CHART.teal} radius={[4, 4, 0, 0]} animationBegin={60} animationDuration={1100} animationEasing="ease-out" />
                  <Bar dataKey="outflow" name="Outflow" fill={CHART.roseSoft} radius={[4, 4, 0, 0]} animationBegin={160} animationDuration={1200} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
              </ChartReveal>
            </div>

            <div className="flex items-center justify-center gap-5 pt-1 border-t border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: CHART.teal }} />
                <span className="text-[11px] text-[var(--color-text-secondary)]">Inflow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: CHART.roseSoft }} />
                <span className="text-[11px] text-[var(--color-text-secondary)]">Outflow</span>
              </div>
            </div>
          </div>
        </Card>

        <Card padding="none" className="lg:col-span-2 flex flex-col">
          <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <h3 className="text-[13px] font-semibold text-[var(--color-text)]">Recent Invoices</h3>
            <Button variant="ghost" size="sm" iconRight={<ChevronRight size={12} />}>View all</Button>
          </div>
          <div className="flex-1">
            {invoices.slice(0, 6).map((inv) => {
              const [variant, label] = statusBadge(inv.status);
              return (
                <div
                  key={inv.id}
                  className="flex items-center gap-3 px-5 py-3 border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] cursor-pointer transition-base last:border-0"
                >
                  <div className="w-7 h-7 rounded-[var(--radius-md)] bg-[var(--color-border-subtle)] flex items-center justify-center shrink-0">
                    <FileText size={13} className="text-[var(--color-text-tertiary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-[var(--color-text)] truncate">{inv.customer}</div>
                    <div className="text-[11px] text-[var(--color-text-tertiary)]">{inv.id}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[13px] font-medium text-[var(--color-text)] tabnum">{fmtCurrency(inv.total)}</div>
                    <div className="text-[10px] text-[var(--color-text-tertiary)]">Due {fmtDateShort(inv.dueDate)}</div>
                  </div>
                  <Badge variant={variant} size="sm">{label}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <Card padding="none" className="lg:col-span-2">
          <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-[var(--radius-sm)] bg-[var(--color-ai-bg)] flex items-center justify-center">
                <Brain size={12} className="text-[var(--color-ai)]" />
              </div>
              <h3 className="text-[13px] font-semibold text-[var(--color-text)]">AI Insights</h3>
              <Badge variant="ai" size="sm">4 new</Badge>
            </div>
            <Button variant="ghost" size="sm">Configure</Button>
          </div>
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {aiInsights.map((insight) => {
              const iconMap = {
                warning: <AlertCircle size={14} className="text-[var(--color-warning)]" />,
                opportunity: <TrendingUp size={14} className="text-[var(--color-success)]" />,
                info: <Info size={14} className="text-[var(--color-info)]" />,
                success: <CheckCircle2 size={14} className="text-[var(--color-success)]" />,
              };
              return (
                <div key={insight.id} className="px-5 py-4 flex items-start gap-3 hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer">
                  <div className="mt-0.5 shrink-0">{iconMap[insight.type as keyof typeof iconMap]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[var(--color-text)]">{insight.title}</p>
                    <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5 leading-5">{insight.description}</p>
                  </div>
                  <button className="text-[11px] text-[var(--color-accent)] shrink-0 hover:underline cursor-pointer mt-0.5">
                    {insight.action} <ArrowRight size={10} className="inline" />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <AnimateIn>
          <div className="flex items-center gap-2">
            <Target size={14} className="text-[var(--color-text-secondary)]" />
            <h3 className="text-[13px] font-semibold text-[var(--color-text)]">Business Health</h3>
          </div>

          <div className="flex items-center justify-center py-2">
            <div className="relative">
              <svg width="128" height="128" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border)" strokeWidth="8" />
                <circle
                  className="health-ring-progress"
                  cx="60" cy="60" r="52" fill="none"
                  stroke={CHART.teal} strokeWidth="8"
                  strokeDasharray={`${(78 / 100) * 327} 327`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[32px] font-bold text-[var(--color-text)] tabnum">78</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 flex-1">
            {[
              { label: "Cash Flow", score: 82, color: CHART.teal },
              { label: "Profitability", score: 74, color: CHART.cyan },
              { label: "AR Collections", score: 68, color: CHART.amber },
              { label: "Debt Ratio", score: 91, color: CHART.teal },
              { label: "Revenue Growth", score: 77, color: CHART.tealSoft },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-[11px] text-[var(--color-text-secondary)] w-28 shrink-0">{item.label}</span>
                <div className="flex-1 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full chart-bar-grow"
                    style={{ width: `${item.score}%`, backgroundColor: item.color, animationDelay: `${120 + i * 80}ms` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-[var(--color-text)] tabnum w-6 text-right">{item.score}</span>
              </div>
            ))}
          </div>
          </AnimateIn>
        </Card>
      </div>

      <Card padding="none">
        <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <h3 className="text-[13px] font-semibold text-[var(--color-text)]">Recent Transactions</h3>
          <Button variant="ghost" size="sm" iconRight={<ChevronRight size={12} />}>View all</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {["Date", "Description", "Category", "Account", "Amount", "Status"].map((h) => (
                  <th key={h} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${h === "Amount" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 6).map((txn) => (
                <tr key={txn.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer">
                  <td className="px-5 py-3 text-[12px] text-[var(--color-text-tertiary)] whitespace-nowrap">{fmtDateShort(txn.date)}</td>
                  <td className="px-5 py-3 text-[13px] text-[var(--color-text)] max-w-[260px] truncate">{txn.description}</td>
                  <td className="px-5 py-3">
                    <span className="text-[11px] px-2 py-0.5 rounded bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">{txn.category}</span>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{txn.account}</td>
                  <td className={`px-5 py-3 text-[13px] font-medium tabnum text-right ${txn.type === "credit" ? "text-[var(--color-success)]" : "text-[var(--color-text)]"}`}>
                    {txn.type === "credit" ? "+" : ""}{fmtCurrency(Math.abs(txn.amount))}
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={txn.reconciled ? "success" : "warning"} size="sm">{txn.reconciled ? "Reconciled" : "Pending"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
