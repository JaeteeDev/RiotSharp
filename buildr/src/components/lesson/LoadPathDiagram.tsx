import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

const paths: Record<'general' | 'opening', string[]> = {
  general: ['Roof', 'Wall Framing', 'Floor / Foundation', 'Ground'],
  opening: ['Load Above Opening', 'Lintel', 'Supporting (Jamb) Studs', 'Structure Below'],
}

export function LoadPathDiagram({ variant }: { variant: 'general' | 'opening' }) {
  const steps = paths[variant]
  return (
    <div className="rounded-[3px] border border-ink-600 bg-ink-900/60 p-6">
      <div className="text-technical mb-5 text-center text-[10px] uppercase tracking-[0.16em] text-mute-500">
        Load Path {variant === 'opening' ? '· Above An Opening' : '· General'}
      </div>
      <div className="mx-auto flex max-w-xs flex-col items-center">
        {steps.map((step, i) => (
          <div key={step} className="flex w-full flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.15, duration: 0.35 }}
              className="w-full rounded-[3px] border border-signal-500/30 bg-signal-500/[0.06] px-4 py-3 text-center"
            >
              <span className="text-[13px] font-medium text-paper-100">{step}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.1, duration: 0.3 }}
                className="py-1.5"
              >
                <ArrowDown className="h-4 w-4 text-signal-400" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
