import type { Flashcard } from '../types'
import { glossary } from './glossary'

// Auto-derive a solid flashcard deck from the glossary, then layer a few
// hand-written calculation/concept cards on top.
const glossaryCards: Flashcard[] = glossary.map((g) => ({
  id: `fc-${g.id}`,
  front: g.term.toUpperCase(),
  back: g.definition,
  learningAreaId: g.learningAreaId ?? 'trade-foundations',
  relatedTermIds: g.relatedTermIds,
}))

const conceptCards: Flashcard[] = [
  { id: 'fc-345-rule', front: '3-4-5 RULE', back: 'A right-angled triangle with sides in the ratio 3:4:5 (in any consistent unit) always contains a true 90° angle — used on site to check or set out square corners without an engineer\'s square.', learningAreaId: 'set-out-levelling', relatedTermIds: ['diagonal-check', 'square-term'] },
  { id: 'fc-pitch-formula', front: 'HOW IS ROOF PITCH FOUND?', back: 'Pitch (°) = arctan(Rise ÷ Run). Rise and run must be measured over the same horizontal reference for the angle to be correct.', learningAreaId: 'pitched-roofs', relatedTermIds: ['pitch', 'rise', 'run'] },
  { id: 'fc-stud-ctrs', front: 'COMMON AU STUD CENTRES', back: 'Commonly 450 mm or 600 mm centres in Australian residential framing — the exact spacing always comes from the design/span tables for the wall and lining/cladding used, not assumed.', learningAreaId: 'wall-framing', relatedTermIds: ['stud-spacing'] },
  { id: 'fc-diagonal-formula', front: 'DIAGONAL OF A RECTANGLE', back: 'Diagonal = √(length² + width²) — Pythagoras\' theorem. Used constantly on site to check squareness of floors, decks and wall frames.', learningAreaId: 'measurement-calculations', relatedTermIds: ['diagonal-check'] },
]

export const flashcards: Flashcard[] = [...glossaryCards, ...conceptCards]
export const flashcardById = (id: string) => flashcards.find((f) => f.id === id)
