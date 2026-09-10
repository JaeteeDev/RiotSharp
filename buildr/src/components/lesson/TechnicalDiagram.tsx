import type { ReactElement } from 'react'
import { motion } from 'framer-motion'

const lineVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({ pathLength: 1, opacity: 1, transition: { delay: i * 0.06, duration: 0.5, ease: [0.65, 0, 0.35, 1] as const } }),
}
const labelVariant = {
  hidden: { opacity: 0, y: 4 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.3 + i * 0.06, duration: 0.3 } }),
}

function Label({ x, y, children, anchor = 'middle', fill = 'var(--color-mute-400)' }: { x: number; y: number; children: string; anchor?: 'start' | 'middle' | 'end'; fill?: string }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="text-technical" fill={fill} fontSize="9.5">
      {children}
    </text>
  )
}

// Base wall-frame silhouette shared by several diagrams — one door opening
// (left) and one window opening (right) on a standard stud layout.
const WALL_LINES = [
  'M20 20 L340 20', // top plate (outer)
  'M20 30 L340 30', // top plate (inner)
  'M20 220 L340 220', // bottom plate
  'M20 30 L20 220', // end stud
  'M60 30 L60 220', // common stud
  'M100 30 L100 130', // jamb stud (door)
  'M100 90 L160 90', // lintel (door)
  'M160 30 L160 130', // jamb stud (door)
  'M130 90 L130 130', // cripple stud (door)
  'M200 30 L200 220', // common stud
  'M240 150 L240 220', // jamb stud (window)
  'M240 150 L310 150', // lintel (window)
  'M310 150 L310 220', // jamb stud (window)
  'M270 150 L270 220', // cripple stud (window)
  'M340 30 L340 220', // end stud
]

function WallFrameBase({ markers }: { markers?: { id: string; x: number; y: number }[] }) {
  return (
    <>
      {WALL_LINES.map((d, i) => (
        <motion.path key={i} d={d} stroke="var(--color-timber-400)" strokeWidth="2" fill="none" custom={i} initial="hidden" animate="visible" variants={lineVariant} />
      ))}
      {markers?.map((m, i) => (
        <motion.g key={m.id} custom={WALL_LINES.length + i} initial="hidden" animate="visible" variants={labelVariant}>
          <circle cx={m.x} cy={m.y} r="10" fill="var(--color-ink-900)" stroke="var(--color-signal-400)" strokeWidth="1.5" />
          <text x={m.x} y={m.y + 3.5} textAnchor="middle" className="text-technical" fill="var(--color-signal-300)" fontSize="10" fontWeight={600}>
            {m.id}
          </text>
        </motion.g>
      ))}
    </>
  )
}

function WallFrameDiagram() {
  return (
    <svg viewBox="0 0 360 240" className="w-full">
      <WallFrameBase />
      <motion.g custom={16} initial="hidden" animate="visible" variants={labelVariant}>
        <Label x={180} y={12}>TOP PLATE</Label>
        <Label x={180} y={235}>BOTTOM PLATE</Label>
        <Label x={130} y={65}>LINTEL</Label>
        <Label x={40} y={125}>JAMB</Label>
        <Label x={280} y={185}>TRIMMER</Label>
      </motion.g>
    </svg>
  )
}

function WallFramePlatesDiagram() {
  return (
    <svg viewBox="0 0 360 200" className="w-full">
      <motion.path d="M20 24 L340 24" stroke="var(--color-timber-400)" strokeWidth="2" custom={0} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.path d="M20 36 L340 36" stroke="var(--color-timber-400)" strokeWidth="2" custom={1} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.path d="M20 168 L340 168" stroke="var(--color-timber-500)" strokeWidth="3" custom={2} initial="hidden" animate="visible" variants={lineVariant} />
      {[20, 60, 140, 200, 260, 340].map((x, i) => (
        <motion.path key={x} d={`M${x} 36 L${x} 168`} stroke="var(--color-timber-400)" strokeWidth="1.75" custom={3 + i} initial="hidden" animate="visible" variants={lineVariant} />
      ))}
      <motion.path d="M140 36 L140 60" stroke="var(--color-blue-400)" strokeWidth="1.75" strokeDasharray="3 2" custom={9} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.path d="M200 36 L200 60" stroke="var(--color-blue-400)" strokeWidth="1.75" strokeDasharray="3 2" custom={10} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.g custom={11} initial="hidden" animate="visible" variants={labelVariant}>
        <Label x={180} y={16} fill="var(--color-timber-300)">DOUBLE TOP PLATE</Label>
        <Label x={180} y={186} fill="var(--color-timber-300)">BOTTOM PLATE</Label>
        <Label x={170} y={52} fill="var(--color-blue-300)">OPENING MARKED ON PLATE</Label>
      </motion.g>
    </svg>
  )
}

