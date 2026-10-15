"use client";

import { useState, useRef, useEffect } from "react"
import {
  Send, Sparkles, Bot, Mic, RotateCcw, Copy, ThumbsUp, ThumbsDown,
  TrendingUp, AlertCircle, CheckCircle2, Zap, Brain, BarChart3,
  FileText, DollarSign, PieChart, Target,
} from "lucide-react"
import { aiInsights } from "../data/mock"
import { Button, Card, Badge, fmtCurrency } from "../components/ui"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const STARTER_PROMPTS = [
  "What is my current cash runway?",
  "Summarize this month's P&L",
  "Which customers are overdue?",
  "Optimize my tax position for Q4",
  "Forecast next quarter revenue",
  "Find unusual expense patterns",
]

const AI_CAPABILITIES = [
  { icon: <Brain size={16} />, title: "Financial Analysis" },
  { icon: <TrendingUp size={16} />, title: "Revenue Forecasting" },
  { icon: <BarChart3 size={16} />, title: "Cash Flow Modeling" },
  { icon: <FileText size={16} />, title: "OCR & Data Entry" },
  { icon: <DollarSign size={16} />, title: "Tax Optimization" },
  { icon: <Zap size={16} />, title: "Automation Builder" },
  { icon: <AlertCircle size={16} />, title: "Anomaly Detection" },
  { icon: <Target size={16} />, title: "Goal Tracking" },
]

