import type { Unit } from '../types'

// ---------------------------------------------------------------------------
// SOURCE NOTE (read this before editing)
//
// CPC30220 Certificate III in Carpentry is delivered under the CPC
// Construction, Plumbing and Services Training Package. The qualification
// requires 34 units of competency (27 core, 7 elective) — this structure was
// confirmed from public training.gov.au / RTO course-listing sources.
//
// The unit codes and titles below were compiled from publicly available
// secondary sources (registered training organisation course pages that
// reference training.gov.au) because this environment could not reach
// training.gov.au directly to pull the primary register entry. They are
// believed accurate but have NOT been cross-checked against the live
// national register. Codes/titles/release numbers change between releases.
//
// -> Always verify the current unit codes, titles, elements, performance
//    criteria and release number directly at https://training.gov.au and
//    against TAFE Queensland's current CPC30220 delivery before relying on
//    this list for enrolment, RPL or assessment purposes.
// ---------------------------------------------------------------------------
export const UNIT_SOURCE_NOTE =
  'Compiled from public RTO course listings referencing training.gov.au. Verify current codes, titles and release details directly at training.gov.au before relying on this for assessment purposes.'

export const units: Unit[] = [
  { code: 'CPCCWHS1001', name: 'Prepare to work safely in the construction industry', type: 'core', learningAreaId: 'trade-foundations', summary: 'The White Card unit — site hazards, PPE and your WHS obligations before you set foot on site.', release: 'CPC Training Package' },
  { code: 'CPCCOM1012', name: 'Work effectively and sustainably in the construction industry', type: 'core', learningAreaId: 'trade-foundations', summary: 'Working within industry structures, employment conditions and sustainable work practices.', release: 'CPC Training Package' },
  { code: 'CPCCOM1014', name: 'Conduct workplace communication', type: 'core', learningAreaId: 'trade-foundations', summary: 'Site communication — instructions, reporting and workplace documentation.', release: 'CPC Training Package' },
  { code: 'CPCCCA2002', name: 'Use carpentry tools and equipment', type: 'core', learningAreaId: 'tools-materials', summary: 'Safe selection, use, care and maintenance of hand and power tools used in carpentry.', release: 'CPC Training Package' },
  { code: 'CPCCOM1015', name: 'Carry out measurements and calculations', type: 'core', learningAreaId: 'measurement-calculations', summary: 'Measurement, unit conversion and the calculations that underpin every carpentry task.', release: 'CPC Training Package' },
  { code: 'CPCCCA3002', name: 'Carry out setting out', type: 'core', learningAreaId: 'set-out-levelling', summary: 'Transferring drawing information to the site accurately — lines, levels and profiles.', release: 'CPC Training Package' },
  { code: 'CPCCCM2006', name: 'Apply basic levelling procedures', type: 'core', learningAreaId: 'set-out-levelling', summary: 'Levelling instruments and procedures used to establish and transfer levels on site.', release: 'CPC Training Package' },
  { code: 'CPCCCA3003', name: 'Install flooring systems', type: 'core', learningAreaId: 'floor-systems', summary: 'Bearers, joists and flooring materials for timber floor systems.', release: 'CPC Training Package' },
  { code: 'CPCCCA3004', name: 'Construct and erect wall frames', type: 'core', learningAreaId: 'wall-framing', summary: 'Setting out, fabricating and erecting timber-framed walls, including openings.', release: 'CPC Training Package' },
  { code: 'CPCCCA3005', name: 'Construct ceiling frames', type: 'core', learningAreaId: 'ceiling-framing', summary: 'Ceiling joist layout, strapping and support for linings above wall frames.', release: 'CPC Training Package' },
  { code: 'CPCCCA3006', name: 'Erect roof trusses', type: 'core', learningAreaId: 'roof-trusses', summary: 'Handling, positioning, bracing and fixing prefabricated roof trusses safely.', release: 'CPC Training Package' },
  { code: 'CPCCCA3007', name: 'Construct pitched roofs', type: 'core', learningAreaId: 'pitched-roofs', summary: 'Conventional (cut) roof construction — rafters, ridges, hips and valleys.', release: 'CPC Training Package' },
  { code: 'CPCCCA3008', name: 'Construct eaves', type: 'core', learningAreaId: 'eaves', summary: 'Fascia, barge boards and eaves lining where roof meets wall.', release: 'CPC Training Package' },
  { code: 'CPCCCA3010', name: 'Install windows and doors', type: 'core', learningAreaId: 'windows-doors', summary: 'Installing window and door units square, plumb and weathertight.', release: 'CPC Training Package' },
  { code: 'CPCCCA3017', name: 'Install exterior cladding', type: 'core', learningAreaId: 'external-cladding', summary: 'External cladding systems fixed over the completed frame.', release: 'CPC Training Package' },
  { code: 'CPCCCA3024', name: 'Install lining, panelling and moulding', type: 'core', learningAreaId: 'linings-mouldings', summary: 'Internal linings and finishing mouldings — architraves, skirtings and cornice.', release: 'CPC Training Package' },
  { code: 'CPCCCA3016', name: 'Construct, assemble and install timber external stairs', type: 'core', learningAreaId: 'stairs', summary: 'Stair geometry and timber stair construction to a compliant design.', release: 'CPC Training Package' },
  { code: 'CPCCCA3028', name: 'Erect and dismantle formwork for footings and slabs on ground', type: 'core', learningAreaId: 'concrete-formwork', summary: 'Formwork construction for simple footings and ground slabs.', release: 'CPC Training Package' },
  { code: 'CPCCCO2013', name: 'Carry out concreting to simple forms', type: 'core', learningAreaId: 'concrete-formwork', summary: 'Placing, compacting and finishing concrete to simple formwork.', release: 'CPC Training Package' },
  { code: 'CPCCCA3001', name: 'Carry out general demolition of minor building structures', type: 'core', learningAreaId: 'demolition', summary: 'Planning and carrying out safe demolition of minor structures.', release: 'CPC Training Package' },
  { code: 'CPCCCM2008', name: 'Erect and dismantle restricted height scaffolding', type: 'core', learningAreaId: 'scaffolding-heights', summary: 'Safe erection and dismantling of restricted-height scaffold systems.', release: 'CPC Training Package' },
  { code: 'CPCCCM2012', name: 'Work safely at heights', type: 'core', learningAreaId: 'scaffolding-heights', summary: 'Fall risk controls and safe systems of work when operating above ground level.', release: 'CPC Training Package' },
  { code: 'CPCCWHS2001', name: 'Apply WHS requirements, policies and procedures in the construction industry', type: 'core', learningAreaId: 'whs-site-practice', summary: 'Applying WHS legislation, site procedures and hazard controls day-to-day.', release: 'CPC Training Package' },
  { code: 'CPCCJN3003', name: 'Manufacture components for doors, windows and frames', type: 'elective', learningAreaId: 'windows-doors', summary: 'Elective — joinery-based manufacture of door, window and frame components.', release: 'CPC Training Package · elective example' },
  { code: 'CPCCJN3004', name: 'Manufacture and assemble joinery components', type: 'elective', learningAreaId: 'linings-mouldings', summary: 'Elective — manufacture and assembly of joinery components.', release: 'CPC Training Package · elective example' },
]

export const unitByCode = (code: string) => units.find((u) => u.code === code)
export const unitsForLearningArea = (learningAreaId: string) => units.filter((u) => u.learningAreaId === learningAreaId)
