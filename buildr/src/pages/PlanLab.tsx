import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn, ZoomOut, RotateCcw, Compass, Ruler, MessageSquareText, CheckCircle2, XCircle } from 'lucide-react'
import clsx from 'clsx'
import { FloorPlanSvg } from '../components/planlab/FloorPlanSvg'
import { useBreadcrumb } from '../store/useUiStore'
import { Panel } from '../components/ui/Panel'

interface Challenge {
  id: string
  prompt: string
  targetId: string
  explanation: string
}

const challenges: Challenge[] = [
  { id: 'c1', prompt: 'Find the overall front dimension of the building.', targetId: 'dim-front', explanation: 'This dimension line runs along the front of the building, with extension lines and arrowheads marking exactly what it measures.' },
  { id: 'c2', prompt: 'Find the front window\'s width dimension.', targetId: 'dim-window', explanation: 'Smaller dimension lines like this one call out individual openings — always more specific than the overall building dimension.' },
  { id: 'c3', prompt: 'Locate the section marker.', targetId: 'section-marker', explanation: 'A section marker (the circled letter) shows exactly where a separate section drawing cuts through the building — look it up in the drawing set to see that view.' },
  { id: 'c4', prompt: 'Find the north point.', targetId: 'north-point', explanation: 'The north point orients the whole drawing to the real site — essential for talking about sun, shading and site orientation.' },
  { id: 'c5', prompt: 'What scale is this drawing at?', targetId: 'scale-note', explanation: 'The scale note tells you the ratio between the drawing and real life — always check it before assuming a measurement.' },
]

export function PlanLab() {
  useBreadcrumb(['Plans'])
  const [zoom, setZoom] = useState(1)
  const [showDimensions, setShowDimensions] = useState(true)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [highlightId, setHighlightId] = useState<string | null>(null)
  const [challengeMode, setChallengeMode] = useState(false)
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [solved, setSolved] = useState<Set<string>>(new Set())

  const challenge = challenges[challengeIndex]

  function handlePartClick(id: string) {
    if (!challengeMode) {
      setHighlightId((cur) => (cur === id ? null : id))
      return
    }
    if (id === challenge.targetId) {
      setFeedback('correct')
      setSolved((s) => new Set(s).add(challenge.id))
      setHighlightId(id)
      setTimeout(() => {
        setFeedback(null)
        setChallengeIndex((i) => (i + 1) % challenges.length)
        setHighlightId(null)
      }, 1400)
    } else {
      setFeedback('incorrect')
      setTimeout(() => setFeedback(null), 700)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-ink-700 bg-ink-900/60 px-5 py-2.5">
        <button onClick={() => setZoom((z) => Math.min(2.2, z + 0.2))} className="flex h-8 w-8 items-center justify-center rounded-md border border-ink-600 text-mute-400 hover:text-paper-200">
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))} className="flex h-8 w-8 items-center justify-center rounded-md border border-ink-600 text-mute-400 hover:text-paper-200">
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => setZoom(1)} className="flex h-8 w-8 items-center justify-center rounded-md border border-ink-600 text-mute-400 hover:text-paper-200">
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <div className="hairline mx-1 h-5 w-px" />
        <ToggleChip active={showDimensions} onClick={() => setShowDimensions((v) => !v)} icon={<Ruler className="h-3.5 w-3.5" />} label="Dimensions" />
        <ToggleChip active={showAnnotations} onClick={() => setShowAnnotations((v) => !v)} icon={<MessageSquareText className="h-3.5 w-3.5" />} label="Annotations" />
        <div className="ml-auto">
          <button
            onClick={() => {
              setChallengeMode((v) => !v)
              setHighlightId(null)
              setChallengeIndex(0)
              setSolved(new Set())
            }}
            className={clsx(
              'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[12px] font-medium transition-colors',
              challengeMode ? 'border-signal-400 bg-signal-500/15 text-signal-300' : 'border-ink-600 text-mute-400 hover:text-paper-200',
            )}
          >
            <Compass className="h-3.5 w-3.5" />
            {challengeMode ? 'Exit Challenges' : 'Plan Reading Challenges'}
          </button>
        </div>
      </div>

      <div className="relative grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_300px]">
        <div className="relative overflow-auto bg-ink-950 p-8">
          <div style={{ width: 900 * zoom, transition: 'width 0.15s' }}>
            <FloorPlanSvg showDimensions={showDimensions} showAnnotations={showAnnotations} highlightId={highlightId} onPartClick={handlePartClick} />
          </div>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={clsx(
                  'pointer-events-none fixed left-1/2 top-24 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold shadow-xl',
                  feedback === 'correct' ? 'bg-good-400 text-ink-950' : 'bg-bad-400 text-ink-950',
                )}
              >
                {feedback === 'correct' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {feedback === 'correct' ? 'Correct' : 'Not that one — try again'}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-l border-ink-700 bg-ink-900/40 p-5">
          {challengeMode ? (
            <div>
              <div className="text-technical mb-2 text-[10px] uppercase tracking-wide text-signal-400">
                Challenge {challengeIndex + 1} / {challenges.length}
              </div>
              <p className="text-[14.5px] leading-relaxed text-paper-100">{challenge.prompt}</p>
              <p className="mt-4 text-[12px] text-mute-500">{solved.size} of {challenges.length} solved this round.</p>
            </div>
          ) : (
            <Panel className="p-4" title="About This Drawing">
              <p className="text-[12.5px] leading-relaxed text-mute-400">
                An illustrative single-storey floor plan drawn to make sense geometrically at 1:100. Click any wall, dimension, or symbol to highlight it, or switch to Plan Reading Challenges to
                practise finding specific information under a prompt.
              </p>
            </Panel>
          )}
        </div>
      </div>
    </div>
  )
}

function ToggleChip({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11.5px] transition-colors',
        active ? 'border-blue-400/50 bg-blue-500/10 text-blue-300' : 'border-ink-600 text-mute-400 hover:text-paper-200',
      )}
    >
      {icon}
      {label}
    </button>
  )
}
