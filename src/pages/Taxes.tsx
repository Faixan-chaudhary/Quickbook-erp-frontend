import { useState } from "react"
import {
  Calculator, AlertCircle, CheckCircle2, Clock, Download,
  ChevronRight, Calendar, TrendingDown, Sparkles,
} from "lucide-react"
import { taxSummary } from "../data/mock"
import { Button, Card, Badge, Tabs, SectionHeader, fmtCurrency, fmtDate } from "../components/ui"

export default function Taxes() {
  const [tab, setTab] = useState("overview")

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Taxes"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Tax Documents</Button>
            <Button variant="primary" size="sm" icon={<Calculator size={13} />}>File Return</Button>
          </div>
        }
      />

      {/* Upcoming tax alert */}
      <div className="flex items-center gap-3 p-3.5 bg-[var(--color-warning-bg)] border border-[var(--color-warning-border)] rounded-[var(--radius-lg)]">
        <AlertCircle size={15} className="text-[var(--color-warning)] shrink-0" />
        <div className="flex-1">
          <span className="text-[13px] font-medium text-[var(--color-warning-text)]">Q4 Estimated Tax Payment due January 15, 2025</span>
          <span className="text-[12px] text-[var(--color-warning-text)] opacity-80 ml-2">Amount: {fmtCurrency(taxSummary.quarterlyEstimated.amount)} · 16 days remaining</span>
        </div>
        <Button variant="secondary" size="sm">Schedule Payment</Button>
      </div>

      {/* AI Tax insight */}
      <div className="flex items-start gap-3 p-4 bg-[var(--color-ai-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
        <Sparkles size={15} className="text-[var(--color-ai)] shrink-0 mt-0.5" />
        <div>
          <div className="text-[13px] font-medium text-[var(--color-ai-text)]">AI Tax Optimization</div>
          <p className="text-[12px] text-[var(--color-ai-text)] opacity-80 mt-0.5">
            Based on your 2024 financials, you may qualify for up to $18,400 in additional deductions via R&D tax credits, home office deductions, and accelerated depreciation on equipment purchases.
          </p>
        </div>
        <Button variant="accent" size="sm">Review</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Federal Tax (Est. 2024)", value: fmtCurrency(580000), sub: "21% effective rate" },
          { label: "Payroll Taxes (YTD)", value: fmtCurrency(taxSummary.payrollTax.ytd), sub: "All withholdings" },
          { label: "Sales Tax Collected", value: fmtCurrency(taxSummary.salesTax.q3 + taxSummary.salesTax.q4YTD), sub: "YTD collected" },
          { label: "Prior Year Refund", value: fmtCurrency(taxSummary.annualReturn.refund), sub: "2023 return", success: true },
        ].map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{stat.label}</span>
            <span className={`text-[20px] font-semibold tabnum tracking-tight ${(stat as {success?: boolean}).success ? "text-[var(--color-success)]" : "text-[var(--color-text)]"}`}>{stat.value}</span>
            {stat.sub ? <span className="text-[11px] text-[var(--color-text-tertiary)]">{stat.sub}</span> : null}
          </Card>
        ))}
      </div>

      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "federal", label: "Federal" },
          { id: "payroll", label: "Payroll Tax" },
          { id: "sales", label: "Sales Tax" },
          { id: "filings", label: "Filing History" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tax calendar */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={14} className="text-[var(--color-text-secondary)]" />
              <h3 className="text-[13px] font-semibold text-[var(--color-text)]">Upcoming Deadlines</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "IRS Form 941 (Q4 Payroll)", date: "Dec 16, 2024", amount: fmtCurrency(55260), status: "upcoming", urgent: true },
                { label: "Q4 Estimated Tax (Federal)", date: "Jan 15, 2025", amount: fmtCurrency(124800), status: "upcoming" },
                { label: "Sales Tax Return (CA Q4)", date: "Jan 31, 2025", amount: fmtCurrency(19200), status: "upcoming" },
                { label: "W-2s to Employees", date: "Jan 31, 2025", amount: "—", status: "upcoming" },
                { label: "Federal Tax Return 2024", date: "Apr 15, 2025", amount: "TBD", status: "future" },
              ].map((item) => (
                <div key={item.label} className={`flex items-center justify-between p-3 rounded-[var(--radius-md)] border ${item.urgent ? "border-[var(--color-danger-border)] bg-[var(--color-danger-bg)]" : "border-[var(--color-border)] bg-[var(--color-bg)]"}`}>
                  <div className="flex items-center gap-2.5">
                    {item.urgent ? <AlertCircle size={12} className="text-[var(--color-danger)] shrink-0" /> : <Clock size={12} className="text-[var(--color-text-tertiary)] shrink-0" />}
                    <div>
                      <div className={`text-[12px] font-medium ${item.urgent ? "text-[var(--color-danger-text)]" : "text-[var(--color-text)]"}`}>{item.label}</div>
                      <div className={`text-[10px] ${item.urgent ? "text-[var(--color-danger-text)] opacity-70" : "text-[var(--color-text-tertiary)]"}`}>{item.date}</div>
                    </div>
                  </div>
                  <span className={`text-[12px] font-semibold tabnum ${item.urgent ? "text-[var(--color-danger-text)]" : "text-[var(--color-text)]"}`}>{item.amount}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Tax Summary */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={14} className="text-[var(--color-text-secondary)]" />
              <h3 className="text-[13px] font-semibold text-[var(--color-text)]">2024 Tax Summary</h3>
            </div>
            <div className="space-y-0">
              {[
                { label: "Gross Revenue", value: fmtCurrency(4965000), indent: 0 },
                { label: "Cost of Revenue", value: `(${fmtCurrency(890000)})`, indent: 1 },
                { label: "Gross Profit", value: fmtCurrency(4075000), indent: 0, bold: true },
                { label: "Operating Expenses", value: `(${fmtCurrency(2359000)})`, indent: 1 },
                { label: "EBITDA", value: fmtCurrency(1716000), indent: 0, bold: true },
                { label: "Depreciation & Amortization", value: `(${fmtCurrency(42000)})`, indent: 1 },
                { label: "EBIT", value: fmtCurrency(1674000), indent: 0, bold: true },
                { label: "Interest Income", value: fmtCurrency(28000), indent: 1 },
                { label: "Taxable Income (Est.)", value: fmtCurrency(1702000), indent: 0, bold: true, highlight: true },
                { label: "Federal Tax @ 21%", value: fmtCurrency(357420), indent: 1 },
                { label: "State Tax (CA @ 8.84%)", value: fmtCurrency(150477), indent: 1 },
                { label: "R&D Credits (Est.)", value: `(${fmtCurrency(18400)})`, indent: 1, success: true },
              ].map((row) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between py-2 border-b border-[var(--color-border-subtle)] last:border-0 ${row.highlight ? "bg-[var(--color-accent-subtle)] -mx-5 px-5 rounded" : ""}`}
                >
                  <span className={`text-[12px] ${row.indent === 1 ? "pl-4" : ""} ${row.bold ? "font-semibold text-[var(--color-text)]" : "text-[var(--color-text-secondary)]"}`}>{row.label}</span>
                  <span className={`text-[12px] font-${row.bold ? "semibold" : "normal"} tabnum ${(row as {success?: boolean}).success ? "text-[var(--color-success)]" : row.bold ? "text-[var(--color-text)]" : "text-[var(--color-text-secondary)]"}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {(tab === "federal" || tab === "payroll" || tab === "sales") && (
        <Card>
          <div className="flex items-center justify-center py-16 flex-col gap-3">
            <Calculator size={24} className="text-[var(--color-text-tertiary)]" />
            <p className="text-[14px] font-medium text-[var(--color-text)]">
              {tab === "federal" ? "Federal Tax Details" : tab === "payroll" ? "Payroll Tax Filings" : "Sales Tax Returns"}
            </p>
            <p className="text-[13px] text-[var(--color-text-secondary)]">Detailed {tab} tax reports and filings</p>
            <Button variant="primary" size="sm">Generate Report</Button>
          </div>
        </Card>
      )}

      {tab === "filings" && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {["Form", "Period", "Filed Date", "Amount", "Status"].map((h) => (
                    <th key={h} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${h === "Amount" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { form: "Form 1120 (2023)", period: "Jan–Dec 2023", date: "Mar 15, 2024", amount: fmtCurrency(340000), status: "filed" },
                  { form: "Form 941 Q3 2024", period: "Jul–Sep 2024", date: "Oct 31, 2024", amount: fmtCurrency(53580), status: "filed" },
                  { form: "Form 941 Q2 2024", period: "Apr–Jun 2024", date: "Jul 31, 2024", amount: fmtCurrency(51600), status: "filed" },
                  { form: "CA Sales Tax Q3", period: "Jul–Sep 2024", date: "Oct 31, 2024", amount: fmtCurrency(28400), status: "filed" },
                  { form: "Form 941 Q4 2024", period: "Oct–Dec 2024", date: "Due Dec 16", amount: fmtCurrency(55260), status: "upcoming" },
                ].map((row) => (
                  <tr key={row.form} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer">
                    <td className="px-5 py-3 text-[13px] font-medium text-[var(--color-text)]">{row.form}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{row.period}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{row.date}</td>
                    <td className="px-5 py-3 text-[13px] tabnum font-medium text-right text-[var(--color-text)]">{row.amount}</td>
                    <td className="px-5 py-3">
                      <Badge variant={row.status === "filed" ? "success" : "warning"} size="sm" dot>
                        {row.status === "filed" ? "Filed" : "Upcoming"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
