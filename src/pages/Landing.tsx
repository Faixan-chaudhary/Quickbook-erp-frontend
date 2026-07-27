import { useCallback, useEffect, useRef, type MouseEvent, type ReactNode } from "react"
import {
  ArrowRight, Check, FileText, Landmark, Receipt,
  Users, Wallet, Shield, BarChart3, Banknote,
  Clock, ChevronRight, Brain, Lock, Sparkles,
  RefreshCw, Building2, TrendingUp, CreditCard,
  ArrowUpRight, Layers,
} from "lucide-react"

interface LandingProps {
  onGetStarted: () => void
}

function useTilt3D(maxTilt = 8) {
  const ref = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  const onMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotY = (x - 0.5) * maxTilt * 2
    const rotX = (0.5 - y) * maxTilt * 2
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--tilt-x", `${rotX.toFixed(2)}deg`)
      el.style.setProperty("--tilt-y", `${rotY.toFixed(2)}deg`)
      el.style.setProperty("--glare-x", `${(x * 100).toFixed(1)}%`)
      el.style.setProperty("--glare-y", `${(y * 100).toFixed(1)}%`)
      el.classList.add("is-tilting")
    })
  }, [maxTilt])

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    cancelAnimationFrame(frame.current)
    el.style.removeProperty("--tilt-x")
    el.style.removeProperty("--tilt-y")
    el.style.removeProperty("--glare-x")
    el.style.removeProperty("--glare-y")
    el.classList.remove("is-tilting")
  }, [])

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  return { ref, onMove, onLeave }
}

