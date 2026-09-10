import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalcLayout, NumberField } from './CalcLayout'

export function DiagonalSquareCalculator() {
  const [length, setLength] = useState(4000)
  const [width, setWidth] = useState(3000)

  const diagonal = Math.sqrt(length * length + width * width)
  const w = 280
  const h = 200
  const pad = 24
  const scale = Math.min((w - pad * 2) / Math.max(length, 1), (h - pad * 2) / Math.max(width, 1))
  const dx = length * scale
  const dy = width * scale

  return (
    <CalcLayout
      diagram={
        <svg viewBox={`-36 0 ${w + 36} ${h}`} className="w-full">
          <rect x={pad} y={pad} width={dx} height={dy} fill="none" stroke="var(--color-timber-400)" strokeWidth="2" />
          <motion.line
            x1={pad}
            y1={pad}
            x2={pad + dx}
            y2={pad + dy}
            stroke="var(--color-signal-400)"
            strokeWidth="2"
            strokeDasharray="6 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          <text x={pad + dx / 2} y={pad - 8} textAnchor="middle" className="text-technical" fontSize="10" fill="var(--color-mute-400)">{length} mm</text>
          <text x={pad - 10} y={pad + dy / 2} textAnchor="end" className="text-technical" fontSize="10" fill="var(--color-mute-400)">{width} mm</text>
        </svg>
      }
      controls={
        <>
          <NumberField label="Length" value={length} onChange={setLength} unit="mm" />
          <NumberField label="Width" value={width} onChange={setWidth} unit="mm" />
        </>
      }
      formula="a² + b² = c²  →  c = √(a² + b²)"
      working={
        <>
          <WorkLine label="a² " value={`${length}² = ${(length * length).toLocaleString()}`} />
          <WorkLine label="b² " value={`${width}² = ${(width * width).toLocaleString()}`} />
          <WorkLine label="a² + b²" value={(length * length + width * width).toLocaleString()} />
          <WorkLine label="√(a² + b²)" value={`${diagonal.toFixed(1)} mm`} />
        </>
      }
      answer={`${diagonal.toFixed(0)} mm diagonal`}
      explanation="The diagonal of a rectangle is found using Pythagoras' theorem — the square of the diagonal equals the sum of the squares of the two sides."
      why="Comparing both diagonals of a frame is one of the fastest ways to check it's square on site: if the frame is a true rectangle, both diagonals will be exactly equal."
    />
  )
}

function WorkLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[13px]">
      <span className="text-mute-500">{label}</span>
      <span className="text-technical text-paper-200">{value}</span>
    </div>
  )
}
