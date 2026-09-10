import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, RotateCcw, ArrowLeft } from 'lucide-react'
import { buildQuiz, quizModeLabel, type QuizMode } from '../lib/quizEngine'
import { useAppStore } from '../store/useAppStore'
import { useBreadcrumb } from '../store/useUiStore'
import { QuizQuestionCard, NextButton } from '../components/quiz/QuizQuestionCard'
import { ProgressRing } from '../components/ui/ProgressRing'
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
      <div className="mx-auto flex max-w-lg flex-col items-center px-8 py-20 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }}>
          <ProgressRing value={pct} size={140} strokeWidth={9} color={pct >= 70 ? 'var(--color-good-400)' : 'var(--color-signal-400)'} />
        </motion.div>
        <div className="mt-6 flex items-center gap-2 text-paper-100">
          <Trophy className="h-5 w-5 text-signal-400" />
          <span className="font-display text-xl font-semibold">
            {score} / {results.length} correct
          </span>
        </div>
        <p className="mt-2 text-[13px] text-mute-400">
          {quizModeLabel[resolvedMode]}
          {areaTitle ? ` · ${areaTitle}` : ''}
        </p>
        <div className="mt-8 flex gap-3">
          <button
            onClick={() => navigate('/quiz')}
            className="flex items-center gap-1.5 rounded-md border border-ink-500 px-4 py-2.5 text-[13px] text-paper-200 hover:border-ink-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Quiz Centre
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 rounded-md bg-signal-500 px-4 py-2.5 text-[13px] font-semibold text-ink-950 hover:bg-signal-400"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-8 py-8">
      <div className="mb-6 flex items-center gap-3">
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

      <AnimatePresence mode="wait">
        <QuizQuestionCard key={current.id} question={current} onAnswered={handleAnswered} />
      </AnimatePresence>

      {answered && (
        <div className="mt-6">
          <NextButton onClick={handleNext} isLast={index + 1 >= questions.length} />
        </div>
      )}
    </div>
  )
}
