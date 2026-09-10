import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Boxes, ChevronRight, Gauge } from 'lucide-react'
import { learningAreaById } from '../data/learningAreas'
import { unitsForLearningArea } from '../data/units'
import { useAppStore } from '../store/useAppStore'
import { useBreadcrumb } from '../store/useUiStore'
import { computeLearningAreaStats, moduleGroupsForArea, computeModuleStats, areaConfidenceLabel } from '../lib/progress'
import { MasteryBadge } from '../components/ui/MasteryBadge'
import { ProgressRing } from '../components/ui/ProgressRing'
import { Panel } from '../components/ui/Panel'

export function LearningArea() {
  const { areaId } = useParams()
  const navigate = useNavigate()
  const area = areaId ? learningAreaById(areaId) : undefined
  const lessonProgress = useAppStore((s) => s.lessonProgress)
  const attempts = useAppStore((s) => s.questionAttempts)

  useBreadcrumb(['Course', area?.title ?? 'Learning Area'])

  if (!area) {
    return (
      <div className="p-8 text-mute-400">
        Learning area not found. <button className="text-signal-400" onClick={() => navigate('/course')}>Back to course map</button>
      </div>
    )
  }

  const stat = computeLearningAreaStats(area.id, lessonProgress, attempts)
  const groups = moduleGroupsForArea(area.id)
  const isSynthetic = groups.length === 1 && groups[0].module.id === `${area.id}-default-module`
  const areaUnits = unitsForLearningArea(area.id)
  const confidence = areaConfidenceLabel(area.id, lessonProgress)

  const allLessons = groups.flatMap((g) => g.lessons)
  const nextLesson =
    allLessons.find((l) => {
      const p = lessonProgress[l.id]
      return p && (p.status === 'learning' || p.status === 'practising')
    }) ?? allLessons.find((l) => !lessonProgress[l.id]) ?? allLessons[0]

  return (
    <div className="mx-auto max-w-[1300px] px-8 py-8">
      <div className="text-technical mb-2 text-[11px] uppercase tracking-[0.16em] text-blue-400">{area.number} · Learning Area</div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-display text-[30px] font-semibold leading-tight text-paper-100">{area.title}</h1>
        <MasteryBadge state={stat.mastery} />
      </div>
      <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-mute-400">{area.description}</p>

      <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-5">
          {nextLesson && (
            <Panel className="flex items-center justify-between gap-4 p-5">
              <div className="min-w-0">
                <div className="text-technical text-[10px] uppercase tracking-wide text-mute-500">Recommended Next Lesson</div>
                <div className="mt-1 truncate text-[16px] font-medium text-paper-100">{nextLesson.title}</div>
                <p className="mt-0.5 truncate text-[12.5px] text-mute-500">{nextLesson.subtitle}</p>
              </div>
              <button
                onClick={() => navigate(`/course/lesson/${nextLesson.id}`)}
                className="flex shrink-0 items-center gap-2 rounded-[3px] bg-signal-500 px-4 py-2.5 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-signal-400"
              >
                Continue
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </Panel>
          )}

          {isSynthetic ? (
            <Panel className="overflow-hidden" title="Lessons">
              {groups[0].lessons.map((l, i) => {
                const p = lessonProgress[l.id]
                return (
                  <button
                    key={l.id}
                    onClick={() => navigate(`/course/lesson/${l.id}`)}
                    className={`group flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-ink-800/50 ${i !== 0 ? 'border-t border-ink-800' : ''}`}
                  >
                    <span className="text-technical w-6 shrink-0 text-[12px] text-mute-600">{String(l.order).padStart(2, '0')}</span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] font-medium text-paper-200">{l.title}</div>
                      <div className="text-[12px] text-mute-500">{l.estMinutes} min · {l.subtitle}</div>
                    </div>
                    <MasteryBadge state={p?.status ?? 'not-started'} />
                    <ChevronRight className="h-4 w-4 shrink-0 text-mute-600 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )
              })}
              {!groups[0].lessons.length && <p className="px-4 py-6 text-[13px] text-mute-500">No lessons published for this area yet — check back soon.</p>}
            </Panel>
          ) : (
            <Panel className="overflow-hidden" title="Modules">
              {groups.map((g, i) => {
                const mstat = computeModuleStats(g, lessonProgress)
                return (
                  <button
                    key={g.module.id}
                    onClick={() => navigate(`/course/module/${g.module.id}`)}
                    className={`group flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-ink-800/50 ${i !== 0 ? 'border-t border-ink-800' : ''}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-medium text-paper-100">{g.module.title}</div>
                      <p className="mt-0.5 line-clamp-1 text-[12.5px] text-mute-500">{g.module.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 w-40 overflow-hidden rounded-full bg-ink-700">
                          <div className="h-full rounded-full bg-signal-400" style={{ width: `${mstat.progressPct}%` }} />
                        </div>
                        <span className="text-technical text-[10px] text-mute-500">{mstat.completed}/{mstat.total} lessons</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-mute-600 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )
              })}
            </Panel>
          )}

          {area.id === 'wall-framing' && (
            <Panel className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                <Boxes className="h-5 w-5 shrink-0 text-blue-400" />
                <div>
                  <div className="text-[13.5px] font-medium text-paper-100">Interactive 3D Wall Frame</div>
                  <p className="text-[12px] text-mute-500">See every component from this area in the Workshop.</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/workshop')}
                className="shrink-0 rounded-[3px] border border-ink-500 px-4 py-2 text-[12.5px] font-medium text-paper-200 hover:border-blue-400 hover:text-blue-300"
              >
                Open in Workshop
              </button>
            </Panel>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <Panel className="flex items-center gap-4 p-5">
            <ProgressRing value={stat.progressPct} size={64} strokeWidth={5} />
            <div>
              <div className="text-technical text-[10px] uppercase tracking-wide text-mute-500">Lessons Completed</div>
              <div className="text-[13px] text-paper-200">{stat.completedLessons} / {stat.totalLessons}</div>
            </div>
          </Panel>

          <Panel className="p-5">
            <div className="flex items-center gap-3">
              <Gauge className="h-4 w-4 shrink-0 text-signal-400" />
              <div className="text-technical text-[10px] uppercase tracking-wide text-mute-500">Quiz Accuracy</div>
            </div>
            <div className="font-display mt-2 text-2xl font-semibold text-paper-100">
              {stat.accuracyPct === null ? <span className="text-mute-600">—</span> : `${stat.accuracyPct}%`}
            </div>
            <div className="mt-0.5 text-[11.5px] text-mute-500">{stat.attempts} question{stat.attempts === 1 ? '' : 's'} attempted</div>
          </Panel>

          <Panel className="p-5">
            <div className="text-technical text-[10px] uppercase tracking-wide text-mute-500">Confidence Level</div>
            <div className="mt-2 text-[15px] font-medium text-paper-100">{confidence}</div>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-mute-500">
              This reflects lessons completed and confidence ratings in BUILDR — never a record of formal competency.
            </p>
          </Panel>

          {areaUnits.length > 0 && (
            <Panel className="p-5" title="Related Official Units">
              <div className="flex flex-col gap-2">
                {areaUnits.map((u) => (
                  <motion.button
                    key={u.code}
                    whileHover={{ x: 2 }}
                    onClick={() => navigate(`/course/unit/${u.code}`)}
                    className="flex items-center justify-between rounded-[3px] border border-ink-700 px-3 py-2 text-left transition-colors hover:border-blue-500/40"
                  >
                    <span className="text-technical text-[11px] text-blue-300">{u.code}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-mute-600" />
                  </motion.button>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  )
}
