import type { QuizQuestion } from '../types'

export const questions: QuizQuestion[] = [
  // ---- Tools ----
  {
    id: 'q-tools-1', type: 'multiple-choice', topic: 'Tools & Equipment', learningAreaId: 'tools-materials', unitCode: 'CPCCCA2002',
    prompt: 'Which tool is best suited to checking that a stud is vertical before fixing?',
    options: ['Combination square', 'Spirit level', 'Chalk line', 'Framing square'],
    correctIndex: 1,
    explanation: 'A spirit level has a vial specifically for checking plumb (vertical) as well as level (horizontal) — the right tool for confirming a stud is standing vertically before it is fixed off.',
    wrongExplanations: {
      0: 'A combination square is excellent for marking 90°/45° angles and depths, but it is too short to reliably check plumb over the height of a stud.',
      2: 'A chalk line marks straight lines over distance (like stud layout on a plate) — it does not check vertical alignment.',
      3: 'A framing square is used for laying out angles and roof geometry, not for checking plumb.',
    },
    difficulty: 1,
  },
  {
    id: 'q-tools-2', type: 'true-false', topic: 'Tools & Equipment', learningAreaId: 'tools-materials', unitCode: 'CPCCCA2002',
    prompt: 'A chalk line can be used to mark a long, straight stud-layout line across a bottom plate.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'True — a chalk line is ideal for snapping a long, straight reference line across a plate quickly and accurately, faster than measuring and marking every point by hand.',
    difficulty: 1,
  },
  {
    id: 'q-tools-3', type: 'multiple-select', topic: 'Tools & Equipment', learningAreaId: 'tools-materials', unitCode: 'CPCCCA2002',
    prompt: 'Select all tools that can be used to check whether a corner is square (90°).',
    options: ['Combination square', 'Framing square', 'Diagonal (3-4-5) measurement', 'Spirit level'],
    correctIndices: [0, 1, 2],
    explanation: 'A combination square and framing square both have a fixed 90° reference, and measuring diagonals (or using the 3-4-5 method) confirms squareness over a larger area. A spirit level checks level/plumb, not squareness.',
    difficulty: 2,
  },

  // ---- Materials ----
  {
    id: 'q-mat-1', type: 'multiple-choice', topic: 'Materials', learningAreaId: 'tools-materials',
    prompt: 'What does an "MGP10" stamp on a piece of framing timber indicate?',
    options: ['The timber species', 'A machine stress-grade rating for structural strength', 'The moisture content as a percentage', 'The hazard (treatment) class'],
    correctIndex: 1,
    explanation: 'MGP stands for Machine Graded Pine — the number is a stress grade indicating verified structural strength, allowing it to be used with confidence in span tables and structural design.',
    wrongExplanations: {
      0: 'MGP grading does not identify species on its own — it is a strength/stress grade classification.',
      2: 'Moisture content is a separate specification, sometimes marked separately (e.g. "seasoned"), not what MGP indicates.',
      3: 'Treatment hazard class (e.g. H2, H3) is a separate stamp relating to decay/insect resistance, not structural grade.',
    },
    difficulty: 2,
  },
  {
    id: 'q-mat-2', type: 'multiple-choice', topic: 'Materials', learningAreaId: 'tools-materials',
    prompt: 'Treated pine is chemically treated primarily to resist:',
    options: ['Fire', 'Decay and insect attack', 'UV fading', 'Shrinkage'],
    correctIndex: 1,
    explanation: 'Treatment (hazard classes such as H2, H3, H4...) protects timber against fungal decay and insect attack appropriate to its exposure conditions.',
    difficulty: 1,
  },
  {
    id: 'q-mat-3', type: 'true-false', topic: 'Materials', learningAreaId: 'tools-materials',
    prompt: 'Plasterboard is a common internal wall and ceiling lining material in Australian homes.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'True — plasterboard (gypsum board) is the standard internal lining material fixed over studs and noggings/ceiling joists in most Australian residential construction.',
    difficulty: 1,
  },

  // ---- Measurement & Calculations ----
  {
    id: 'q-meas-1', type: 'calculation', topic: 'Measurement & Calculations', learningAreaId: 'measurement-calculations', unitCode: 'CPCCOM1015',
    prompt: 'A wall is 4200 mm long. If common studs are set out at 600 mm centres starting from one end, how many stud spaces fit along the wall (ignoring any remainder)?',
    numericAnswer: 7, numericTolerance: 0, numericUnit: 'spaces',
    explanation: '4200 ÷ 600 = 7 — seven full 600 mm spaces fit along the wall, meaning 8 stud positions at the centre-lines (plus end studs as required by the actual layout).',
    difficulty: 2,
  },
  {
    id: 'q-meas-2', type: 'calculation', topic: 'Measurement & Calculations', learningAreaId: 'measurement-calculations', unitCode: 'CPCCOM1015',
    prompt: 'Convert 2.4 metres to millimetres.',
    numericAnswer: 2400, numericTolerance: 0, numericUnit: 'mm',
    explanation: '1 metre = 1000 mm, so 2.4 m × 1000 = 2400 mm.',
    difficulty: 1,
  },
  {
    id: 'q-meas-3', type: 'calculation', topic: 'Measurement & Calculations', learningAreaId: 'measurement-calculations', unitCode: 'CPCCOM1015',
    prompt: 'A rectangular deck frame measures 3600 mm × 2700 mm. What is its area in square metres?',
    numericAnswer: 9.72, numericTolerance: 0.02, numericUnit: 'm²',
    explanation: '3.6 m × 2.7 m = 9.72 m². Always convert to metres before multiplying for an area in m².',
    difficulty: 2,
  },
  {
    id: 'q-meas-4', type: 'multiple-choice', topic: 'Measurement & Calculations', learningAreaId: 'measurement-calculations',
    prompt: 'On a tape measure, which of these is the correct order from largest to smallest graduation?',
    options: ['mm, cm, m', 'm, cm, mm', 'cm, m, mm', 'm, mm, cm'],
    correctIndex: 1,
    explanation: 'Metres are the largest unit shown, then centimetres, then millimetres — m > cm > mm.',
    difficulty: 1,
  },

  // ---- Plans ----
  {
    id: 'q-plan-1', type: 'multiple-choice', topic: 'Plans & Specifications', learningAreaId: 'plans-specifications',
    prompt: 'A drawing at a scale of 1:100 shows a wall as 42 mm long on the page. What is the real-world length?',
    options: ['0.42 m', '4.2 m', '42 m', '420 m'],
    correctIndex: 1,
    explanation: '1:100 means every 1 unit on paper equals 100 real units. 42 mm × 100 = 4200 mm = 4.2 m.',
    difficulty: 2,
  },
  {
    id: 'q-plan-2', type: 'multiple-choice', topic: 'Plans & Specifications', learningAreaId: 'plans-specifications',
    prompt: 'Which drawing type would you check to see the internal construction and floor-to-floor heights of a building "sliced through"?',
    options: ['Floor plan', 'Elevation', 'Section', 'Site plan'],
    correctIndex: 2,
    explanation: 'A section shows the building as if cut through vertically, revealing internal construction and height relationships that a floor plan or elevation alone cannot show.',
    wrongExplanations: {
      0: 'A floor plan is a plan (top-down) view of one level — it does not show vertical/height relationships.',
      1: 'An elevation shows an external face straight-on, but not the internal construction.',
      3: 'A site plan shows the building\'s position and boundaries on the block, not internal construction.',
    },
    difficulty: 2,
  },
  {
    id: 'q-plan-3', type: 'true-false', topic: 'Plans & Specifications', learningAreaId: 'plans-specifications',
    prompt: 'An elevation drawing shows a building as if viewed from directly above.',
    options: ['True', 'False'],
    correctIndex: 1,
    explanation: 'False — a top-down view is a floor plan (or site plan). An elevation is a straight-on view of one external face of the building.',
    difficulty: 1,
  },

  // ---- Set-out ----
  {
    id: 'q-setout-1', type: 'multiple-choice', topic: 'Set-Out & Levelling', learningAreaId: 'set-out-levelling', unitCode: 'CPCCCA3002',
    prompt: 'What is the purpose of a datum on a construction site?',
    options: ['To mark the boundary of the site', 'To act as a fixed reference point that all other levels relate back to', 'To indicate where materials should be stored', 'To show the direction of north'],
    correctIndex: 1,
    explanation: 'A datum is a known, fixed reference level (or point) that every other height and level measurement on the project is related back to, keeping the whole job consistent.',
    difficulty: 2,
  },
  {
    id: 'q-setout-2', type: 'calculation', topic: 'Set-Out & Levelling', learningAreaId: 'set-out-levelling', unitCode: 'CPCCCA3002',
    prompt: 'Using the 3-4-5 method scaled up, if one side of a right angle measures 3.6 m (3 × 1.2) and the other measures 4.8 m (4 × 1.2), what should the diagonal (hypotenuse) measure for the corner to be square?',
    numericAnswer: 6, numericTolerance: 0.05, numericUnit: 'm',
    explanation: '5 × 1.2 = 6 m. The 3-4-5 ratio scales evenly — multiplying each side by the same factor keeps the triangle\'s proportions (and therefore its right angle) intact.',
    difficulty: 2,
  },
  {
    id: 'q-setout-3', type: 'multiple-choice', topic: 'Set-Out & Levelling', learningAreaId: 'set-out-levelling',
    prompt: 'When checking a rectangular frame for square by measuring both diagonals, what result confirms it is square?',
    options: ['Both diagonals measure exactly the same', 'One diagonal is longer than the other', 'The diagonals cross at 90°', 'The diagonals equal the perimeter'],
    correctIndex: 0,
    explanation: 'For a true rectangle, both diagonals are always equal in length. If they differ, the frame is out of square and needs to be adjusted before fixing.',
    difficulty: 1,
  },

  // ---- Wall framing ----
  {
    id: 'q-wall-1', type: 'identify-component', topic: 'Wall Framing', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'Which component spans horizontally above a door or window opening to carry the load down into the jamb studs?',
    options: ['Nogging', 'Lintel', 'Bottom plate', 'Cripple stud'],
    correctIndex: 1,
    explanation: 'The lintel (header) spans the opening and transfers load from above down into the jamb studs on either side.',
    wrongExplanations: { 0: 'A nogging braces between studs and provides fixing points — it plays no role spanning an opening.', 2: 'The bottom plate is the base of the wall frame, unrelated to the top of an opening.', 3: 'Cripple studs continue the regular layout above the lintel, but they don\'t span the opening themselves.' },
    difficulty: 1,
  },
  {
    id: 'q-wall-2', type: 'multiple-choice', topic: 'Wall Framing', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'What distinguishes a load-bearing wall from a non-load-bearing wall?',
    options: ['Load-bearing walls are always external', 'A load-bearing wall carries structural load from above down to the foundation, not just its own weight', 'Non-load-bearing walls never contain studs', 'Load-bearing walls are always thicker'],
    correctIndex: 1,
    explanation: 'A load-bearing wall carries load from the structure above (roof, floor, or another wall) in addition to its own weight. Whether a specific wall is load-bearing is set by the structural drawings, never assumed by its location or appearance.',
    wrongExplanations: { 0: 'Both internal and external walls can be load-bearing or non-load-bearing — location alone doesn\'t decide it.', 2: 'Non-load-bearing walls are still timber-framed with studs; they just don\'t carry load from above.', 3: 'Wall thickness alone doesn\'t indicate load-bearing status — always check the drawings.' },
    difficulty: 1,
  },
  {
    id: 'q-wall-3', type: 'multiple-choice', topic: 'Wall Framing — Plates', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'Why are the top and bottom plates commonly marked out together, held side by side?',
    options: ['It uses less timber overall', 'It guarantees stud and opening positions line up exactly between the top and bottom of the frame', 'It is faster to lift afterwards', 'Only the top plate actually needs marking'],
    correctIndex: 1,
    explanation: 'Marking both plates together transfers every mark identically to both, so studs and openings line up top-to-bottom once the frame is assembled.',
    difficulty: 2,
  },

  // ---- Wall framing — studs & spacing ----
  {
    id: 'q-wall-4', type: 'multiple-choice', topic: 'Wall Framing — Studs', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'A common stud is best described as:',
    options: ['A stud forming the side of an opening', 'A regularly-spaced stud with no special role at an opening or corner', 'A shortened stud above a lintel', 'The stud at the very end of a wall'],
    correctIndex: 1,
    explanation: 'A common stud sits at the regular layout centres and carries no special opening or corner role — that distinguishes it from jamb, cripple and end studs.',
    difficulty: 1,
  },
  {
    id: 'q-wall-5', type: 'calculation', topic: 'Wall Framing — Studs', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'A wall is 3600 mm long. At 600 mm centres, how many full stud spaces fit along it?',
    numericAnswer: 6, numericTolerance: 0, numericUnit: 'spaces',
    explanation: '3600 ÷ 600 = 6 full stud spaces (7 stud centre-lines before any end/jamb stud adjustment).',
    difficulty: 1,
  },
  {
    id: 'q-wall-6', type: 'multiple-choice', topic: 'Wall Framing — Studs', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'Why does regular stud spacing matter for sheet linings and cladding?',
    options: ['It has no real effect on linings', 'Sheet materials are manufactured in standard sizes, and regular centres let sheet edges land on a stud for fixing', 'It only matters for external cladding, never internal linings', 'It determines the colour of the lining sheets'],
    correctIndex: 1,
    explanation: 'Standard sheet widths (e.g. 1200 mm) are designed around common stud centres so sheet edges consistently land on a solid fixing point.',
    difficulty: 2,
  },

  // ---- Wall framing — openings ----
  {
    id: 'q-wall-7', type: 'multiple-choice', topic: 'Wall Framing — Openings', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'A jamb stud is best described as:',
    options: ['A shortened stud above a lintel', 'A full-height stud forming the side of an opening', 'The stud at the very end of a wall', 'A horizontal brace between studs'],
    correctIndex: 1,
    explanation: 'A jamb (trimming) stud runs full height beside an opening and supports the end of the lintel.',
    difficulty: 1,
  },
  {
    id: 'q-wall-8', type: 'multiple-choice', topic: 'Wall Framing — Openings', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'Why doesn\'t a door opening need a sill trimmer, while a window opening does?',
    options: ['Doors are always narrower than windows', 'A door opening extends to the bottom plate, so there\'s no bottom edge to frame — a window\'s sill needs its own support', 'Trimmers are purely decorative', 'It depends only on the builder\'s personal preference'],
    correctIndex: 1,
    explanation: 'A door opening runs floor-to-lintel, so the bottom plate is already the bottom of the opening. A window sits above the bottom plate, so its sill (the trimmer) needs cripple studs to support it.',
    difficulty: 2,
  },
  {
    id: 'q-wall-9', type: 'identify-component', topic: 'Wall Framing — Openings', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'Which member continues the regular stud layout above a lintel, without running full height?',
    options: ['Cripple stud', 'Jamb stud', 'Trimmer', 'End stud'],
    correctIndex: 0,
    explanation: 'A cripple stud is a shortened stud that continues the regular layout above a lintel (or below a sill trimmer).',
    wrongExplanations: { 1: 'A jamb stud runs full height beside the opening, supporting the lintel\'s end.', 2: 'A trimmer forms the sill below a window opening — it doesn\'t sit above a lintel.', 3: 'An end stud is at the outer end of the wall, unrelated to an opening.' },
    difficulty: 2,
  },

  // ---- Wall framing — lintels ----
  {
    id: 'q-wall-10', type: 'multiple-choice', topic: 'Wall Framing — Lintels', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'Why does an opening structurally need a lintel?',
    options: ['To make the opening look finished', 'To transfer the load that would otherwise pass through the missing studs, sideways into the jamb studs', 'To provide a fixing point for door hinges', 'To stop noggings from falling out'],
    correctIndex: 1,
    explanation: 'Removing studs for an opening also removes their straight-down load path. The lintel picks that load up and redirects it sideways into the jamb studs either side.',
    difficulty: 2,
  },
  {
    id: 'q-wall-11', type: 'true-false', topic: 'Wall Framing — Lintels', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'Lintel size and material can be safely reused from a similar-looking opening on a previous job, without checking the current drawings.',
    options: ['True', 'False'],
    correctIndex: 1,
    explanation: 'False — lintel size depends on that specific opening\'s span and the load above it. It must come from the current structural drawings or engineering, never assumed from another job.',
    difficulty: 2,
  },
  {
    id: 'q-wall-12', type: 'multiple-choice', topic: 'Wall Framing — Lintels', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'A lintel transfers load into which components?',
    options: ['The bottom plate directly', 'The jamb studs at each end of the opening', 'The noggings above the opening', 'The floor joists below'],
    correctIndex: 1,
    explanation: 'The lintel bears on and transfers load into the jamb studs at each end of the opening, which then carry it on down through the frame.',
    difficulty: 1,
  },

  // ---- Wall framing — noggings ----
  {
    id: 'q-wall-13', type: 'multiple-choice', topic: 'Wall Framing — Noggings', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'What is the main function of noggings in a timber wall frame?',
    options: ['To carry the roof load', 'To brace the studs, provide fixing points and act as fire blocking', 'To form the sides of a window opening', 'To level the bottom plate'],
    correctIndex: 1,
    explanation: 'Noggings restrain the studs from twisting, give a fixing point for sheet joins in linings/cladding, and help block the spread of fire within the wall cavity.',
    difficulty: 1,
  },
  {
    id: 'q-wall-14', type: 'true-false', topic: 'Wall Framing — Noggings', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'A nogging is sometimes called a "dwang" in other English-speaking countries.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'True — terminology varies regionally; "dwang" is a common equivalent term used elsewhere.',
    difficulty: 1,
  },
  {
    id: 'q-wall-15', type: 'multiple-choice', topic: 'Wall Framing — Noggings', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'Where does a nogging typically sit in a standard wall frame?',
    options: ['Fixed vertically at the wall corner', 'Fixed horizontally between two common studs, often near mid-height', 'Spanning the full opening above a door', 'Bolted to the outside of the top plate'],
    correctIndex: 1,
    explanation: 'A nogging is a short horizontal member fixed between studs, typically at mid-height or wherever the bracing/fixing design calls for it.',
    difficulty: 1,
  },

  // ---- Wall framing — set-out ----
  {
    id: 'q-wall-16', type: 'order-steps', topic: 'Wall Framing — Set-out', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'Put these wall framing steps into the correct construction sequence.',
    orderItems: ['Mark stud centres on the plates', 'Set out plate lengths and opening positions', 'Assemble and fix studs between the plates', 'Square the completed frame'],
    correctOrder: [1, 0, 2, 3],
    explanation: 'Plates are set out and opening positions marked first, stud centres are marked next, studs are then fixed between the plates, and the assembled frame is squared before it is stood up or braced.',
    difficulty: 2,
  },
  {
    id: 'q-wall-17', type: 'multiple-choice', topic: 'Wall Framing — Set-out', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'Why are opening positions marked on the plates before stud centres are worked out?',
    options: ['It makes no real difference which order they\'re marked in', 'So the regular stud layout can be planned around the fixed opening positions', 'Because openings are always marked last on real projects', 'To save time only'],
    correctIndex: 1,
    explanation: 'Opening positions come directly from the drawing and can\'t move, so they\'re marked first and the stud layout is worked out around them.',
    difficulty: 2,
  },
  {
    id: 'q-wall-18', type: 'true-false', topic: 'Wall Framing — Set-out', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'Every mark made during wall-frame set-out should be checked against the drawing again before any cutting begins.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'True — a final check against the drawing catches transcription or measuring errors before they become an expensive, already-cut mistake.',
    difficulty: 1,
  },

  // ---- Wall framing — square / diagonal ----
  {
    id: 'q-wall-19', type: 'calculation', topic: 'Wall Framing — Square', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'A rectangular wall frame measures 2400 mm × 3600 mm. Using a² + b² = c², what should each diagonal measure if the frame is square?',
    numericAnswer: 4328, numericTolerance: 3, numericUnit: 'mm',
    explanation: '2400² + 3600² = 5,760,000 + 12,960,000 = 18,720,000. √18,720,000 ≈ 4327.8 mm.',
    difficulty: 2,
  },
  {
    id: 'q-wall-20', type: 'multiple-choice', topic: 'Wall Framing — Square', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'You measure a rectangular frame\'s two diagonals and get 4328 mm and 4361 mm. What does this tell you?',
    options: ['The frame is square, since one value is close to expected', 'The frame is out of square and needs adjustment before fixing', 'The frame is too small overall', 'One side must be the wrong length'],
    correctIndex: 1,
    explanation: 'A 33 mm difference between the two diagonals means the frame is measurably out of square — both diagonals must match, not just be individually "close".',
    difficulty: 2,
  },
  {
    id: 'q-wall-21', type: 'true-false', topic: 'Wall Framing — Square', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'Comparing a rectangular frame\'s two diagonals is a reliable way to check it is square, because a true rectangle always has two equal diagonals.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'True — this follows directly from Pythagoras\' theorem: any true rectangle has two diagonals of exactly equal length.',
    difficulty: 1,
  },

  // ---- Wall framing — load path ----
  {
    id: 'q-wall-22', type: 'order-steps', topic: 'Wall Framing — Load Path', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'Put these in the correct load path order, from above an opening down to the structure below.',
    orderItems: ['Jamb studs', 'Load above the opening', 'Structure below', 'Lintel'],
    correctOrder: [1, 3, 0, 2],
    explanation: 'The load starts above the opening, is redirected sideways by the lintel, transferred into the jamb studs, and continues down into the structure below.',
    difficulty: 2,
  },
  {
    id: 'q-wall-23', type: 'multiple-choice', topic: 'Wall Framing — Load Path', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'In the general load path through a timber-framed building, what comes immediately after "Wall Framing"?',
    options: ['Roof', 'Ceiling lining', 'Floor / Foundation', 'Eaves'],
    correctIndex: 2,
    explanation: 'The general load path runs Roof → Wall Framing → Floor/Foundation → Ground.',
    difficulty: 1,
  },
  {
    id: 'q-wall-24', type: 'true-false', topic: 'Wall Framing — Load Path', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'Understanding the general load path through a building is enough basis to decide a structural member\'s size on your own.',
    options: ['True', 'False'],
    correctIndex: 1,
    explanation: 'False — load path is a conceptual understanding, not engineering design. Structural sizing is always the responsibility of a qualified engineer or the project drawings.',
    difficulty: 2,
  },

  // ---- Wall framing — common errors ----
  {
    id: 'q-wall-25', type: 'multiple-choice', topic: 'Wall Framing — Common Errors', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'A trimmer below a window opening is fixed with a small gap between it and the jamb studs on each side. What is the problem?',
    options: ['There is no real problem', 'The sill won\'t be supported at its ends and load transfer into the jamb studs is compromised', 'It makes installing the window easier', 'This only matters on external walls'],
    correctIndex: 1,
    explanation: 'A trimmer needs to sit tight against both jamb studs to transfer sill load into them properly and support the full width of the window opening.',
    difficulty: 2,
  },
  {
    id: 'q-wall-26', type: 'multiple-choice', topic: 'Wall Framing — Common Errors', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'Why is skipping the diagonal check on a frame that "looks square" a common and costly mistake?',
    options: ['It never actually causes any real problem', 'The eye can\'t reliably detect the small amount of racking that causes fitting problems later', 'Diagonal checks are only a formality with no real purpose', 'Frames cannot be out of square if all timber is straight'],
    correctIndex: 1,
    explanation: 'A frame can look square while still being out by enough to cause real problems fitting linings, cladding or the roof structure later — the eye alone isn\'t accurate enough to catch it.',
    difficulty: 2,
  },
  {
    id: 'q-wall-27', type: 'true-false', topic: 'Wall Framing — Common Errors', learningAreaId: 'wall-framing', unitCode: 'CPCCCA3004',
    prompt: 'Fixing cripple studs before the lintel has been positioned and checked can leave every cripple stud above it in the wrong place.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'True — the lintel\'s position determines exactly where the cripple studs above it land. Getting the lintel wrong first means every cripple stud built off it is also wrong.',
    difficulty: 2,
  },

  // ---- Floor framing ----
  {
    id: 'q-floor-1', type: 'multiple-choice', topic: 'Floor Systems', learningAreaId: 'floor-systems', unitCode: 'CPCCCA3003',
    prompt: 'In a timber floor frame, what do joists typically span between?',
    options: ['Stud to stud', 'Bearers (or supporting walls)', 'Rafter to rafter', 'Fascia to fascia'],
    correctIndex: 1,
    explanation: 'Floor joists span between bearers (or directly between supporting walls), directly carrying the flooring material fixed above them.',
    difficulty: 1,
  },
  {
    id: 'q-floor-2', type: 'multiple-choice', topic: 'Floor Systems', learningAreaId: 'floor-systems', unitCode: 'CPCCCA3003',
    prompt: 'What is the purpose of blocking fitted between floor joists?',
    options: ['To increase the floor span', 'To restrain joists from twisting and stiffen the floor', 'To replace the bearer', 'To level the site'],
    correctIndex: 1,
    explanation: 'Blocking prevents joists twisting under load, stiffens the overall floor and gives solid fixing at sheet flooring joins.',
    difficulty: 1,
  },
  {
    id: 'q-floor-3', type: 'true-false', topic: 'Floor Systems', learningAreaId: 'floor-systems', unitCode: 'CPCCCA3003',
    prompt: 'Actual joist size and spacing for a given span can always be safely assumed from experience on a previous job, without checking span tables or drawings.',
    options: ['True', 'False'],
    correctIndex: 1,
    explanation: 'False — span, spacing, timber grade and load all interact. Member selection must come from current span tables, engineering, or project drawings for that specific job, not assumption.',
    difficulty: 2,
  },

  // ---- Roof terminology ----
  {
    id: 'q-roof-1', type: 'multiple-choice', topic: 'Roof Terminology', learningAreaId: 'pitched-roofs', unitCode: 'CPCCCA3007',
    prompt: 'What is roof "pitch"?',
    options: ['The horizontal distance a rafter travels', 'The angle of the roof surface measured from horizontal', 'The length of the ridge board', 'The overhang distance at the eaves'],
    correctIndex: 1,
    explanation: 'Pitch is the angle the roof plane makes with the horizontal, expressed in degrees in Australian practice.',
    difficulty: 1,
  },
  {
    id: 'q-roof-2', type: 'identify-component', topic: 'Roof Terminology', learningAreaId: 'pitched-roofs',
    prompt: 'Which roof member forms the external sloping corner where two roof planes meet?',
    options: ['Valley', 'Hip', 'Ridge', 'Jack rafter'],
    correctIndex: 1,
    explanation: 'A hip is the external sloping corner where two roof planes meet, running from the ridge down to the building corner.',
    wrongExplanations: { 0: 'A valley is the internal equivalent, formed where two roof planes meet at an inward angle.', 2: 'The ridge is the horizontal member at the very top of the roof.', 3: 'A jack rafter is a shortened rafter that meets a hip or valley — it doesn\'t itself form the corner.' },
    difficulty: 2,
  },
  {
    id: 'q-roof-3', type: 'multiple-choice', topic: 'Roof Terminology', learningAreaId: 'roof-trusses', unitCode: 'CPCCCA3006',
    prompt: 'What is the main advantage of a prefabricated roof truss over a conventional cut roof?',
    options: ['It never needs bracing', 'It is engineered to span between external walls without internal support, and is delivered ready to erect', 'It uses less timber than any cut roof', 'It does not require a crane or lifting equipment'],
    correctIndex: 1,
    explanation: 'Trusses are engineered off-site to span the full building width without internal support and arrive ready to lift into place — though correct temporary and permanent bracing is still essential.',
    difficulty: 2,
  },
  {
    id: 'q-roof-4', type: 'true-false', topic: 'Roof Terminology', learningAreaId: 'eaves', unitCode: 'CPCCCA3008',
    prompt: 'The fascia board is fixed to the ends of the rafters or trusses and commonly supports the gutter.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'True — the fascia runs around the roof perimeter fixed to rafter/truss ends and is the usual fixing point for guttering.',
    difficulty: 1,
  },
  {
    id: 'q-roof-5', type: 'multiple-choice', topic: 'Roof Terminology', learningAreaId: 'pitched-roofs',
    prompt: 'A jack rafter is best described as:',
    options: ['A full-length common rafter', 'A rafter shortened because it terminates against a hip or valley', 'The horizontal ridge member', 'A brace between two rafters'],
    correctIndex: 1,
    explanation: 'A jack rafter is shorter than a common rafter because a hip or valley cuts its run short before it would otherwise reach the ridge.',
    difficulty: 1,
  },

  // ---- Basic calculations (roof/stairs) ----
  {
    id: 'q-calc-1', type: 'calculation', topic: 'Roof Calculations', learningAreaId: 'pitched-roofs', unitCode: 'CPCCCA3007',
    prompt: 'A building span is 7200 mm. What is the run (half-span) used for a symmetrical gable roof calculation?',
    numericAnswer: 3600, numericTolerance: 0, numericUnit: 'mm',
    explanation: 'For a symmetrical gable roof, the run is half the overall building span: 7200 ÷ 2 = 3600 mm.',
    difficulty: 2,
  },
  {
    id: 'q-calc-2', type: 'calculation', topic: 'Stair Calculations', learningAreaId: 'stairs', unitCode: 'CPCCCA3016',
    prompt: 'A staircase has a total rise of 2700 mm and each riser is set at 180 mm. How many risers are needed?',
    numericAnswer: 15, numericTolerance: 0, numericUnit: 'risers',
    explanation: '2700 ÷ 180 = 15 risers. The actual riser height chosen must also meet current regulatory and design requirements, not just divide evenly.',
    difficulty: 2,
  },
  {
    id: 'q-calc-3', type: 'calculation', topic: 'Set-Out Calculations', learningAreaId: 'set-out-levelling',
    prompt: 'A rectangle measures 3000 mm × 4000 mm. Using a² + b² = c², what is the diagonal length?',
    numericAnswer: 5000, numericTolerance: 5, numericUnit: 'mm',
    explanation: '3000² + 4000² = 9,000,000 + 16,000,000 = 25,000,000. √25,000,000 = 5000 mm — the classic 3-4-5 relationship scaled up by 1000.',
    difficulty: 2,
  },

  // ---- WHS ----
  {
    id: 'q-whs-1', type: 'multiple-choice', topic: 'WHS Principles', learningAreaId: 'whs-site-practice', unitCode: 'CPCCWHS2001',
    prompt: 'What does PPE stand for?',
    options: ['Personal Protective Equipment', 'Public Property Entry', 'Plant Protection Enclosure', 'Primary Provider Equipment'],
    correctIndex: 0,
    explanation: 'PPE = Personal Protective Equipment, worn to minimise exposure to identified hazards.',
    difficulty: 1,
  },
  {
    id: 'q-whs-2', type: 'multiple-choice', topic: 'WHS Principles', learningAreaId: 'whs-site-practice', unitCode: 'CPCCWHS2001',
    prompt: 'What is a SWMS used for?',
    options: ['Scheduling weekly material shipments', 'Setting out the safe method for carrying out high-risk construction work', 'Storing wall measurement specifications', 'Submitting a work modification summary'],
    correctIndex: 1,
    explanation: 'A Safe Work Method Statement (SWMS) documents high-risk construction work, its hazards, and the control measures used to carry it out safely — required before that work begins.',
    difficulty: 2,
  },
  {
    id: 'q-whs-3', type: 'true-false', topic: 'WHS Principles', learningAreaId: 'scaffolding-heights', unitCode: 'CPCCCM2012',
    prompt: 'Working at height always requires exactly the same fall-prevention control regardless of the task or site.',
    options: ['True', 'False'],
    correctIndex: 1,
    explanation: 'False — fall risk controls follow a hierarchy (elimination, then passive/engineering controls, then administrative controls/PPE) and are selected for the specific task, height and site, not applied identically everywhere.',
    difficulty: 2,
  },
  {
    id: 'q-whs-4', type: 'multiple-choice', topic: 'WHS Principles', learningAreaId: 'trade-foundations', unitCode: 'CPCCWHS1001',
    prompt: 'Before starting work on an unfamiliar construction site, a worker should primarily:',
    options: ['Begin work immediately to save time', 'Complete a site induction and understand site-specific hazards', 'Wait for a co-worker to explain informally on the job', 'Only check hazards that relate to their own trade'],
    correctIndex: 1,
    explanation: 'A site induction ensures a worker understands the site-specific hazards, emergency procedures and controls before starting — a core WHS obligation on Australian construction sites.',
    difficulty: 1,
  },
]

export const topics = Array.from(new Set(questions.map((q) => q.topic)))
export const questionsByLearningArea = (id: string) => questions.filter((q) => q.learningAreaId === id)
export const questionsByTopic = (topic: string) => questions.filter((q) => q.topic === topic)