function WallFrameOpeningDetailDiagram() {
  return (
    <svg viewBox="0 0 260 220" className="w-full">
      <motion.path d="M20 20 L240 20" stroke="var(--color-timber-400)" strokeWidth="2" custom={0} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.path d="M20 200 L240 200" stroke="var(--color-timber-400)" strokeWidth="2" custom={1} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.path d="M20 20 L20 200" stroke="var(--color-timber-500)" strokeWidth="2.5" custom={2} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.path d="M240 20 L240 200" stroke="var(--color-timber-500)" strokeWidth="2.5" custom={3} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.path d="M60 20 L60 200" stroke="var(--color-signal-400)" strokeWidth="2.5" custom={4} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.path d="M180 20 L180 200" stroke="var(--color-signal-400)" strokeWidth="2.5" custom={5} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.path d="M60 80 L180 80" stroke="var(--color-blue-400)" strokeWidth="2.5" custom={6} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.path d="M100 20 L100 80" stroke="var(--color-timber-300)" strokeWidth="1.75" custom={7} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.path d="M140 20 L140 80" stroke="var(--color-timber-300)" strokeWidth="1.75" custom={8} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.g custom={9} initial="hidden" animate="visible" variants={labelVariant}>
        <Label x={120} y={68} fill="var(--color-blue-300)">LINTEL</Label>
        <Label x={45} y={140} fill="var(--color-signal-300)">JAMB STUD</Label>
        <Label x={120} y={50} fill="var(--color-timber-200)">CRIPPLE STUDS</Label>
        <Label x={120} y={212}>OPENING</Label>
      </motion.g>
    </svg>
  )
}

function WallFrameNoggingPickDiagram() {
  return (
    <svg viewBox="0 0 360 240" className="w-full">
      <WallFrameBase markers={[{ id: 'A', x: 40, y: 20 }, { id: 'B', x: 40, y: 125 }, { id: 'C', x: 130, y: 60 }, { id: 'D', x: 320, y: 220 }]} />
    </svg>
  )
}

function WallFrameErrorPickDiagram() {
  return (
    <svg viewBox="0 0 360 240" className="w-full">
      <WallFrameBase markers={[{ id: 'A', x: 130, y: 90 }, { id: 'B', x: 200, y: 125 }, { id: 'C', x: 280, y: 185 }, { id: 'D', x: 20, y: 125 }]} />
    </svg>
  )
}

function SquareDiagonalCheckDiagram() {
  const w = 360
  const pad = 28
  const rectW = 240
  const rectH = 160
  return (
    <svg viewBox={`0 0 ${w} 200`} className="w-full">
      <motion.rect x={pad} y={20} width={rectW} height={rectH} fill="none" stroke="var(--color-timber-400)" strokeWidth="2" custom={0} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.line x1={pad} y1={20} x2={pad + rectW} y2={20 + rectH} stroke="var(--color-signal-400)" strokeWidth="2" strokeDasharray="6 4" custom={1} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.line x1={pad} y1={20 + rectH} x2={pad + rectW} y2={20} stroke="var(--color-blue-400)" strokeWidth="2" strokeDasharray="6 4" custom={2} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.g custom={3} initial="hidden" animate="visible" variants={labelVariant}>
        <Label x={pad + rectW / 2} y={12}>3600 mm</Label>
        <Label x={pad - 10} y={20 + rectH / 2} anchor="end">2400 mm</Label>
        <Label x={pad + rectW / 2 + 30} y={20 + rectH / 2 - 40} fill="var(--color-signal-300)">DIAGONAL A</Label>
        <Label x={pad + rectW / 2 - 30} y={20 + rectH / 2 + 46} fill="var(--color-blue-300)">DIAGONAL B</Label>
      </motion.g>
    </svg>
  )
}

