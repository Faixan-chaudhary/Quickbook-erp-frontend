import { useState } from "react"
import {
  Plus, Download, Users2, DollarSign, Calendar, CheckCircle2,
  Clock, AlertCircle, Play, Eye, ChevronDown,
} from "lucide-react"
import { employees, payrollRuns } from "../data/mock"
import {
  Button, Card, Badge, Tabs, SectionHeader, fmtCurrency, fmtDate,
  statusBadge, Avatar, Pagination,
} from "../components/ui"

export default function Payroll() {
  const [tab, setTab] = useState("runs")
  const [page, setPage] = useState(1)

  const nextRun = payrollRuns.find((r) => r.status === "scheduled")
  const lastRun = payrollRuns.find((r) => r.status === "completed")

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Payroll"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Play size={13} />}>Run Payroll</Button>
          </div>
        }
      />

      {/* Alert */}
      {nextRun && (
        <div className="flex items-center gap-3 p-3.5 bg-[var(--color-info-bg)] border border-[var(--color-info-border)] rounded-[var(--radius-lg)]">
          <Calendar size={15} className="text-[var(--color-info)] shrink-0" />
          <div className="flex-1">
            <span className="text-[13px] font-medium text-[var(--color-info-text)]">Next payroll run scheduled: {fmtDate(nextRun.date)}</span>
            <span className="text-[12px] text-[var(--color-info-text)] opacity-80 ml-2">{nextRun.employees} employees · est. {fmtCurrency(nextRun.grossPay)} gross</span>
          </div>
          <Button variant="accent" size="sm" icon={<Play size={12} />}>Process Now</Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Annual Payroll", value: fmtCurrency(payrollRuns.filter((r) => r.status === "completed").reduce((s, r) => s + r.grossPay, 0)), sub: "YTD gross" },
          { label: "Tax Withholdings", value: fmtCurrency(payrollRuns.filter((r) => r.status === "completed").reduce((s, r) => s + r.taxes, 0)), sub: "YTD total" },
          { label: "Active Employees", value: String(employees.filter((e) => e.status === "active").length), sub: `${employees.length} total` },
          { label: "Last Run", value: lastRun ? fmtCurrency(lastRun.netPay) : "—", sub: lastRun ? "Net paid · " + fmtDate(lastRun.date) : "" },
        ].map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{stat.label}</span>
            <span className="text-[20px] font-semibold tabnum tracking-tight text-[var(--color-text)]">{stat.value}</span>
            {stat.sub ? <span className="text-[11px] text-[var(--color-text-tertiary)]">{stat.sub}</span> : null}
          </Card>
        ))}
      </div>

      <Tabs
        tabs={[
          { id: "runs", label: "Pay Runs" },
          { id: "employees", label: "Employees", count: employees.length },
          { id: "taxes", label: "Tax Withholdings" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "runs" && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {["Pay Period", "Pay Date", "Employees", "Gross Pay", "Tax Withheld", "Net Pay", "Status", ""].map((h) => (
                    <th key={h} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${["Gross Pay", "Tax Withheld", "Net Pay"].includes(h) ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payrollRuns.map((run) => {
                  const [variant, label] = statusBadge(run.status)
                  return (
                    <tr key={run.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer group">
                      <td className="px-5 py-3">
                        <div className="text-[13px] font-medium text-[var(--color-text)]">{run.period}</div>
                        <div className="text-[10px] text-[var(--color-text-tertiary)]">{run.id}</div>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{fmtDate(run.date)}</td>
                      <td className="px-5 py-3 text-[13px] text-[var(--color-text)] tabnum">{run.employees}</td>
                      <td className="px-5 py-3 text-[13px] tabnum text-right text-[var(--color-text-secondary)]">{fmtCurrency(run.grossPay)}</td>
                      <td className="px-5 py-3 text-[13px] tabnum text-right text-[var(--color-text-secondary)]">{fmtCurrency(run.taxes)}</td>
                      <td className="px-5 py-3 text-[13px] font-semibold tabnum text-right text-[var(--color-text)]">{fmtCurrency(run.netPay)}</td>
                      <td className="px-5 py-3"><Badge variant={variant} size="sm" dot>{label}</Badge></td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-base">
                          <Button variant="ghost" size="xs" icon={<Eye size={11} />}>View</Button>
                          <Button variant="secondary" size="xs" icon={<Download size={11} />}>PDF</Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "employees" && (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  {["Employee", "Department", "Title", "Pay Type", "Annual Salary", "Start Date", "Status"].map((h) => (
                    <th key={h} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${h === "Annual Salary" ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => {
                  const [variant, label] = statusBadge(emp.status)
                  return (
                    <tr key={emp.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={emp.name} size="sm" />
                          <div>
                            <div className="text-[13px] font-medium text-[var(--color-text)]">{emp.name}</div>
                            <div className="text-[11px] text-[var(--color-text-tertiary)]">{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[11px] px-2 py-0.5 rounded bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">{emp.department}</span>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{emp.title}</td>
                      <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)] capitalize">{emp.payType}</td>
                      <td className="px-5 py-3 text-[13px] font-medium tabnum text-right text-[var(--color-text)]">{fmtCurrency(emp.salary)}</td>
                      <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{fmtDate(emp.startDate)}</td>
                      <td className="px-5 py-3"><Badge variant={variant} size="sm" dot>{label}</Badge></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={10} total={employees.length} onChange={setPage} />
        </Card>
      )}

      {tab === "taxes" && (
        <Card>
          <h3 className="text-[14px] font-semibold text-[var(--color-text)] mb-4">Payroll Tax Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Federal Income Tax (FIT)", ytd: 214400, q4: 55260 },
              { label: "Social Security (OASDI)", ytd: 91200, q4: 22800 },
              { label: "Medicare (HI)", ytd: 32280, q4: 7680 },
              { label: "FUTA / SUTA", ytd: 12400, q4: 2800 },
              { label: "State Income Tax (CA)", ytd: 89600, q4: 21800 },
              { label: "SDI / SUI", ytd: 18400, q4: 4600 },
            ].map((tax) => (
              <div key={tax.label} className="flex items-center justify-between p-3.5 bg-[var(--color-bg)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
                <div>
                  <div className="text-[12px] font-medium text-[var(--color-text)]">{tax.label}</div>
                  <div className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">Q4: {fmtCurrency(tax.q4)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-semibold tabnum text-[var(--color-text)]">{fmtCurrency(tax.ytd)}</div>
                  <div className="text-[10px] text-[var(--color-text-tertiary)]">YTD</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
