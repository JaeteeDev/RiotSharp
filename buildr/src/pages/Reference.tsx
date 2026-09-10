import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import clsx from 'clsx'
import { glossary } from '../data/glossary'
import { useBreadcrumb } from '../store/useUiStore'
import { Panel } from '../components/ui/Panel'
import type { GlossaryTerm } from '../types'

const categoryLabels: Record<GlossaryTerm['category'], string> = {
  framing: 'Framing',
  roof: 'Roof',
  floor: 'Floor',
  tools: 'Tools',
  materials: 'Materials',
  plans: 'Plans',
  general: 'General',
  whs: 'WHS',
  stairs: 'Stairs',
  concrete: 'Concrete',
}

export function Reference() {
  useBreadcrumb(['Reference'])
  const { termId } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<GlossaryTerm['category'] | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(termId ?? null)

  useEffect(() => {
    if (termId) setSelectedId(termId)
  }, [termId])

  const filtered = useMemo(() => {
    return glossary.filter((g) => {
      const matchCategory = category === 'all' || g.category === category
      const q = query.toLowerCase()
      const matchQuery = !q || g.term.toLowerCase().includes(q) || g.short.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q)
      return matchCategory && matchQuery
    })
  }, [query, category])

  const selected = glossary.find((g) => g.id === selectedId) ?? filtered[0]

  function selectTerm(id: string) {
    setSelectedId(id)
    navigate(`/reference/term/${id}`, { replace: true })
  }

  const categories = Array.from(new Set(glossary.map((g) => g.category))) as GlossaryTerm['category'][]

  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-8 py-8 lg:grid-cols-[360px_1fr]">
      <div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-mute-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terminology…"
            className="w-full rounded-md border border-ink-600 bg-ink-850 py-2 pl-9 pr-3 text-[13px] text-paper-100 outline-none focus:border-signal-400"
          />
        </div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          <CategoryChip label="All" active={category === 'all'} onClick={() => setCategory('all')} />
          {categories.map((c) => (
            <CategoryChip key={c} label={categoryLabels[c]} active={category === c} onClick={() => setCategory(c)} />
          ))}
        </div>
        <div className="flex max-h-[calc(100vh-260px)] flex-col gap-1 overflow-y-auto rounded-lg border border-ink-700 bg-ink-900/40 p-1.5">
          {filtered.map((g) => (
            <button
              key={g.id}
              onClick={() => selectTerm(g.id)}
              className={clsx(
                'rounded-md px-3 py-2 text-left transition-colors',
                selected?.id === g.id ? 'bg-signal-500/15 text-signal-300' : 'text-paper-300 hover:bg-ink-800',
              )}
            >
              <div className="text-[13px] font-medium">{g.term}</div>
              <div className="truncate text-[11.5px] text-mute-500">{g.short}</div>
            </button>
          ))}
          {!filtered.length && <div className="p-4 text-center text-[12.5px] text-mute-500">No terms match “{query}”.</div>}
        </div>
      </div>

      <div>
        {selected ? (
          <motion.div key={selected.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Panel className="p-7">
              <span className="text-technical text-[10px] uppercase tracking-wide text-blue-400">{categoryLabels[selected.category]}</span>
              <h1 className="font-display mt-1.5 text-[26px] font-semibold text-paper-100">{selected.term}</h1>
              <p className="mt-4 text-[15px] leading-relaxed text-paper-300">{selected.definition}</p>

              {selected.relatedTermIds.length > 0 && (
                <div className="mt-7 border-t border-ink-700 pt-5">
                  <div className="text-technical mb-2.5 text-[10px] uppercase tracking-wide text-mute-500">Related</div>
                  <div className="flex flex-wrap gap-2">
                    {selected.relatedTermIds.map((id) => {
                      const t = glossary.find((g) => g.id === id)
                      if (!t) return null
                      return (
                        <button
                          key={id}
                          onClick={() => selectTerm(id)}
                          className="rounded-full border border-ink-600 px-3 py-1.5 text-[12px] text-paper-300 transition-colors hover:border-signal-400 hover:text-signal-300"
                        >
                          {t.term}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </Panel>
          </motion.div>
        ) : (
          <div className="flex h-full items-center justify-center text-[13px] text-mute-500">Select a term to see its full definition.</div>
        )}
      </div>
    </div>
  )
}

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors',
        active ? 'border-signal-400 bg-signal-500/15 text-signal-300' : 'border-ink-600 text-mute-500 hover:text-paper-200',
      )}
    >
      {label}
    </button>
  )
}
