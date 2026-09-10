import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ConfidenceLevel,
  FlashcardRecord,
  LearningProgress,
  MasteryState,
  QuestionAttempt,
  TopicWeakness,
} from '../types'
import { nextWeaknessOnConfidence, nextWeaknessOnQuiz } from '../lib/progress'

export interface Settings {
  animations: boolean
  reducedMotion: boolean
  modelQuality: 'standard' | 'high'
  uiScale: 'compact' | 'comfortable' | 'spacious'
  sidebarCollapsed: boolean
}

const defaultSettings: Settings = {
  animations: true,
  reducedMotion: false,
  modelQuality: 'high',
  uiScale: 'comfortable',
  sidebarCollapsed: false,
}

interface AppState {
  onboardingComplete: boolean
  lastVisitedPath: string
  lessonProgress: Record<string, LearningProgress>
  questionAttempts: QuestionAttempt[]
  flashcardRecords: Record<string, FlashcardRecord>
  settings: Settings
  unlockedAchievementIds: string[]
  streakDays: number
  lastActiveDay: string | null
  competencyRecorded: Record<string, boolean>
  topicWeakness: Record<string, TopicWeakness>

  completeOnboarding: () => void
  setLastVisitedPath: (path: string) => void
  setLessonStatus: (lessonId: string, status: MasteryState) => void
  setLessonConfidence: (lessonId: string, confidence: ConfidenceLevel) => void
  visitLesson: (lessonId: string) => void
  recordQuestionAttempt: (attempt: QuestionAttempt) => void
  recordFlashcardReview: (cardId: string, correct: boolean) => void
  unlockAchievement: (id: string) => void
  updateSettings: (partial: Partial<Settings>) => void
  resetTrainingData: () => void
  touchStreak: () => void
  setCompetencyRecorded: (unitCode: string, recorded: boolean) => void
  recordQuizWeaknessSignal: (areaId: string, correct: boolean) => void
  recordConfidenceWeaknessSignal: (areaId: string, confidence: ConfidenceLevel) => void
  importState: (data: Partial<AppState>) => void
}

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      onboardingComplete: false,
      lastVisitedPath: '/',
      lessonProgress: {},
      questionAttempts: [],
      flashcardRecords: {},
      settings: defaultSettings,
      unlockedAchievementIds: [],
      streakDays: 0,
      lastActiveDay: null,
      competencyRecorded: {},
      topicWeakness: {},

      completeOnboarding: () => set({ onboardingComplete: true }),
      setLastVisitedPath: (path) => set({ lastVisitedPath: path }),

      setLessonStatus: (lessonId, status) =>
        set((s) => ({
          lessonProgress: {
            ...s.lessonProgress,
            [lessonId]: {
              lessonId,
              status,
              lastVisitedAt: Date.now(),
              completedAt: status === 'strong' || status === 'practising' || status === 'revision-due'
                ? s.lessonProgress[lessonId]?.completedAt ?? Date.now()
                : s.lessonProgress[lessonId]?.completedAt,
              confidence: s.lessonProgress[lessonId]?.confidence,
            },
          },
        })),

      setLessonConfidence: (lessonId, confidence) =>
        set((s) => {
          const existing = s.lessonProgress[lessonId]
          const derivedStatus: MasteryState =
            confidence === 'confident' ? 'strong' : confidence === 'getting-there' ? 'practising' : 'learning'
          return {
            lessonProgress: {
              ...s.lessonProgress,
              [lessonId]: {
                lessonId,
                status: existing?.status && existing.status !== 'not-started' ? existing.status : derivedStatus,
                lastVisitedAt: Date.now(),
                completedAt: existing?.completedAt ?? Date.now(),
                confidence,
              },
            },
          }
        }),

      visitLesson: (lessonId) =>
        set((s) => {
          const existing = s.lessonProgress[lessonId]
          if (existing) {
            return { lessonProgress: { ...s.lessonProgress, [lessonId]: { ...existing, lastVisitedAt: Date.now() } } }
          }
          return {
            lessonProgress: {
              ...s.lessonProgress,
              [lessonId]: { lessonId, status: 'learning', lastVisitedAt: Date.now() },
            },
          }
        }),

      recordQuestionAttempt: (attempt) => set((s) => ({ questionAttempts: [...s.questionAttempts, attempt] })),

      recordFlashcardReview: (cardId, correct) =>
        set((s) => {
          const existing = s.flashcardRecords[cardId]
          const timesSeen = (existing?.timesSeen ?? 0) + 1
          const timesCorrect = (existing?.timesCorrect ?? 0) + (correct ? 1 : 0)
          const intervalDays = correct ? Math.min(14, ((existing?.timesCorrect ?? 0) + 1) * 2) : 1
          return {
            flashcardRecords: {
              ...s.flashcardRecords,
              [cardId]: {
                cardId,
                timesSeen,
                timesCorrect,
                lastSeenAt: Date.now(),
                nextDueAt: Date.now() + intervalDays * 24 * 60 * 60 * 1000,
              },
            },
          }
        }),

      unlockAchievement: (id) =>
        set((s) => (s.unlockedAchievementIds.includes(id) ? s : { unlockedAchievementIds: [...s.unlockedAchievementIds, id] })),

      updateSettings: (partial) => set((s) => ({ settings: { ...s.settings, ...partial } })),

      touchStreak: () =>
        set((s) => {
          const today = todayKey()
          if (s.lastActiveDay === today) return {}
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
          const continued = s.lastActiveDay === yesterday
          return { streakDays: continued ? s.streakDays + 1 : 1, lastActiveDay: today }
        }),

      setCompetencyRecorded: (unitCode, recorded) =>
        set((s) => ({ competencyRecorded: { ...s.competencyRecorded, [unitCode]: recorded } })),

      recordQuizWeaknessSignal: (areaId, correct) =>
        set((s) => ({
          topicWeakness: { ...s.topicWeakness, [areaId]: { areaId, ...nextWeaknessOnQuiz(s.topicWeakness[areaId], correct) } },
        })),

      recordConfidenceWeaknessSignal: (areaId, confidence) =>
        set((s) => ({
          topicWeakness: { ...s.topicWeakness, [areaId]: { areaId, ...nextWeaknessOnConfidence(s.topicWeakness[areaId], confidence) } },
        })),

      importState: (data) => set((s) => ({ ...s, ...data })),

      resetTrainingData: () =>
        set({
          onboardingComplete: get().onboardingComplete,
          lastVisitedPath: '/',
          lessonProgress: {},
          questionAttempts: [],
          flashcardRecords: {},
          settings: defaultSettings,
          unlockedAchievementIds: [],
          streakDays: 0,
          lastActiveDay: null,
          competencyRecorded: {},
          topicWeakness: {},
        }),
    }),
    { name: 'buildr-training-data', version: 2 },
  ),
)
