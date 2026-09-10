import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Search, Calculator, PlayCircle } from 'lucide-react'
import { useUiStore } from '../../store/useUiStore'
import { useAppStore } from '../../store/useAppStore'
import { recommendNextLesson } from '../../lib/progress'

export function TopBar() {
  const navigate = useNavigate()
  const breadcrumb = useUiStore((s) => s.breadcrumb)
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen)
  const lessonProgress = useAppStore((s) => s.lessonProgress)

  const next = recommendNextLesson(lessonProgress)

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-ink-700 bg-ink-900/80 px-5 backdrop-blur">
      <div className="flex min-w-0 flex-1 items-center gap-1.5 text-technical text-[11px] uppercase tracking-[0.12em] text-mute-500">
        <AnimatePresence mode="popLayout" initial={false}>
          {breadcrumb.map((crumb, i) => (
            <motion.span
              key={crumb + i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-1.5"
            >
              {i > 0 && <ChevronRight className="h-3 w-3 text-ink-500" />}
              <span className={i === breadcrumb.length - 1 ? 'text-paper-300' : ''}>{crumb}</span>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="flex w-72 items-center gap-2.5 rounded-[3px] border border-ink-600 bg-ink-850 px-3 py-1.5 text-left text-sm text-mute-500 transition-colors hover:border-ink-500 hover:text-mute-400"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-[13px]">Search BUILDR…</span>
        <kbd className="text-technical rounded border border-ink-600 bg-ink-800 px-1.5 py-0.5 text-[10px] text-mute-500">Ctrl K</kbd>
      </button>

      <button
        onClick={() => navigate('/calculators')}
        className="flex items-center gap-1.5 rounded-[3px] border border-ink-600 px-3 py-1.5 text-[13px] font-medium text-mute-400 transition-colors hover:border-blue-500/50 hover:text-blue-300"
      >
        <Calculator className="h-3.5 w-3.5" />
        Quick Calculator
      </button>

      {next && (
        <button
          onClick={() => navigate(`/course/lesson/${next.id}`)}
          className="flex items-center gap-1.5 rounded-[3px] border border-signal-500/40 bg-signal-500/10 px-3 py-1.5 text-[13px] font-medium text-signal-300 transition-colors hover:bg-signal-500/20"
        >
          <PlayCircle className="h-3.5 w-3.5" />
          Continue Learning
        </button>
      )}
    </header>
  )
}
