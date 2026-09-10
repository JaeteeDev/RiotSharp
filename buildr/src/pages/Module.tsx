import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Boxes, ChevronRight, ClipboardCheck } from 'lucide-react'
import { learningAreaById } from '../data/learningAreas'
import { glossary } from '../data/glossary'
import { useAppStore } from '../store/useAppStore'
import { useBreadcrumb } from '../store/useUiStore'
import { moduleGroupById, computeModuleStats } from '../lib/progress'
import { MasteryBadge } from '../components/ui/MasteryBadge'
import { ProgressRing } from '../components/ui/ProgressRing'
import { Panel } from '../components/ui/Panel'

export function Module() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const group = moduleId ? moduleGroupById(moduleId) : undefined
  const area = group ? learningAreaById(group.module.learningAreaId) : undefined
  const lessonProgress = useAppStore((s) => s.lessonProgress)

  useBreadcrumb(['Course', area?.title ?? '', group?.module.title ?? 'Module'])

  if (!group || !area) {
    return (
      <div className="p-8 text-mute-400">
        Module not found. <button className="text-signal-400" onClick={() => navigate('/course')}>Back to course map</button>
      </div>
    )
  }

  const stat = computeModuleStats(group, lessonProgress)
  const relatedTermIds = new Set(group.lessons.flatMap((l) => l.relatedTermIds))
  const terms = glossary.filter((g) => relatedTermIds.has(g.id))

  return (
    <div className="mx-auto max-w-[1300px] px-8 py-8">
      <button onClick={() => navigate(`/course/area/${area.id}`)} className="text-technical mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-blue-400 hover:text-blue-300">
        {area.number} · {area.title}
      </button>
      <h1 className="font-display text-[30px] font-semibold leading-tight text-paper-100">{group.module.title}</h1>
      {group.module.description && <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-mute-400">{group.module.description}</p>}

      <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-5">
          <Panel className="overflow-hidden" title="Lessons">
            {group.lessons.map((l, i) => {
              const p = lessonProgress[l.id]
              return (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
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
                </motion.button>
              )
            })}
          </Panel>

          {area.id === 'wall-framing' && (
            <Panel className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                <Boxes className="h-5 w-5 shrink-0 text-blue-400" />
                <div>
                  <div className="text-[13.5px] font-medium text-paper-100">Interactive 3D Wall Frame</div>
                  <p className="text-[12px] text-mute-500">See every component from this module in the Workshop.</p>
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

          <Panel className="corner-ticks relative flex flex-col items-center gap-3 border-signal-500/30 bg-signal-500/[0.05] px-6 py-8 text-center">
            <ClipboardCheck className="h-6 w-6 text-signal-400" strokeWidth={1.5} />
            <div className="text-technical text-[10px] uppercase tracking-[0.16em] text-signal-300">Module Assessment</div>
            <p className="max-w-sm text-[13px] leading-relaxed text-mute-400">Test your knowledge across every lesson in this module.</p>
            <button
              onClick={() => navigate('/quiz/session/unit', { state: { learningAreaId: area.id, moduleId: group.module.id } })}
              className="mt-2 rounded-[3px] bg-signal-500 px-5 py-2.5 text-[13px] font-semibold text-ink-950 hover:bg-signal-400"
            >
              Start Module Quiz
            </button>
          </Panel>
        </div>

        <div className="flex flex-col gap-5">
          <Panel className="flex items-center gap-4 p-5">
            <ProgressRing value={stat.progressPct} size={64} strokeWidth={5} />
            <div>
              <div className="text-technical text-[10px] uppercase tracking-wide text-mute-500">Module Progress</div>
              <div className="text-[13px] text-paper-200">{stat.completed} / {stat.total} lessons</div>
            </div>
          </Panel>

          {terms.length > 0 && (
            <Panel className="p-5" title="Related Terminology">
              <div className="flex flex-wrap gap-2">
                {terms.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => navigate(`/reference/term/${t.id}`)}
                    className="rounded-full border border-ink-600 px-3 py-1 text-[12px] text-paper-300 transition-colors hover:border-blue-500/50 hover:text-blue-300"
                  >
                    {t.term}
                  </button>
                ))}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </div>
  )
}
