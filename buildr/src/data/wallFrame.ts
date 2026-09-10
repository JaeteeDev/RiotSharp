// ---------------------------------------------------------------------------
// Workshop — Wall Frame 01 data model
//
// A single, fully-specified timber wall frame with a door and a window
// opening, used to drive the 3D model, the model tree, the inspector and
// the component-identification exercises. Units are metres (1 unit = 1 m)
// purely for the 3D scene; on-screen dimension labels are shown in mm.
// ---------------------------------------------------------------------------

export type WallComponentCategory =
  | 'top-plate'
  | 'bottom-plate'
  | 'common-stud'
  | 'end-stud'
  | 'jamb-stud'
  | 'lintel'
  | 'trimmer'
  | 'cripple-stud'
  | 'nogging'

export type WallComponentGroup = 'plates' | 'studs' | 'door-opening' | 'window-opening' | 'noggings'

export interface WallComponentInstance {
  id: string
  name: string
  category: WallComponentCategory
  group: WallComponentGroup
  position: [number, number, number]
  size: [number, number, number]
}

export interface WallComponentInfo {
  label: string
  role: string
  typicalLocation: string
  loadFunction: string
  installConcept: string
  commonMistakes: string
  relatedTermIds: string[]
}

export const WALL_LENGTH = 3.8
export const WALL_HEIGHT = 2.4
const STUD_T = 0.09
const STUD_D = 0.045

export const categoryColor: Record<WallComponentCategory, string> = {
  'top-plate': '#8f6a3c',
  'bottom-plate': '#8f6a3c',
  'common-stud': '#c79f6a',
  'end-stud': '#c79f6a',
  'jamb-stud': '#d8b989',
  lintel: '#e0a15c',
  trimmer: '#d8b989',
  'cripple-stud': '#cdb384',
  nogging: '#b3854e',
}

