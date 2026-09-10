import type { Lesson } from '../../types'

const MODULE_ID = 'module-wall-frame-fundamentals'
const AREA_ID = 'wall-framing'
const UNIT_CODE = 'CPCCCA3004'

// The full "Wall Frame Fundamentals" module — eleven lessons, data-driven
// through the shared LessonBlock renderer. This is the proof-of-concept for
// the rest of CPC30220: every other learning area can follow this exact
// pattern (module + lessons + quiz bank) without any new page code.
export const wallFramingLessons: Lesson[] = [
  // 01 — Introduction ------------------------------------------------------
  {
    id: 'lesson-wall-01',
    unitCode: UNIT_CODE,
    learningAreaId: AREA_ID,
    moduleId: MODULE_ID,
    order: 1,
    title: 'Introduction to Wall Frames',
    subtitle: 'What a wall frame is, and what it does',
    estMinutes: 10,
    objectives: [
      'Describe what a timber wall frame is and its basic structural purpose',
      'Explain the difference between a load-bearing and non-load-bearing wall',
      'Name the core parts of a wall frame using correct terminology',
    ],
    blocks: [
      { kind: 'text', body: 'A timber wall frame is a repeating skeleton of horizontal and vertical members — plates, studs and bracing — that does two jobs at once: it carries load down through the building, and it creates the openings (doors, windows) you actually need in a wall. Everything in this module builds from that one idea.' },
      { kind: 'terms', terms: [
        { term: 'Plate', definition: 'A horizontal member capping the top or forming the base of a wall frame.' },
        { term: 'Stud', definition: 'A vertical member running between the plates, forming the main skeleton of the wall.' },
        { term: 'Lintel', definition: 'Spans above an opening, carrying load into the studs either side.' },
        { term: 'Opening', definition: 'A gap in the regular stud layout for a door or window.' },
        { term: 'Nogging', definition: 'Horizontal blocking between studs for bracing and fixing.' },
        { term: 'Jamb', definition: 'The full-height stud (or lining) forming the side of an opening.' },
        { term: 'Frame', definition: 'The complete assembled timber structure of a wall, before linings and cladding.' },
        { term: 'Load Path', definition: 'The route a load travels down through connected building elements to the ground.' },
      ] },
      { kind: 'callout', tone: 'info', title: 'Load-bearing vs non-load-bearing', body: 'A load-bearing wall carries structural load from the roof, floor or another wall above it, in addition to its own weight. A non-load-bearing wall — often an internal partition — only supports itself. Which category a specific wall falls into is a design fact set by the structural drawings, never something to assume by looking at it on site.' },
      { kind: 'image-diagram', diagramId: 'wall-frame-labelled', caption: 'A standard timber wall frame with a door opening and a window opening.' },
      { kind: 'list', heading: 'How wall framing connects the building together', ordered: true, items: [
        'The floor system below provides a level, fixed platform for the bottom plate to be fixed to',
        'The wall frame itself carries any load from above down through its studs to that floor',
        'The top plate provides the fixing surface and load path for the ceiling frame and/or roof structure above',
        'Openings in the wall frame are pre-planned to line up with the doors and windows on the drawings',
      ] },
      { kind: 'mini-question', question: {
        id: 'mq-w1-1', prompt: 'What is the main structural purpose of a load-bearing wall frame?', options: ['To divide a room for privacy only', 'To carry load from above down to the structure below, as well as supporting itself', 'To hold up the scaffolding during construction', 'To provide a fixing surface for skirting boards'],
        correctIndex: 1, explanation: 'A load-bearing wall\'s defining job is carrying load from whatever sits above it (another wall, a floor, or the roof) safely down to the structure below — a non-load-bearing wall only needs to support itself.',
      } },
      { kind: 'text', heading: 'Where this module goes', body: 'The next ten lessons work through every major wall-frame component and concept in turn — plates, studs, openings, lintels, noggings, set-out, squaring and load path — before a revision lesson and the module quiz. The Workshop\'s interactive 3D wall frame is available any time you want to see these parts in three dimensions.' },
    ],
    relatedTermIds: ['wall-frame', 'top-plate', 'bottom-plate', 'stud', 'lintel', 'opening', 'nogging', 'jamb-stud', 'load-path', 'load-bearing-wall', 'non-load-bearing-wall'],
    quizIds: ['q-wall-1', 'q-wall-2'],
  },

  // 02 — Plates --------------------------------------------------------------
  {
    id: 'lesson-wall-02',
    unitCode: UNIT_CODE,
    learningAreaId: AREA_ID,
    moduleId: MODULE_ID,
    order: 2,
    title: 'Top & Bottom Plates',
    subtitle: 'The horizontal members every stud relies on',
    estMinutes: 10,
    objectives: [
      'Explain the purpose of the top plate and bottom plate',
      'Describe how studs relate to the plates and how plates carry the set-out',
      'Understand how opening positions are marked directly onto the plates',
    ],
    blocks: [
      { kind: 'text', body: 'Plates are the horizontal members every other part of a wall frame relies on. The bottom plate anchors the whole frame to the floor below; the top plate ties every stud together and hands the load path on to whatever sits above the wall. Get the plates right and the rest of the frame follows from them directly.' },
      { kind: 'terms', terms: [
        { term: 'Top Plate', definition: 'The horizontal member fixed across the top of the studs, tying the frame together and carrying the load path upward. Often doubled on load-bearing walls.' },
        { term: 'Bottom Plate', definition: 'Also called the sole plate. The horizontal member at the base of the frame that studs are fixed to, and which is fixed down to the floor structure.' },
      ] },
      { kind: 'image-diagram', diagramId: 'wall-frame-plates', caption: 'A doubled top plate and a bottom plate, with an opening position marked out on the top plate.' },
      { kind: 'callout', tone: 'info', title: 'Terminology and practice vary', body: 'Whether a top plate is doubled, and exactly how plate joints are lapped or staggered, depends on the framing system, the wall\'s load-bearing status and local practice — this is a design/engineering decision, not a universal rule. This course teaches the concept; always follow the actual project documentation and framing system in use.' },
      { kind: 'list', heading: 'Why set-out starts on the plates', ordered: true, items: [
        'The bottom and top plates are cut to the wall\'s overall length first',
        'Opening positions are measured from a reference end and marked across both plates together (so they line up exactly)',
        'Stud centres are then marked along the plates, working out from the opening marks',
        'Every stud, jamb and cripple stud position in the frame is fixed once the plates are marked — the plates carry the whole set-out',
      ] },
      { kind: 'mini-question', question: {
        id: 'mq-w2-1', prompt: 'Why are the top and bottom plates usually marked out together, held side by side, rather than separately?', options: ['It saves timber', 'It guarantees studs and opening positions line up exactly between the top and bottom of the frame', 'It is required by every building code', 'It makes the plates easier to lift'],
        correctIndex: 1, explanation: 'Marking both plates together (commonly clamped or held side-by-side) transfers every mark identically to both, so every stud and opening lines up top-to-bottom once the frame is assembled — marking them separately risks small measuring differences that leave the frame slightly out of alignment.',
      } },
    ],
    relatedTermIds: ['top-plate', 'bottom-plate', 'stud', 'set-out', 'opening'],
    quizIds: ['q-wall-3', 'q-wall-16'],
  },

  // 03 — Studs & Stud Spacing -------------------------------------------------
  {
    id: 'lesson-wall-03',
    unitCode: UNIT_CODE,
    learningAreaId: AREA_ID,
    moduleId: MODULE_ID,
    order: 3,
    title: 'Studs and Stud Spacing',
    subtitle: 'The vertical members, and why their spacing is never arbitrary',
    estMinutes: 12,
    objectives: [
      'Distinguish common studs from end studs',
      'Explain what "centres" means and why regular stud spacing matters',
      'Relate stud spacing to sheet materials and load',
    ],
    blocks: [
      { kind: 'text', body: 'Studs form the main vertical skeleton of a wall frame, running between the bottom plate and top plate. Most studs in a frame are common studs — evenly spaced with no special role — but a small number take on specific jobs at corners and openings, covered in the next lesson.' },
      { kind: 'terms', terms: [
        { term: 'Common Stud', definition: 'A standard, evenly-spaced stud carrying no special role at an opening or corner.' },
        { term: 'End Stud', definition: 'The stud forming the outer end of a wall frame, typically at a corner.' },
        { term: 'Stud Spacing', definition: 'The regular distance between stud centrelines, commonly 450 or 600 mm in Australian residential framing.' },
      ] },
      { kind: 'callout', tone: 'info', title: 'Why do carpenters say "centres"?', body: 'Stud spacing is always measured centreline to centreline — the middle of one stud to the middle of the next — not gap to gap. Saying "600 centres" (written "600 CTRS") means every stud\'s centreline sits 600 mm from the next, which keeps the numbers consistent regardless of the actual stud thickness used.' },
      { kind: 'stud-spacing-interactive', defaultLength: 2400, defaultCentres: 600 },
      { kind: 'list', heading: 'Why regular spacing matters', items: [
        'Sheet linings and cladding are manufactured in standard sizes (e.g. 1200 mm wide) — regular centres let sheet edges land squarely on a stud for fixing',
        'Even spacing distributes load from above evenly across all the studs, rather than concentrating it on a few',
        'A predictable layout makes it far faster to check, measure and frame around on site',
      ] },
      { kind: 'mini-question', question: {
        id: 'mq-w3-1', prompt: 'Stud spacing of "450 CTRS" means:', options: ['A 450 mm gap between the edges of adjacent studs', '450 mm measured from the centreline of one stud to the centreline of the next', '450 mm from the wall corner to the first stud only', 'The stud is 450 mm long'],
        correctIndex: 1, explanation: '"CTRS" (centres) is always measured centreline to centreline, not gap to gap — this keeps the spacing numbers consistent no matter what thickness of stud timber is actually used.',
      } },
      { kind: 'mistakes', items: [
        { mistake: 'Assuming the same stud centres apply to every project', why: 'Actual stud spacing is set by the project drawings, based on sheet material, wall height and load — this lesson\'s 450/600 mm examples are common defaults, not a rule to apply everywhere.' },
      ] },
    ],
    relatedTermIds: ['stud', 'common-stud', 'end-stud', 'stud-spacing', 'centres'],
    quizIds: ['q-wall-4', 'q-wall-5', 'q-wall-6'],
  },

  // 04 — Door & Window Openings ------------------------------------------------
  {
    id: 'lesson-wall-04',
    unitCode: UNIT_CODE,
    learningAreaId: AREA_ID,
    moduleId: MODULE_ID,
    order: 4,
    title: 'Door & Window Openings',
    subtitle: 'How the regular stud layout changes around an opening',
    estMinutes: 12,
    objectives: [
      'Identify jamb studs, trimmers and cripple studs and explain each one\'s role',
      'Explain how a door opening differs from a window opening in a stud layout',
      'Describe where the lintel sits relative to the other opening components',
    ],
    blocks: [
      { kind: 'text', body: 'Every opening interrupts the regular stud layout in the same predictable way: the common studs either side of it are replaced with a small purpose-built cluster of members that frame the opening square, carry the load around it, and give something solid to fix a door or window unit to later.' },
      { kind: 'terms', terms: [
        { term: 'Jamb Stud', definition: 'A full-height stud immediately beside an opening, supporting the end of the lintel and forming the side of the opening. Also called a trimming stud.' },
        { term: 'Trimmer', definition: 'A short horizontal member forming the sill of a window opening, supported by cripple studs beneath it.' },
        { term: 'Cripple Stud', definition: 'A shortened stud continuing the regular layout above a lintel or below a sill trimmer.' },
      ] },
      { kind: 'image-diagram', diagramId: 'wall-frame-opening-detail', caption: 'A single opening showing the jamb studs, lintel and cripple studs above it.' },
      { kind: 'list', heading: 'Door opening vs window opening', items: [
        'A door opening runs from the bottom plate to the lintel — no trimmer or sill is needed because there\'s no bottom edge to frame',
        'A window opening is framed on all four sides: jamb studs each side, a lintel above, and a sill trimmer below (supported by cripple studs down to the bottom plate)',
        'Both use cripple studs above the lintel, continuing the regular layout up to the top plate',
      ] },
      { kind: 'mini-question', question: {
        id: 'mq-w4-1', prompt: 'Why doesn\'t a door opening need a sill trimmer, while a window opening does?', options: ['Doors are always narrower than windows', 'A door opening extends down to the bottom plate, so there\'s no bottom edge to frame — a window opening has a raised sill that needs support', 'Trimmers are only used for structural reasons on windows', 'It is simply a matter of local custom with no functional reason'],
        correctIndex: 1, explanation: 'A door opening runs floor-to-lintel, so the bottom plate itself is the bottom of the opening. A window sits above the bottom plate, so its lower edge (the sill) is a trimmer that needs its own support — cripple studs running down to the bottom plate.',
      } },
    ],
    relatedTermIds: ['jamb-stud', 'trimmer', 'cripple-stud', 'lintel', 'opening'],
    quizIds: ['q-wall-7', 'q-wall-8', 'q-wall-9'],
  },

  // 05 — Lintels ---------------------------------------------------------------
  {
    id: 'lesson-wall-05',
    unitCode: UNIT_CODE,
    learningAreaId: AREA_ID,
    moduleId: MODULE_ID,
    order: 5,
    title: 'Lintels and Supporting Members',
    subtitle: 'How load gets around an opening instead of through it',
    estMinutes: 10,
    objectives: [
      'Explain what a lintel does and why an opening needs one',
      'Describe, at a basic level, how load transfers from above an opening down to the ground',
      'Understand why lintel sizing is never assumed on site',
    ],
    blocks: [
      { kind: 'text', body: 'An opening removes the studs that would otherwise be standing directly under whatever load is coming from above. A lintel\'s whole job is to bridge that gap — spanning horizontally across the opening and handing the load sideways into the jamb studs at each end, so it can keep travelling down to the ground exactly as it would have if the opening weren\'t there.' },
      { kind: 'callout', tone: 'warning', title: 'Never assume a lintel size', body: 'Real lintel size and material depend on the span of the opening, the load above it (roof, floor, another wall) and the timber or steel used — always determined by the structural drawings or engineering for that specific job, never estimated or reused from a different project.' },
      { kind: 'load-path', variant: 'opening' },
      { kind: 'mini-question', question: {
        id: 'mq-w5-1', prompt: 'Why does an opening need a lintel at all, structurally?', options: ['To make the opening look finished', 'To transfer the load that would otherwise pass through the missing studs, sideways into the jamb studs either side', 'To provide a fixing point for the door hinges', 'To stop noggings from falling out'],
        correctIndex: 1, explanation: 'Removing studs for an opening also removes their load path straight down. The lintel picks up that load and redirects it sideways to the jamb studs, which then carry it on down to the ground — without a lintel, the load above the opening would have nothing to stand on.',
      } },
    ],
    relatedTermIds: ['lintel', 'jamb-stud', 'load-path', 'opening'],
    quizIds: ['q-wall-10', 'q-wall-11', 'q-wall-12'],
  },

  // 06 — Noggings ----------------------------------------------------------------
  {
    id: 'lesson-wall-06',
    unitCode: UNIT_CODE,
    learningAreaId: AREA_ID,
    moduleId: MODULE_ID,
    order: 6,
    title: 'Noggings and Blocking',
    subtitle: 'The horizontal members between studs',
    estMinutes: 9,
    objectives: [
      'Explain what noggings are and where they typically sit in a wall frame',
      'Describe the general functions noggings serve',
      'Correctly identify a nogging position in a wall frame',
    ],
    blocks: [
      { kind: 'text', body: 'Noggings are short horizontal members fixed between studs — usually near mid-height, or wherever the bracing/fixing design calls for them. They\'re easy to overlook because they don\'t span an opening or carry the wall\'s main structural story, but they quietly do several jobs at once.' },
      { kind: 'terms', terms: [
        { term: 'Nogging', definition: 'Horizontal (or staggered) blocking fixed between studs, bracing the frame and providing fixing points. Called a "dwang" in some other English-speaking countries.' },
      ] },
      { kind: 'list', heading: 'What noggings do', items: [
        'Brace the studs against twisting and help keep the frame stable',
        'Give a solid fixing point where sheet lining or cladding joints land mid-height',
        'Act as fire blocking, helping to slow the spread of fire within the wall cavity',
      ] },
      { kind: 'image-diagram', diagramId: 'wall-frame-nogging-pick', caption: 'Four candidate positions (A–D) on a wall frame. Which one is a nogging?' },
      { kind: 'mini-question', question: {
        id: 'mq-w6-1', prompt: 'Select the nogging: which lettered position in the diagram above is a nogging?', options: ['A — at the top plate junction', 'B — horizontal, fixed between two studs at mid-height', 'C — near the lintel, above the opening', 'D — at the bottom plate junction'],
        correctIndex: 1, explanation: 'B sits horizontally between two common studs at mid-height — exactly where a nogging belongs. A and D are actually parts of the plates themselves, not separate noggings, and C is part of the opening framing (the lintel area), not a nogging.',
      } },
    ],
    relatedTermIds: ['nogging', 'stud', 'bracing'],
    quizIds: ['q-wall-13', 'q-wall-14', 'q-wall-15'],
  },

  // 07 — Wall Frame Set-out -------------------------------------------------------
  {
    id: 'lesson-wall-07',
    unitCode: UNIT_CODE,
    learningAreaId: AREA_ID,
    moduleId: MODULE_ID,
    order: 7,
    title: 'Wall Frame Set-out',
    subtitle: 'Turning a drawing into marks on a plate',
    estMinutes: 12,
    objectives: [
      'Describe the general process of setting out a wall frame from a drawing',
      'Read and interpret typical stud/opening annotations marked on a plate',
      'Explain why plates are checked against the drawing before any cutting begins',
    ],
    blocks: [
      { kind: 'text', body: 'Wall frame set-out is the process of reading a drawing\'s dimensions and opening positions, then marking every stud, jamb and opening location directly onto the plates before a single stud is cut. Done carefully, set-out turns a complicated-looking frame into a simple, repeatable marking-out exercise.' },
      { kind: 'list', heading: 'The general set-out sequence', ordered: true, items: [
        'Read the wall\'s overall length and confirm it against the drawing',
        'Identify every opening on that wall and its position, usually dimensioned from one reference end',
        'Mark the opening positions onto both plates first (held or clamped together, so the marks match)',
        'Mark stud centres along the remaining length, working out from the opening marks',
        'Check every mark against the drawing once more before cutting anything',
      ] },
      { kind: 'image-diagram', diagramId: 'wall-frame-setout-plate', caption: 'A bottom plate marked with an opening position and stud centres either side.' },
      { kind: 'callout', tone: 'warning', title: 'Marking is conceptual here', body: 'This lesson covers the reasoning behind set-out marks — reading dimensions, marking opening positions, working out stud centres. It intentionally does not cover physical tool technique (e.g. how to hold or operate a specific marking tool), which is covered separately and safely in the Tools & Equipment learning area.' },
      { kind: 'mini-question', question: {
        id: 'mq-w7-1', prompt: 'Why are opening positions marked onto the plates before the stud centres are worked out?', options: ['It doesn\'t matter which order they\'re marked in', 'So the stud layout can be planned around the fixed opening positions, not the other way around', 'Because openings are always marked last on real projects', 'To save chalk line'],
        correctIndex: 1, explanation: 'Opening positions come directly from the drawing and can\'t move — so they\'re marked first, and the regular stud centres are then worked out around them (adjusting the last space either side of an opening as needed), not the reverse.',
      } },
    ],
    relatedTermIds: ['set-out', 'stud-spacing', 'opening', 'top-plate', 'bottom-plate'],
    quizIds: ['q-wall-16', 'q-wall-17', 'q-wall-18'],
  },

  // 08 — Checking a Wall for Square -------------------------------------------------
  {
    id: 'lesson-wall-08',
    unitCode: UNIT_CODE,
    learningAreaId: AREA_ID,
    moduleId: MODULE_ID,
    order: 8,
    title: 'Checking a Wall for Square',
    subtitle: 'Why a rectangle\'s two diagonals tell you everything',
    estMinutes: 11,
    objectives: [
      'Explain what "square" means for an assembled wall frame',
      'Apply a² + b² = c² to calculate the expected diagonal of a rectangular frame',
      'Use a diagonal comparison to confirm (or correct) a frame\'s squareness',
    ],
    blocks: [
      { kind: 'text', body: 'An assembled wall frame should be a true rectangle — every corner exactly 90°. You could check every corner individually with a square, but there\'s a faster, more reliable trick: for any true rectangle, both corner-to-corner diagonals are exactly equal in length. If they\'re not, the frame is out of square.' },
      { kind: 'image-diagram', diagramId: 'square-diagonal-check', caption: 'A 2400 × 3600 mm rectangular frame with both diagonals marked.' },
      { kind: 'worked-example', title: 'Finding the expected diagonal of a 2400 × 3600 mm frame', given: ['Side a = 2400 mm', 'Side b = 3600 mm'], steps: [
        { label: 'Square each side (a² and b²)', detail: '2400² = 5,760,000  ·  3600² = 12,960,000' },
        { label: 'Add them together', detail: '5,760,000 + 12,960,000 = 18,720,000' },
        { label: 'Take the square root', detail: '√18,720,000 ≈ 4327.8' },
      ], result: 'Both diagonals should measure ≈ 4327.8 mm if the frame is square.' },
      { kind: 'callout', tone: 'info', title: 'This is Pythagoras\' theorem', body: 'a² + b² = c² — the same relationship behind the 3-4-5 method used in site set-out. Any right-angled corner obeys it, which is exactly why comparing a frame\'s diagonals is such a reliable square check.' },
      { kind: 'mini-question', question: {
        id: 'mq-w8-1', prompt: 'You measure a 2400 × 3600 mm frame\'s two diagonals and get 4328 mm and 4361 mm. What does this tell you?', options: ['The frame is square — both are close to 4327.8 mm', 'The frame is out of square and needs adjustment before fixing', 'The frame is too small overall', 'One side must be the wrong length'],
        correctIndex: 1, explanation: 'A 33 mm difference between the two diagonals means the frame is measurably out of square — even though one diagonal is close to the calculated 4327.8 mm, "close" on only one diagonal isn\'t enough. Both must match each other.',
      } },
      { kind: 'text', heading: 'Practise it', body: 'The Diagonal / Square calculator in the Calculator Centre lets you enter any rectangle\'s length and width and see the expected diagonal worked out live, exactly like the example above.' },
    ],
    relatedTermIds: ['square-term', 'diagonal-check', 'set-out'],
    quizIds: ['q-wall-19', 'q-wall-20', 'q-wall-21'],
  },

  // 09 — Load Path Fundamentals -------------------------------------------------
  {
    id: 'lesson-wall-09',
    unitCode: UNIT_CODE,
    learningAreaId: AREA_ID,
    moduleId: MODULE_ID,
    order: 9,
    title: 'Load Path Fundamentals',
    subtitle: 'Following a load from the roof to the ground',
    estMinutes: 10,
    objectives: [
      'Describe the general load path through a simple timber-framed building',
      'Explain how the load path changes at an opening',
      'Understand why this is a concept lesson, not an engineering design lesson',
    ],
    blocks: [
      { kind: 'text', body: 'Every structural decision in this module connects back to one simple idea: loads have to travel somewhere. In a conventional timber-framed building, that route — the load path — runs from the roof, down through the walls, to the floor and foundation, and finally into the ground.' },
      { kind: 'load-path', variant: 'general' },
      { kind: 'text', heading: 'What happens at an opening', body: 'An opening breaks the wall\'s normal vertical load path, because the studs that would carry load straight down aren\'t there. The lintel picks that load up and redirects it sideways into the jamb studs, which rejoin the normal path down to the structure below — the same load path, just detouring around the opening.' },
      { kind: 'load-path', variant: 'opening' },
      { kind: 'callout', tone: 'safety', title: 'This is a concept, not an engineering lesson', body: 'This lesson teaches the general idea of how loads travel through connected building elements — it is not engineering design advice, and gives no basis for sizing or altering any structural member. Structural design and sizing is always the responsibility of a qualified engineer or the project drawings.' },
      { kind: 'mini-question', question: {
        id: 'mq-w9-1', prompt: 'Put these in the correct load path order, from an opening down to the structure below.', options: ['Load above opening → Jamb studs → Lintel → Structure below', 'Lintel → Load above opening → Structure below → Jamb studs', 'Load above opening → Lintel → Jamb studs → Structure below', 'Jamb studs → Load above opening → Lintel → Structure below'],
        correctIndex: 2, explanation: 'The load starts above the opening, is picked up and redirected sideways by the lintel, transferred down into the jamb studs at each end, and continues down into the structure below — exactly the order shown in the diagram above.',
      } },
    ],
    relatedTermIds: ['load-path', 'lintel', 'jamb-stud', 'wall-frame'],
    quizIds: ['q-wall-22', 'q-wall-23', 'q-wall-24'],
  },

  // 10 — Common Framing Errors ---------------------------------------------------
  {
    id: 'lesson-wall-10',
    unitCode: UNIT_CODE,
    learningAreaId: AREA_ID,
    moduleId: MODULE_ID,
    order: 10,
    title: 'Common Framing Errors',
    subtitle: 'What to check for before a frame gets fixed permanently',
    estMinutes: 11,
    objectives: [
      'Recognise common wall-framing set-out and assembly errors',
      'Explain why each error matters, not just that it happened',
      'Understand why frames are checked before, not after, they\'re fixed off',
    ],
    blocks: [
      { kind: 'text', body: 'Most wall-framing problems trace back to one of a small number of repeat offenders. Learning to recognise them — and understanding why each one matters — is often more valuable than any single skill covered so far in this module, because it\'s what catches mistakes before they\'re built in permanently.' },
      { kind: 'image-diagram', diagramId: 'wall-frame-error-pick', caption: 'Four marked locations on a wall frame — each hides a different kind of framing error.' },
      { kind: 'mini-question', question: {
        id: 'mq-w10-1', prompt: 'What\'s wrong here? At marker C, the trimmer below a window has been fixed with a small gap between it and the jamb studs on both sides, rather than sitting tight against them.', options: ['Nothing — a small gap is expected there', 'The trimmer won\'t transfer load properly into the jamb studs and the sill will be unsupported at its ends', 'The gap makes the window easier to install later', 'This only matters for external walls'],
        correctIndex: 1, explanation: 'A trimmer needs to sit tight against both jamb studs to properly transfer sill load into them and give the window unit solid support along its full width — a gap at either end leaves that end of the sill unsupported.',
      } },
      { kind: 'mistakes', items: [
        { mistake: 'Incorrect layout — stud centres not measured from a consistent reference point', why: 'Small errors compound along the wall, leaving sheet joins that don\'t land on a stud by the far end.' },
        { mistake: 'A missed component — a nogging or cripple stud left out because it "wasn\'t needed structurally"', why: 'Every member in the layout is also a fixing point for future work — leaving one out creates a problem for whoever linings or cladding later.' },
        { mistake: 'Incorrect opening support — a lintel resting on only one jamb stud, or not fully bearing on either', why: 'The lintel can\'t transfer load evenly into both sides of the opening, concentrating stress on one jamb stud.' },
        { mistake: 'A frame that "looks square" but was never diagonal-checked', why: 'The eye is not accurate enough to catch a few millimetres of racking — exactly the amount that can cause fitting problems later.' },
        { mistake: 'A component fixed in the wrong location relative to the plate marks', why: 'Once sheeted over, a misplaced stud or opening is expensive and disruptive to correct.' },
        { mistake: 'Misreading a plan dimension (e.g. an overall dimension vs. an opening dimension)', why: 'The wrong number carried through set-out puts every mark downstream of that error in the wrong place too.' },
      ] },
    ],
    relatedTermIds: ['trimmer', 'jamb-stud', 'diagonal-check', 'set-out'],
    quizIds: ['q-wall-25', 'q-wall-26', 'q-wall-27'],
  },

  // 11 — Revision ------------------------------------------------------------------
  {
    id: 'lesson-wall-11',
    unitCode: UNIT_CODE,
    learningAreaId: AREA_ID,
    moduleId: MODULE_ID,
    order: 11,
    title: 'Wall Frame Revision',
    subtitle: 'A condensed run through the whole module',
    estMinutes: 14,
    objectives: [
      'Recall component identification, terminology, set-out and load path concepts across the module',
      'Rate your confidence honestly across the module\'s topics',
      'Move into the Wall Framing quiz with a clear sense of what to focus on',
    ],
    blocks: [
      { kind: 'text', body: 'This lesson is a quick lap through every topic in the module — one question on each. Don\'t worry about a perfect score here; it\'s meant to surface exactly what to focus on before the full quiz below.' },
      { kind: 'image-diagram', diagramId: 'wall-frame-labelled', caption: 'Component identification — refer back to this diagram for the question below.' },
      { kind: 'mini-question', question: {
        id: 'mq-w11-1', prompt: 'Component ID: which member spans a door or window opening and carries load into the jamb studs?', options: ['Nogging', 'Lintel', 'Bottom plate', 'End stud'],
        correctIndex: 1, explanation: 'The lintel spans the opening and transfers load down into the jamb studs at each end.',
      } },
      { kind: 'mini-question', question: {
        id: 'mq-w11-2', prompt: 'Terminology: a shortened stud continuing the regular layout above a lintel is called a:', options: ['Jamb stud', 'Cripple stud', 'Common stud', 'Trimmer'],
        correctIndex: 1, explanation: 'A cripple stud continues the regular stud layout above a lintel (or below a sill trimmer) without running full height.',
      } },
      { kind: 'worked-example', title: 'Mini calculation: stud spaces along a 3000 mm wall', given: ['Wall length = 3000 mm', 'Stud spacing = 600 mm centres'], steps: [
        { label: 'Divide length by spacing', detail: '3000 ÷ 600 = 5' },
      ], result: '5 full 600 mm stud spaces.' },
      { kind: 'mini-question', question: {
        id: 'mq-w11-3', prompt: 'A 4800 mm wall is set out at 600 mm centres. How many full stud spaces fit along it?', options: ['6', '7', '8', '9'],
        correctIndex: 2, explanation: '4800 ÷ 600 = 8 full stud spaces.',
      } },
      { kind: 'load-path', variant: 'general' },
      { kind: 'mini-question', question: {
        id: 'mq-w11-4', prompt: 'Load path: in a conventional timber building, what comes immediately after "Wall Framing" in the load path down to the ground?', options: ['Roof', 'Ceiling', 'Floor / Foundation', 'Eaves'],
        correctIndex: 2, explanation: 'The general load path runs Roof → Wall Framing → Floor/Foundation → Ground — the floor/foundation is next after the wall framing.',
      } },
      { kind: 'mini-question', question: {
        id: 'mq-w11-5', prompt: 'Set-out: why are opening positions marked onto the plates before stud centres are worked out?', options: ['So the regular stud layout can be planned around the fixed opening positions', 'Because it makes no real difference', 'Because openings are always the last thing framed', 'To reduce the number of studs needed'],
        correctIndex: 0, explanation: 'Opening positions are fixed by the drawing and can\'t move, so they\'re marked first — the regular stud centres are then worked out around them.',
      } },
      { kind: 'mini-question', question: {
        id: 'mq-w11-6', prompt: 'Openings: why does a window opening need a trimmer, but a door opening does not?', options: ['Windows are always wider than doors', 'A door opening runs to the bottom plate; a window\'s raised sill needs its own supported member', 'Trimmers are decorative only', 'It depends purely on the builder\'s preference'],
        correctIndex: 1, explanation: 'A door opening extends down to the bottom plate itself, so there\'s no separate bottom edge to frame. A window sits above the bottom plate, so its sill (the trimmer) needs cripple studs to support it.',
      } },
      { kind: 'quiz-cta', label: 'Module Assessment', description: 'You\'ve worked through every lesson in Wall Frame Fundamentals. Twenty-five-plus questions covering terminology, components, spacing, openings, lintels, noggings, set-out, squaring, load path and common mistakes are ready whenever you are — roughly 15 are selected at random each time.', learningAreaId: AREA_ID },
    ],
    relatedTermIds: ['wall-frame', 'lintel', 'cripple-stud', 'stud-spacing', 'load-path', 'opening', 'set-out'],
    quizIds: ['q-wall-1', 'q-wall-4', 'q-wall-10', 'q-wall-19', 'q-wall-22', 'q-wall-25'],
  },
]
