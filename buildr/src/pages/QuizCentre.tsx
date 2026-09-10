import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, BookOpen, Layers, TrendingDown, GraduationCap, Sparkles } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useBreadcrumb } from '../store/useUiStore'
import { computeQuizAccuracy, findWeakestArea } from '../lib/progress'
import { topics, questions } from '../data/questions'
import { learningAreaById } from '../data/learningAreas'
import { Panel } from '../components/ui/Panel'
import { AnimatedNumber } from '../components/ui/AnimatedNumber'
import clsx from 'clsx'

const modes = [
  { id: 'quick', title: 'Quick Quiz', desc: '10 random questions across every topic covered so far.', icon: Zap },
  { id: 'mock', title: 'Mock Theory Test', desc: '20 mixed questions simulating a broader knowledge check.', icon: GraduationCap },
  { id: 'weak', title: 'Weak Area Quiz', desc: 'Targets whichever learning area needs the most attention right now.', icon: TrendingDown },
  { id: 'daily', title: '15 Minute Session', desc: 'A short mixed set for when you only have a few minutes.', icon: Sparkles },
]

export function QuizCentre() {
  useBreadcrumb(['Quiz Centre'])
  const navigate = useNavigate()
  const attempts = useAppStore((s) => s.questionAttempts)
  const lessonProgress = useAppStore((s) => s.lessonProgress)
  const accuracy = computeQuizAccuracy(attempts)
  const weakest = findWeakestArea(lessonProgress, attempts)

  return (
    <div className="mx-auto max-w-[1400px] px-8 py-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper-100">Quiz Centre</h1>
          <p className="mt-1 text-[13px] text-mute-400">Every wrong answer explains why — right and wrong.</p>
        </div>
        <Panel className="flex overflow-hidden">
          <div className="px-5 py-3">
            <div className="text-technical text-[9px] uppercase tracking-wide text-mute-600">Attempted</div>
            <div className="font-display mt-1 text-xl font-semibold text-paper-100">
              <AnimatedNumber value={attempts.length} />
            </div>
          </div>
          <div className="border-l border-ink-700 px-5 py-3">
            <div className="text-technical text-[9px] uppercase tracking-wide text-mute-600">Accuracy</div>
            <div className="font-display mt-1 text-xl font-semibold text-paper-100">
              {accuracy === null ? <span className="text-mute-600">—</span> : <AnimatedNumber value={accuracy} suffix="%" />}
            </div>
          </div>
        </Panel>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {modes.map((m, i) => {
          const Icon = m.icon
          return (
            <motion.button
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -2 }}
              onClick={() => navigate(`/quiz/session/${m.id}`)}
              className="corner-ticks relative flex flex-col items-start gap-3 rounded-[3px] border border-ink-600 bg-ink-850/50 p-6 text-left transition-colors hover:border-signal-400/50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-signal-500/30 bg-signal-500/10 text-signal-400">
                <Icon className="h-4 w-4" />
              </div>
              <div className="text-[16px] font-medium text-paper-100">{m.title}</div>
              <p className="text-[12.5px] leading-relaxed text-mute-500">{m.desc}</p>
              {m.id === 'weak' && weakest && (
                <span className="text-technical mt-auto rounded-full border border-warn-400/30 bg-warn-400/10 px-2 py-0.5 text-[10px] text-warn-400">
                  {learningAreaById(weakest.areaId)?.title}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>

      <div className="mt-10">
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-mute-500" />
          <h2 className="text-technical text-[11px] uppercase tracking-wide text-mute-500">Quiz by Topic</h2>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {topics.map((topic, i) => {
            const count = questions.filter((q) => q.topic === topic).length
            return (
              <button
                key={topic}
                onClick={() => navigate('/quiz/session/topic', { state: { topic } })}
                className={clsx(
                  'flex items-center justify-between border-b border-ink-700 px-1 py-3.5 text-left transition-colors hover:border-signal-400/40 hover:bg-ink-850/40',
                )}
              >
                <span className="flex items-center gap-2.5 text-[13.5px] text-paper-200">
                  <span className="text-technical text-[10px] text-mute-600">{String(i + 1).padStart(2, '0')}</span>
                  {topic}
                </span>
                <span className="text-technical flex items-center gap-1 text-[11px] text-mute-500">
                  <Layers className="h-3 w-3" />
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