const SAMPLE_RESPONSES: Record<string, string> = {
  "What is my current cash runway?": `**Cash Runway Analysis — As of December 2024**

Based on your current financials:

**Current Position:**
- Cash & Equivalents: $2,328,940
- Monthly Burn Rate: $271,000 (Nov avg)

**Runway: ~8.6 months** (until August 2025)

**Improving factors:**
- Expected collections from Titanium Capital ($156K overdue) would extend runway to **9.2 months**
- Revenue growth of 18% MoM would extend to **11+ months**

**Recommendations:**
1. Accelerate collections on 3 overdue invoices totaling $209K
2. Review AWS spend ($28K/mo) — potential 20-30% optimization
3. Consider a short-term credit facility as runway buffer

Would you like me to run a detailed scenario analysis?`,

  "Summarize this month's P&L": `**November 2024 P&L Summary**

**Revenue:** $462,000 (+3.8% MoM, +15.2% YoY)
**Expenses:** $271,000 (+3.8% MoM)
**Net Income:** $191,000 (**41.3% margin**)

**Highlights:**
- Enterprise tier drove 68% of revenue ($314K)
- Professional Services up 22% — strong demand signal
- Payroll increased $1,800 MoM (new hire mid-month)

**Watch items:**
- AWS spend increased 34% ($7.2K over prior month)
- 3 invoices totaling $209K remain uncollected
- Q4 estimated tax payment due Jan 15 ($124.8K)

**YTD Performance:** On track for $5.0M ARR by year-end.`,
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Ask about cash runway, P&L, overdue invoices, forecasts, or tax — I have your live books loaded.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "insights" | "automations">("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = (content: string) => {
    if (!content.trim()) return
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    setTimeout(() => {
      const response = SAMPLE_RESPONSES[content] || `I understand you're asking about: **"${content}"**\n\nI'm analyzing your financial data... Based on your Meridian Technologies account, I can see relevant metrics and trends. Here's what I found:\n\n- Revenue trend is **positive** with consistent month-over-month growth\n- Your cash position is **healthy** with 8+ months runway\n- There are **3 action items** that could improve your financial position\n\nWould you like me to dive deeper into any specific aspect?`
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMsg])
      setLoading(false)
    }, 1200)
  }

  const formatMessage = (content: string) => {
    return content
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={i} className="font-semibold text-[var(--color-text)] mt-2 first:mt-0">{line.replace(/\*\*/g, "")}</p>
        }
        if (line.startsWith("- ")) {
          return (
            <p key={i} className="flex items-start gap-2 text-[var(--color-text-secondary)]">
              <span className="mt-2 w-1 h-1 rounded-full bg-[var(--color-text-tertiary)] shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--color-text)] font-semibold">$1</strong>') }} />
            </p>
          )
        }
        if (line.match(/^\d+\./)) {
          return (
            <p key={i} className="text-[var(--color-text-secondary)]" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--color-text)] font-semibold">$1</strong>') }} />
          )
        }
        if (!line) return <br key={i} />
        return (
          <p key={i} className="text-[var(--color-text-secondary)]" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[var(--color-text)] font-semibold">$1</strong>') }} />
        )
      })
  }

  return (
    <div className="p-6 flex flex-col gap-5 w-full h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-[var(--radius-lg)] bg-[var(--color-ai-bg)] flex items-center justify-center">
            <Brain size={18} className="text-[var(--color-ai)]" />
          </div>
          <div>
            <h1 className="text-[18px] font-semibold text-[var(--color-text)] tracking-tight">AI Copilot</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<RotateCcw size={13} />}>New Session</Button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-0 border-b border-[var(--color-border)]">
        {(["chat", "insights", "automations"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-[13px] font-medium capitalize border-b-2 -mb-px cursor-pointer transition-base ${activeTab === t ? "border-[var(--color-text)] text-[var(--color-text)]" : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {activeTab === "chat" && (
        <div className="flex gap-4 flex-1 min-h-0" style={{ height: "calc(100vh - 280px)" }}>
          {/* Chat */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            {/* Capabilities (only when fresh) */}
            {messages.length === 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {AI_CAPABILITIES.map((cap) => (
                  <div key={cap.title} className="p-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
                    <div className="text-[var(--color-text-tertiary)] mb-1.5">{cap.icon}</div>
                    <div className="text-[12px] font-medium text-[var(--color-text)]">{cap.title}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Messages */}
            <Card padding="none" className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === "assistant" ? "bg-[var(--color-ai-bg)]" : "bg-[var(--color-primary)]"}`}>
                      {msg.role === "assistant" ? (
                        <Bot size={14} className="text-[var(--color-ai)]" />
                      ) : (
                        <span className="text-[10px] font-bold text-[var(--color-primary-fg)]">JA</span>
                      )}
                    </div>
                    <div className={`max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                      <div
                        className={`rounded-[var(--radius-lg)] px-4 py-3 text-[13px] leading-6 ${msg.role === "assistant" ? "bg-[var(--color-bg)] border border-[var(--color-border)]" : "bg-[var(--color-primary)] text-[var(--color-primary-fg)]"}`}
                      >
                        {msg.role === "assistant" ? (
                          <div className="flex flex-col gap-0.5">{formatMessage(msg.content)}</div>
                        ) : (
                          msg.content
                        )}
                      </div>
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-1">
                          <button className="w-5 h-5 flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-base cursor-pointer">
                            <ThumbsUp size={11} />
                          </button>
                          <button className="w-5 h-5 flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-base cursor-pointer">
                            <ThumbsDown size={11} />
                          </button>
                          <button className="w-5 h-5 flex items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-base cursor-pointer">
                            <Copy size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[var(--color-ai-bg)] flex items-center justify-center shrink-0">
                      <Bot size={14} className="text-[var(--color-ai)]" />
                    </div>
                    <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-tertiary)] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-tertiary)] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-tertiary)] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Starter prompts */}
              {messages.length <= 2 && !loading && (
                <div className="px-5 py-3 border-t border-[var(--color-border)] flex gap-2 flex-wrap">
                  {STARTER_PROMPTS.map((p) => (
                    <button
                      key={p}
                      onClick={() => sendMessage(p)}
                      className="text-[11px] px-3 py-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] hover:text-[var(--color-text)] cursor-pointer transition-base"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div className="border-t border-[var(--color-border)] p-4">
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage(input)
                        }
                      }}
                      placeholder="Ask about your finances, forecasts, or tax strategy..."
                      rows={2}
                      className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] text-[13px] text-[var(--color-text)] placeholder-[var(--color-text-tertiary)] p-3 pr-10 resize-none focus:outline-none focus:border-[var(--color-accent)] transition-base"
                    />
                    <button className="absolute right-3 bottom-3 text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] transition-base cursor-pointer">
                      <Mic size={14} />
                    </button>
                  </div>
                  <Button
                    variant="accent"
                    size="md"
                    icon={<Send size={14} />}
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || loading}
                  >
                    Send
                  </Button>
                </div>
                <p className="text-[10px] text-[var(--color-text-tertiary)] mt-2 text-center">
                  AI responses are based on your actual financial data and may not constitute professional financial advice.
                </p>
              </div>
            </Card>
          </div>

          {/* Right panel: AI Insights */}
          <div className="w-72 shrink-0 flex flex-col gap-3">
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={13} className="text-[var(--color-ai)]" />
                <span className="text-[12px] font-semibold text-[var(--color-text)]">Live Insights</span>
                <Badge variant="ai" size="sm">4</Badge>
              </div>
              <div className="space-y-3">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className={`p-3 rounded-[var(--radius-md)] cursor-pointer hover:opacity-80 transition-base ${insight.type === "warning" ? "bg-[var(--color-warning-bg)] border border-[var(--color-warning-border)]" : insight.type === "opportunity" ? "bg-[var(--color-success-bg)] border border-[var(--color-success-border)]" : insight.type === "success" ? "bg-[var(--color-success-bg)] border border-[var(--color-success-border)]" : "bg-[var(--color-info-bg)] border border-[var(--color-info-border)]"}`} onClick={() => sendMessage(insight.title)}>
                    <div className={`text-[11px] font-semibold mb-1 ${insight.type === "warning" ? "text-[var(--color-warning-text)]" : insight.type === "opportunity" || insight.type === "success" ? "text-[var(--color-success-text)]" : "text-[var(--color-info-text)]"}`}>{insight.title}</div>
                    <div className={`text-[10px] leading-4 ${insight.type === "warning" ? "text-[var(--color-warning-text)] opacity-80" : insight.type === "opportunity" || insight.type === "success" ? "text-[var(--color-success-text)] opacity-80" : "text-[var(--color-info-text)] opacity-80"}`}>{insight.description.slice(0, 80)}...</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "insights" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights.map((insight) => (
            <Card key={insight.id}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-[var(--radius-md)] flex items-center justify-center shrink-0 ${insight.type === "warning" ? "bg-[var(--color-warning-bg)]" : insight.type === "opportunity" || insight.type === "success" ? "bg-[var(--color-success-bg)]" : "bg-[var(--color-info-bg)]"}`}>
                  {insight.type === "warning" ? <AlertCircle size={14} className="text-[var(--color-warning)]" /> : <CheckCircle2 size={14} className="text-[var(--color-success)]" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-semibold text-[var(--color-text)]">{insight.title}</p>
                    <Badge variant={insight.priority === "high" ? "danger" : insight.priority === "medium" ? "warning" : "neutral"} size="sm">{insight.priority}</Badge>
                  </div>
                  <p className="text-[12px] text-[var(--color-text-secondary)] mt-1.5 leading-5">{insight.description}</p>
                  <div className="mt-3">
                    <Button variant="secondary" size="xs">{insight.action}</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "automations" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Invoice Reminder – 7 days overdue", trigger: "Invoice overdue > 7 days", action: "Send reminder email to customer", status: "active", runs: 42 },
            { name: "Expense Auto-Categorization", trigger: "New expense submitted", action: "AI categorizes and posts to GL", status: "active", runs: 208 },
            { name: "Bank Reconciliation Alert", trigger: "Unreconciled txns > 5", action: "Notify CFO via email", status: "active", runs: 12 },
            { name: "Payroll Approval Workflow", trigger: "Payroll run initiated", action: "Require CFO approval before processing", status: "active", runs: 6 },
            { name: "Low Cash Alert", trigger: "Cash < $500K", action: "Notify Finance team via Slack", status: "inactive", runs: 0 },
            { name: "Monthly P&L Summary", trigger: "1st of each month", action: "Email P&L summary to executive team", status: "active", runs: 11 },
          ].map((auto) => (
            <Card key={auto.name} className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-[var(--color-text)]">{auto.name}</p>
                  <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">{auto.runs} runs total</p>
                </div>
                <Badge variant={auto.status === "active" ? "success" : "neutral"} size="sm" dot>{auto.status}</Badge>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 bg-[var(--color-bg)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
                  <div className="text-[9px] uppercase tracking-wider font-semibold text-[var(--color-text-tertiary)] mb-0.5">IF</div>
                  <div className="text-[12px] text-[var(--color-text-secondary)]">{auto.trigger}</div>
                </div>
                <div className="p-2.5 bg-[var(--color-bg)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
                  <div className="text-[9px] uppercase tracking-wider font-semibold text-[var(--color-text-tertiary)] mb-0.5">THEN</div>
                  <div className="text-[12px] text-[var(--color-text-secondary)]">{auto.action}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="xs">Edit</Button>
                <Button variant={auto.status === "active" ? "secondary" : "accent"} size="xs">{auto.status === "active" ? "Disable" : "Enable"}</Button>
              </div>
            </Card>
          ))}
          <Card className="border-dashed flex items-center justify-center py-8 cursor-pointer hover:bg-[var(--color-border-subtle)] transition-base">
            <div className="text-center">
              <Zap size={20} className="mx-auto text-[var(--color-text-tertiary)] mb-2" />
              <p className="text-[13px] font-medium text-[var(--color-text)]">Create Automation</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
