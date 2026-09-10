import { lazy, Suspense, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RotateCcw, Boxes, Layers as LayersIcon, Flame, Target, TrendingDown, ArrowRight } from 'lucide-react'
import { HOUSE_LAYERS, type HouseLayerId } from '../components/three/houseLayers'
import { Panel } from '../components/ui/Panel'
import { ProgressRing } from '../components/ui/ProgressRing'
import { useAppStore } from '../store/useAppStore'
import { useBreadcrumb } from '../store/useUiStore'
import {
  computeOverallProgress,
  computeQuizAccuracy,
  findWeakestArea,
  recommendNextLesson,
  dueFlashcards,
} from '../lib/progress'
import { learningAreaById } from '../data/learningAreas'
import clsx from 'clsx'

const HouseScene = lazy(() => import('../components/three/HouseScene').then((m) => ({ default: m.HouseScene })))

function ScenePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="text-technical text-[11px] uppercase tracking-wide text-mute-600">Loading model…</div>
    </div>
  )
}

export function Dashboard() {
  useBreadcrumb(['Dashboard'])
  const navigate = useNavigate()
  const lessonProgress = useAppStore((s) => s.lessonProgress)
  const questionAttempts = useAppStore((s) => s.questionAttempts)
  const flashcardRecords = useAppStore((s) => s.flashcardRecords)
  const streakDays = useAppStore((s) => s.streakDays)

  const [selectedLayer, setSelectedLayer] = useState<HouseLayerId | null>(null)
  const [exploded, setExploded] = useState(false)
  const [resetToken, setResetToken] = useState(0)

  const overall = computeOverallProgress(lessonProgress)
  const accuracy = computeQuizAccuracy(questionAttempts)
  const weakest = findWeakestArea(lessonProgress, questionAttempts)
  const nextLesson = recommendNextLesson(lessonProgress)
  const nextLessonArea = learningAreaById(nextLesson.learningAreaId)
  const revisionDueCount = dueFlashcards(flashcardRecords).length

  const lessonPct = overall.pct

  return (
    <div className="mx-auto max-w-[1600px] px-8 py-8">
      {/* HERO */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,420px)_1fr]">
        <div className="flex flex-col justify-between gap-8">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-technical text-[11px] uppercase tracking-[0.24em] text-signal-400"
            >
              Welcome back
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="font-display mt-2 text-[38px] font-semibold leading-[1.05] tracking-tight text-paper-100"
            >
              Continue your
              <br />
              apprenticeship training.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mt-4 max-w-sm text-[14px] leading-relaxed text-mute-400"
            >
              CPC30220 Certificate III in Carpentry — study companion. Track your learning, not your competency: formal assessment stays with your RTO.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Qualification Progress" value={`${lessonPct}%`} icon={<Target className="h-3.5 w-3.5" />} />
            <StatTile label="Quiz Accuracy" value={accuracy === null ? '—' : `${accuracy}%`} icon={<TrendingDown className="h-3.5 w-3.5" />} />
            <StatTile label="Learning Streak" value={`${streakDays} day${streakDays === 1 ? '' : 's'}`} icon={<Flame className="h-3.5 w-3.5" />} />
            <StatTile label="Revision Due" value={`${revisionDueCount}`} icon={<LayersIcon className="h-3.5 w-3.5" />} />
          </div>

          <div className="flex items-center gap-4 rounded-lg border border-ink-600 bg-ink-850/60 p-4">
            <ProgressRing value={lessonPct} size={64} strokeWidth={5} />
            <div className="min-w-0">
              <div className="text-technical text-[10px] uppercase tracking-wide text-mute-500">Weakest area right now</div>
              <div className="truncate text-[14px] font-medium text-paper-100">
                {weakest ? learningAreaById(weakest.areaId)?.title : 'Not enough data yet'}
              </div>
              {weakest && (
                <button onClick={() => navigate(`/quiz/session/weak`)} className="mt-1 text-[12px] text-signal-400 hover:text-signal-300">
                  Practise this weak area →
                </button>
              )}
            </div>
          </div>
        </div>

        <Panel className="relative h-[440px] overflow-hidden xl:h-[520px]" corner={false}>
          <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
            <span className="text-technical rounded-full border border-ink-600 bg-ink-900/80 px-2.5 py-1 text-[10px] uppercase tracking-wide text-mute-400">
              Interactive Model · Timber House Framing
            </span>
          </div>

          <div className="absolute right-4 top-4 z-10 flex gap-1.5">
            <IconButton onClick={() => setExploded((e) => !e)} active={exploded} label="Exploded view">
              <Boxes className="h-4 w-4" />
            </IconButton>
            <IconButton onClick={() => setResetToken((t) => t + 1)} label="Reset camera">
              <RotateCcw className="h-4 w-4" />
            </IconButton>
          </div>

          <Suspense fallback={<ScenePlaceholder />}>
            <HouseScene selectedLayer={selectedLayer} exploded={exploded} resetToken={resetToken} />
          </Suspense>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/90 to-transparent p-4 pt-10">
            <div className="pointer-events-auto flex flex-wrap gap-1.5">
              {HOUSE_LAYERS.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setSelectedLayer((cur) => (cur === layer.id ? null : layer.id))}
                  className={clsx(
                    'text-technical rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-wide transition-colors',
                    selectedLayer === layer.id
                      ? 'border-signal-400 bg-signal-500/20 text-signal-300'
                      : 'border-ink-600 bg-ink-900/70 text-mute-400 hover:border-ink-500 hover:text-paper-200',
                  )}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      {/* CONTINUE LEARNING */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <Panel className="p-6" title="Continue Learning">
          <div className="flex items-center justify-between gap-6">
            <div className="min-w-0 flex-1">
              <div className="text-technical mb-1 text-[10px] uppercase tracking-wide text-mute-500">
                {nextLessonArea?.number} · {nextLessonArea?.title}
              </div>
              <div className="font-display text-2xl font-semibold text-paper-100">{nextLesson.title}</div>
              <p className="mt-1.5 max-w-md text-[13px] text-mute-400">{nextLesson.subtitle}</p>
              <button
                onClick={() => navigate(`/course/lesson/${nextLesson.id}`)}
                className="mt-5 flex items-center gap-2 rounded-md bg-signal-500 px-4 py-2 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-signal-400"
              >
                Continue
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <MiniFrameIcon />
          </div>
        </Panel>

        <Panel className="p-6" title="15 Minute Session">
          <p className="text-[13px] leading-relaxed text-mute-400">
            A short mixed session — one revision exercise, a quick lesson, five quiz questions, a calculation and a component ID drill.
          </p>
          <button
            onClick={() => navigate('/quiz/session/daily')}
            className="mt-5 flex items-center gap-2 rounded-md border border-ink-500 px-4 py-2 text-[13px] font-medium text-paper-200 transition-colors hover:border-signal-400 hover:text-signal-300"
          >
            Start Session
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </Panel>
      </div>
    </div>
  )
}

