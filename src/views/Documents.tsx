"use client";

import { useState } from "react"
import { Plus, Search, Download, Filter, FileText, FileSpreadsheet, Presentation, Archive } from "lucide-react"
import { documents } from "../data/mock"
import {
  Button, Badge, Card, Tabs, SectionHeader, Pagination,
  fmtDate, statusBadge,
} from "../components/ui"

function fileIcon(type: string) {
  if (type === "Report" || type === "Statement") return <FileSpreadsheet size={14} className="text-[var(--color-success)]" />
  if (type === "Presentation") return <Presentation size={14} className="text-[var(--color-warning)]" />
  if (type === "Tax" || type === "Compliance") return <Archive size={14} className="text-[var(--color-accent)]" />
  return <FileText size={14} className="text-[var(--color-primary)]" />
}

export default function Documents() {
  const [tab, setTab] = useState("all")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const types = ["all", ...Array.from(new Set(documents.map((d) => d.type)))]

  const filtered = documents.filter((d) => {
    const matchTab =
      tab === "all" ||
      d.type === tab ||
      (tab === "archived" && d.status === "archived") ||
      (tab === "active" && d.status === "active")
    const matchSearch =
      search === "" ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.uploadedBy.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    return matchTab && matchSearch
  })

  const tabs = [
    { id: "all", label: "All", count: documents.length },
    { id: "active", label: "Active", count: documents.filter((d) => d.status === "active").length },
    { id: "Contract", label: "Contracts", count: documents.filter((d) => d.type === "Contract").length },
    { id: "Tax", label: "Tax", count: documents.filter((d) => d.type === "Tax").length },
    { id: "archived", label: "Archived", count: documents.filter((d) => d.status === "archived").length },
  ]

  return (
    <div className="p-6 flex flex-col gap-5 w-full">
      <SectionHeader
        title="Documents"
        action={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Download size={13} />}>Export</Button>
            <Button variant="primary" size="sm" icon={<Plus size={13} />}>Upload</Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Documents", value: String(documents.length), sub: `${documents.filter((d) => d.status === "active").length} active` },
          { label: "Contracts", value: String(documents.filter((d) => d.type === "Contract").length), sub: "" },
          { label: "Document Types", value: String(types.length - 1), sub: "" },
          { label: "Uploaded this month", value: String(documents.filter((d) => d.uploadedAt.startsWith("2024-11") || d.uploadedAt.startsWith("2024-12")).length), sub: "Nov–Dec" },
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files, tags, uploader..."
              className="w-full h-8 pl-8 pr-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base"
            />
          </div>
          <Button variant="secondary" size="sm" icon={<Filter size={13} />}>Filter</Button>
          <div className="ml-auto text-[12px] text-[var(--color-text-tertiary)]">{filtered.length} documents</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {["Name", "Type", "Size", "Tags", "Uploaded By", "Date", "Status"].map((h) => (
                  <th key={h} className="px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => {
                const [variant, label] = statusBadge(doc.status)
                return (
                  <tr key={doc.id} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-border-subtle)] transition-base cursor-pointer">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[var(--radius-md)] bg-[var(--color-border-subtle)] flex items-center justify-center shrink-0">
                          {fileIcon(doc.type)}
                        </div>
                        <span className="text-[13px] font-medium text-[var(--color-text)] max-w-[280px] truncate">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{doc.type}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{doc.size}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)]">{doc.uploadedBy}</td>
                    <td className="px-5 py-3 text-[12px] text-[var(--color-text-secondary)] whitespace-nowrap">{fmtDate(doc.uploadedAt)}</td>
                    <td className="px-5 py-3"><Badge variant={variant} size="sm" dot>{label}</Badge></td>
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
