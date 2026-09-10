import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex h-full min-h-[420px] flex-col items-center justify-center px-8 text-center">
      {icon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative mb-6 flex h-16 w-16 items-center justify-center text-mute-600"
        >
          <span className="pointer-events-none absolute -left-1 -top-1 h-3 w-3 border-l border-t border-ink-500" />
          <span className="pointer-events-none absolute -right-1 -top-1 h-3 w-3 border-r border-t border-ink-500" />
          <span className="pointer-events-none absolute -bottom-1 -left-1 h-3 w-3 border-b border-l border-ink-500" />
          <span className="pointer-events-none absolute -bottom-1 -right-1 h-3 w-3 border-b border-r border-ink-500" />
          {icon}
        </motion.div>
      )}
      <h2 className="font-display text-[19px] font-semibold uppercase tracking-wide text-paper-100">{title}</h2>
      <p className="mt-3 max-w-sm text-[13.5px] leading-relaxed text-mute-500">{description}</p>
      {action && <div className="mt-7">{action}</div>}
    </div>
  )
}
