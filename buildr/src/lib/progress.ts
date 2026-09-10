import { learningAreas } from '../data/learningAreas'
import { lessons, lessonsForLearningArea } from '../data/lessons'
import { modulesForLearningArea } from '../data/modules'
import { questions } from '../data/questions'
import type { ConfidenceLevel, FlashcardRecord, Lesson, LearningModule, LearningProgress, MasteryState, QuestionAttempt, RevisionItem, TopicWeakness } from '../types'

export interface LearningAreaStats {
  areaId: string
  totalLessons: number
  completedLessons: number
  progressPct: number
  accuracyPct: number | null
  attempts: number
  mastery: MasteryState
  confidenceScore: number // 0-1, from confidence ratings, used for weak-area ranking
}

const masteryWeight: Record<MasteryState, number> = {
  'not-started': 0,
  learning: 0.35,
  practising: 0.65,
  'revision-due': 0.55,
  strong: 1,
}

export function computeLearningAreaStats(
  areaId: string,
  lessonProgress: Record<string, LearningProgress>,
  attempts: QuestionAttempt[],
): LearningAreaStats {
  const areaLessons = lessonsForLearningArea(areaId)
  const totalLessons = areaLessons.length
  const completedLessons = areaLessons.filter((l) => {
    const p = lessonProgress[l.id]
    return p && p.status !== 'not-started' && p.status !== 'learning'
  }).length

  const areaQuestionIds = new Set(questions.filter((q) => q.learningAreaId === areaId).map((q) => q.id))
  const areaAttempts = attempts.filter((a) => areaQuestionIds.has(a.questionId))
  const accuracyPct = areaAttempts.length ? Math.round((areaAttempts.filter((a) => a.correct).length / areaAttempts.length) * 100) : null

  const progressStates = areaLessons.map((l) => lessonProgress[l.id]?.status ?? 'not-started')
  const avgMasteryWeight = progressStates.length
    ? progressStates.reduce((sum, s) => sum + masteryWeight[s], 0) / progressStates.length
    : 0

  let mastery: MasteryState = 'not-started'
  if (avgMasteryWeight >= 0.9) mastery = 'strong'
  else if (avgMasteryWeight >= 0.55) mastery = 'practising'
  else if (avgMasteryWeight > 0) mastery = 'learning'

  const hasRevisionDue = progressStates.includes('revision-due')
  if (hasRevisionDue) mastery = 'revision-due'

  const progressPct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0
  const accuracyComponent = accuracyPct === null ? 0.5 : accuracyPct / 100
  const confidenceScore = avgMasteryWeight * 0.6 + accuracyComponent * 0.4

  return { areaId, totalLessons, completedLessons, progressPct, accuracyPct, attempts: areaAttempts.length, mastery, confidenceScore }
}

export function computeAllAreaStats(lessonProgress: Record<string, LearningProgress>, attempts: QuestionAttempt[]) {
  return learningAreas.map((a) => computeLearningAreaStats(a.id, lessonProgress, attempts))
}

export function computeOverallProgress(lessonProgress: Record<string, LearningProgress>) {
  const total = lessons.length
  const completed = Object.values(lessonProgress).filter((p) => p.status !== 'not-started' && p.status !== 'learning').length
  return { total, completed, pct: total ? Math.round((completed / total) * 100) : 0 }
}

export function computeQuizAccuracy(attempts: QuestionAttempt[]) {
  if (!attempts.length) return null
  return Math.round((attempts.filter((a) => a.correct).length / attempts.length) * 100)
}

export function findWeakestArea(lessonProgress: Record<string, LearningProgress>, attempts: QuestionAttempt[]) {
  const stats = computeAllAreaStats(lessonProgress, attempts).filter((s) => s.attempts > 0 || s.progressPct > 0)
  if (!stats.length) return null
  return stats.reduce((weakest, s) => (s.confidenceScore < weakest.confidenceScore ? s : weakest))
}

export function findStrongestArea(lessonProgress: Record<string, LearningProgress>, attempts: QuestionAttempt[]) {
  const stats = computeAllAreaStats(lessonProgress, attempts).filter((s) => s.attempts > 0 || s.progressPct > 0)
  if (!stats.length) return null
  return stats.reduce((strongest, s) => (s.confidenceScore > strongest.confidenceScore ? s : strongest))
}

export function recommendNextLesson(lessonProgress: Record<string, LearningProgress>) {
  const inProgress = lessons.find((l) => {
    const p = lessonProgress[l.id]
    return p && (p.status === 'learning' || p.status === 'practising')
  })
  if (inProgress) return inProgress

  const notStarted = lessons.find((l) => !lessonProgress[l.id])
  return notStarted ?? lessons[0]
}

export function dueFlashcards(records: Record<string, FlashcardRecord>) {
  const now = Date.now()
  return Object.values(records).filter((r) => r.nextDueAt <= now)
}

// ---------------------------------------------------------------------------
// Modules — a module groups a run of lessons within a learning area. Areas
// without any real module defined still work: they get one synthetic
// "default" module wrapping every lesson, so every learning area routes
// through the same Module page and stats logic.
// ---------------------------------------------------------------------------

export interface ModuleGroup {
  module: LearningModule
  lessons: Lesson[]
}

