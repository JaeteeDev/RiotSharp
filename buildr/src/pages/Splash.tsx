import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export function Splash({ onDone }: { onDone: () => void }) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const t = setTimeout(onDone, reduceMotion ? 400 : 1900)
    return () => clearTimeout(t)
  }, [onDone, reduceMotion])

  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { delay: i * 0.08, duration: 0.7, ease: [0.65, 0, 0.35, 1] as const }, opacity: { delay: i * 0.08, duration: 0.2 } },
    }),
  }

  return (
    <div className="drafting-field flex h-screen w-screen flex-col items-center justify-center gap-6">
      <svg width="180" height="140" viewBox="0 0 180 140" fill="none">
        {[
          'M20 130 L20 80 L90 30 L160 80 L160 130', // frame outline
          'M20 130 L160 130', // baseline
          'M60 130 L60 90 L120 90 L120 130', // door/window block
          'M90 30 L90 130', // ridge to floor centre line
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke={i === 3 ? 'var(--color-blue-400)' : 'var(--color-signal-400)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            custom={i}
            initial="hidden"
            animate="visible"
            variants={draw}
          />
        ))}
      </svg>
      <div className="flex flex-col items-center gap-2">
        <div className="font-display text-2xl font-semibold tracking-[0.12em] text-paper-100">BUILDR</div>
        <motion.div
          className="text-technical text-[11px] uppercase tracking-[0.2em] text-mute-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Initialising workshop…
        </motion.div>
      </div>
    </div>
  )
}
