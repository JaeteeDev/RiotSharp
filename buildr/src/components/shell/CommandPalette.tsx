import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, ArrowRight, CornerDownLeft } from 'lucide-react'
import { useUiStore } from '../../store/useUiStore'
import { primaryNav } from '../../lib/nav'
import { lessons } from '../../data/lessons'
import { glossary } from '../../data/glossary'
import { units } from '../../data/units'
import { calculators } from '../../data/calculators'

interface PaletteItem {
  id: string
  label: string
  sub: string
  group: string
  action: () => void
}

export function CommandPalette() {
  const open = useUiStore((s) => s.commandPaletteOpen)
  const setOpen = useUiStore((s) => s.setCommandPaletteOpen)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  const items: PaletteItem[] = useMemo(() => {
    const nav = primaryNav.map((n) => ({
      id: `nav-${n.id}`,
      label: `Go to ${n.label}`,
      sub: n.path,
      group: 'Navigate',
      action: () => navigate(n.path),
    }))
    const quick = [
      { id: 'quick-quiz', label: 'Start Quick Quiz', sub: '10 random questions', group: 'Actions', action: () => navigate('/quiz/session/quick') },
      { id: 'quick-calc', label: 'Open Roof Pitch Calculator', sub: 'Calculators', group: 'Actions', action: () => navigate('/calculators/roof-pitch') },
    ]
    const lessonItems = lessons.map((l) => ({
      id: `lesson-${l.id}`,
      label: l.title,
      sub: `Lesson · ${l.subtitle}`,
      group: 'Lessons',
      action: () => navigate(`/course/lesson/${l.id}`),
    }))
    const termItems = glossary.map((g) => ({
      id: `term-${g.id}`,
      label: g.term,
      sub: `Glossary · ${g.short}`,
      group: 'Terminology',
      action: () => navigate(`/reference/term/${g.id}`),
    }))
    const unitItems = units.map((u) => ({
      id: `unit-${u.code}`,
      label: `${u.code} — ${u.name}`,
      sub: 'Unit of competency',
      group: 'Units',
      action: () => navigate(`/course/unit/${u.code}`),
    }))
    const calcItems = calculators.map((c) => ({
      id: `calc-${c.id}`,
      label: c.name,
      sub: 'Calculator',
      group: 'Calculators',
      action: () => navigate(`/calculators/${c.id}`),
    }))
    return [...quick, ...nav, ...lessonItems, ...termItems, ...unitItems, ...calcItems]
  }, [navigate])

  const filtered = useMemo(() => {
    if (!query.trim()) return items.filter((i) => i.group === 'Navigate' || i.group === 'Actions')
    const q = query.toLowerCase()
    return items.filter((i) => i.label.toLowerCase().includes(q) || i.sub.toLowerCase().includes(q)).slice(0, 40)
  }, [items, query])

  useEffect(() => setActiveIndex(0), [query])

  function close() {
    setOpen(false)
  }

  function commit(item?: PaletteItem) {
    const target = item ?? filtered[activeIndex]
    if (!target) return
    target.action()
    close()
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Escape') {
      close()
    }
  }

  let lastGroup = ''

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-ink-950/70 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[60vh] w-full max-w-xl flex-col overflow-hidden rounded-[3px] border border-ink-600 bg-ink-850 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-ink-700 px-4 py-3.5">
              <Search className="h-4 w-4 text-mute-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search lessons, terminology, units, calculators…"
                className="flex-1 bg-transparent text-[14px] text-paper-100 placeholder:text-mute-600 outline-none"
              />
              <kbd className="text-technical rounded border border-ink-600 px-1.5 py-0.5 text-[10px] text-mute-500">ESC</kbd>
            </div>
            <div className="flex-1 overflow-y-auto py-1.5">
              {filtered.length === 0 && <div className="px-4 py-6 text-center text-sm text-mute-500">No matches for “{query}”</div>}
              {filtered.map((item, i) => {
                const showGroup = item.group !== lastGroup
                lastGroup = item.group
                return (
                  <div key={item.id}>
                    {showGroup && (
                      <div className="text-technical px-4 pt-2.5 pb-1 text-[10px] uppercase tracking-[0.14em] text-mute-600">{item.group}</div>
                    )}
                    <button
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => commit(item)}
                      className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                        i === activeIndex ? 'bg-ink-700/70' : ''
                      }`}
                    >
                      <span className="flex-1 truncate text-[13.5px] text-paper-200">{item.label}</span>
                      <span className="shrink-0 truncate text-[11px] text-mute-600">{item.sub}</span>
                      {i === activeIndex ? (
                        <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-signal-400" />
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-transparent" />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