export function moduleGroupsForArea(areaId: string): ModuleGroup[] {
  const realModules = modulesForLearningArea(areaId)
  const groups: ModuleGroup[] = realModules.map((m) => ({
    module: m,
    lessons: lessons.filter((l) => l.moduleId === m.id).sort((a, b) => a.order - b.order),
  }))
  const grouped = new Set(groups.flatMap((g) => g.lessons.map((l) => l.id)))
  const rest = lessonsForLearningArea(areaId).filter((l) => !grouped.has(l.id))
  if (rest.length) {
    groups.push({
      module: { id: `${areaId}-default-module`, learningAreaId: areaId, order: realModules.length + 1, title: 'Lessons', description: '' },
      lessons: rest,
    })
  }
  return groups
}

export function moduleGroupById(moduleId: string): ModuleGroup | undefined {
  for (const area of learningAreas) {
    const found = moduleGroupsForArea(area.id).find((g) => g.module.id === moduleId)
    if (found) return found
  }
  return undefined
}

export function computeModuleStats(group: ModuleGroup, lessonProgress: Record<string, LearningProgress>) {
  const total = group.lessons.length
  const completed = group.lessons.filter((l) => {
    const p = lessonProgress[l.id]
    return p && p.status !== 'not-started' && p.status !== 'learning'
  }).length
  const progressPct = total ? Math.round((completed / total) * 100) : 0
  return { total, completed, progressPct }
}

// ---------------------------------------------------------------------------
// Confidence summary — used on the Learning Area page.
// ---------------------------------------------------------------------------

export function areaConfidenceLabel(areaId: string, lessonProgress: Record<string, LearningProgress>): string {
  const areaLessons = lessonsForLearningArea(areaId)
  const rated = areaLessons.map((l) => lessonProgress[l.id]?.confidence).filter((c): c is ConfidenceLevel => !!c)
  if (!rated.length) return 'Not rated yet'
  const counts = { 'needs-revision': 0, 'getting-there': 0, confident: 0 } as Record<ConfidenceLevel, number>
  rated.forEach((c) => counts[c]++)
  if (counts['needs-revision'] > rated.length / 2) return 'Needs Revision'
  if (counts.confident > rated.length / 2) return 'Confident'
  return 'Getting There'
}

// ---------------------------------------------------------------------------
// Weak-area / revision system — a transparent, bounded 0-100 weakness score
// per learning area (see TopicWeakness). Incorrect quiz answers and
// "Need Revision" confidence ratings push it up; correct answers and
// confident ratings bring it down. A gentle time-decay is added at read
// time so a topic left untouched slowly drifts back toward due — no
// background jobs, no hidden state.
// ---------------------------------------------------------------------------

const WEAKNESS_QUIZ_WRONG = 18
const WEAKNESS_QUIZ_RIGHT = -10
const WEAKNESS_CONFIDENCE_LOW = 60 // floor — forces the topic to read as due
const WEAKNESS_CONFIDENCE_MID = 10
const WEAKNESS_CONFIDENCE_HIGH = -12
const WEAKNESS_DECAY_PER_DAY = 1.5
const WEAKNESS_DECAY_CAP = 30
const REVISION_DUE_THRESHOLD = 50

export function nextWeaknessOnQuiz(current: TopicWeakness | undefined, correct: boolean): Omit<TopicWeakness, 'areaId'> {
  const base = current ? effectiveWeaknessScore(current) : 30
  const score = clampScore(base + (correct ? WEAKNESS_QUIZ_RIGHT : WEAKNESS_QUIZ_WRONG))
  return { score, lastUpdatedAt: Date.now(), reason: correct ? 'scheduled' : 'quiz-miss' }
}

export function nextWeaknessOnConfidence(current: TopicWeakness | undefined, confidence: ConfidenceLevel): Omit<TopicWeakness, 'areaId'> {
  const base = current ? effectiveWeaknessScore(current) : 30
  if (confidence === 'needs-revision') return { score: clampScore(Math.max(base, WEAKNESS_CONFIDENCE_LOW)), lastUpdatedAt: Date.now(), reason: 'low-confidence' }
  const delta = confidence === 'confident' ? WEAKNESS_CONFIDENCE_HIGH : WEAKNESS_CONFIDENCE_MID
  return { score: clampScore(base + delta), lastUpdatedAt: Date.now(), reason: 'scheduled' }
}

function clampScore(v: number) {
  return Math.max(0, Math.min(100, v))
}

export function effectiveWeaknessScore(entry: TopicWeakness | Omit<TopicWeakness, 'areaId'>): number {
  const days = (Date.now() - entry.lastUpdatedAt) / 86_400_000
  const decay = Math.min(WEAKNESS_DECAY_CAP, Math.max(0, days) * WEAKNESS_DECAY_PER_DAY)
  return clampScore(entry.score + decay)
}

export interface RevisionDueItem extends RevisionItem {
  score: number
}

export function computeRevisionDue(topicWeakness: Record<string, TopicWeakness>): RevisionDueItem[] {
  return Object.values(topicWeakness)
    .map((entry) => ({
      topic: learningAreaById(entry.areaId)?.title ?? entry.areaId,
      learningAreaId: entry.areaId,
      dueAt: entry.lastUpdatedAt,
      reason: entry.reason,
      score: Math.round(effectiveWeaknessScore(entry)),
    }))
    .filter((r) => r.score >= REVISION_DUE_THRESHOLD)
    .sort((a, b) => b.score - a.score)
}

function learningAreaById(id: string) {
  return learningAreas.find((a) => a.id === id)
}
