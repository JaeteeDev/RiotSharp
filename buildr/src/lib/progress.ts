import { learningAreas } from '../data/learningAreas'
import { lessons, lessonsForLearningArea } from '../data/lessons'
import { questions } from '../data/questions'
import type { FlashcardRecord, LearningProgress, MasteryState, QuestionAttempt } from '../types'

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
