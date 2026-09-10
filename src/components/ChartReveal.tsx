"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"

function useInView(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let isMounted = true
    const el = ref.current
    if (!el) return

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true)
      return
    }

    let timeoutId = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !isMounted) return
        timeoutId = window.setTimeout(() => {
          if (isMounted) {
            setVisible(true)
          }
        }, delay)
        io.disconnect()
      },
      { threshold: 0.18, rootMargin: "0px 0px -24px 0px" },
    )
    io.observe(el)
    return () => {
      isMounted = false
      io.disconnect()
      window.clearTimeout(timeoutId)
    }
  }, [delay])

  return { ref, visible }
}

/** Mounts chart children only when in view so Recharts entrance animations play. */
export function ChartReveal({
  children,
  className = "",
  style,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  delay?: number
}) {
  const { ref, visible } = useInView(delay)

  return (
    <div
      ref={ref}
      className={`chart-reveal ${visible ? "is-ready" : ""} ${className}`}
      style={style}
    >
      {visible ? children : <div className="chart-reveal-skeleton" aria-hidden />}
    </div>
  )
}

/** Soft fade/slide for KPI cards, lists, and progress bars. */
export function AnimateIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const { ref, visible } = useInView(delay)

  return (
    <div
      ref={ref}
      className={`animate-in ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  )
}

export default ChartReveal