export const categoryInfo: Record<WallComponentCategory, WallComponentInfo> = {
  'top-plate': {
    label: 'Top Plate',
    role: 'Ties the tops of all studs together and carries the load from the ceiling/roof structure down into the studs.',
    typicalLocation: 'Runs the full length of the wall along the top of every stud.',
    loadFunction: 'Distributes point loads from above (ceiling joists, roof members) across multiple studs rather than concentrating them on one.',
    installConcept: 'Fixed on top of the studs after the frame is assembled flat, often doubled on load-bearing walls to help lap joints between wall sections.',
    commonMistakes: 'Fixing the plate before every stud is checked for plumb — any lean gets locked in permanently once the plate is on.',
    relatedTermIds: ['bottom-plate', 'stud'],
  },
  'bottom-plate': {
    label: 'Bottom Plate',
    role: 'Anchors the base of every stud and transfers the wall\'s load down into the floor structure.',
    typicalLocation: 'Runs the full length of the wall along the bottom, fixed to the floor frame below.',
    loadFunction: 'Spreads the wall\'s vertical load into the floor across its full length, and locates the bottom of every stud.',
    installConcept: 'Set out first — opening positions and stud centres are usually marked directly onto the bottom (and top) plate before assembly.',
    commonMistakes: 'Marking stud centres inconsistently between the top and bottom plate, causing studs to twist out of plane.',
    relatedTermIds: ['top-plate', 'stud'],
  },
  'common-stud': {
    label: 'Common Stud',
    role: 'Forms the main vertical structure of the wall and provides a fixing line for linings and cladding.',
    typicalLocation: 'Evenly spaced along the wall at the design centres (this model uses approximately 600 mm).',
    loadFunction: 'Carries the vertical load from the top plate down to the bottom plate, and resists lateral (wind) loads with the bracing.',
    installConcept: 'Cut to length and fixed between the plates at marked centres — consistent spacing keeps sheet linings landing correctly on the framing.',
    commonMistakes: 'Spacing measured from the previous stud\'s edge instead of a consistent centre-line, letting small errors accumulate along the wall.',
    relatedTermIds: ['stud', 'stud-spacing', 'top-plate', 'bottom-plate'],
  },
  'end-stud': {
    label: 'End Stud',
    role: 'Closes off the end of the wall frame and provides a fixing point where this frame meets another frame or structure.',
    typicalLocation: 'At each end of the wall frame, often built up with an extra stud or packer at a corner.',
    loadFunction: 'Carries the same vertical load path as a common stud, plus ties this frame to whatever it butts up against.',
    installConcept: 'Positioned first when setting out the wall, since every other stud and opening is measured relative to it.',
    commonMistakes: 'Setting out the rest of the wall from the wrong face of the end stud, offsetting every dimension that follows.',
    relatedTermIds: ['end-stud', 'corner-stud', 'stud'],
  },
  'jamb-stud': {
    label: 'Jamb Stud',
    role: 'Forms the side of a door or window opening and carries the lintel\'s load down to the bottom plate.',
    typicalLocation: 'Runs full height immediately beside a door or window opening, in pairs either side of the opening.',
    loadFunction: 'Directly supports the end of the lintel, carrying the load from above the opening down past the opening to the floor.',
    installConcept: 'Positioned and fixed before the lintel — the lintel sits on top of the jamb studs, so their position fixes the opening width.',
    commonMistakes: 'Setting the jamb studs to the finished opening size instead of the rough opening size required by the door/window unit and its frame.',
    relatedTermIds: ['jamb-stud', 'lintel', 'trimmer', 'cripple-stud'],
  },
  lintel: {
    label: 'Lintel',
    role: 'Spans the door or window opening and transfers the load from above into the jamb studs either side.',
    typicalLocation: 'Directly above a door or window opening, resting on the jamb studs.',
    loadFunction: 'Carries the load that would otherwise have been carried by a continuous stud run, redirecting it around the opening.',
    installConcept: 'Sized for the load above it and the span of the opening — never assumed on site, always taken from the structural drawing.',
    commonMistakes: 'Using an undersized lintel because "it looks fine" rather than confirming size against the drawing/engineering for the actual load above.',
    relatedTermIds: ['lintel', 'jamb-stud', 'cripple-stud'],
  },
  trimmer: {
    label: 'Trimmer (Sill)',
    role: 'Forms the sill of a window opening and provides a fixing line for the bottom of the window unit.',
    typicalLocation: 'Below a window opening, fixed between the jamb studs.',
    loadFunction: 'Not usually a primary structural load path — mainly transfers minor loads into the cripple studs beneath it.',
    installConcept: 'Positioned at the window\'s sill height, supported by cripple studs continuing down to the bottom plate.',
    commonMistakes: 'Fixing the trimmer without support directly beneath it, leaving it to sag under the weight of the window unit.',
    relatedTermIds: ['trimmer', 'jamb-stud', 'cripple-stud'],
  },
  'cripple-stud': {
    label: 'Cripple Stud',
    role: 'Continues the regular stud layout above a lintel or below a sill trimmer, even though it doesn\'t run full height.',
    typicalLocation: 'Between the top plate and a lintel, or between a sill trimmer and the bottom plate.',
    loadFunction: 'Carries a share of the plate load down to the lintel or trimmer, and gives sheet linings a fixing point at the correct centres.',
    installConcept: 'Cut to fit the shortened space exactly — length depends on the lintel or trimmer position, not a standard length.',
    commonMistakes: 'Leaving cripple studs out above short lintels "because it\'s a small gap" — sheet linings then have no fixing point there.',
    relatedTermIds: ['cripple-stud', 'lintel', 'trimmer'],
  },
  nogging: {
    label: 'Nogging',
    role: 'Braces the studs against twisting, gives a horizontal fixing line for sheet joins, and helps block fire spread within the wall.',
    typicalLocation: 'Fixed horizontally between studs, commonly at around mid-height, sometimes staggered.',
    loadFunction: 'Not a primary vertical load path — its job is lateral restraint of the studs and fire/fixing performance.',
    installConcept: 'Cut to fit snugly between each pair of studs and skew-nailed or fixed with framing connectors.',
    commonMistakes: 'Fixing noggings at an inconsistent height along the wall, so sheet joins don\'t land on them where needed.',
    relatedTermIds: ['nogging', 'stud'],
  },
}

const commonStudXs = [0.55, 2.3]
const doorX = [1.0, 1.85] as const
const windowX = [2.75, 3.35] as const
const windowSillY = 0.9
const openingHeadY = 2.05

