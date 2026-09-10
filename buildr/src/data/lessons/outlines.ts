import type { Lesson } from '../../types'
import { learningAreas } from '../learningAreas'
import { unitsForLearningArea } from '../units'
import { flagshipLessons } from './flagship'

const flagshipAreaIds = new Set(flagshipLessons.map((l) => l.learningAreaId))

// Every learning area not yet given a full flagship lesson still gets a
// properly structured outline lesson, so every navigation path in the app
// works and shows real, specific content — never a bare "coming soon" page.
export const outlineLessons: Lesson[] = learningAreas
  .filter((area) => !flagshipAreaIds.has(area.id))
  .map((area) => {
    const areaUnits = unitsForLearningArea(area.id)
    return {
      id: `lesson-outline-${area.id}`,
      unitCode: areaUnits[0]?.code,
      learningAreaId: area.id,
      order: 1,
      title: area.title,
      subtitle: 'Course outline — full interactive lesson in development',
      estMinutes: 10,
      objectives: [
        `Understand the scope of ${area.title.toLowerCase()} within CPC30220`,
        'Identify the units of competency this learning area maps to',
        'Preview the key terminology and concepts covered here',
      ],
      blocks: [
        { kind: 'text', body: area.description },
        { kind: 'callout', tone: 'info', title: 'This is a course outline', body: 'A full interactive lesson for this learning area is still being built. The structure, unit mapping and glossary links below are complete and functional — richer lesson content will fill in over time.' },
        ...(areaUnits.length
          ? [{ kind: 'list' as const, heading: 'Units of competency covered here', items: areaUnits.map((u) => `${u.code} — ${u.name}`) }]
          : []),
      ],
      relatedTermIds: [],
      quizIds: [],
    } satisfies Lesson
  })
