import { questions } from '../data/questions'
import type { QuestionAttempt, QuizQuestion } from '../types'
import { findWeakestArea } from './progress'

export type QuizMode = 'quick' | 'unit' | 'topic' | 'weak' | 'mock' | 'daily'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export interface BuildQuizOpts {
  learningAreaId?: string
  topic?: string
  lessonProgress?: Record<string, import('../types').LearningProgress>
  attempts?: QuestionAttempt[]
}

export function buildQuiz(mode: QuizMode, opts: BuildQuizOpts = {}): QuizQuestion[] {
  switch (mode) {
    case 'unit':
      if (opts.learningAreaId) {
        return shuffle(questions.filter((q) => q.learningAreaId === opts.learningAreaId))
      }
      return shuffle(questions).slice(0, 10)
    case 'topic':
      if (opts.topic) {
        return shuffle(questions.filter((q) => q.topic === opts.topic))
      }
      return shuffle(questions).slice(0, 10)
    case 'weak': {
      const weakest = opts.lessonProgress && opts.attempts ? findWeakestArea(opts.lessonProgress, opts.attempts) : null
      if (weakest) {
        const set = shuffle(questions.filter((q) => q.learningAreaId === weakest.areaId))
        if (set.length) return set
      }
      return shuffle(questions).slice(0, 10)
    }
    case 'mock':
      return shuffle(questions).slice(0, 20)
    case 'daily':
      return shuffle(questions).slice(0, 8)
    case 'quick':
    default:
      return shuffle(questions).slice(0, 10)
  }
}

export function checkAnswer(
  q: QuizQuestion,
  response: { selectedIndices?: number[]; numericValue?: number; order?: number[] },
): boolean {
  switch (q.type) {
    case 'multiple-choice':
    case 'identify-component':
    case 'true-false':
      return response.selectedIndices?.[0] === q.correctIndex
    case 'multiple-select': {
      const a = [...(response.selectedIndices ?? [])].sort()
      const b = [...(q.correctIndices ?? [])].sort()
      return a.length === b.length && a.every((v, i) => v === b[i])
    }
    case 'calculation': {
      if (response.numericValue === undefined || q.numericAnswer === undefined) return false
      const tol = q.numericTolerance ?? 0
      return Math.abs(response.numericValue - q.numericAnswer) <= tol
    }
    case 'order-steps': {
      const a = response.order ?? []
      const b = q.correctOrder ?? []
      return a.length === b.length && a.every((v, i) => v === b[i])
    }
    default:
      return false
  }
}

export const quizModeLabel: Record<QuizMode, string> = {
  quick: 'Quick Quiz',
  unit: 'Unit Quiz',
  topic: 'Topic Quiz',
  weak: 'Weak Area Quiz',
  mock: 'Mock Theory Test',
  daily: '15 Minute Session',
}