export const wallComponents: WallComponentInstance[] = [
  { id: 'bottom-plate-1', name: 'Bottom Plate', category: 'bottom-plate', group: 'plates', position: [WALL_LENGTH / 2, 0.045, 0], size: [WALL_LENGTH, 0.09, STUD_D * 1.6] },
  { id: 'top-plate-1', name: 'Top Plate', category: 'top-plate', group: 'plates', position: [WALL_LENGTH / 2, WALL_HEIGHT - 0.045, 0], size: [WALL_LENGTH, 0.09, STUD_D * 1.6] },

  { id: 'end-stud-left', name: 'End Stud (Left)', category: 'end-stud', group: 'studs', position: [0.05, WALL_HEIGHT / 2, 0], size: [STUD_T, WALL_HEIGHT - 0.18, STUD_D] },
  { id: 'end-stud-right', name: 'End Stud (Right)', category: 'end-stud', group: 'studs', position: [WALL_LENGTH - 0.05, WALL_HEIGHT / 2, 0], size: [STUD_T, WALL_HEIGHT - 0.18, STUD_D] },

  { id: 'common-stud-1', name: 'Common Stud 01', category: 'common-stud', group: 'studs', position: [commonStudXs[0], WALL_HEIGHT / 2, 0], size: [STUD_T, WALL_HEIGHT - 0.18, STUD_D] },
  { id: 'common-stud-2', name: 'Common Stud 02', category: 'common-stud', group: 'studs', position: [commonStudXs[1], WALL_HEIGHT / 2, 0], size: [STUD_T, WALL_HEIGHT - 0.18, STUD_D] },

  // Door opening
  { id: 'jamb-door-left', name: 'Jamb Stud — Door (Left)', category: 'jamb-stud', group: 'door-opening', position: [doorX[0], WALL_HEIGHT / 2, 0], size: [STUD_T, WALL_HEIGHT - 0.18, STUD_D] },
  { id: 'jamb-door-right', name: 'Jamb Stud — Door (Right)', category: 'jamb-stud', group: 'door-opening', position: [doorX[1], WALL_HEIGHT / 2, 0], size: [STUD_T, WALL_HEIGHT - 0.18, STUD_D] },
  { id: 'lintel-door', name: 'Lintel — Door', category: 'lintel', group: 'door-opening', position: [(doorX[0] + doorX[1]) / 2, openingHeadY + 0.075, 0], size: [doorX[1] - doorX[0] + STUD_T, 0.15, STUD_D] },
  { id: 'cripple-door', name: 'Cripple Stud — Door', category: 'cripple-stud', group: 'door-opening', position: [(doorX[0] + doorX[1]) / 2, openingHeadY + 0.15 + (WALL_HEIGHT - 0.09 - (openingHeadY + 0.15)) / 2, 0], size: [STUD_T, WALL_HEIGHT - 0.09 - (openingHeadY + 0.15), STUD_D] },

  // Window opening
  { id: 'jamb-window-left', name: 'Jamb Stud — Window (Left)', category: 'jamb-stud', group: 'window-opening', position: [windowX[0], WALL_HEIGHT / 2, 0], size: [STUD_T, WALL_HEIGHT - 0.18, STUD_D] },
  { id: 'jamb-window-right', name: 'Jamb Stud — Window (Right)', category: 'jamb-stud', group: 'window-opening', position: [windowX[1], WALL_HEIGHT / 2, 0], size: [STUD_T, WALL_HEIGHT - 0.18, STUD_D] },
  { id: 'lintel-window', name: 'Lintel — Window', category: 'lintel', group: 'window-opening', position: [(windowX[0] + windowX[1]) / 2, openingHeadY + 0.075, 0], size: [windowX[1] - windowX[0] + STUD_T, 0.15, STUD_D] },
  { id: 'trimmer-window', name: 'Trimmer — Window Sill', category: 'trimmer', group: 'window-opening', position: [(windowX[0] + windowX[1]) / 2, windowSillY, 0], size: [windowX[1] - windowX[0] + STUD_T, 0.09, STUD_D] },
  { id: 'cripple-window-top', name: 'Cripple Stud — Window (Above)', category: 'cripple-stud', group: 'window-opening', position: [(windowX[0] + windowX[1]) / 2, openingHeadY + 0.15 + (WALL_HEIGHT - 0.09 - (openingHeadY + 0.15)) / 2, 0], size: [STUD_T, WALL_HEIGHT - 0.09 - (openingHeadY + 0.15), STUD_D] },
  { id: 'cripple-window-bottom', name: 'Cripple Stud — Window (Below)', category: 'cripple-stud', group: 'window-opening', position: [(windowX[0] + windowX[1]) / 2, windowSillY / 2 + 0.045, 0], size: [STUD_T, windowSillY - 0.09, STUD_D] },

  // Noggings — one row at mid height between each pair of adjacent verticals (skipping across openings)
  { id: 'nogging-1', name: 'Nogging 01', category: 'nogging', group: 'noggings', position: [(0.05 + commonStudXs[0]) / 2, 1.2, 0], size: [commonStudXs[0] - 0.05 - STUD_T, 0.07, STUD_D * 0.8] },
  { id: 'nogging-2', name: 'Nogging 02', category: 'nogging', group: 'noggings', position: [(commonStudXs[0] + doorX[0]) / 2, 1.2, 0], size: [doorX[0] - commonStudXs[0] - STUD_T, 0.07, STUD_D * 0.8] },
  { id: 'nogging-3', name: 'Nogging 03', category: 'nogging', group: 'noggings', position: [(doorX[1] + commonStudXs[1]) / 2, 1.2, 0], size: [commonStudXs[1] - doorX[1] - STUD_T, 0.07, STUD_D * 0.8] },
  { id: 'nogging-4', name: 'Nogging 04', category: 'nogging', group: 'noggings', position: [(commonStudXs[1] + windowX[0]) / 2, 1.2, 0], size: [windowX[0] - commonStudXs[1] - STUD_T, 0.07, STUD_D * 0.8] },
  { id: 'nogging-5', name: 'Nogging 05', category: 'nogging', group: 'noggings', position: [(windowX[1] + (WALL_LENGTH - 0.05)) / 2, 1.2, 0], size: [WALL_LENGTH - 0.05 - windowX[1] - STUD_T, 0.07, STUD_D * 0.8] },
]