function StatTile({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-850/60 px-4 py-3">
      <div className="flex items-center gap-1.5 text-mute-500">
        {icon}
        <span className="text-technical text-[9.5px] uppercase tracking-wide">{label}</span>
      </div>
      <div className="font-display mt-1.5 text-2xl font-semibold text-paper-100">{value}</div>
    </div>
  )
}

function IconButton({ children, onClick, active, label }: { children: React.ReactNode; onClick: () => void; active?: boolean; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={clsx(
        'flex h-8 w-8 items-center justify-center rounded-md border transition-colors',
        active ? 'border-signal-400 bg-signal-500/20 text-signal-300' : 'border-ink-600 bg-ink-900/70 text-mute-400 hover:text-paper-200',
      )}
    >
      {children}
    </button>
  )
}

function MiniFrameIcon() {
  return (
    <svg width="96" height="72" viewBox="0 0 96 72" className="shrink-0 opacity-90">
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
        <rect x="8" y="10" width="80" height="52" fill="none" stroke="var(--color-timber-400)" strokeWidth="2" />
        {[24, 40, 56, 72].map((x, i) => (
          <line key={i} x1={x} y1="10" x2={x} y2="62" stroke="var(--color-timber-500)" strokeWidth="1.5" />
        ))}
        <line x1="8" y1="36" x2="88" y2="36" stroke="var(--color-signal-500)" strokeWidth="1.5" strokeDasharray="3 3" />
      </motion.g>
    </svg>
  )
}
