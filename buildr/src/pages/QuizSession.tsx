import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, RotateCcw, ArrowLeft, Check, X, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { buildQuiz, quizModeLabel, type QuizMode } from '../lib/quizEngine'
import { useAppStore } from '../store/useAppStore'
import { useBreadcrumb } from '../store/useUiStore'
import { QuizQuestionCard, NextButton } from '../components/quiz/QuizQuestionCard'
import { ProgressRing } from '../components/ui/ProgressRing'
import { Panel } from '../components/ui/Panel'
import { learningAreaById } from '../data/learningAreas'
import type { QuizQuestion } from '../types'

function correctAnswerText(q: QuizQuestion): string {
  switch (q.type) {
    case 'calculation':
      return `${q.numericAnswer} ${q.numericUnit ?? ''}`.trim()
    case 'multiple-select':
      return (q.correctIndices ?? []).map((i) => q.options?.[i]).filter(Boolean).join(', ')
    case 'order-steps':
      return (q.correctOrder ?? []).map((i) => q.orderItems?.[i]).filter(Boolean).join(' → ')
    default:
      return q.options?.[q.correctIndex ?? 0] ?? ''
  }
}

export function QuizSession() {
  const { mode } = useParams<{ mode: QuizMode }>()
  const location = useLocation()
  const navigate = useNavigate()
  const lessonProgress = useAppStore((s) => s.lessonProgress)
  const attempts = useAppStore((s) => s.questionAttempts)
  const recordQuestionAttempt = useAppStore((s) => s.recordQuestionAttempt)
  const recordQuizWeaknessSignal = useAppStore((s) => s.recordQuizWeaknessSignal)

  const state = (location.state ?? {}) as { learningAreaId?: string; topic?: string; moduleId?: string }
  const resolvedMode: QuizMode = (mode as QuizMode) ?? 'quick'

  useBreadcrumb(['Quiz Centre', quizModeLabel[resolvedMode] ?? 'Quiz'])

  const sessionId = useMemo(() => `session-${Date.now()}`, [])
  const [questions] = useState(() => buildQuiz(resolvedMode, { learningAreaId: state.learningAreaId, topic: state.topic, lessonProgress, attempts }))
  const [index, setIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [results, setResults] = useState<boolean[]>([])
  const [finished, setFinished] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)

  const current = questions[index]

  function handleAnswered(correct: boolean) {
    setAnswered(true)
    setResults((r) => [...r, correct])
    recordQuestionAttempt({ questionId: current.id, correct, attemptedAt: Date.now(), quizSessionId: sessionId })
    recordQuizWeaknessSignal(current.learningAreaId, correct)
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
    const wrongQuestions = questions.filter((_, i) => results[i] === false)

    const topicBreakdown = Object.values(
      questions.reduce<Record<string, { topic: string; correct: number; total: number }>>((acc, q, i) => {
        acc[q.topic] ??= { topic: q.topic, correct: 0, total: 0 }
        acc[q.topic].total += 1
        if (results[i]) acc[q.topic].correct += 1
        return acc
      }, {}),
    ).map((t) => ({ ...t, pct: Math.round((t.correct / t.total) * 100) }))
    const weakTopics = topicBreakdown.filter((t) => t.pct < 70).sort((a, b) => a.pct - b.pct)
    const strongTopics = topicBreakdown.filter((t) => t.pct >= 70).sort((a, b) => b.pct - a.pct)

    return (
      <div className="mx-auto flex min-h-full max-w-2xl flex-col items-center px-8 py-10 text-center">
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
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {results.map((r, i) => (
            <span key={i} className={clsx('h-1.5 w-6 rounded-full', r ? 'bg-good-400' : 'bg-bad-400/70')} />
          ))}
        </div>

        {topicBreakdown.length > 1 && (
          <div className="mt-8 w-full text-left">
            <div className="text-technical mb-2.5 text-center text-[10px] uppercase tracking-wide text-mute-500">Performance By Topic</div>
            <Panel className="flex flex-col divide-y divide-ink-800 overflow-hidden">
              {[...weakTopics, ...strongTopics].map((t) => (
                <div key={t.topic} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="truncate text-[12.5px] text-paper-300">{t.topic}</span>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-700">
                      <div className={clsx('h-full rounded-full', t.pct >= 70 ? 'bg-good-400' : 'bg-warn-400')} style={{ width: `${t.pct}%` }} />
                    </div>
                    <span className="text-technical w-9 text-right text-[11px] text-mute-500">{t.pct}%</span>
                  </div>
                </div>
              ))}
            </Panel>
          </div>
        )}

        {wrongQuestions.length > 0 && (
          <div className="mt-5 w-full text-left">
            <button
              onClick={() => setReviewOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-[3px] border border-ink-600 bg-ink-850/60 px-4 py-3 text-left"
            >
              <span className="text-technical text-[10px] uppercase tracking-wide text-mute-400">Review Mistakes · {wrongQuestions.length}</span>
              <motion.span animate={{ rotate: reviewOpen ? 180 : 0 }}>
                <ChevronDown className="h-4 w-4 text-mute-500" />
              </motion.span>
            </button>
            <AnimatePresence>
              {reviewOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2.5 flex flex-col gap-2.5 overflow-hidden">
                  {wrongQuestions.map((q) => (
                    <div key={q.id} className="rounded-[3px] border border-bad-400/25 bg-bad-400/[0.04] px-4 py-3">
                      <p className="text-[13px] text-paper-200">{q.prompt}</p>
                      <p className="mt-1.5 text-[12px] text-good-400">Correct answer: {correctAnswerText(q)}</p>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-mute-400">{q.explanation}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigate(state.moduleId ? `/course/module/${state.moduleId}` : state.learningAreaId ? `/course/area/${state.learningAreaId}` : '/quiz')}
            className="flex items-center gap-1.5 rounded-[3px] border border-ink-500 px-5 py-2.5 text-[13px] text-paper-200 hover:border-ink-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {state.moduleId ? 'Return to Module' : state.learningAreaId ? 'Return to Learning Area' : 'Quiz Centre'}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 rounded-[3px] bg-signal-500 px-5 py-2.5 text-[13px] font-semibold text-ink-950 hover:bg-signal-400"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Retry Quiz
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