export const wallComponentById = (id: string) => wallComponents.find((c) => c.id === id)

export const wallGroupLabels: Record<WallComponentGroup, string> = {
  plates: 'Plates',
  studs: 'Studs',
  'door-opening': 'Door Opening',
  'window-opening': 'Window Opening',
  noggings: 'Noggings',
}

export interface MistakeScenario {
  componentId: string
  issue: string
  whyItMatters: string
  positionOverride?: [number, number, number]
  sizeOverride?: [number, number, number]
}

// "Find the Mistake" mode — four components are deliberately moved/resized
// away from their correct position to represent common framing errors.
export const mistakeScenarios: MistakeScenario[] = [
  {
    componentId: 'nogging-3',
    issue: 'This nogging is fixed at an inconsistent height compared to the others.',
    whyItMatters: 'Sheet linings are fixed assuming noggings sit in a consistent line — one out of line means a missed fixing point and a weak joint in the lining.',
    positionOverride: [(doorX[1] + commonStudXs[1]) / 2, 1.62, 0],
  },
  {
    componentId: 'cripple-window-bottom',
    issue: 'This cripple stud stops short of the sill trimmer, leaving a gap.',
    whyItMatters: 'The trimmer relies on the cripple studs beneath it for support — a gap here leaves the window sill unsupported and able to sag under load.',
    sizeOverride: [STUD_T, (windowSillY - 0.09) * 0.55, STUD_D],
  },
  {
    componentId: 'common-stud-2',
    issue: 'This stud is spaced irregularly, well off the standard layout.',
    whyItMatters: 'Irregular spacing breaks the fixing centres sheet linings and cladding rely on, and can affect the wall\'s bracing capacity.',
    positionOverride: [commonStudXs[1] + 0.22, WALL_HEIGHT / 2, 0],
  },
  {
    componentId: 'lintel-door',
    issue: 'This lintel is too short to bear fully on the right-hand jamb stud.',
    whyItMatters: 'A lintel that isn\'t fully supported on both jamb studs can\'t reliably transfer the load from above down into the framing either side of the opening.',
    sizeOverride: [doorX[1] - doorX[0] - 0.1, 0.15, STUD_D],
  },
]

export const buildSequenceSteps = [
  { id: 'plates', label: 'Plates', groups: ['plates'] as WallComponentGroup[], description: 'Top and bottom plates are set out and cut to length first — every other measurement in the wall references them.' },
  { id: 'set-out', label: 'Set-Out', groups: ['plates'] as WallComponentGroup[], description: 'Opening positions and stud centres are marked onto both plates together, so they land in exactly the same place top and bottom.' },
  { id: 'studs', label: 'Studs', groups: ['plates', 'studs'] as WallComponentGroup[], description: 'End and common studs are fixed between the plates at the marked centres.' },
  { id: 'openings', label: 'Openings', groups: ['plates', 'studs', 'door-opening', 'window-opening'] as WallComponentGroup[], description: 'Jamb studs, lintels, trimmers and cripple studs are added to frame the door and window openings.' },
  { id: 'noggings', label: 'Noggings', groups: ['plates', 'studs', 'door-opening', 'window-opening', 'noggings'] as WallComponentGroup[], description: 'Noggings are fixed between the studs to brace the frame and provide fixing lines for linings.' },
  { id: 'square', label: 'Square', groups: ['plates', 'studs', 'door-opening', 'window-opening', 'noggings'] as WallComponentGroup[], description: 'The completed frame is squared using a diagonal check before it is braced and stood up.' },
]
