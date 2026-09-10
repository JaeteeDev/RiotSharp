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

function Label({ x, y, children, anchor = 'middle' }: { x: number; y: number; children: string; anchor?: 'start' | 'middle' | 'end' }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="text-technical" fill="var(--color-mute-400)" fontSize="9.5">
      {children}
    </text>
  )
}

function WallFrameDiagram() {
  const lines = [
    'M20 20 L340 20', // top plate
    'M20 30 L340 30', // top plate 2
    'M20 220 L340 220', // bottom plate
    'M20 30 L20 220',
    'M60 30 L60 220',
    'M100 30 L100 130',
    'M100 90 L160 90',
    'M160 30 L160 130',
    'M130 90 L130 130',
    'M200 30 L200 220',
    'M240 150 L240 220',
    'M240 150 L310 150',
    'M310 150 L310 220',
    'M270 150 L270 220',
    'M340 30 L340 220',
  ]
  return (
    <svg viewBox="0 0 360 240" className="w-full">
      {lines.map((d, i) => (
        <motion.path key={i} d={d} stroke="var(--color-timber-400)" strokeWidth="2" fill="none" custom={i} initial="hidden" animate="visible" variants={lineVariant} />
      ))}
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
  'floor-frame-exploded': FloorFrameDiagram,
  'plan-elevation-section': PlanElevationSectionDiagram,
}

export function TechnicalDiagram({ diagramId, caption }: { diagramId: string; caption?: string }) {
  const Component = registry[diagramId]
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-900/60 p-5">
      {Component ? <Component /> : <div className="flex h-32 items-center justify-center text-[12px] text-mute-600">Diagram in development</div>}
      {caption && <p className="mt-3 text-center text-[11.5px] text-mute-500">{caption}</p>}
    </div>
  )
}
