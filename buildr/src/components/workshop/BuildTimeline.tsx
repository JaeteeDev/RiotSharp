import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { buildSequenceSteps } from '../../data/wallFrame'

export function BuildTimeline({ activeIndex, onSelect }: { activeIndex: number | null; onSelect: (index: number | null) => void }) {
  return (
    <div className="border-t border-ink-700 bg-ink-900/70">
      <div className="flex items-center gap-1 px-4 pt-3">
        <button
          onClick={() => onSelect(null)}
          className={clsx(
            'text-technical shrink-0 rounded-[3px] border px-2.5 py-1.5 text-[10px] uppercase tracking-wide transition-colors',
            activeIndex === null ? 'border-ink-500 bg-ink-700 text-paper-100' : 'border-transparent text-mute-500 hover:text-paper-200',
          )}
        >
          Free Explore
        </button>
        <div className="hairline mx-3 h-6 w-px shrink-0" />
        {buildSequenceSteps.map((step, i) => {
          const isActive = activeIndex === i
          const isDone = activeIndex !== null && activeIndex > i
          return (
            <button key={step.id} onClick={() => onSelect(i)} className="group relative flex flex-1 flex-col items-center gap-1.5 px-1 py-1">
              <div className="flex w-full items-center">
                <div className={clsx('h-px flex-1 transition-colors', i === 0 ? 'bg-transparent' : isDone || isActive ? 'bg-signal-400' : 'bg-ink-600')} />
                <div
                  className={clsx(
                    'relative flex h-7 w-7 shrink-0 items-center justify-center text-[10px] font-semibold transition-all',
                    isActive
                      ? 'rotate-45 border-2 border-signal-400 bg-signal-500 text-ink-950'
                      : isDone
                        ? 'rotate-45 border border-signal-400/50 bg-signal-500/15 text-signal-300'
                        : 'rotate-45 border border-ink-500 text-mute-400 group-hover:border-ink-400',
                  )}
                >
                  <span className={clsx(isActive || isDone ? '-rotate-45' : '-rotate-45')}>{i + 1}</span>
                </div>
                <div className={clsx('h-px flex-1 transition-colors', i === buildSequenceSteps.length - 1 ? 'bg-transparent' : isDone ? 'bg-signal-400' : 'bg-ink-600')} />
              </div>
              <span className={clsx('text-technical text-[9.5px] uppercase tracking-wide', isActive ? 'text-signal-300' : 'text-mute-500')}>{step.label}</span>
            </button>
          )
        })}
      </div>
      <div className="h-9 px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeIndex ?? 'free'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex h-9 items-center text-[11.5px] leading-snug text-mute-500"
          >
            {activeIndex !== null ? buildSequenceSteps[activeIndex].description : 'Select a build step above to see the wall frame assemble stage by stage — or explore freely.'}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
