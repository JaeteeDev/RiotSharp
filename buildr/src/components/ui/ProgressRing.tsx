import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface ProgressRingProps {
  value: number // 0-100
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
  color?: string
}

export function ProgressRing({ value, size = 88, strokeWidth = 6, label, sublabel, color = 'var(--color-signal-400)' }: ProgressRingProps) {
  const reduceMotion = useReducedMotion()
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, value))
  const [display, setDisplay] = useState(reduceMotion ? clamped : 0)

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(clamped)
      return
    }
    let raf: number
    const duration = 900
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(eased * clamped))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clamped, reduceMotion])

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-ink-700)" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - display / 100) }}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="font-display text-lg font-semibold text-paper-100">{display}%</span>
        {label && <span className="text-technical text-[9px] uppercase tracking-wide text-mute-500">{label}</span>}
      </div>
      {sublabel && <span className="sr-only">{sublabel}</span>}
    </div>
  )
}
