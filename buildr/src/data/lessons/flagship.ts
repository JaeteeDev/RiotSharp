import type { Lesson } from '../../types'

export const flagshipLessons: Lesson[] = [
  // A — Tools & Equipment ------------------------------------------------
  {
    id: 'lesson-tools-equipment',
    unitCode: 'CPCCCA2002',
    learningAreaId: 'tools-materials',
    order: 1,
    title: 'Carpentry Tools & Equipment',
    subtitle: 'Know your kit before you pick it up',
    estMinutes: 12,
    objectives: [
      'Identify common hand and power tools used in residential carpentry',
      'Match each tool to its primary purpose',
      'Recognise the main safety principle for each tool category',
    ],
    blocks: [
      { kind: 'text', heading: 'Why tool knowledge comes first', body: 'Every later skill in this course — set-out, framing, roofing — assumes you already know which tool to reach for and how to use it safely. Getting this foundation solid now makes everything downstream faster and safer.' },
      { kind: 'terms', terms: [
        { term: 'Combination Square', definition: 'Marks and checks 90°/45° angles and depths over a short length.' },
        { term: 'Framing (Steel) Square', definition: 'Large L-shaped square used for marking right angles and roof/stair geometry.' },
        { term: 'Spirit Level', definition: 'Checks level (horizontal) and plumb (vertical) using a bubble vial.' },
        { term: 'Chalk Line', definition: 'Snaps a long, straight temporary line across a surface.' },
      ] },
      { kind: 'callout', tone: 'safety', title: 'PPE is not optional', body: 'Hearing and eye protection are the minimum for almost every powered tool used in carpentry. Check the specific tool\'s requirements before you switch it on.' },
      { kind: 'mini-question', question: {
        id: 'mq-tools-1', prompt: 'Which tool would you reach for to confirm a stud is standing perfectly vertical?', options: ['Chalk line', 'Spirit level', 'Combination square'], correctIndex: 1,
        explanation: 'A spirit level has a plumb vial specifically for checking vertical alignment over the height of a stud.',
      } },
      { kind: 'mistakes', items: [
        { mistake: 'Using a combination square to check plumb over a long stud', why: 'Its short body cannot reliably confirm vertical alignment over a long distance — small errors compound.' },
        { mistake: 'Skipping hearing protection for "quick" power tool cuts', why: 'Hearing damage accumulates with repeated short exposures, not just long ones.' },
      ] },
      { kind: 'text', heading: 'Where this goes next', body: 'Once you can identify and safely use these core tools, the Workshop lets you practise selecting the right tool inside a real framing scenario, and the Tool Library (Reference) gives you a full searchable catalogue.' },
    ],
    relatedTermIds: ['combination-square', 'framing-square', 'spirit-level', 'chalk-line'],
    quizIds: ['q-tools-1', 'q-tools-2', 'q-tools-3'],
  },

  // B — Measurement & Calculations ---------------------------------------
  {
    id: 'lesson-measurement-calculations',
    unitCode: 'CPCCOM1015',
    learningAreaId: 'measurement-calculations',
    order: 1,
    title: 'Measurements & Calculations',
    subtitle: 'The arithmetic behind every cut list',
    estMinutes: 15,
    objectives: [
      'Convert confidently between metres and millimetres',
      'Calculate area and simple stud/space counts along a length',
      'Understand why metric, not imperial, is used throughout Australian construction',
    ],
    blocks: [
      { kind: 'text', body: 'Australian carpentry works in millimetres for anything on the tape measure, and metres for larger site dimensions. Getting comfortable converting between the two — instantly, without a calculator — is one of the highest-leverage skills in this whole course.' },
      { kind: 'list', heading: 'Core conversions', items: ['1 m = 1000 mm', '1 m = 100 cm', '1 cm = 10 mm'] },
      { kind: 'worked-example', title: 'Stud spaces along a wall', given: ['Wall length = 4200 mm', 'Stud spacing = 600 mm centres'], steps: [
        { label: 'Divide the length by the spacing', detail: '4200 ÷ 600 = 7' },
        { label: 'Interpret the result', detail: 'Seven full 600 mm spaces fit along the wall.' },
      ], result: '7 stud spaces (8 stud centre-lines, before adding end/jamb studs for any openings).' },
      { kind: 'worked-example', title: 'Area of a floor frame', given: ['Length = 3.6 m', 'Width = 2.7 m'], steps: [
        { label: 'Convert to the same unit', detail: 'Already in metres.' },
        { label: 'Multiply length × width', detail: '3.6 × 2.7 = 9.72' },
      ], result: '9.72 m²' },
      { kind: 'callout', tone: 'info', title: 'Why millimetres on the tape', body: 'Working entirely in millimetres on site avoids decimal-point errors (mixing metres and centimetres mid-calculation is one of the most common on-site mistakes).' },
      { kind: 'mini-question', question: {
        id: 'mq-meas-1', prompt: 'Convert 3.15 m to millimetres.', options: ['315 mm', '3150 mm', '31500 mm'], correctIndex: 1,
        explanation: '3.15 × 1000 = 3150 mm.',
      } },
    ],
    relatedTermIds: ['span'],
    quizIds: ['q-meas-1', 'q-meas-2', 'q-meas-3', 'q-meas-4'],
  },

  // C — Reading Plans ------------------------------------------------------
  {
    id: 'lesson-reading-plans',
    learningAreaId: 'plans-specifications',
    order: 1,
    title: 'Reading Construction Drawings',
    subtitle: 'Plans, elevations, sections and scale',
    estMinutes: 14,
    objectives: [
      'Distinguish floor plans, elevations and sections',
      'Read a drawing scale and convert drawing measurements to real dimensions',
      'Locate key annotations: dimensions, section markers, levels and the north point',
    ],
    blocks: [
      { kind: 'text', body: 'A set of construction drawings tells the same story from different angles. Learning to move between a floor plan, an elevation and a section — and knowing which one answers which question — is a skill you\'ll use on every single job.' },
      { kind: 'terms', terms: [
        { term: 'Floor Plan', definition: 'A top-down view of one level, with the roof and everything above the cut plane removed.' },
        { term: 'Elevation', definition: 'A straight-on view of one external face of the building.' },
        { term: 'Section', definition: 'The building shown as if sliced through, revealing internal construction and heights.' },
        { term: 'Scale', definition: 'The fixed ratio between a drawing measurement and the real dimension it represents.' },
      ] },
      { kind: 'image-diagram', diagramId: 'plan-elevation-section', caption: 'The same simple building shown as a floor plan, an elevation and a section.' },
      { kind: 'worked-example', title: 'Reading a scaled dimension', given: ['Drawing scale = 1:100', 'Measured length on the drawing = 42 mm'], steps: [
        { label: 'Multiply by the scale factor', detail: '42 mm × 100 = 4200 mm' },
        { label: 'Convert to metres if useful', detail: '4200 mm = 4.2 m' },
      ], result: '4.2 m in real life' },
      { kind: 'callout', tone: 'warning', title: 'Never scale off a drawing when a dimension is printed', body: 'Printed dimensions are the authoritative source — PDFs and printed copies can shrink or stretch slightly. Only measure off the drawing itself when no dimension is given, and confirm with the drawing issuer if in doubt.' },
      { kind: 'mini-question', question: {
        id: 'mq-plan-1', prompt: 'Which drawing would best show you the floor-to-ceiling height at a specific point in a building?', options: ['Floor plan', 'Section', 'Site plan'], correctIndex: 1,
        explanation: 'A section reveals vertical/height relationships because it cuts through the building — a floor plan and site plan are both top-down views.',
      } },
    ],
    relatedTermIds: ['floor-plan', 'elevation', 'section', 'scale'],
    quizIds: ['q-plan-1', 'q-plan-2', 'q-plan-3'],
  },

  // D — Setting Out ---------------------------------------------------------
  {
    id: 'lesson-setting-out',
    unitCode: 'CPCCCA3002',
    learningAreaId: 'set-out-levelling',
    order: 1,
    title: 'Site Set-Out',
    subtitle: 'Getting it right before a single frame goes up',
    estMinutes: 16,
    objectives: [
      'Explain the purpose of a datum and a set-out profile',
      'Apply the 3-4-5 method to establish a square corner',
      'Use a diagonal check to confirm a rectangular layout is square',
    ],
    blocks: [
      { kind: 'text', body: 'Set-out is the process of transferring the building\'s dimensions from the drawing onto the real site — accurately. Every wall, floor and roof measurement in this course assumes the set-out underneath it was correct. An error here multiplies through everything built on top of it.' },
      { kind: 'terms', terms: [
        { term: 'Datum', definition: 'A fixed, known reference level that every other level on the job is related back to.' },
        { term: 'Profile', definition: 'A small timber frame set clear of the work area used to re-establish building lines throughout the job.' },
      ] },
      { kind: 'worked-example', title: 'The 3-4-5 method, scaled up', given: ['Scale factor chosen = 1.2', 'Side A = 3 × 1.2 = 3.6 m', 'Side B = 4 × 1.2 = 4.8 m'], steps: [
        { label: 'Multiply the 5 by the same scale factor', detail: '5 × 1.2 = 6 m' },
        { label: 'Measure the diagonal between the ends of side A and side B', detail: 'If it measures exactly 6 m, the angle between A and B is a true 90°.' },
      ], result: 'A 3.6 m / 4.8 m / 6 m triangle confirms a square corner.' },
      { kind: 'callout', tone: 'info', title: 'Why 3-4-5 works', body: 'It\'s Pythagoras\' theorem in disguise: 3² + 4² = 5² (9 + 16 = 25). Any triangle with sides in that ratio must contain a right angle — scaling every side by the same factor keeps the ratio, and therefore the right angle, intact.' },
      { kind: 'list', heading: 'Diagonal check on a full rectangle', ordered: true, items: [
        'Measure both diagonals corner-to-corner',
        'Compare the two results',
        'If they match, the rectangle is square — if not, adjust one corner and re-check',
      ] },
      { kind: 'mini-question', question: {
        id: 'mq-setout-1', prompt: 'You measure both diagonals of a rectangular deck frame and get 5002 mm and 4986 mm. What does this tell you?', options: ['The frame is square', 'The frame is slightly out of square and needs adjustment', 'The frame is too small'], correctIndex: 1,
        explanation: 'Equal diagonals confirm square — a 16 mm difference here means the frame needs to be racked slightly and re-checked before fixing anything permanently.',
      } },
      { kind: 'mistakes', items: [
        { mistake: 'Only checking one diagonal', why: 'A single diagonal alone can\'t confirm squareness — you need both, compared against each other.' },
        { mistake: 'Losing the datum part-way through a job', why: 'Every level poured or framed afterwards will be wrong relative to what came before it — always protect and re-check your datum.' },
      ] },
    ],
    relatedTermIds: ['set-out', 'datum', 'profile', 'diagonal-check', 'square-term'],
    quizIds: ['q-setout-1', 'q-setout-2', 'q-setout-3', 'q-calc-3'],
  },

  // E — Floor Framing --------------------------------------------------------
  {
    id: 'lesson-floor-framing',
    unitCode: 'CPCCCA3003',
    learningAreaId: 'floor-systems',
    order: 1,
    title: 'Floor Framing Systems',
    subtitle: 'The platform everything else is built on',
    estMinutes: 15,
    objectives: [
      'Identify bearers, joists and blocking and describe their roles',
      'Explain how load travels from the flooring down to the footings',
      'Understand why span, spacing and orientation are design decisions, not guesses',
    ],
    blocks: [
      { kind: 'text', body: 'A timber floor system is a simple, repeating load path: flooring sheets sit on joists, joists sit on bearers, bearers sit on stumps or piers, and the stumps carry the load down to footings in the ground. Understanding that chain makes every individual component\'s purpose obvious.' },
      { kind: 'terms', terms: [
        { term: 'Bearer', definition: 'Primary horizontal member, usually on stumps or piers, that supports the joists.' },
        { term: 'Joist', definition: 'Spans between bearers and directly supports the flooring.' },
        { term: 'Blocking', definition: 'Solid timber between joists that stops them twisting and stiffens the floor.' },
      ] },
      { kind: 'image-diagram', diagramId: 'floor-frame-exploded', caption: 'Load path: flooring → joists → bearers → stumps → footings.' },
      { kind: 'callout', tone: 'warning', title: 'Never assume a span', body: 'Actual bearer/joist size, spacing and allowable span depend on timber grade, load and the specific span tables or engineering for that job. This course teaches the concepts — always confirm real sizes from current project documentation.' },
      { kind: 'list', heading: 'What determines joist spacing and orientation', items: [
        'The span they need to cover without excessive deflection',
        'The flooring material being used above them',
        'Load paths for anything supported by the floor (walls, fixtures)',
        'Any openings (stairwells, service penetrations) that need trimming around',
      ] },
      { kind: 'mini-question', question: {
        id: 'mq-floor-1', prompt: 'What do floor joists typically span between?', options: ['Stud to stud', 'Bearers or supporting walls', 'Fascia to fascia'], correctIndex: 1,
        explanation: 'Joists span between bearers (or directly between supporting walls), carrying the flooring load down to them.',
      } },
      { kind: 'mistakes', items: [
        { mistake: 'Leaving out blocking because "the floor feels fine without it"', why: 'A floor can feel adequate under light foot traffic and still twist or bounce under real service loads over time.' },
      ] },
    ],
    relatedTermIds: ['bearer', 'joist', 'blocking', 'floor-frame', 'stump', 'span'],
    quizIds: ['q-floor-1', 'q-floor-2', 'q-floor-3'],
  },

  // F — Wall Framing ----------------------------------------------------------
  {
    id: 'lesson-wall-framing',
    unitCode: 'CPCCCA3004',
    learningAreaId: 'wall-framing',
    order: 1,
    title: 'Wall Framing Fundamentals',
    subtitle: 'Plates, studs and openings',
    estMinutes: 18,
    objectives: [
      'Name every major component of a standard timber wall frame',
      'Explain how a door/window opening changes the standard stud layout',
      'Describe the general wall-framing construction sequence',
    ],
    blocks: [
      { kind: 'text', body: 'A wall frame looks complex at first glance but is really a small number of repeating parts, arranged to do two jobs at once: carry load, and create openings where you need them. Once you can name every part on sight, the Workshop\'s 3D wall frame will make the whole system click.' },
      { kind: 'terms', terms: [
        { term: 'Top / Bottom Plate', definition: 'Horizontal members capping the top and base of the frame.' },
        { term: 'Common Stud', definition: 'A regularly-spaced vertical member with no opening role.' },
        { term: 'Jamb Stud', definition: 'Full-height stud forming the side of a door/window opening.' },
        { term: 'Lintel', definition: 'Spans above an opening, carrying load into the jamb studs.' },
        { term: 'Trimmer', definition: 'Forms the sill below a window opening.' },
        { term: 'Cripple Stud', definition: 'Shortened stud continuing the layout above a lintel or below a sill.' },
        { term: 'Nogging', definition: 'Horizontal blocking between studs for bracing and fixing.' },
      ] },
      { kind: 'callout', tone: 'info', title: 'Terminology varies by region and method', body: 'Some of these terms shift slightly between states, employers and construction methods (for example "nogging" is sometimes called "dwang" in other English-speaking countries, and "header" is used interchangeably with "lintel"). This course uses the terms most common in Australian residential framing, and flags variations where they matter.' },
      { kind: 'image-diagram', diagramId: 'wall-frame-labelled', caption: 'A labelled wall frame with a door and window opening.' },
      { kind: 'list', heading: 'General build sequence', ordered: true, items: [
        'Inspect the plan for wall dimensions and opening positions',
        'Set out plates — mark overall length and opening positions',
        'Mark stud centres along the plates',
        'Prepare framing members (cut studs, lintels, trimmers to length)',
        'Position and fix members between the plates',
        'Square the assembled frame using a diagonal check',
        'Brace the frame (conceptually, per the bracing design) before raising',
      ] },
      { kind: 'mini-question', question: {
        id: 'mq-wall-1', prompt: 'Which member spans a door/window opening and carries the load above it into the jamb studs?', options: ['Nogging', 'Lintel', 'Bottom plate'], correctIndex: 1,
        explanation: 'The lintel (or header) spans the opening and transfers the load down into the jamb studs either side.',
      } },
      { kind: 'mistakes', items: [
        { mistake: 'Fixing cripple studs before the lintel is positioned and checked', why: 'The lintel position determines exactly where the cripple studs land — get the lintel wrong and every cripple stud above it is also wrong.' },
        { mistake: 'Skipping the diagonal check because the frame "looks square"', why: 'A frame can look square to the eye and still be out by enough to cause problems fitting linings, cladding or the roof structure later.' },
      ] },
      { kind: 'text', heading: 'Practise it', body: 'Head to the Workshop to explore a fully interactive 3D wall frame — click any component to inspect it, explode the model to see how it goes together, or try Build Mode to step through the sequence yourself.' },
    ],
    relatedTermIds: ['top-plate', 'bottom-plate', 'common-stud', 'jamb-stud', 'lintel', 'trimmer', 'cripple-stud', 'nogging', 'stud-spacing', 'bracing'],
    quizIds: ['q-wall-1', 'q-wall-2', 'q-wall-3', 'q-wall-4', 'q-wall-5'],
  },

  // G — Roof Terminology & Pitch ------------------------------------------
  {
    id: 'lesson-roof-terminology-pitch',
    unitCode: 'CPCCCA3007',
    learningAreaId: 'pitched-roofs',
    order: 1,
    title: 'Roof Terminology & Pitch',
    subtitle: 'Rise, run and the language of roofs',
    estMinutes: 17,
    objectives: [
      'Define pitch, rise and run and how they relate to each other',
      'Identify rafters, ridge, hips, valleys and jack rafters',
      'Explain the difference between a gable, hip, Dutch gable and skillion roof',
    ],
    blocks: [
      { kind: 'text', body: 'Roofing has its own vocabulary, but nearly all of it comes back to one relationship: rise, run and pitch. Get comfortable with that triangle and the rest of roof terminology falls into place around it.' },
      { kind: 'terms', terms: [
        { term: 'Pitch', definition: 'The angle of the roof surface from horizontal.' },
        { term: 'Rise', definition: 'Vertical height gained from wall top-plate to ridge.' },
        { term: 'Run', definition: 'Horizontal distance a rafter travels — half the building span on a symmetrical gable roof.' },
        { term: 'Rafter', definition: 'Sloping member forming a conventional (cut) roof.' },
        { term: 'Ridge', definition: 'Horizontal member at the top of the roof that rafters meet at.' },
        { term: 'Hip', definition: 'External sloping corner where two roof planes meet.' },
        { term: 'Valley', definition: 'Internal sloping corner where two roof planes meet.' },
        { term: 'Jack Rafter', definition: 'Shortened rafter terminating against a hip or valley.' },
      ] },
      { kind: 'worked-example', title: 'Finding pitch from rise and run', given: ['Building span = 7200 mm', 'Run (half span) = 3600 mm', 'Rise = 1491 mm'], steps: [
        { label: 'Divide rise by run', detail: '1491 ÷ 3600 = 0.4142' },
        { label: 'Take the arctangent', detail: 'arctan(0.4142) ≈ 22.5°' },
      ], result: 'Roof pitch ≈ 22.5°' },
      { kind: 'callout', tone: 'info', title: 'Roof type changes the vocabulary, not the physics', body: 'Gable, hip, Dutch gable and skillion roofs all still obey the same rise/run/pitch relationship on every plane — what changes is how many planes there are and how they intersect (hips, valleys, gable ends).' },
      { kind: 'list', heading: 'Common roof types', items: [
        'Gable — two planes meeting at a ridge, vertical ends',
        'Hip — all sides slope, no vertical gable end',
        'Dutch Gable — a hip roof with a small gable at the top of one or more ends',
        'Skillion — a single sloping plane, no ridge',
      ] },
      { kind: 'mini-question', question: {
        id: 'mq-roof-1', prompt: 'On a symmetrical gable roof with a 7200 mm building span, what run would you use for the pitch calculation?', options: ['7200 mm', '3600 mm', '1800 mm'], correctIndex: 1,
        explanation: 'Run is half the overall span for a symmetrical gable roof: 7200 ÷ 2 = 3600 mm.',
      } },
      { kind: 'text', heading: 'Practise it', body: 'The Roof Lab lets you drag a pitch slider from 0°–45° and watch the rise, angle arc and rafter geometry update live, then step through the full LEARN → PRACTISE → CALCULATE roof calculation trainer.' },
    ],
    relatedTermIds: ['pitch', 'rise', 'run', 'rafter', 'ridge', 'hip', 'valley', 'jack-rafter', 'gable-roof', 'hip-roof', 'skillion-roof', 'truss'],
    quizIds: ['q-roof-1', 'q-roof-2', 'q-roof-3', 'q-roof-4', 'q-roof-5', 'q-calc-1'],
  },
]
