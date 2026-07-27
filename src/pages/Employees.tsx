import { useState } from "react"
import { Plus, Search, Download, Filter, Mail } from "lucide-react"
import { employees } from "../data/mock"
import {
  Button, Badge, Card, SectionHeader, Pagination, Avatar,
  fmtCurrency, fmtDate, statusBadge,
} from "../components/ui"

export default function Employees() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [dept, setDept] = useState("all")

  const departments = ["all", ...Array.from(new Set(employees.map((e) => e.department)))]

  const filtered = employees.filter((e) => {
    const matchDept = dept === "all" || e.department === dept
    const matchSearch =
      search === "" ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.title.toLowerCase().includes(search.toLowerCase())
    return matchDept && matchSearch
  })

  const totalPayroll = employees.filter((e) => e.status === "active").reduce((s, e) => s + e.salary, 0)

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Employees"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />}>Add Employee</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Headcount", value: String(employees.filter((e) => e.status === "active").length), sub: `${employees.length} total` },
          { label: "Annual Payroll", value: fmtCurrency(totalPayroll), sub: "" },
          { label: "Departments", value: String(departments.length - 1), sub: "" },
          { label: "Avg Salary", value: fmtCurrency(Math.round(totalPayroll / employees.filter((e) => e.status === "active").length)), sub: "" },
        ].map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[var(--color-text-secondary)]">{stat.label}</span>
            <span className="text-[20px] font-semibold tabnum tracking-tight text-[var(--color-text)]">{stat.value}</span>
            {stat.sub ? <span className="text-[11px] text-[var(--color-text-tertiary)]">{stat.sub}</span> : null}
          </Card>
        ))}
      </div>

      <Card padding="none">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--color-border)] flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, title..."
              className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base"
            />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {departments.map((d) => (
              <button
                key={d}
                onClick={() => setDept(d)}
                className={`h-7 px-2.5 rounded-[var(--radius-md)] text-[11px] font-medium transition-base cursor-pointer ${dept === d ? "bg-[var(--color-accent-subtle)] text-[var(--color-primary)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)]"}`}
              >
                {d === "all" ? "All" : d}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" icon={<Filter size={13} />}>Filter</Button>
          <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} employees</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {["Employee", "Department", "Title", "Start Date", "Pay Type", "Salary", "Status", ""].map((h) => (
                  <th key={h || "actions"} className={`px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${h === "Salary" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => {
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
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{emp.department}</td>
                    <td className="px-5 py-3 text-[13px] text-[var(--color-text)]">{emp.title}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)] whitespace-nowrap">{fmtDate(emp.startDate)}</td>
                    <td className="px-5 py-3 text-[12px] capitalize text-[var(--color-text-secondary)]">{emp.payType}</td>
                    <td className="px-5 py-3 text-[13px] font-semibold tabnum text-right">{fmtCurrency(emp.salary)}</td>
                    <td className="px-5 py-3"><Badge variant={variant} size="sm" dot>{label}</Badge></td>
                    <td className="px-5 py-3">
                      <Button variant="ghost" size="xs" icon={<Mail size={11} />}>Email</Button>
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
