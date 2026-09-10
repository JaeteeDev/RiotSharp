// ---------------------------------------------------------------------------
// BUILDR data model
//
// This models the content system described for the app: a qualification
// broken into units, grouped into learning areas, each containing lessons,
// glossary terms, questions and flashcards. Kept as plain structured data
// (not hardcoded per-page) so new content can be added without new code.
// ---------------------------------------------------------------------------

export type MasteryState =
  | 'not-started'
  | 'learning'
  | 'practising'
  | 'strong'
  | 'revision-due'

export type ConfidenceLevel = 'needs-revision' | 'getting-there' | 'confident'

export interface Unit {
  code: string
  name: string
  type: 'core' | 'elective'
  learningAreaId: string
  /** One-line plain-English summary of what the unit covers. */
  summary: string
  /** training.gov.au release/version note shown in the source drawer. */
  release: string
}

export interface LearningArea {
  id: string
  number: string // "01".."20"
  title: string
  description: string
  unitCodes: string[]
  /** Skill-tree prerequisite learning area ids. */
  prerequisites: string[]
}

/**
 * A module groups a run of lessons within one learning area (e.g. Wall
 * Framing's "Wall Frame Fundamentals" module holds 11 lessons). Learning
 * areas without any defined modules still work everywhere — curriculum.ts
 * synthesises a single default module wrapping their lessons.
 */
export interface LearningModule {
  id: string
  learningAreaId: string
  order: number
  title: string
  description: string
}

export type LessonBlock =
  | { kind: 'text'; heading?: string; body: string }
  | { kind: 'callout'; tone: 'info' | 'warning' | 'safety'; title: string; body: string }
  | { kind: 'terms'; terms: { term: string; definition: string }[] }
  | { kind: 'list'; heading?: string; ordered?: boolean; items: string[] }
  | { kind: 'worked-example'; title: string; given: string[]; steps: { label: string; detail: string }[]; result: string }
  | { kind: 'mini-question'; question: MiniQuestion }
  | { kind: 'image-diagram'; diagramId: string; caption?: string }
  | { kind: 'mistakes'; items: { mistake: string; why: string }[] }
  | { kind: 'stud-spacing-interactive'; defaultLength?: number; defaultCentres?: 450 | 600 }
  | { kind: 'load-path'; variant: 'general' | 'opening' }
  | { kind: 'quiz-cta'; label: string; description: string; learningAreaId: string }

export interface MiniQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Lesson {
  id: string
  unitCode?: string
  learningAreaId: string
  moduleId?: string
  order: number
  title: string
  subtitle: string
  estMinutes: number
  objectives: string[]
  blocks: LessonBlock[]
  relatedTermIds: string[]
  quizIds: string[]
}

export interface GlossaryTerm {
  id: string
  term: string
  short: string
  definition: string
  relatedTermIds: string[]
  learningAreaId?: string
  category: 'framing' | 'roof' | 'floor' | 'tools' | 'materials' | 'plans' | 'general' | 'whs' | 'stairs' | 'concrete'
}

export type QuestionType =
  | 'multiple-choice'
  | 'multiple-select'
  | 'true-false'
  | 'calculation'
  | 'identify-component'
  | 'order-steps'
  | 'match-terms'

export interface QuizQuestion {
  id: string
  type: QuestionType
  topic: string
  learningAreaId: string
  unitCode?: string
  prompt: string
  options?: string[]
  correctIndices?: number[]
  correctIndex?: number
  orderItems?: string[]
  correctOrder?: number[]
  matchPairs?: { left: string; right: string }[]
  numericAnswer?: number
  numericTolerance?: number
  numericUnit?: string
  explanation: string
  wrongExplanations?: Record<number, string>
  difficulty: 1 | 2 | 3
}

export interface Flashcard {
  id: string
  front: string
  back: string
  diagramId?: string
  learningAreaId: string
  relatedTermIds: string[]
}

export interface CalculatorMeta {
  id: string
  name: string
  category: 'general' | 'roofing' | 'framing' | 'stairs' | 'concrete' | 'materials' | 'set-out'
  description: string
}

// ---------------------------------------------------------------------------
// Progress / persistence entities
// ---------------------------------------------------------------------------

export interface LearningProgress {
  lessonId: string
  status: MasteryState
  completedAt?: number
  lastVisitedAt: number
  confidence?: ConfidenceLevel
}

export interface QuestionAttempt {
  questionId: string
  correct: boolean
  attemptedAt: number
  quizSessionId: string
}

export interface FlashcardRecord {
  cardId: string
  timesSeen: number
  timesCorrect: number
  lastSeenAt: number
  nextDueAt: number
}

export interface RevisionItem {
  topic: string
  learningAreaId: string
  dueAt: number
  reason: 'low-confidence' | 'quiz-miss' | 'scheduled'
}

/**
 * Transparent 0-100 weakness score per learning area. Incorrect quiz answers
 * and "Need Revision" confidence ratings push it up; correct answers and
 * confident ratings bring it down. A small time-decay is added at read time
 * (see lib/progress.ts) rather than stored, so it never goes stale.
 */
export interface TopicWeakness {
  areaId: string
  score: number
  lastUpdatedAt: number
  reason: RevisionItem['reason']
}

export interface Achievement {
  id: string
  title: string
  description: string
  unlockedAt?: number
}

export interface WorkshopModelProgress {
  modelId: string
  bestIdAccuracy?: number
  timesOpened: number
}
