import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Boxes, Clock, ListChecks } from 'lucide-react'
import clsx from 'clsx'
import { lessonById, lessonsForLearningArea } from '../data/lessons'
import { learningAreaById } from '../data/learningAreas'
import { moduleById } from '../data/modules'
import { glossary } from '../data/glossary'
import { useAppStore } from '../store/useAppStore'
import { useBreadcrumb } from '../store/useUiStore'
import { LessonBlockRenderer } from '../components/lesson/LessonBlockRenderer'
import type { ConfidenceLevel } from '../types'

const confidenceOptions: { level: ConfidenceLevel; label: string }[] = [
  { level: 'needs-revision', label: 'Need Revision' },
  { level: 'getting-there', label: 'Getting There' },
  { level: 'confident', label: 'Confident' },
]

export function LessonViewer() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const lesson = lessonId ? lessonById(lessonId) : undefined
  const area = lesson ? learningAreaById(lesson.learningAreaId) : undefined
  const visitLesson = useAppStore((s) => s.visitLesson)
  const setLessonConfidence = useAppStore((s) => s.setLessonConfidence)
  const setLessonStatus = useAppStore((s) => s.setLessonStatus)
  const recordConfidenceWeaknessSignal = useAppStore((s) => s.recordConfidenceWeaknessSignal)
  const recordQuizWeaknessSignal = useAppStore((s) => s.recordQuizWeaknessSignal)
  const progress = useAppStore((s) => (lesson ? s.lessonProgress[lesson.id] : undefined))

  const module = lesson?.moduleId ? moduleById(lesson.moduleId) : undefined

  useBreadcrumb(['Course', area?.title ?? '', ...(module ? [module.title] : []), lesson?.title ?? ''])

  useEffect(() => {
    if (lesson) visitLesson(lesson.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id])

  if (!lesson || !area) {
    return (
      <div className="p-8 text-mute-400">
        Lesson not found. <button className="text-signal-400" onClick={() => navigate('/course')}>Back to course map</button>
      </div>
    )
  }

  const relatedTerms = glossary.filter((g) => lesson.relatedTermIds.includes(g.id))
  const siblingLessons = lessonsForLearningArea(area.id)
  const currentIndex = siblingLessons.findIndex((l) => l.id === lesson.id)
  const prevLesson = currentIndex > 0 ? siblingLessons[currentIndex - 1] : undefined
  const nextLesson = siblingLessons[currentIndex + 1]

  const currentLesson = lesson
  function pickConfidence(level: ConfidenceLevel) {
    setLessonConfidence(currentLesson.id, level)
    recordConfidenceWeaknessSignal(currentLesson.learningAreaId, level)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px]">
      <div className="ruler-margin mx-auto w-full max-w-[900px] px-8 py-8 pl-12 lg:pl-14">
        <div className="text-technical mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-blue-400">
          <button onClick={() => navigate(`/course/area/${area.id}`)} className="hover:text-blue-300">{area.number} · {area.title}</button>
          {module && (
            <>
              <span className="text-mute-600">/</span>
              <button onClick={() => navigate(`/course/module/${module.id}`)} className="hover:text-blue-300">{module.title}</button>
            </>
          )}
          {lesson.unitCode && <span className="text-mute-600">· {lesson.unitCode}</span>}
        </div>
        <h1 className="font-display text-[30px] font-semibold leading-tight text-paper-100">{lesson.title}</h1>
        <p className="mt-1.5 text-[14px] text-mute-400">{lesson.subtitle}</p>
        <div className="mt-3 flex items-center gap-4 text-[12px] text-mute-500">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {lesson.estMinutes} min
          </span>
          <span className="flex items-center gap-1.5">
            <ListChecks className="h-3.5 w-3.5" /> {lesson.objectives.length} objectives
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-7">
          {lesson.blocks.map((block, i) => (
            <LessonBlockRenderer
              key={i}
              block={block}
              index={i}
              onMiniQuestionAnswered={(correct) => recordQuizWeaknessSignal(lesson.learningAreaId, correct)}
            />
          ))}
        </div>

        <div className="mt-10 rounded-[3px] border border-ink-600 bg-ink-850/50 p-5">
          <div className="text-technical mb-3 text-[10px] uppercase tracking-wide text-mute-500">How confident are you?</div>
          <div className="flex gap-2">
            {confidenceOptions.map((c) => (
              <button
                key={c.level}
                onClick={() => pickConfidence(c.level)}
                className={clsx(
                  'flex-1 rounded-[3px] border px-3 py-2.5 text-[12.5px] font-medium transition-colors',
                  progress?.confidence === c.level
                    ? 'border-signal-400 bg-signal-500/15 text-signal-300'
                    : 'border-ink-600 text-mute-400 hover:border-ink-500 hover:text-paper-200',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLessonStatus(lesson.id, 'strong')}
              className="rounded-[3px] bg-signal-500 px-5 py-2.5 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-signal-400"
            >
              Mark Lesson Complete
            </button>
            {prevLesson && (
              <button
                onClick={() => navigate(`/course/lesson/${prevLesson.id}`)}
                className="flex items-center gap-1.5 text-[13px] text-mute-400 hover:text-paper-200"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Previous
              </button>
            )}
          </div>
          {nextLesson && (
            <button
              onClick={() => navigate(`/course/lesson/${nextLesson.id}`)}
              className="flex items-center gap-1.5 text-[13px] text-mute-400 hover:text-paper-200"
            >
              Next: {nextLesson.title}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <aside className="hidden border-l border-ink-700 bg-ink-900/40 px-6 py-8 xl:block">
        <div className="text-technical mb-3 text-[10px] uppercase tracking-wide text-mute-500">Objectives</div>
        <ul className="mb-8 flex flex-col gap-2">
          {lesson.objectives.map((o, i) => (
            <li key={i} className="text-[12.5px] leading-relaxed text-paper-300">
              <span className="text-signal-400">→</span> {o}
            </li>
          ))}
        </ul>

        {relatedTerms.length > 0 && (
          <>
            <div className="text-technical mb-3 text-[10px] uppercase tracking-wide text-mute-500">Related Terms</div>
            <div className="mb-8 flex flex-wrap gap-1.5">
              {relatedTerms.map((t) => (
                <motion.button
                  whileHover={{ y: -1 }}
                  key={t.id}
                  onClick={() => navigate(`/reference/term/${t.id}`)}
                  className="rounded-full border border-ink-600 px-2.5 py-1 text-[11px] text-paper-300 hover:border-blue-500/50 hover:text-blue-300"
                >
                  {t.term}
                </motion.button>
              ))}
            </div>
          </>
        )}

        {lesson.quizIds.length > 0 && (
          <button
            onClick={() => navigate('/quiz/session/unit', { state: { learningAreaId: area.id } })}
            className="w-full rounded-[3px] border border-ink-600 px-4 py-2.5 text-[12.5px] font-medium text-paper-200 hover:border-signal-400 hover:text-signal-300"
          >
            Quiz Me On This Topic
          </button>
        )}

        {area.id === 'wall-framing' && (
          <button
            onClick={() => navigate('/workshop')}
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-[3px] border border-blue-500/30 bg-blue-500/[0.05] px-4 py-2.5 text-[12.5px] font-medium text-blue-300 hover:border-blue-400/50"
          >
            <Boxes className="h-3.5 w-3.5" />
            Open In Workshop
          </button>
        )}

        <button
          onClick={() => navigate(module ? `/course/module/${module.id}` : `/course/area/${area.id}`)}
          className="mt-2.5 w-full rounded-[3px] px-4 py-2.5 text-center text-[12px] text-mute-500 hover:text-paper-200"
        >
          ← Back to {module ? module.title : area.title}
        </button>
      </aside>
    </div>
  )
}
