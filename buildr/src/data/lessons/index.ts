import type { Lesson } from '../../types'
import { flagshipLessons } from './flagship'
import { wallFramingLessons } from './wallFraming'
import { outlineLessons } from './outlines'

export const lessons: Lesson[] = [...flagshipLessons, ...wallFramingLessons, ...outlineLessons]
export const lessonById = (id: string) => lessons.find((l) => l.id === id)
export const lessonsForLearningArea = (areaId: string) => lessons.filter((l) => l.learningAreaId === areaId).sort((a, b) => a.order - b.order)
export const isFlagshipLesson = (id: string) => flagshipLessons.some((l) => l.id === id)
