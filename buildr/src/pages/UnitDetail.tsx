import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, ExternalLink, CheckCircle2 } from 'lucide-react'
import { unitByCode } from '../data/units'
import { UNIT_SOURCE_NOTE } from '../data/units'
import { learningAreaById } from '../data/learningAreas'
import { lessonsForLearningArea } from '../data/lessons'
import { glossary } from '../data/glossary'
import { questionsByLearningArea } from '../data/questions'
import { useAppStore } from '../store/useAppStore'
import { useBreadcrumb } from '../store/useUiStore'
import { MasteryBadge } from '../components/ui/MasteryBadge'
import { Panel } from '../components/ui/Panel'

export function UnitDetail() {
  const { code } = useParams()
  const navigate = useNavigate()
  const unit = code ? unitByCode(code) : undefined
  const area = unit ? learningAreaById(unit.learningAreaId) : undefined
  const lessonProgress = useAppStore((s) => s.lessonProgress)
  const competencyRecorded = useAppStore((s) => s.competencyRecorded)
  const setCompetencyRecorded = useAppStore((s) => s.setCompetencyRecorded)
  const [sourceOpen, setSourceOpen] = useState(false)

  useBreadcrumb(['Course', area?.title ?? 'Unit', code ?? ''])

  if (!unit || !area) {
    return (
      <div className="p-8 text-mute-400">
        Unit not found. <button className="text-signal-400" onClick={() => navigate('/course')}>Back to course map</button>
      </div>
    )
  }

  const lessons = lessonsForLearningArea(area.id)
  const relatedTermIds = new Set(lessons.flatMap((l) => l.relatedTermIds))
  const terms = glossary.filter((g) => relatedTermIds.has(g.id))
  const quizQuestions = questionsByLearningArea(area.id).filter((q) => !q.unitCode || q.unitCode === unit.code)
  const recorded = competencyRecorded[unit.code] ?? false

  const completedLessons = lessons.filter((l) => {
    const p = lessonProgress[l.id]
    return p && p.status !== 'not-started' && p.status !== 'learning'
  }).length
  const progressPct = lessons.length ? Math.round((completedLessons / lessons.length) * 100) : 0

  return (
    <div className="mx-auto max-w-[1100px] px-8 py-8">
      <div className="text-technical mb-2 text-[11px] uppercase tracking-[0.16em] text-blue-400">
        {area.number} · {area.title}
      </div>
      <h1 className="text-technical text-[13px] tracking-wide text-mute-500">{unit.code}</h1>
      <h2 className="font-display mt-1 text-[30px] font-semibold uppercase leading-tight text-paper-100">{unit.name}</h2>
      <span className="text-technical mt-2 inline-block rounded border border-ink-600 px-2 py-0.5 text-[10px] uppercase text-mute-500">
        {unit.type === 'core' ? 'Core Unit' : 'Elective Unit'}
      </span>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-5">
          <Panel className="p-5" title="Overview">
            <p className="text-[14px] leading-relaxed text-paper-300">{unit.summary}</p>
          </Panel>

          <Panel className="p-5" title="What You Will Learn">
            <ul className="flex flex-col gap-2">
              {lessons.flatMap((l) => l.objectives).slice(0, 6).map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-[13.5px] text-paper-300">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-signal-400" />
                  {o}
                </li>
              ))}
              {!lessons.length && <li className="text-[13px] text-mute-500">Lesson content for this unit is being developed.</li>}
            </ul>
          </Panel>

          <Panel className="p-5" title="Key Terminology">
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
              {!terms.length && <span className="text-[13px] text-mute-500">No terms linked yet.</span>}
            </div>
          </Panel>

          <Panel className="p-5" title="Knowledge Lessons">
            <div className="flex flex-col gap-2">
              {lessons.map((l) => {
                const p = lessonProgress[l.id]
                return (
                  <button
                    key={l.id}
                    onClick={() => navigate(`/course/lesson/${l.id}`)}
                    className="flex items-center justify-between rounded-md border border-ink-700 px-3.5 py-2.5 text-left transition-colors hover:border-ink-500"
                  >
                    <div>
                      <div className="text-[13.5px] font-medium text-paper-200">{l.title}</div>
                      <div className="text-[12px] text-mute-500">{l.estMinutes} min · {l.subtitle}</div>
                    </div>
                    <MasteryBadge state={p?.status ?? 'not-started'} />
                  </button>
                )
              })}
              {!lessons.length && <p className="text-[13px] text-mute-500">No lessons published for this unit yet — check back soon.</p>}
            </div>
          </Panel>

          {quizQuestions.length > 0 && (
            <Panel className="p-5" title="Knowledge Quiz">
              <p className="text-[13px] text-mute-400">{quizQuestions.length} questions available covering this unit.</p>
              <button
                onClick={() => navigate('/quiz/session/unit', { state: { learningAreaId: area.id } })}
                className="mt-3 rounded-md bg-signal-500 px-4 py-2 text-[13px] font-semibold text-ink-950 hover:bg-signal-400"
              >
                Start Unit Quiz
              </button>
            </Panel>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <Panel className="p-5" title="Learning Progress">
            <div className="text-3xl font-display font-semibold text-paper-100">{progressPct}%</div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
              <div className="h-full rounded-full bg-signal-400" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-mute-500">
              This reflects lessons completed in BUILDR — it is not a record of formal competency.
            </p>
          </Panel>

          <Panel className="p-5" title="Official Competency">
            <p className="text-[12.5px] leading-relaxed text-mute-400">
              Formal competency in this unit is only achieved through your RTO's supervised assessment — never from completing lessons or quizzes here.
            </p>
            <label className="mt-3 flex items-center gap-2.5 rounded-md border border-ink-700 px-3 py-2.5 text-[12.5px] text-paper-300">
              <input
                type="checkbox"
                checked={recorded}
                onChange={(e) => setCompetencyRecorded(unit.code, e.target.checked)}
                className="h-3.5 w-3.5 accent-signal-500"
              />
              I have formally been assessed as competent (manually recorded)
            </label>
          </Panel>

          <Panel>
            <button
              onClick={() => setSourceOpen((v) => !v)}
              className="flex w-full items-center justify-between px-5 py-3.5 text-left"
            >
              <span className="text-technical text-[10px] uppercase tracking-[0.14em] text-mute-500">Source / Unit Requirements</span>
              <motion.span animate={{ rotate: sourceOpen ? 180 : 0 }}>
                <ChevronDown className="h-4 w-4 text-mute-500" />
              </motion.span>
            </button>
            {sourceOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="overflow-hidden px-5 pb-5">
                <p className="text-[12px] leading-relaxed text-mute-500">{UNIT_SOURCE_NOTE}</p>
                <a
                  href="https://training.gov.au"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] text-blue-400 hover:text-blue-300"
                >
                  training.gov.au <ExternalLink className="h-3 w-3" />
                </a>
                <p className="mt-2 text-[11px] text-mute-600">{unit.release}</p>
              </motion.div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  )
}
