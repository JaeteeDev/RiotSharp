import { motion, AnimatePresence } from 'framer-motion'
import { Search, CheckCircle2 } from 'lucide-react'
import { mistakeScenarios } from '../../data/wallFrame'

export function FindMistakePanel({ foundIds, onExit }: { foundIds: Set<string>; onExit: () => void }) {
  return (
    <div className="absolute inset-x-4 top-4 z-10 flex flex-col gap-3 rounded-lg border border-ink-600 bg-ink-900/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-signal-400" />
          <span className="font-display text-[15px] font-semibold text-paper-100">Find {mistakeScenarios.length} Framing Errors</span>
          <span className="text-technical text-[11px] text-mute-500">({foundIds.size}/{mistakeScenarios.length} found)</span>
        </div>
        <button onClick={onExit} className="text-technical text-[10.5px] uppercase text-mute-500 hover:text-paper-200">
          Exit
        </button>
      </div>
      <div className="flex flex-col gap-1.5">
        <AnimatePresence>
          {mistakeScenarios.map((m) =>
            foundIds.has(m.componentId) ? (
              <motion.div
                key={m.componentId}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex gap-2 rounded-md border border-good-400/25 bg-good-400/5 px-3 py-2"
              >
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-good-400" />
                <div>
                  <div className="text-[12px] font-medium text-paper-200">{m.issue}</div>
                  <div className="mt-0.5 text-[11.5px] text-mute-500">{m.whyItMatters}</div>
                </div>
              </motion.div>
            ) : null,
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
