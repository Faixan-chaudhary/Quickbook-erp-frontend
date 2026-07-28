import { type ReactNode, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react"

// ─── Button ──────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "accent"
type ButtonSize = "xs" | "sm" | "md" | "lg"

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  onClick?: () => void
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  className?: string
  icon?: ReactNode
  iconRight?: ReactNode
  full?: boolean
}

const btnBase =
  "inline-flex items-center justify-center gap-2 font-medium rounded-[var(--radius-md)] transition-base focus-ring cursor-pointer select-none whitespace-nowrap border"

const btnVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-primary-fg)] border-transparent hover:bg-[var(--color-primary-hover)]",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-border-subtle)]",
  ghost:
    "bg-transparent text-[var(--color-text-secondary)] border-transparent hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)]",
  danger:
    "bg-[var(--color-danger-bg)] text-[var(--color-danger-text)] border-[var(--color-danger-border)] hover:bg-[var(--color-danger)] hover:text-white",
  accent:
    "bg-[var(--color-accent)] text-[var(--color-accent-fg)] border-transparent hover:bg-[var(--color-accent-hover)]",
}

const btnSizes: Record<ButtonSize, string> = {
  xs: "h-6 px-2 text-[11px] gap-1",
  sm: "h-7 px-3 text-[12px] gap-1.5",
  md: "h-8 px-3.5 text-[13px]",
  lg: "h-10 px-5 text-[14px]",
}

export function Button({
  children,
  variant = "secondary",
  size = "md",
  onClick,
  disabled,
  type = "button",
  className = "",
  icon,
  iconRight,
  full,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${full ? "w-full" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  )
}

// ─── Badge ────────────────────────────────────────────────────────────────────

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "ai" | "neutral"

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: "sm" | "md"
  dot?: boolean
  className?: string
}

const badgeVariants: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-border-subtle)] text-[var(--color-text-secondary)]",
  success: "bg-[var(--color-success-bg)] text-[var(--color-success-text)]",
  warning: "bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]",
  danger: "bg-[var(--color-danger-bg)] text-[var(--color-danger-text)]",
  info: "bg-[var(--color-info-bg)] text-[var(--color-info-text)]",
  ai: "bg-[var(--color-ai-bg)] text-[var(--color-ai-text)]",
  neutral: "bg-[var(--color-border)] text-[var(--color-text-secondary)]",
}

const dotColors: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-text-tertiary)]",
  success: "bg-[var(--color-success)]",
  warning: "bg-[var(--color-warning)]",
  danger: "bg-[var(--color-danger)]",
  info: "bg-[var(--color-info)]",
  ai: "bg-[var(--color-ai)]",
  neutral: "bg-[var(--color-text-secondary)]",
}

export function Badge({ children, variant = "default", size = "md", dot, className = "" }: BadgeProps) {
  const cls = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5"
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${badgeVariants[variant]} ${cls} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
  bordered?: boolean
}

export function Card({ children, className = "", padding = "md", bordered = true }: CardProps) {
  const pads = { none: "", sm: "p-4", md: "p-5", lg: "p-6" }
  return (
    <div
      className={`bg-[var(--color-surface)] rounded-[var(--radius-lg)] ${bordered ? "border border-[var(--color-border)]" : ""} ${pads[padding]} ${className}`}
    >
      {children}
    </div>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helper?: string
  error?: string
  icon?: ReactNode
  iconRight?: ReactNode
}

export function Input({ label, helper, error, icon, iconRight, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[12px] font-medium text-[var(--color-text)]">
          {label}
          {props.required && <span className="text-[var(--color-danger)] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-3 text-[var(--color-text-tertiary)] pointer-events-none">{icon}</span>
        )}
        <input
          className={`w-full h-8 bg-[var(--color-surface)] border ${error ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"} rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base ${icon ? "pl-8" : "pl-3"} ${iconRight ? "pr-8" : "pr-3"} ${className}`}
          {...props}
        />
        {iconRight && (
          <span className="absolute right-3 text-[var(--color-text-tertiary)] pointer-events-none">{iconRight}</span>
        )}
      </div>
      {error && <p className="text-[11px] text-[var(--color-danger)]">{error}</p>}
      {helper && !error && <p className="text-[11px] text-[var(--color-text-tertiary)]">{helper}</p>}
    </div>
  )
}

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
  error?: string
}

