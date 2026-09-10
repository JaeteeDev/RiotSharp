import clsx from 'clsx'
import type { MasteryState } from '../../types'

const config: Record<MasteryState, { label: string; className: string }> = {
  'not-started': { label: 'Not Started', className: 'text-mute-500 border-ink-600 bg-ink-800' },
  learning: { label: 'Learning', className: 'text-blue-300 border-blue-500/30 bg-blue-500/10' },
  practising: { label: 'Practising', className: 'text-timber-300 border-timber-500/30 bg-timber-500/10' },
  strong: { label: 'Strong', className: 'text-good-400 border-good-400/30 bg-good-400/10' },
  'revision-due': { label: 'Revision Due', className: 'text-warn-400 border-warn-400/30 bg-warn-400/10' },
}

export function MasteryBadge({ state, className }: { state: MasteryState; className?: string }) {
  const c = config[state]
  return (
    <span className={clsx('text-technical inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide', c.className, className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {c.label}
    </span>
  )
}
