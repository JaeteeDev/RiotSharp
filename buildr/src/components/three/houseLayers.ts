// Plain constant/type data describing the house model's layers, kept in a
// file with no three.js/R3F imports so pages that only need the layer list
// (e.g. for chip UI) don't pull the 3D engine into their bundle chunk.
export type HouseLayerId = 'foundations' | 'floor' | 'walls' | 'openings' | 'ceiling' | 'roof' | 'eaves'

export const HOUSE_LAYERS: { id: HouseLayerId; label: string; order: number }[] = [
  { id: 'foundations', label: 'Foundations', order: 0 },
  { id: 'floor', label: 'Floor', order: 1 },
  { id: 'walls', label: 'Walls', order: 2 },
  { id: 'openings', label: 'Openings', order: 3 },
  { id: 'ceiling', label: 'Ceiling', order: 4 },
  { id: 'roof', label: 'Roof', order: 5 },
  { id: 'eaves', label: 'Eaves', order: 6 },
]