export function Select({ label, options, error, className = "", ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[12px] font-medium text-[var(--color-text)]">{label}</label>}
      <select
        className={`h-8 bg-[var(--color-surface)] border ${error ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"} rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)] transition-base px-3 pr-8 appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-[11px] text-[var(--color-danger)]">{error}</p>}
    </div>
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helper?: string
  error?: string
}

export function Textarea({ label, helper, error, className = "", ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[12px] font-medium text-[var(--color-text)]">{label}</label>}
      <textarea
        className={`w-full bg-[var(--color-surface)] border ${error ? "border-[var(--color-danger)]" : "border-[var(--color-border)]"} rounded-[var(--radius-md)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-base p-3 resize-none ${className}`}
        rows={3}
        {...props}
      />
      {error && <p className="text-[11px] text-[var(--color-danger)]">{error}</p>}
      {helper && !error && <p className="text-[11px] text-[var(--color-text-tertiary)]">{helper}</p>}
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string
  change?: number
  changeLabel?: string
  icon?: ReactNode
  accent?: boolean
  subValue?: string
}

export function StatCard({ label, value, change, changeLabel, icon, accent, subValue }: StatCardProps) {
  const positive = change !== undefined && change >= 0
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-[12px] font-medium text-[var(--color-text-secondary)]">{label}</span>
        {icon && (
          <span className={`p-1.5 rounded-[var(--radius-md)] ${accent ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent)]" : "bg-[var(--color-border-subtle)] text-[var(--color-text-tertiary)]"}`}>
            {icon}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[22px] font-semibold text-[var(--color-text)] tabnum tracking-tight">{value}</span>
        {subValue && <span className="text-[11px] text-[var(--color-text-tertiary)]">{subValue}</span>}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[11px] font-medium ${positive ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}
          >
            {positive ? "+" : ""}
            {change}%
          </span>
          {changeLabel && (
            <span className="text-[11px] text-[var(--color-text-tertiary)]">{changeLabel}</span>
          )}
        </div>
      )}
    </Card>
  )
}

// ─── Table ────────────────────────────────────────────────────────────────────

interface Column<T> {
  key: string
  header: string
  width?: string
  align?: "left" | "right" | "center"
  render?: (row: T) => ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyField: keyof T
  onRowClick?: (row: T) => void
  selectable?: boolean
  selectedIds?: Set<string>
  onSelectRow?: (id: string) => void
  onSelectAll?: () => void
  emptyMessage?: string
  loading?: boolean
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyField,
  onRowClick,
  selectable,
  selectedIds = new Set(),
  onSelectRow,
  onSelectAll,
  emptyMessage = "No data",
  loading,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            {selectable && (
              <th className="w-10 px-4 py-2.5 text-left">
                <input
                  type="checkbox"
                  checked={data.length > 0 && selectedIds.size === data.length}
                  onChange={onSelectAll}
                  className="rounded border-[var(--color-border)] accent-[var(--color-accent)]"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-tertiary)] ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-[var(--color-border-subtle)]">
                {selectable && <td className="px-4 py-3" />}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="h-4 bg-[var(--color-border-subtle)] rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-4 py-12 text-center text-[13px] text-[var(--color-text-tertiary)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => {
              const id = String(row[keyField])
              const selected = selectedIds.has(id)
              return (
                <tr
                  key={id}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-[var(--color-border-subtle)] transition-base ${onRowClick ? "cursor-pointer hover:bg-[var(--color-border-subtle)]" : ""} ${selected ? "bg-[var(--color-accent-subtle)]" : ""}`}
                >
                  {selectable && (
                    <td
                      className="w-10 px-4 py-3"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectRow?.(id)
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => onSelectRow?.(id)}
                        className="rounded border-[var(--color-border)] accent-[var(--color-accent)]"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 text-[13px] text-[var(--color-text)] ${col.align === "right" ? "text-right tabnum" : col.align === "center" ? "text-center" : ""}`}
                    >
                      {col.render ? col.render(row) : (row[col.key] as ReactNode)}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-teal-100 text-teal-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
  "bg-sky-100 text-sky-700",
]

interface AvatarProps {
  name: string
  size?: "xs" | "sm" | "md" | "lg"
  src?: string | null
}

export function Avatar({ name, size = "md", src }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
  const colorIdx = name.charCodeAt(0) % AVATAR_COLORS.length
  const sizes = { xs: "w-5 h-5 text-[9px]", sm: "w-7 h-7 text-[11px]", md: "w-8 h-8 text-[12px]", lg: "w-10 h-10 text-[14px]" }
  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover`} />
  }
  return (
    <span className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold shrink-0 ${AVATAR_COLORS[colorIdx]}`}>
      {initials}
    </span>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin text-[var(--color-accent)]"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round" />
    </svg>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

