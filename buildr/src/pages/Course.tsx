import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { List, GitBranch, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { learningAreas } from '../data/learningAreas'
import { unitsForLearningArea } from '../data/units'
import { lessonsForLearningArea } from '../data/lessons'
import { useAppStore } from '../store/useAppStore'
import { useBreadcrumb } from '../store/useUiStore'
import { computeLearningAreaStats } from '../lib/progress'
import { MasteryBadge } from '../components/ui/MasteryBadge'
import { SkillTree } from '../components/course/SkillTree'

export function Course() {
  useBreadcrumb(['Course'])
  const navigate = useNavigate()
  const location = useLocation()
  const [view, setView] = useState<'list' | 'tree'>('list')
  const lessonProgress = useAppStore((s) => s.lessonProgress)
  const questionAttempts = useAppStore((s) => s.questionAttempts)

  useEffect(() => {
    if (view !== 'list' || !location.hash) return
    const id = location.hash.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('ring-2', 'ring-signal-400')
      const t = setTimeout(() => el.classList.remove('ring-2', 'ring-signal-400'), 1600)
      return () => clearTimeout(t)
    }
  }, [location.hash, view])

  return (
    <div className="mx-auto max-w-[1400px] px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper-100">Course Map</h1>
          <p className="mt-1 text-[13px] text-mute-400">20 learning areas built from the CPC30220 unit structure — foundations to finish.</p>
        </div>
        <div className="flex rounded-md border border-ink-600 bg-ink-850 p-1">
          <ViewToggle active={view === 'list'} onClick={() => setView('list')} icon={<List className="h-3.5 w-3.5" />} label="List" />
          <ViewToggle active={view === 'tree'} onClick={() => setView('tree')} icon={<GitBranch className="h-3.5 w-3.5" />} label="Skill Tree" />
        </div>
      </div>

      <div className="mt-6">
        {view === 'tree' ? (
          <SkillTree />
        ) : (
          <div className="flex flex-col gap-3">
            {learningAreas.map((area, i) => {
              const stat = computeLearningAreaStats(area.id, lessonProgress, questionAttempts)
              const areaUnits = unitsForLearningArea(area.id)
              const areaLessons = lessonsForLearningArea(area.id)
              return (
                <motion.button
                  key={area.id}
                  id={area.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  onClick={() => (areaLessons[0] ? navigate(`/course/lesson/${areaLessons[0].id}`) : undefined)}
                  className="group flex items-center gap-5 rounded-lg border border-ink-600 bg-ink-850/50 px-5 py-4 text-left transition-colors hover:border-ink-500 hover:bg-ink-800/60"
                >
                  <span className="text-technical w-8 shrink-0 text-[13px] text-mute-600">{area.number}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <span className="truncate text-[15px] font-medium text-paper-100">{area.title}</span>
                      <MasteryBadge state={stat.mastery} />
                    </div>
                    <p className="mt-0.5 truncate text-[12.5px] text-mute-500">{area.description}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {areaUnits.map((u) => (
                        <span
                          key={u.code}
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/course/unit/${u.code}`)
                          }}
                          className="text-technical rounded border border-ink-600 px-1.5 py-0.5 text-[9.5px] text-mute-500 hover:border-blue-500/50 hover:text-blue-300"
                        >
                          {u.code}
                        </span>
                      ))}
                      {!areaUnits.length && <span className="text-technical text-[9.5px] text-mute-600">Cross-topic</span>}
                    </div>
                  </div>
                  <div className="hidden w-32 shrink-0 sm:block">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
                      <div className="h-full rounded-full bg-signal-400 transition-all" style={{ width: `${stat.progressPct}%` }} />
                    </div>
                    <div className="text-technical mt-1 text-right text-[10px] text-mute-500">{stat.progressPct}%</div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-mute-600 transition-transform group-hover:translate-x-0.5" />
                </motion.button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function ViewToggle({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-1.5 rounded px-3 py-1.5 text-[12.5px] font-medium transition-colors',
        active ? 'bg-ink-700 text-paper-100' : 'text-mute-500 hover:text-paper-200',
      )}
    >
      {icon}
      {label}
    </button>
  )
}
