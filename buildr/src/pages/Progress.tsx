import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Sparkles, BarChart3 } from 'lucide-react'
import { learningAreas } from '../data/learningAreas'
import { useAppStore } from '../store/useAppStore'
import { useBreadcrumb } from '../store/useUiStore'
import { computeAllAreaStats, computeOverallProgress, findStrongestArea, findWeakestArea, recommendNextLesson } from '../lib/progress'
import { MasteryBadge } from '../components/ui/MasteryBadge'
import { ProgressRing } from '../components/ui/ProgressRing'
import { Panel } from '../components/ui/Panel'
import { EmptyState } from '../components/ui/EmptyState'

function heatColor(score: number) {
  if (score >= 0.85) return 'bg-good-400'
  if (score >= 0.6) return 'bg-signal-400'
  if (score > 0) return 'bg-warn-400'
  return 'bg-ink-600'
}

export function Progress() {
  useBreadcrumb(['Progress'])
  const navigate = useNavigate()
  const lessonProgress = useAppStore((s) => s.lessonProgress)
  const attempts = useAppStore((s) => s.questionAttempts)

  const stats = computeAllAreaStats(lessonProgress, attempts)
  const overall = computeOverallProgress(lessonProgress)
  const strongest = findStrongestArea(lessonProgress, attempts)
  const weakest = findWeakestArea(lessonProgress, attempts)
  const next = recommendNextLesson(lessonProgress)

  if (overall.completed === 0 && attempts.length === 0) {
    return (
      <EmptyState
        icon={<BarChart3 className="h-6 w-6" strokeWidth={1.25} />}
        title="No Progress Data Yet"
        description="Complete a lesson or your first quiz and BUILDR will start building your skill matrix — showing exactly where you're strong and where to focus next."
        action={
          <button onClick={() => navigate('/course')} className="rounded-[3px] bg-signal-500 px-5 py-2.5 text-[13px] font-semibold text-ink-950 hover:bg-signal-400">
            Start Learning
          </button>
        }
      />
    )
  }

  return (
    <div className="mx-auto max-w-[1500px] px-8 py-8">
      <h1 className="font-display text-2xl font-semibold text-paper-100">Progress</h1>
      <p className="mt-1 text-[13px] text-mute-400">A skill matrix across every CPC30220 learning area — not a record of formal competency.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Panel className="flex items-center gap-4 p-5">
          <ProgressRing value={overall.pct} size={64} strokeWidth={5} />
          <div>
            <div className="text-technical text-[10px] uppercase tracking-wide text-mute-500">Overall Progress</div>
            <div className="text-[13px] text-paper-200">{overall.completed} / {overall.total} lessons</div>
          </div>
        </Panel>
        {strongest && (
          <Panel className="flex items-center gap-3 p-5">
            <TrendingUp className="h-5 w-5 shrink-0 text-good-400" />
            <div>
              <div className="text-technical text-[10px] uppercase tracking-wide text-mute-500">Strongest Skill</div>
              <div className="text-[13px] text-paper-200">{learningAreas.find((a) => a.id === strongest.areaId)?.title}</div>
            </div>
          </Panel>
        )}
        {weakest && (
          <Panel className="flex items-center gap-3 p-5">
            <TrendingDown className="h-5 w-5 shrink-0 text-warn-400" />
            <div>
              <div className="text-technical text-[10px] uppercase tracking-wide text-mute-500">Needs Work</div>
              <div className="text-[13px] text-paper-200">{learningAreas.find((a) => a.id === weakest.areaId)?.title}</div>
            </div>
          </Panel>
        )}
      </div>

      <Panel className="mt-6 flex items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-signal-400" />
          <div>
            <div className="text-technical text-[10px] uppercase tracking-wide text-mute-500">Recommended Next Lesson</div>
            <div className="text-[14px] font-medium text-paper-100">{next.title}</div>
          </div>
        </div>
        <button onClick={() => navigate(`/course/lesson/${next.id}`)} className="rounded-[3px] bg-signal-500 px-4 py-2 text-[12.5px] font-semibold text-ink-950 hover:bg-signal-400">
          Go
        </button>
      </Panel>

      <Panel className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-ink-700 bg-ink-900/60 text-mute-500">
              <th className="px-4 py-3 font-medium">Learning Area</th>
              <th className="px-4 py-3 font-medium">Mastery</th>
              <th className="px-4 py-3 font-medium">Learned</th>
              <th className="px-4 py-3 font-medium">Quiz Accuracy</th>
              <th className="px-4 py-3 font-medium">Attempts</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => {
              const area = learningAreas.find((a) => a.id === s.areaId)!
              return (
                <motion.tr
                  key={s.areaId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.015 }}
                  onClick={() => navigate(`/course#${area.id}`)}
                  className="cursor-pointer border-b border-ink-800 transition-colors hover:bg-ink-850/60"
                >
                  <td className="px-4 py-3">
                    <span className="text-technical mr-2 text-mute-600">{area.number}</span>
                    <span className="text-paper-200">{area.title}</span>
                  </td>
                  <td className="px-4 py-3">
                    <MasteryBadge state={s.mastery} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${heatColor(s.progressPct / 100)}`} />
                      {s.progressPct}%
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {s.accuracyPct === null ? <span className="text-mute-600">—</span> : (
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${heatColor(s.accuracyPct / 100)}`} />
                        {s.accuracyPct}%
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-mute-500">{s.attempts}</td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </Panel>
    </div>
  )
}
