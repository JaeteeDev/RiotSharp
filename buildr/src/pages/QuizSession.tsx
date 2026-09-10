import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, RotateCcw, ArrowLeft, Check, X } from 'lucide-react'
import clsx from 'clsx'
import { buildQuiz, quizModeLabel, type QuizMode } from '../lib/quizEngine'
import { useAppStore } from '../store/useAppStore'
import { useBreadcrumb } from '../store/useUiStore'
import { QuizQuestionCard, NextButton } from '../components/quiz/QuizQuestionCard'
import { ProgressRing } from '../components/ui/ProgressRing'
import { Panel } from '../components/ui/Panel'
import { learningAreaById } from '../data/learningAreas'

export function QuizSession() {
  const { mode } = useParams<{ mode: QuizMode }>()
  const location = useLocation()
  const navigate = useNavigate()
  const lessonProgress = useAppStore((s) => s.lessonProgress)
  const attempts = useAppStore((s) => s.questionAttempts)
  const recordQuestionAttempt = useAppStore((s) => s.recordQuestionAttempt)

  const state = (location.state ?? {}) as { learningAreaId?: string; topic?: string }
  const resolvedMode: QuizMode = (mode as QuizMode) ?? 'quick'

  useBreadcrumb(['Quiz Centre', quizModeLabel[resolvedMode] ?? 'Quiz'])

  const sessionId = useMemo(() => `session-${Date.now()}`, [])
  const [questions] = useState(() => buildQuiz(resolvedMode, { learningAreaId: state.learningAreaId, topic: state.topic, lessonProgress, attempts }))
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [results, setResults] = useState<boolean[]>([])
  const [finished, setFinished] = useState(false)

  const current = questions[index]

  function handleAnswered(correct: boolean) {
    setAnswered(true)
    setResults((r) => [...r, correct])
    recordQuestionAttempt({ questionId: current.id, correct, attemptedAt: Date.now(), quizSessionId: sessionId })
  }

  function handleNext() {
    if (index + 1 >= questions.length) {
      setFinished(true)
    } else {
      setIndex((i) => i + 1)
      setAnswered(false)
    }
  }

  if (!questions.length) {
    return (
      <div className="mx-auto max-w-xl px-8 py-16 text-center">
        <p className="text-[14px] text-mute-400">Not enough questions are available for this selection yet.</p>
        <button onClick={() => navigate('/quiz')} className="mt-4 text-signal-400">
          Back to Quiz Centre
        </button>
      </div>
    )
  }

  if (finished) {
    const score = results.filter(Boolean).length
    const pct = Math.round((score / results.length) * 100)
    const areaTitle = state.learningAreaId ? learningAreaById(state.learningAreaId)?.title : undefined
    return (
      <div className="flex h-full flex-col items-center justify-center px-8 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
          <ProgressRing value={pct} size={160} strokeWidth={10} color={pct >= 70 ? 'var(--color-good-400)' : 'var(--color-signal-400)'} />
        </motion.div>
        <div className="mt-7 flex items-center gap-2 text-paper-100">
          <Trophy className="h-5 w-5 text-signal-400" />
          <span className="font-display text-2xl font-semibold">
            {score} / {results.length} correct
          </span>
        </div>
        <p className="mt-2 text-[13px] text-mute-400">
          {quizModeLabel[resolvedMode]}
          {areaTitle ? ` · ${areaTitle}` : ''}
        </p>
        <div className="mt-4 flex gap-1.5">
          {results.map((r, i) => (
            <span key={i} className={clsx('h-1.5 w-6 rounded-full', r ? 'bg-good-400' : 'bg-bad-400/70')} />
          ))}
        </div>
        <div className="mt-9 flex gap-3">
          <button
            onClick={() => navigate('/quiz')}
            className="flex items-center gap-1.5 rounded-[3px] border border-ink-500 px-5 py-2.5 text-[13px] text-paper-200 hover:border-ink-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Quiz Centre
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 rounded-[3px] bg-signal-500 px-5 py-2.5 text-[13px] font-semibold text-ink-950 hover:bg-signal-400"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-full max-w-4xl items-center px-8 py-8">
      <div className="grid w-full grid-cols-[56px_1fr] gap-6">
        <div className="flex flex-col items-center gap-2 pt-2">
          {questions.map((_, i) => {
            const state = i < results.length ? (results[i] ? 'correct' : 'wrong') : i === index ? 'current' : 'upcoming'
            return (
              <div
                key={i}
                className={clsx(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[9px] font-semibold transition-colors',
                  state === 'correct' && 'border-good-400/50 bg-good-400/15 text-good-400',
                  state === 'wrong' && 'border-bad-400/50 bg-bad-400/15 text-bad-400',
                  state === 'current' && 'border-signal-400 bg-signal-500/20 text-signal-300',
                  state === 'upcoming' && 'border-ink-700 text-mute-600',
                )}
              >
                {state === 'correct' ? <Check className="h-3 w-3" /> : state === 'wrong' ? <X className="h-3 w-3" /> : i + 1}
              </div>
            )
          })}
        </div>

        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="text-technical text-[11px] uppercase tracking-wide text-mute-500">
              {quizModeLabel[resolvedMode]} · {index + 1} / {questions.length}
            </span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-700">
              <motion.div
                className="h-full rounded-full bg-signal-400"
                animate={{ width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%` }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          <Panel className="corner-ticks p-8">
            <AnimatePresence mode="wait">
              <QuizQuestionCard key={current.id} question={current} onAnswered={handleAnswered} />
            </AnimatePresence>

            {answered && (
              <div className="mt-7 border-t border-ink-700 pt-6">
                <NextButton onClick={handleNext} isLast={index + 1 >= questions.length} />
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}