interface TabsProps {
  tabs: { id: string; label: string; count?: number }[]
  active: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, active, onChange, className = "" }: TabsProps) {
  return (
    <div className={`flex gap-0 border-b border-[var(--color-border)] ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2.5 text-[13px] font-medium transition-base border-b-2 -mb-px cursor-pointer ${active === tab.id ? "border-[var(--color-text)] text-[var(--color-text)]" : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-border)]"}`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${active === tab.id ? "bg-[var(--color-border)] text-[var(--color-text)]" : "bg-[var(--color-border-subtle)] text-[var(--color-text-tertiary)]"}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  breadcrumb?: string[]
}

export function SectionHeader({ title, subtitle, action, breadcrumb }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        {breadcrumb && (
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-text-tertiary)]">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {b}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-[20px] font-semibold text-[var(--color-text)] tracking-tight">{title}</h1>
        {subtitle && <p className="text-[13px] text-[var(--color-text-secondary)]">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0 flex items-center gap-2">{action}</div>}
    </div>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-12 h-12 rounded-[var(--radius-xl)] bg-[var(--color-border-subtle)] flex items-center justify-center text-[var(--color-text-tertiary)]">
        {icon}
      </div>
      <div className="text-center flex flex-col gap-1">
        <p className="text-[14px] font-medium text-[var(--color-text)]">{title}</p>
        <p className="text-[13px] text-[var(--color-text-secondary)] max-w-xs">{description}</p>
      </div>
      {action}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  width?: "md" | "lg" | "xl"
}

export function Modal({ open, onClose, title, description, children, footer, width = "lg" }: ModalProps) {
  if (!open) return null

  const widths = { md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] cursor-pointer"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative w-full ${widths[width]} max-h-[90vh] flex flex-col bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-xl`}
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-[var(--color-border)] shrink-0">
          <div>
            <h2 id="modal-title" className="text-[16px] font-semibold text-[var(--color-text)] tracking-tight">{title}</h2>
            {description && <p className="text-[12px] text-[var(--color-text-secondary)] mt-0.5">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-[var(--radius-md)] flex items-center justify-center text-[var(--color-text-tertiary)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)] transition-base cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[var(--color-border)] shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onChange: (p: number) => void
}

export function Pagination({ page, pageSize, total, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--color-border)]">
      <span className="text-[12px] text-[var(--color-text-tertiary)]">
        {start}–{end} of {total} results
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="h-7 w-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] disabled:opacity-40 transition-base"
        >
          ‹
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = i + 1
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`h-7 w-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[12px] font-medium transition-base ${page === p ? "bg-[var(--color-primary)] text-[var(--color-primary-fg)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)]"}`}
            >
              {p}
            </button>
          )
        })}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="h-7 w-7 flex items-center justify-center rounded-[var(--radius-sm)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] disabled:opacity-40 transition-base"
        >
          ›
        </button>
      </div>
    </div>
  )
}

// ─── Format helpers ───────────────────────────────────────────────────────────

export function fmtCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function fmtDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function fmtDateShort(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function statusBadge(status: string): [BadgeVariant, string] {
  const map: Record<string, [BadgeVariant, string]> = {
    paid: ["success", "Paid"],
    sent: ["info", "Sent"],
    viewed: ["info", "Viewed"],
    draft: ["neutral", "Draft"],
    overdue: ["danger", "Overdue"],
    pending: ["warning", "Pending"],
    approved: ["success", "Approved"],
    rejected: ["danger", "Rejected"],
    scheduled: ["info", "Scheduled"],
    completed: ["success", "Completed"],
    active: ["success", "Active"],
    inactive: ["neutral", "Inactive"],
    connected: ["success", "Connected"],
    manual: ["neutral", "Manual"],
    warning: ["warning", "Warning"],
    opportunity: ["success", "Opportunity"],
    info: ["info", "Info"],
    success: ["success", "Success"],
    reconciled: ["success", "Reconciled"],
    unreconciled: ["warning", "Unreconciled"],
    accepted: ["success", "Accepted"],
    declined: ["danger", "Declined"],
    converted: ["success", "Converted"],
    open: ["info", "Open"],
    closed: ["neutral", "Closed"],
    "in-progress": ["info", "In Progress"],
    "on-hold": ["warning", "On Hold"],
    "low-stock": ["warning", "Low Stock"],
    "out-of-stock": ["danger", "Out of Stock"],
    "in-stock": ["success", "In Stock"],
    received: ["success", "Received"],
    "partially-received": ["warning", "Partial"],
    ordered: ["info", "Ordered"],
    processing: ["info", "Processing"],
    failed: ["danger", "Failed"],
    enabled: ["success", "Enabled"],
    disabled: ["neutral", "Disabled"],
    archived: ["neutral", "Archived"],
    billable: ["success", "Billable"],
    "non-billable": ["neutral", "Non-billable"],
    incoming: ["success", "Incoming"],
    outgoing: ["warning", "Outgoing"],
    expired: ["danger", "Expired"],
    cancelled: ["neutral", "Cancelled"],
    confirmed: ["info", "Confirmed"],
    fulfilled: ["success", "Fulfilled"],
    "partially-fulfilled": ["warning", "Partial"],
    invoiced: ["success", "Invoiced"],
  }
  return map[status] ?? ["neutral", status]
}

export function pctChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return Math.round(((current - previous) / previous) * 1000) / 10
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

export function Tooltip({ children, content }: { children: ReactNode; content: string }) {
  return (
    <div className="relative group inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[var(--color-text)] text-[var(--color-surface)] text-[11px] rounded-[var(--radius-sm)] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-base z-50">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--color-text)]" />
      </div>
    </div>
  )
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export function Divider({ className = "" }: { className?: string }) {
  return <div className={`border-t border-[var(--color-border)] ${className}`} />
}

// ─── Metric Row ───────────────────────────────────────────────────────────────

export function MetricRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-[13px] text-[var(--color-text-secondary)]">{label}</span>
      <div className="text-right">
        <span className="text-[13px] font-medium text-[var(--color-text)] tabnum">{value}</span>
        {sub && <div className="text-[11px] text-[var(--color-text-tertiary)]">{sub}</div>}
      </div>
    </div>
  )
}