function TiltStage({
  children,
  className = "",
  maxTilt = 7,
  glare = true,
}: {
  children: ReactNode
  className?: string
  maxTilt?: number
  glare?: boolean
}) {
  const { ref, onMove, onLeave } = useTilt3D(maxTilt)
  return (
    <div
      ref={ref}
      className={`landing-tilt-stage ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="landing-tilt-inner">
        {children}
        {glare && <div className="landing-tilt-glare" aria-hidden />}
      </div>
    </div>
  )
}

const WORKFLOWS = [
  {
    title: "Get paid faster",
    desc: "Create professional invoices in minutes, send reminders automatically, and track every dollar until it hits your account.",
    points: ["Custom invoice templates", "Online payment links", "Overdue reminders", "AR aging reports"],
    visual: "invoices" as const,
    icon: FileText,
  },
  {
    title: "Know where the money goes",
    desc: "Connect your bank, categorize transactions with AI, and reconcile in a fraction of the time — so books stay audit-ready.",
    points: ["Bank & credit card sync", "Smart categorization", "One-click reconcile", "Receipt capture"],
    visual: "banking" as const,
    icon: Landmark,
  },
  {
    title: "Run payroll without the stress",
    desc: "Pay your team on time with tax calculations, direct deposit, and filings handled in the same place as your books.",
    points: ["Salary & hourly pay", "Tax withholdings", "Direct deposit", "Employee portal"],
    visual: "payroll" as const,
    icon: Users,
  },
]

const TOOLS = [
  { icon: FileText, label: "Invoicing", detail: "Estimates → invoices → payments" },
  { icon: Receipt, label: "Expenses & bills", detail: "Capture, approve, pay vendors" },
  { icon: Landmark, label: "Banking", detail: "Sync, match, reconcile" },
  { icon: Users, label: "Payroll", detail: "Run payroll in minutes" },
  { icon: BarChart3, label: "Reports", detail: "P&L, cash flow, balance sheet" },
  { icon: Banknote, label: "Taxes", detail: "Sales tax & estimated payments" },
]

const TRUST_NAMES = ["Aperture Labs", "NovaTech", "Meridian", "Cascade Group", "Orion Digital", "Apex Corp", "Luminary", "Vantage"]

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible")
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`landing-reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function Landing({ onGetStarted }: LandingProps) {
  return (
    <div className="landing min-h-screen overflow-x-hidden">
      <nav className="landing-nav sticky top-0 z-40 border-b border-[var(--lp-line)]">
        <div className="max-w-[1160px] mx-auto h-14 px-5 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[var(--lp-brand)] flex items-center justify-center">
              <Wallet size={15} className="text-white" />
            </div>
            <span className="landing-display text-[18px] font-semibold tracking-tight text-[var(--lp-ink)]">Arca</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[13px] text-[var(--lp-ink-soft)]">
            <a href="#features" className="landing-nav-link hover:text-[var(--lp-ink)] transition-colors">Features</a>
            <a href="#how" className="landing-nav-link hover:text-[var(--lp-ink)] transition-colors">How it works</a>
            <a href="#pricing" className="landing-nav-link hover:text-[var(--lp-ink)] transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGetStarted}
              className="hidden sm:block text-[13px] font-medium text-[var(--lp-ink-soft)] hover:text-[var(--lp-ink)] px-3 py-1.5 cursor-pointer"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="landing-cta-primary h-9 px-4 rounded-md text-[13px] font-semibold cursor-pointer"
            >
              Start free trial
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="landing-hero-atmosphere" aria-hidden>
          <span className="landing-orb landing-orb-a" />
          <span className="landing-orb landing-orb-b" />
          <span className="landing-orb landing-orb-c" />
          <div className="landing-grid-fade" />
        </div>

        <div className="relative max-w-[1160px] mx-auto px-5 md:px-8 pt-16 md:pt-20 pb-10 md:pb-12 text-center">
          <p className="landing-hero-enter landing-display text-[14px] md:text-[15px] font-semibold tracking-[0.04em] text-[var(--lp-brand)] mb-4">
            Arca Finance
          </p>
          <h1 className="landing-display landing-headline text-[40px] md:text-[58px] font-semibold tracking-[-0.02em] leading-[1.06] text-[var(--lp-ink)] max-w-[820px] mx-auto">
            The books that keep your business moving forward
          </h1>
          <p className="landing-hero-enter-delay mt-5 text-[17px] md:text-[18px] text-[var(--lp-ink-soft)] max-w-[520px] mx-auto leading-relaxed">
            Invoice, pay bills, reconcile banks, and run payroll. See exactly where your cash stands, in one place.
          </p>
          <div className="landing-hero-enter-delay mt-8 flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={onGetStarted}
              className="landing-cta-primary h-12 px-7 rounded-md text-[15px] font-semibold cursor-pointer inline-flex items-center gap-2"
            >
              See Arca in action
              <ArrowRight size={16} className="landing-cta-arrow" />
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="landing-cta-secondary h-12 px-6 rounded-md text-[15px] font-semibold text-[var(--lp-ink)] cursor-pointer inline-flex items-center gap-2"
            >
              Explore the demo
              <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="landing-hero-enter-delay mt-5 flex items-center justify-center gap-4 text-[12px] text-[var(--lp-ink-soft)]">
            <span className="inline-flex items-center gap-1.5">
              <Check size={13} className="text-[var(--lp-brand)]" strokeWidth={2.5} />
              14-day free trial
            </span>
            <span className="w-px h-3 bg-[var(--lp-line)]" />
            <span className="inline-flex items-center gap-1.5">
              <Lock size={12} className="text-[var(--lp-brand)]" />
              No credit card
            </span>
            <span className="w-px h-3 bg-[var(--lp-line)] hidden sm:block" />
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <RefreshCw size={12} className="text-[var(--lp-brand)]" />
              Cancel anytime
            </span>
          </div>
        </div>

        <div className="landing-hero-visual relative max-w-[1160px] mx-auto px-5 md:px-8 pb-16 md:pb-24">
          <div className="landing-hero-stage">
            <div className="landing-hero-depth" aria-hidden />
            <TiltStage className="landing-hero-tilt" maxTilt={9}>
          <div className="landing-product-frame landing-mock w-full rounded-xl overflow-hidden text-left">
            <div className="h-10 bg-[#EEF6F5] border-b border-[var(--lp-line)] flex items-center px-4 gap-2">
              <span className="landing-mock-dot w-2.5 h-2.5 rounded-full bg-[#D48484]" />
              <span className="landing-mock-dot w-2.5 h-2.5 rounded-full bg-[#D4B86A]" />
              <span className="landing-mock-dot w-2.5 h-2.5 rounded-full bg-[#7CB89A]" />
              <span className="ml-3 text-[11px] text-[var(--lp-ink-soft)] font-medium">app.arcafinance.io / Dashboard</span>
              <button
                type="button"
                onClick={onGetStarted}
                className="landing-mock-chip ml-auto hidden sm:inline-flex items-center gap-1.5 text-[10px] font-medium text-[var(--lp-brand)] bg-[var(--lp-mint)] px-2 py-1 rounded cursor-pointer"
              >
                <Sparkles size={11} />
                Live demo
              </button>
            </div>
            <div className="grid grid-cols-12 min-h-[320px] md:min-h-[400px]">
              <div className="hidden md:flex col-span-2 flex-col gap-0.5 p-3 border-r border-[var(--lp-line)] bg-[#F8FBFA]">
                <div className="flex items-center gap-2 px-2 py-2.5 mb-2">
                  <div className="w-5 h-5 rounded bg-[var(--lp-brand)] flex items-center justify-center">
                    <Wallet size={10} className="text-white" />
                  </div>
                  <span className="text-[11px] font-semibold">Arca</span>
                </div>
                {[
                  { label: "Dashboard", icon: Layers },
                  { label: "Invoices", icon: FileText },
                  { label: "Banking", icon: Landmark },
                  { label: "Expenses", icon: Receipt },
                  { label: "Payroll", icon: Users },
                  { label: "Reports", icon: BarChart3 },
                ].map((item, i) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={onGetStarted}
                    className={`landing-mock-nav flex items-center gap-2 px-2 py-1.5 rounded text-[11px] w-full text-left cursor-pointer ${i === 0 ? "is-active bg-[var(--lp-mint)] text-[var(--lp-brand)] font-semibold" : "text-[var(--lp-ink-soft)]"}`}
                  >
                    <item.icon size={12} strokeWidth={1.75} />
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="col-span-12 md:col-span-10 p-4 md:p-6 bg-white">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-[15px] font-semibold text-[var(--lp-ink)]">Good afternoon, Jordan</div>
                    <div className="text-[12px] text-[var(--lp-ink-soft)] flex items-center gap-1.5 mt-0.5">
                      <Building2 size={11} />
                      Meridian Technologies
                      <span className="text-[var(--lp-line)]">·</span>
                      <span className="text-[var(--lp-brand)] font-medium inline-flex items-center gap-1">
                        <TrendingUp size={11} />
                        Cash healthy
                      </span>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onGetStarted}
                      className="landing-mock-btn-secondary h-7 px-3 rounded border border-[var(--lp-line)] text-[11px] text-[var(--lp-ink-soft)] flex items-center cursor-pointer"
                    >
                      Export
                    </button>
                    <button
                      type="button"
                      onClick={onGetStarted}
                      className="landing-mock-btn-primary h-7 px-3 rounded bg-[var(--lp-brand)] text-white text-[11px] font-semibold flex items-center cursor-pointer"
                    >
                      New invoice
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: "Cash on hand", value: "$2.33M", change: "+10.9%", up: true },
                    { label: "To collect", value: "$285K", change: "38 DSO", up: false },
                    { label: "To pay", value: "$65K", change: "7 bills", up: false },
                    { label: "Profit (YTD)", value: "$1.72M", change: "+32.8%", up: true },
                  ].map((kpi, i) => (
                    <button
                      key={kpi.label}
                      type="button"
                      onClick={onGetStarted}
                      className="landing-kpi landing-mock-kpi rounded-lg border border-[var(--lp-line)] p-3 bg-[#FAFDFC] text-left cursor-pointer w-full"
                      style={{ animationDelay: `${0.35 + i * 0.08}s` }}
                    >
                      <div className="text-[10px] uppercase tracking-wide text-[var(--lp-ink-soft)] mb-1">{kpi.label}</div>
                      <div className="text-[18px] font-bold tabular-nums text-[var(--lp-ink)]">{kpi.value}</div>
                      <div className={`text-[11px] mt-0.5 font-medium ${kpi.up ? "text-[var(--lp-brand)]" : "text-[var(--lp-ink-soft)]"}`}>
                        {kpi.change}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  <div className="landing-mock-panel md:col-span-3 rounded-lg border border-[var(--lp-line)] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-[12px] font-semibold">Revenue this year</div>
                      <div className="text-[11px] text-[var(--lp-brand)] font-medium tabular-nums">$4.56M</div>
                    </div>
                    <div className="flex items-end gap-1.5 h-28">
                      {[
                        { m: "Jan", h: 42, v: "$284K" },
                        { m: "Feb", h: 48, v: "$312K" },
                        { m: "Mar", h: 45, v: "$298K" },
                        { m: "Apr", h: 55, v: "$341K" },
                        { m: "May", h: 62, v: "$368K" },
                        { m: "Jun", h: 58, v: "$355K" },
                        { m: "Jul", h: 68, v: "$392K" },
                        { m: "Aug", h: 74, v: "$418K" },
                        { m: "Sep", h: 70, v: "$401K" },
                        { m: "Oct", h: 82, v: "$445K" },
                        { m: "Nov", h: 88, v: "$462K" },
                        { m: "Dec", h: 94, v: "$489K" },
                      ].map((bar, i) => (
                        <div
                          key={bar.m}
                          className="landing-bar-wrap group/bar relative flex-1 h-full flex items-end"
                        >
                          <div className="landing-bar-tip absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-[9px] font-semibold bg-[var(--lp-ink)] text-white opacity-0 pointer-events-none z-10">
                            {bar.m} · {bar.v}
                          </div>
                          <button
                            type="button"
                            onClick={onGetStarted}
                            className="landing-bar w-full rounded-t bg-[var(--lp-brand)] cursor-pointer border-0 p-0"
                            style={{
                              height: `${bar.h}%`,
                              opacity: 0.55 + (i / 12) * 0.45,
                              animationDelay: `${0.45 + i * 0.045}s`,
                            }}
                            aria-label={`${bar.m} revenue ${bar.v}`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-[var(--lp-ink-soft)]">
                      <span>Jan</span><span>Jun</span><span>Dec</span>
                    </div>
                  </div>
                  <div className="landing-mock-panel md:col-span-2 rounded-lg border border-[var(--lp-line)] p-4">
                    <div className="text-[12px] font-semibold mb-3">Needs attention</div>
                    <div className="space-y-1">
                      {[
                        { t: "3 overdue invoices", s: "$209,412", tone: "danger" as const, icon: FileText },
                        { t: "Bank match ready", s: "12 txns", tone: "brand" as const, icon: CreditCard },
                        { t: "Payroll Dec 27", s: "$192K", tone: "muted" as const, icon: Users },
                      ].map((row) => (
                        <button
                          key={row.t}
                          type="button"
                          onClick={onGetStarted}
                          className="landing-mock-attention flex items-center justify-between text-[12px] gap-2 w-full rounded-md px-2 py-2 text-left cursor-pointer border-0 bg-transparent"
                        >
                          <span className="text-[var(--lp-ink-soft)] inline-flex items-center gap-2 min-w-0">
                            <row.icon size={12} className="landing-mock-attention-icon shrink-0 opacity-70" />
                            <span className="truncate">{row.t}</span>
                          </span>
                          <span
                            className={`font-semibold tabular-nums shrink-0 ${
                              row.tone === "danger"
                                ? "text-[#B91C1C]"
                                : row.tone === "brand"
                                  ? "text-[var(--lp-brand)]"
                                  : "text-[var(--lp-ink-soft)]"
                            }`}
                          >
                            {row.s}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            </TiltStage>
          </div>
        </div>
      </section>

      {/* Trust marquee */}
      <section className="border-y border-[var(--lp-line)] bg-white/70 py-7 overflow-hidden">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--lp-ink-soft)] mb-5">
          Trusted by finance teams at
        </p>
        <div className="landing-marquee">
          <div className="landing-marquee-track">
            {[...TRUST_NAMES, ...TRUST_NAMES].map((n, i) => (
              <span key={`${n}-${i}`} className="landing-marquee-item">
                <Building2 size={14} className="opacity-40" />
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-[1160px] mx-auto px-5 md:px-8">
          <Reveal className="max-w-[580px] mb-14">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--lp-brand)] mb-3">Product</p>
            <h2 className="landing-display text-[32px] md:text-[42px] font-semibold tracking-tight text-[var(--lp-ink)] leading-[1.12]">
              Everything you need to close the books
            </h2>
            <p className="mt-4 text-[16px] text-[var(--lp-ink-soft)] leading-relaxed">
              From day-one bookkeeping to month-end reporting — the same tools finance teams use every day, connected.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((tool, i) => (
              <Reveal key={tool.label} delay={i * 60}>
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="landing-tool-card w-full bg-white p-6 text-left cursor-pointer group border border-[var(--lp-line)] rounded-xl h-full"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--lp-mint)] text-[var(--lp-brand)] flex items-center justify-center mb-4 group-hover:bg-[var(--lp-brand)] group-hover:text-white transition-colors duration-300">
                    <tool.icon size={18} strokeWidth={1.75} />
                  </div>
                  <div className="text-[15px] font-semibold text-[var(--lp-ink)] flex items-center gap-1">
                    {tool.label}
                    <ChevronRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[var(--lp-brand)]" />
                  </div>
                  <p className="mt-1.5 text-[13px] text-[var(--lp-ink-soft)] leading-snug">{tool.detail}</p>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Workflows */}
      <section id="how" className="py-4 md:py-8 bg-white border-y border-[var(--lp-line)]">
        <div className="max-w-[1160px] mx-auto px-5 md:px-8 space-y-20 md:space-y-28 py-16 md:py-20">
          {WORKFLOWS.map((w, idx) => (
            <Reveal key={w.title}>
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${idx % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div>
                  <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-[var(--lp-brand)] mb-4">
                    <span className="w-8 h-8 rounded-lg bg-[var(--lp-mint)] flex items-center justify-center">
                      <w.icon size={15} strokeWidth={1.75} />
                    </span>
                    Step {idx + 1}
                  </div>
                  <h3 className="landing-display text-[28px] md:text-[34px] font-semibold tracking-tight text-[var(--lp-ink)] leading-tight">
                    {w.title}
                  </h3>
                  <p className="mt-3 text-[15px] text-[var(--lp-ink-soft)] leading-relaxed">{w.desc}</p>
                  <ul className="mt-6 space-y-2.5">
                    {w.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-[14px] text-[var(--lp-ink)]">
                        <span className="w-5 h-5 rounded-md bg-[var(--lp-mint)] flex items-center justify-center shrink-0">
                          <Check size={12} className="text-[var(--lp-brand)]" strokeWidth={2.5} />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={onGetStarted}
                    className="mt-8 text-[14px] font-semibold text-[var(--lp-brand)] inline-flex items-center gap-1.5 hover:gap-2.5 transition-all cursor-pointer"
                  >
                    Try this in the demo <ArrowRight size={15} />
                  </button>
                </div>
                <TiltStage maxTilt={6} className="landing-workflow-tilt">
                  <WorkflowVisual type={w.visual} />
                </TiltStage>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* AI */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1160px] mx-auto px-5 md:px-8">
          <Reveal>
            <TiltStage maxTilt={5} className="landing-ai-tilt">
            <div className="landing-ai-panel rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#7DD3C8] mb-4">
                  <Brain size={15} />
                  AI Copilot
                </div>
                <h2 className="landing-display text-[28px] md:text-[36px] font-semibold tracking-tight leading-tight text-white">
                  Ask your books a question. Get a real answer.
                </h2>
                <p className="mt-4 text-[15px] text-white/65 leading-relaxed">
                  Cash runway, overdue risk, expense anomalies — grounded in your live data, not generic advice.
                </p>
                <button
                  type="button"
                  onClick={onGetStarted}
                  className="mt-8 self-start h-11 px-5 rounded-md bg-white text-[var(--lp-ink)] text-[14px] font-semibold hover:bg-[var(--lp-mint)] transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  Open AI Copilot <ArrowRight size={15} />
                </button>
              </div>
              <div className="p-6 md:p-8 bg-[#0C3F3B] flex flex-col gap-3.5 justify-center relative overflow-hidden">
                <div className="landing-ai-glow" aria-hidden />
                <div className="landing-chat-bubble landing-chat-user self-end max-w-[88%] rounded-xl rounded-br-sm bg-[var(--lp-brand)] px-3.5 py-2.5 text-[13px] text-white relative z-10">
                  What&apos;s our cash runway?
                </div>
                <div className="landing-chat-bubble landing-chat-ai self-start max-w-[92%] rounded-xl rounded-bl-sm bg-white/10 border border-white/10 px-3.5 py-2.5 text-[13px] text-white/90 leading-relaxed relative z-10">
                  Based on $2.33M cash and ~$271K monthly burn, you have about 8.6 months. Collecting three overdue invoices ($209K) extends that to 9.2 months.
                </div>
                <div className="landing-chat-bubble landing-chat-user self-end max-w-[88%] rounded-xl rounded-br-sm bg-[var(--lp-brand)] px-3.5 py-2.5 text-[13px] text-white relative z-10" style={{ animationDelay: "0.35s" }}>
                  Who should we follow up with first?
                </div>
                <div className="landing-chat-bubble landing-chat-ai self-start max-w-[92%] rounded-xl rounded-bl-sm bg-white/10 border border-white/10 px-3.5 py-2.5 text-[13px] text-white/90 leading-relaxed relative z-10" style={{ animationDelay: "0.5s" }}>
                  Titanium Capital: $156K overdue 62 days. Quantum Ventures: $31.8K, 60+ days. Both past your 60-day DSO threshold.
                </div>
              </div>
            </div>
            </TiltStage>
          </Reveal>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 md:py-28 bg-white border-y border-[var(--lp-line)]">
        <div className="max-w-[1160px] mx-auto px-5 md:px-8">
          <Reveal className="text-center max-w-[500px] mx-auto mb-14">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--lp-brand)] mb-3">Pricing</p>
            <h2 className="landing-display text-[32px] md:text-[42px] font-semibold tracking-tight text-[var(--lp-ink)]">
              Simple pricing that scales with you
            </h2>
            <p className="mt-4 text-[15px] text-[var(--lp-ink-soft)]">
              Start with what you need. Upgrade when your team grows — no surprise fees.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {[
              {
                name: "Starter",
                price: "$49",
                blurb: "Freelancers & solo operators",
                features: ["2 users", "Invoicing & expenses", "2 bank connections", "Basic reports", "Email support"],
                featured: false,
              },
              {
                name: "Professional",
                price: "$199",
                blurb: "Growing finance teams",
                features: ["10 users", "Full accounting suite", "Unlimited banks", "AI Copilot", "Payroll add-on", "API access"],
                featured: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                blurb: "Multi-entity organizations",
                features: ["Unlimited users", "Multi-company", "SSO / SAML", "Dedicated support", "Custom integrations", "SLA"],
                featured: false,
              },
            ].map((plan, i) => (
              <Reveal key={plan.name} delay={i * 80}>
                <div
                  className={`landing-price-card rounded-xl p-6 flex flex-col h-full ${
                    plan.featured
                      ? "landing-price-featured text-white"
                      : "bg-[#FAFDFC] border border-[var(--lp-line)]"
                  }`}
                >
                  {plan.featured && (
                    <div className="inline-flex self-start items-center gap-1.5 text-[11px] font-semibold bg-white/15 text-[#9DE8DE] px-2.5 py-1 rounded-md mb-3">
                      <Sparkles size={12} />
                      Most popular
                    </div>
                  )}
                  <div className="text-[14px] font-semibold">{plan.name}</div>
                  <div className={`text-[13px] mt-1 ${plan.featured ? "text-white/60" : "text-[var(--lp-ink-soft)]"}`}>{plan.blurb}</div>
                  <div className="mt-5 mb-6">
                    <span className="landing-display text-[40px] font-semibold tracking-tight">{plan.price}</span>
                    {plan.price !== "Custom" && (
                      <span className={`text-[13px] ${plan.featured ? "text-white/50" : "text-[var(--lp-ink-soft)]"}`}>/mo</span>
                    )}
                  </div>
                  <ul className="space-y-2.5 flex-1 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[13px]">
                        <Check size={14} className={plan.featured ? "text-[#7DD3C8]" : "text-[var(--lp-brand)]"} />
                        <span className={plan.featured ? "text-white/85" : "text-[var(--lp-ink-soft)]"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={onGetStarted}
                    className={`w-full h-10 rounded-md text-[13px] font-semibold cursor-pointer transition-colors ${
                      plan.featured
                        ? "bg-white text-[var(--lp-ink)] hover:bg-[var(--lp-mint)]"
                        : "landing-cta-primary"
                    }`}
                  >
                    {plan.price === "Custom" ? "Talk to sales" : "Start free trial"}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1160px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Reveal>
              <div className="landing-trust-card rounded-xl border border-[var(--lp-line)] bg-white p-6 md:p-7 h-full">
                <div className="w-10 h-10 rounded-lg bg-[var(--lp-mint)] text-[var(--lp-brand)] flex items-center justify-center mb-4">
                  <Shield size={18} strokeWidth={1.75} />
                </div>
                <div className="text-[16px] font-semibold text-[var(--lp-ink)]">Bank-grade security</div>
                <p className="text-[13px] text-[var(--lp-ink-soft)] mt-2 leading-relaxed">
                  SOC 2 Type II · 256-bit encryption · Role-based access · Full audit trail
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="landing-trust-card rounded-xl border border-[var(--lp-line)] bg-white p-6 md:p-7 h-full">
                <div className="w-10 h-10 rounded-lg bg-[var(--lp-mint)] text-[var(--lp-brand)] flex items-center justify-center mb-4">
                  <Clock size={18} strokeWidth={1.75} />
                </div>
                <div className="text-[16px] font-semibold text-[var(--lp-ink)]">Close books days faster</div>
                <p className="text-[13px] text-[var(--lp-ink-soft)] mt-2 leading-relaxed">
                  Automation and AI cut reconciliation and month-end work so your team focuses on decisions.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-[1160px] mx-auto px-5 md:px-8">
          <Reveal>
            <div className="landing-final-cta rounded-2xl px-8 py-14 md:px-16 md:py-16 text-center relative overflow-hidden">
              <div className="landing-final-cta-orb" aria-hidden />
              <h2 className="landing-display relative text-[28px] md:text-[38px] font-semibold tracking-tight text-[var(--lp-ink)]">
                Ready to take control of your books?
              </h2>
              <p className="relative mt-3 text-[15px] text-[var(--lp-ink-soft)] max-w-md mx-auto">
                Jump into the live demo with sample company data — no signup required for the walkthrough.
              </p>
              <button
                type="button"
                onClick={onGetStarted}
                className="landing-cta-primary relative mt-8 h-12 px-8 rounded-md text-[15px] font-semibold cursor-pointer inline-flex items-center gap-2"
              >
                Open the Arca demo
                <ArrowRight size={16} className="landing-cta-arrow" />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-[var(--lp-line)] bg-white">
        <div className="max-w-[1160px] mx-auto px-5 md:px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-md bg-[var(--lp-brand)] flex items-center justify-center">
                <Wallet size={13} className="text-white" />
              </div>
              <span className="font-semibold text-[var(--lp-ink)]">Arca Finance</span>
            </div>
            <div className="flex flex-wrap gap-5 text-[12px] text-[var(--lp-ink-soft)]">
              {["Product", "Pricing", "Security", "API", "Privacy", "Terms"].map((l) => (
                <button key={l} type="button" className="hover:text-[var(--lp-ink)] cursor-pointer transition-colors">{l}</button>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-[var(--lp-line)] text-[11px] text-[var(--lp-ink-soft)]">
            © 2026 Arca Finance Inc. Accounting software for modern finance teams.
          </div>
        </div>
      </footer>
    </div>
  )
}

function WorkflowVisual({ type }: { type: "invoices" | "banking" | "payroll" }) {
  if (type === "invoices") {
    return (
      <div className="landing-product-frame rounded-xl p-5 landing-visual-float">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[12px] font-semibold text-[var(--lp-ink)] flex items-center gap-2">
            <FileText size={13} className="text-[var(--lp-brand)]" />
            Open invoices
          </div>
          <span className="text-[11px] font-medium text-[var(--lp-ink-soft)]">4 open</span>
        </div>
        <div className="space-y-2">
          {[
            { id: "INV-0847", name: "Apex Dynamics", amt: "$25,920", status: "Overdue", bad: true },
            { id: "INV-0846", name: "Luminary Solutions", amt: "$13,500", status: "Sent", bad: false },
            { id: "INV-0842", name: "Orion Digital", amt: "$26,880", status: "Viewed", bad: false },
            { id: "INV-0840", name: "Vantage Point", amt: "$19,008", status: "Sent", bad: false },
          ].map((row, i) => (
            <button
              key={row.id}
              type="button"
              className="landing-list-row flex items-center gap-3 p-2.5 rounded-lg border border-[var(--lp-line)] bg-white w-full text-left cursor-pointer"
              style={{ animationDelay: `${0.1 + i * 0.07}s` }}
            >
              <div className="w-8 h-8 rounded-md bg-[var(--lp-mint)] text-[var(--lp-brand)] text-[10px] font-bold flex items-center justify-center">
                {row.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium text-[var(--lp-ink)] truncate">{row.name}</div>
                <div className="text-[10px] text-[var(--lp-ink-soft)] font-mono">{row.id}</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-semibold tabular-nums">{row.amt}</div>
                <div className={`text-[10px] font-medium ${row.bad ? "text-[#B91C1C]" : "text-[var(--lp-brand)]"}`}>{row.status}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (type === "banking") {
    return (
      <div className="landing-product-frame rounded-xl p-5 landing-visual-float">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[12px] font-semibold flex items-center gap-2">
            <Landmark size={13} className="text-[var(--lp-brand)]" />
            Operating Checking
          </div>
          <div className="text-[18px] font-bold tabular-nums text-[var(--lp-ink)]">$892,340</div>
        </div>
        <div className="space-y-0">
          {[
            { d: "Payment – Nexus INV-0845", a: "+$38,200", ok: true },
            { d: "Stripe BILL-0337", a: "−$3,200", ok: false },
            { d: "WeWork – December rent", a: "−$9,800", ok: false },
            { d: "Payment – Cascade INV-0843", a: "+$9,612", ok: true },
          ].map((t, i) => (
            <button
              key={t.d}
              type="button"
              className="landing-list-row flex items-center justify-between py-2.5 px-1 border-b border-[var(--lp-line)] last:border-0 w-full text-left cursor-pointer bg-transparent"
              style={{ animationDelay: `${0.1 + i * 0.07}s` }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-1.5 h-1.5 rounded-sm shrink-0 ${t.ok ? "bg-[var(--lp-brand)]" : "bg-amber-500"}`} />
                <span className="text-[12px] text-[var(--lp-ink-soft)] truncate">{t.d}</span>
              </div>
              <span className={`text-[12px] font-semibold tabular-nums shrink-0 ml-3 ${t.a.startsWith("+") ? "text-[var(--lp-brand)]" : "text-[var(--lp-ink)]"}`}>
                {t.a}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="landing-mock-match mt-4 h-9 w-full rounded-md bg-[var(--lp-mint)] text-[var(--lp-brand)] text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer border-0"
        >
          <RefreshCw size={12} className="landing-spin-on-hover" />
          12 transactions ready to match
        </button>
      </div>
    )
  }

  return (
    <div className="landing-product-frame rounded-xl p-5 landing-visual-float">
      <div className="text-[12px] font-semibold mb-1 flex items-center gap-2">
        <Users size={13} className="text-[var(--lp-brand)]" />
        Next payroll · Dec 27
      </div>
      <div className="landing-display text-[30px] font-semibold tabular-nums text-[var(--lp-ink)] mb-4">$192,400</div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { l: "Gross", v: "$192K" },
          { l: "Taxes", v: "$58K" },
          { l: "Net", v: "$135K" },
        ].map((x) => (
          <button key={x.l} type="button" className="landing-mock-stat rounded-lg bg-[var(--lp-mint)] p-2.5 text-center cursor-pointer border-0 w-full">
            <div className="text-[10px] text-[var(--lp-ink-soft)]">{x.l}</div>
            <div className="text-[13px] font-bold tabular-nums text-[var(--lp-ink)]">{x.v}</div>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {["Jordan Avery — CFO", "Priya Sharma — Engineering", "Marcus Chen — Sales"].map((n, i) => (
          <button
            key={n}
            type="button"
            className="landing-list-row flex items-center gap-2 text-[12px] text-[var(--lp-ink-soft)] w-full text-left cursor-pointer bg-transparent border-0 px-1 py-1 rounded-md"
            style={{ animationDelay: `${0.1 + i * 0.07}s` }}
          >
            <div className="w-6 h-6 rounded-md bg-[var(--lp-mint)] text-[9px] font-bold text-[var(--lp-brand)] flex items-center justify-center">
              {n[0]}
            </div>
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
