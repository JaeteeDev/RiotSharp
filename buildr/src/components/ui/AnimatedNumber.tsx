import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

export function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(reduceMotion ? value : 0)

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value)
      return
    }
    let raf: number
    const start = performance.now()
    const from = display
    const duration = 700
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (value - from) * eased))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduceMotion])

  return (
    <>
      {display}
      {suffix}
    </>
  )
}
