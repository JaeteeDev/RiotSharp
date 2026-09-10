import clsx from 'clsx'
import type { ReactNode } from 'react'

export function Panel({
  children,
  className,
  title,
  corner = true,
  actions,
  tone = 'default',
}: {
  children: ReactNode
  className?: string
  title?: string
  corner?: boolean
  actions?: ReactNode
  tone?: 'default' | 'danger'
}) {
  return (
    <div className={clsx('relative rounded-[3px] border bg-ink-850/60', tone === 'danger' ? 'border-bad-400/30' : 'border-ink-600', className)}>
      {corner && (
        <>
          <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-signal-500/60" />
          <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-signal-500/60" />
          <span className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-signal-500/60" />
          <span className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-signal-500/60" />
        </>
      )}
      {title && (
        <div className="flex items-center justify-between border-b border-ink-700 px-4 py-2.5">
          <span className="text-technical text-[10px] uppercase tracking-[0.16em] text-mute-500">{title}</span>
          {actions}
        </div>
      )}
      {children}
    </div>
  )
}
