import { motion } from 'framer-motion'
import clsx from 'clsx'
import { buildSequenceSteps } from '../../data/wallFrame'

export function BuildTimeline({ activeIndex, onSelect }: { activeIndex: number | null; onSelect: (index: number | null) => void }) {
  return (
    <div className="flex items-center gap-1 border-t border-ink-700 bg-ink-900/70 px-4 py-3">
      <button
        onClick={() => onSelect(null)}
        className={clsx(
          'text-technical shrink-0 rounded px-2.5 py-1.5 text-[10px] uppercase tracking-wide transition-colors',
          activeIndex === null ? 'bg-ink-700 text-paper-100' : 'text-mute-500 hover:text-paper-200',
        )}
      >
        Free
      </button>
      <div className="hairline mx-2 h-6 w-px shrink-0" />
      {buildSequenceSteps.map((step, i) => (
        <button key={step.id} onClick={() => onSelect(i)} className="group relative flex flex-1 flex-col items-center gap-1.5 px-1 py-1">
          <div className="flex w-full items-center">
            <div className={clsx('h-[2px] flex-1 transition-colors', i === 0 ? 'bg-transparent' : activeIndex !== null && activeIndex >= i ? 'bg-signal-400' : 'bg-ink-600')} />
            <div
              className={clsx(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold transition-colors',
                activeIndex === i
                  ? 'border-signal-400 bg-signal-500 text-ink-950'
                  : activeIndex !== null && activeIndex > i
                    ? 'border-signal-400/60 bg-signal-500/20 text-signal-300'
                    : 'border-ink-500 text-mute-400 group-hover:border-ink-400',
              )}
            >
              {i + 1}
            </div>
            <div className={clsx('h-[2px] flex-1 transition-colors', i === buildSequenceSteps.length - 1 ? 'bg-transparent' : activeIndex !== null && activeIndex > i ? 'bg-signal-400' : 'bg-ink-600')} />
          </div>
          <span className={clsx('text-technical text-[9.5px] uppercase tracking-wide', activeIndex === i ? 'text-signal-300' : 'text-mute-500')}>{step.label}</span>
        </button>
      ))}
      {activeIndex !== null && (
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          className="ml-3 hidden max-w-xs shrink-0 text-[11px] leading-snug text-mute-400 lg:block"
        >
          {buildSequenceSteps[activeIndex].description}
        </motion.div>
      )}
    </div>
  )
}
