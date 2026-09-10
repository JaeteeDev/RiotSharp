import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { ArrowLeft, ArrowRight, Space, Layers } from 'lucide-react'
import { flashcards } from '../data/flashcards'
import { learningAreas } from '../data/learningAreas'
import { useAppStore } from '../store/useAppStore'
import { useBreadcrumb } from '../store/useUiStore'
import { findWeakestArea } from '../lib/progress'
import { EmptyState } from '../components/ui/EmptyState'

type DeckFilter = 'all' | 'area' | 'weak' | 'missed'

export function Flashcards() {
  useBreadcrumb(['Flashcards'])
  const recordFlashcardReview = useAppStore((s) => s.recordFlashcardReview)
  const flashcardRecords = useAppStore((s) => s.flashcardRecords)
  const lessonProgress = useAppStore((s) => s.lessonProgress)
  const attempts = useAppStore((s) => s.questionAttempts)

  const [filter, setFilter] = useState<DeckFilter>('all')
  const [areaId, setAreaId] = useState(learningAreas[6].id)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 })

  const weakest = findWeakestArea(lessonProgress, attempts)

  const deck = useMemo(() => {
    if (filter === 'area') return flashcards.filter((f) => f.learningAreaId === areaId)
    if (filter === 'weak' && weakest) return flashcards.filter((f) => f.learningAreaId === weakest.areaId)
    if (filter === 'missed') return flashcards.filter((f) => {
      const r = flashcardRecords[f.id]
      return r && r.timesCorrect < r.timesSeen
    })
    return flashcards
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, areaId])

  useEffect(() => {
    setIndex(0)
    setFlipped(false)
    setSessionStats({ correct: 0, incorrect: 0 })
  }, [filter, areaId])

  const card = deck[index % Math.max(deck.length, 1)]

  function next(correct?: boolean) {
    if (card && correct !== undefined) {
      recordFlashcardReview(card.id, correct)
      setSessionStats((s) => (correct ? { ...s, correct: s.correct + 1 } : { ...s, incorrect: s.incorrect + 1 }))
    }
    setFlipped(false)
    setTimeout(() => setIndex((i) => i + 1), 120)
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement && (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT')) return
      if (e.code === 'Space') {
        e.preventDefault()
        setFlipped((f) => !f)
      } else if (e.key === 'ArrowLeft' && flipped) {
        next(false)
      } else if (e.key === 'ArrowRight' && flipped) {
        next(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped, card])

  const filterBar = (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <FilterChip label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
      <FilterChip label="Weak Areas" active={filter === 'weak'} onClick={() => setFilter('weak')} disabled={!weakest} />
      <FilterChip label="Missed Questions" active={filter === 'missed'} onClick={() => setFilter('missed')} />
      <FilterChip label="By Topic" active={filter === 'area'} onClick={() => setFilter('area')} />
      {filter === 'area' && (
        <select value={areaId} onChange={(e) => setAreaId(e.target.value)} className="rounded-[3px] border border-ink-600 bg-ink-850 px-2.5 py-1.5 text-[12px] text-paper-200">
          {learningAreas.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
      )}
    </div>
  )

  if (!deck.length) {
    return (
      <div className="flex h-full flex-col">
        <div className="pt-8">{filterBar}</div>
        <EmptyState
          icon={<Layers className="h-6 w-6" strokeWidth={1.25} />}
          title="No cards in this deck"
          description={'Try a different filter, or complete a few quizzes first so BUILDR can build a "missed questions" deck.'}
        />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center px-8 py-8">
      <div className="mb-7">{filterBar}</div>

      <div className="text-technical mb-4 text-[11px] uppercase tracking-wide text-mute-500">
        Card {(index % deck.length) + 1} / {deck.length} · {sessionStats.correct} correct · {sessionStats.incorrect} to review
      </div>

      <div className="[perspective:1400px]" style={{ width: 560, height: 340 }}>
        <motion.div
          key={card.id}
          className="relative h-full w-full cursor-pointer [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => setFlipped((f) => !f)}
        >
          <div className="corner-ticks absolute inset-0 flex flex-col items-center justify-center rounded-[3px] border border-ink-600 bg-ink-850 p-8 text-center [backface-visibility:hidden]">
            <span className="text-technical mb-4 text-[10px] uppercase tracking-wide text-mute-500">Front</span>
            <span className="font-display text-3xl font-semibold tracking-wide text-paper-100">{card.front}</span>
          </div>
          <div
            className="corner-ticks absolute inset-0 flex flex-col items-center justify-center rounded-[3px] border border-signal-500/40 bg-ink-800 p-10 text-center [backface-visibility:hidden]"
            style={{ transform: 'rotateY(180deg)' }}
          >
            <span className="text-technical mb-3 text-[10px] uppercase tracking-wide text-signal-400">Back</span>
            <p className="text-[14.5px] leading-relaxed text-paper-200">{card.back}</p>
          </div>
        </motion.div>
      </div>

      <div className="mt-7 flex items-center gap-3">
        <button
          onClick={() => next(false)}
          disabled={!flipped}
          className="flex items-center gap-1.5 rounded-[3px] border border-bad-400/40 px-5 py-2.5 text-[13px] text-bad-400 transition-colors disabled:opacity-30"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Incorrect
        </button>
        <button
          onClick={() => setFlipped((f) => !f)}
          className="flex items-center gap-1.5 rounded-[3px] border border-ink-500 px-5 py-2.5 text-[13px] text-paper-200"
        >
          <Space className="h-3.5 w-3.5" /> Flip
        </button>
        <button
          onClick={() => next(true)}
          disabled={!flipped}
          className="flex items-center gap-1.5 rounded-[3px] border border-good-400/40 px-5 py-2.5 text-[13px] text-good-400 transition-colors disabled:opacity-30"
        >
          Correct <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mt-4 text-[11px] text-mute-600">Space to flip · ← incorrect · → correct</p>
    </div>
  )
}

function FilterChip({ label, active, onClick, disabled }: { label: string; active: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30',
        active ? 'border-signal-400 bg-signal-500/15 text-signal-300' : 'border-ink-600 text-mute-400 hover:text-paper-200',
      )}
    >
      {label}
    </button>
  )
}
