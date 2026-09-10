import { useState } from 'react'
import { CalcLayout, NumberField } from './CalcLayout'

export function ThreeFourFiveCalculator() {
  const [multiplier, setMultiplier] = useState(1.2)
  const a = 3 * multiplier
  const b = 4 * multiplier
  const c = 5 * multiplier

  const w = 280
  const h = 200
  const pad = 24
  const scale = Math.min((w - pad * 2) / b, (h - pad * 2) / a)

  return (
    <CalcLayout
      diagram={
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
          <polygon
            points={`${pad},${pad + a * scale} ${pad},${pad} ${pad + b * scale},${pad + a * scale}`}
            fill="var(--color-signal-500)"
            fillOpacity="0.08"
            stroke="var(--color-signal-400)"
            strokeWidth="2"
          />
          <rect x={pad} y={pad + a * scale - 10} width="10" height="10" fill="none" stroke="var(--color-blue-400)" strokeWidth="1.5" />
          <text x={pad - 10} y={pad + (a * scale) / 2} textAnchor="end" fontSize="10" className="text-technical" fill="var(--color-mute-400)">{a.toFixed(2)} m</text>
          <text x={pad + (b * scale) / 2} y={pad + a * scale + 16} textAnchor="middle" fontSize="10" className="text-technical" fill="var(--color-mute-400)">{b.toFixed(2)} m</text>
          <text x={pad + (b * scale) / 2 - 6} y={pad + (a * scale) / 2 - 6} textAnchor="middle" fontSize="10" className="text-technical" fill="var(--color-signal-300)">{c.toFixed(2)} m</text>
        </svg>
      }
      controls={
        <>
          <NumberField label="Scale factor" value={multiplier} onChange={setMultiplier} />
          <p className="mt-2 text-[11.5px] leading-relaxed text-mute-500">Try 1.2 (3.6/4.8/6 m) for a full corner, or a smaller factor for a tighter check.</p>
        </>
      }
      formula="If sides are 3k, 4k and 5k, the angle between the 3k and 4k sides is always exactly 90°"
      working={
        <>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">Side A (3 × k)</span><span className="text-technical text-paper-200">{a.toFixed(2)} m</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">Side B (4 × k)</span><span className="text-technical text-paper-200">{b.toFixed(2)} m</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">Diagonal (5 × k)</span><span className="text-technical text-paper-200">{c.toFixed(2)} m</span></div>
        </>
      }
      answer={`${a.toFixed(2)} / ${b.toFixed(2)} / ${c.toFixed(2)} m`}
      explanation="3² + 4² = 5² (9 + 16 = 25). Any triangle with sides in this ratio contains a true right angle — scaling every side by the same factor keeps that ratio intact."
      why="On site, measure the required distance along each wall line from the corner, then check the diagonal between those two points matches the scaled '5' value — a fast way to set out or verify a square corner without a large engineer's square."
    />
  )
}
