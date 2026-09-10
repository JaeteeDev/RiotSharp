import { motion, AnimatePresence } from 'framer-motion'
import { Target, Flame, Check, X } from 'lucide-react'
import clsx from 'clsx'

interface IdentifyPanelProps {
  targetName: string
  mode: 'training' | 'test'
  onModeChange: (mode: 'training' | 'test') => void
  score: number
  attempts: number
  streak: number
  lastResult: 'correct' | 'incorrect' | null
  onExit: () => void
}

export function IdentifyPanel({ targetName, mode, onModeChange, score, attempts, streak, lastResult, onExit }: IdentifyPanelProps) {
  return (
    <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between gap-4 rounded-lg border border-ink-600 bg-ink-900/90 px-4 py-3 backdrop-blur">
      <div className="min-w-0">
        <div className="text-technical text-[9.5px] uppercase tracking-wide text-mute-500">Select the</div>
        <div className="font-display truncate text-[17px] font-semibold text-signal-300">{targetName}</div>
      </div>

      <div className="flex items-center gap-4">
        <Stat icon={<Target className="h-3.5 w-3.5" />} value={`${score}/${attempts}`} />
        <Stat icon={<Flame className="h-3.5 w-3.5" />} value={`${streak}`} />
        <div className="flex rounded-md border border-ink-600 bg-ink-850 p-0.5">
          {(['training', 'test'] as const).map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={clsx('rounded px-2.5 py-1 text-[10.5px] font-medium capitalize transition-colors', mode === m ? 'bg-ink-700 text-paper-100' : 'text-mute-500')}
            >
              {m}
            </button>
          ))}
        </div>
        <button onClick={onExit} className="text-technical text-[10.5px] uppercase text-mute-500 hover:text-paper-200">
          Exit
        </button>
      </div>

      <AnimatePresence>
        {lastResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={clsx(
              'absolute -top-3 right-4 flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-lg',
              lastResult === 'correct' ? 'bg-good-400 text-ink-950' : 'bg-bad-400 text-ink-950',
            )}
          >
            {lastResult === 'correct' ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            {lastResult === 'correct' ? 'Correct' : 'Try again'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Stat({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-1.5 text-mute-400">
      {icon}
      <span className="text-technical text-[12px] text-paper-200">{value}</span>
    </div>
  )
}
