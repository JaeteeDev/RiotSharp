import type { LearningModule } from '../types'

// Modules group a run of lessons within one learning area. Most learning
// areas don't have an explicit module yet (see lib/progress.ts, which
// synthesises a single default module wrapping their lessons) — this file
// only needs entries for areas that have been broken into real modules.
export const modules: LearningModule[] = [
  {
    id: 'module-wall-frame-fundamentals',
    learningAreaId: 'wall-framing',
    order: 1,
    title: 'Wall Frame Fundamentals',
    description:
      'Every core wall-framing concept from first principles to common mistakes — eleven lessons covering plates, studs, openings, lintels, noggings, set-out, squaring, load path and revision.',
  },
]

export const modulesForLearningArea = (areaId: string) =>
  modules.filter((m) => m.learningAreaId === areaId).sort((a, b) => a.order - b.order)

export const moduleById = (id: string) => modules.find((m) => m.id === id)