function WallFrameSetoutPlateDiagram() {
  return (
    <svg viewBox="0 0 360 120" className="w-full">
      <motion.path d="M20 50 L340 50" stroke="var(--color-timber-500)" strokeWidth="3" custom={0} initial="hidden" animate="visible" variants={lineVariant} />
      {[20, 60, 100, 160, 200, 240, 310, 340].map((x, i) => (
        <motion.path key={x} d={`M${x} 44 L${x} 56`} stroke="var(--color-timber-300)" strokeWidth="1.5" custom={1 + i} initial="hidden" animate="visible" variants={lineVariant} />
      ))}
      <motion.path d="M100 30 L100 44" stroke="var(--color-blue-400)" strokeWidth="1.5" strokeDasharray="3 2" custom={9} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.path d="M160 30 L160 44" stroke="var(--color-blue-400)" strokeWidth="1.5" strokeDasharray="3 2" custom={10} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.g custom={11} initial="hidden" animate="visible" variants={labelVariant}>
        <Label x={130} y={22} fill="var(--color-blue-300)">O/A 600 — DOOR OPENING</Label>
        <Label x={40} y={72}>CTRS</Label>
        <Label x={270} y={72}>CTRS</Label>
        <Label x={180} y={100} fill="var(--color-mute-500)">Reference edge marked at one end of the plate</Label>
      </motion.g>
    </svg>
  )
}

function FloorFrameDiagram() {
  const joists = Array.from({ length: 6 }, (_, i) => 40 + i * 55)
  return (
    <svg viewBox="0 0 360 200" className="w-full">
      <motion.path d="M20 40 L340 40" stroke="var(--color-timber-500)" strokeWidth="4" fill="none" custom={0} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.path d="M20 40 L20 190" stroke="var(--color-timber-500)" strokeWidth="4" fill="none" custom={1} initial="hidden" animate="visible" variants={lineVariant} />
      {joists.map((x, i) => (
        <motion.path key={i} d={`M${x} 20 L${x} 190`} stroke="var(--color-timber-400)" strokeWidth="2.5" fill="none" custom={2 + i} initial="hidden" animate="visible" variants={lineVariant} />
      ))}
      <motion.g custom={10} initial="hidden" animate="visible" variants={labelVariant}>
        <Label x={60} y={12}>JOISTS</Label>
        <Label x={330} y={50} anchor="end">BEARER</Label>
      </motion.g>
    </svg>
  )
}

function PlanElevationSectionDiagram() {
  return (
    <svg viewBox="0 0 360 150" className="w-full">
      {/* floor plan */}
      <motion.rect x="10" y="20" width="90" height="70" fill="none" stroke="var(--color-blue-400)" strokeWidth="1.5" custom={0} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.path d="M55 20 L55 90" stroke="var(--color-blue-500)" strokeWidth="1" custom={1} initial="hidden" animate="visible" variants={lineVariant} />
      {/* elevation */}
      <motion.path d="M130 90 L130 30 L175 10 L220 30 L220 90 Z" fill="none" stroke="var(--color-timber-400)" strokeWidth="1.5" custom={2} initial="hidden" animate="visible" variants={lineVariant} />
      {/* section */}
      <motion.path d="M260 90 L260 30 L305 10 L350 30 L350 90" fill="none" stroke="var(--color-signal-400)" strokeWidth="1.5" custom={3} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.path d="M260 60 L350 60" stroke="var(--color-signal-400)" strokeWidth="1" strokeDasharray="3 2" custom={4} initial="hidden" animate="visible" variants={lineVariant} />
      <motion.g custom={5} initial="hidden" animate="visible" variants={labelVariant}>
        <Label x={55} y={110}>FLOOR PLAN</Label>
        <Label x={175} y={110}>ELEVATION</Label>
        <Label x={305} y={110}>SECTION</Label>
      </motion.g>
    </svg>
  )
}

const registry: Record<string, () => ReactElement> = {
  'wall-frame-labelled': WallFrameDiagram,
  'wall-frame-plates': WallFramePlatesDiagram,
  'wall-frame-opening-detail': WallFrameOpeningDetailDiagram,
  'wall-frame-nogging-pick': WallFrameNoggingPickDiagram,
  'wall-frame-error-pick': WallFrameErrorPickDiagram,
  'square-diagonal-check': SquareDiagonalCheckDiagram,
  'wall-frame-setout-plate': WallFrameSetoutPlateDiagram,
  'floor-frame-exploded': FloorFrameDiagram,
  'plan-elevation-section': PlanElevationSectionDiagram,
}

export function TechnicalDiagram({ diagramId, caption }: { diagramId: string; caption?: string }) {
  const Component = registry[diagramId]
  return (
    <div className="rounded-[3px] border border-ink-600 bg-ink-900/60 p-5">
      {Component ? <Component /> : <div className="flex h-32 items-center justify-center text-[12px] text-mute-600">Diagram in development</div>}
      {caption && <p className="mt-3 text-center text-[11.5px] text-mute-500">{caption}</p>}
    </div>
  )
}
