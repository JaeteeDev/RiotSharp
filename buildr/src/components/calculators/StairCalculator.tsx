import { useState } from 'react'
import { CalcLayout, NumberField } from './CalcLayout'

export function StairCalculator() {
  const [totalRise, setTotalRise] = useState(2700)
  const [targetRiser, setTargetRiser] = useState(180)
  const [going, setGoing] = useState(280)

  const numRisers = Math.round(totalRise / targetRiser)
  const actualRiser = totalRise / numRisers
  const numGoings = numRisers - 1
  const totalGoing = numGoings * going
  const pitchDeg = (Math.atan(actualRiser / going) * 180) / Math.PI

  const w = 320
  const h = 220
  const stepW = Math.min(26, (w - 40) / numRisers)
  const stepH = Math.min(18, (h - 50) / numRisers)

  return (
    <CalcLayout
      diagram={
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
          {Array.from({ length: numRisers }, (_, i) => {
            const x = 20 + i * stepW
            const yTop = h - 30 - (i + 1) * stepH
            const yBottom = h - 30 - i * stepH
            return (
              <g key={i}>
                <line x1={x} y1={yBottom} x2={x} y2={yTop} stroke="var(--color-timber-400)" strokeWidth="2" />
                <line x1={x} y1={yTop} x2={x + stepW} y2={yTop} stroke="var(--color-timber-400)" strokeWidth="2" />
              </g>
            )
          })}
          <line x1={20} y1={h - 30} x2={20 + numRisers * stepW} y2={h - 30} stroke="var(--color-ink-500)" strokeWidth="1.5" />
          <text x={20} y={h - 14} fontSize="9" className="text-technical" fill="var(--color-mute-400)">{numGoings} goings × {going}mm</text>
          <text x={20} y={h - 30 - numRisers * stepH - 8} fontSize="9" className="text-technical" fill="var(--color-mute-400)">{numRisers} risers</text>
        </svg>
      }
      controls={
        <>
          <NumberField label="Total rise" value={totalRise} onChange={setTotalRise} unit="mm" />
          <NumberField label="Target riser height" value={targetRiser} onChange={setTargetRiser} unit="mm" />
          <NumberField label="Going" value={going} onChange={setGoing} unit="mm" />
        </>
      }
      formula="Number of risers = round(Total Rise ÷ Target Riser)  ·  Actual Riser = Total Rise ÷ Number of Risers"
      working={
        <>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">Risers</span><span className="text-technical text-paper-200">{totalRise} ÷ {targetRiser} ≈ {numRisers}</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">Actual riser height</span><span className="text-technical text-paper-200">{actualRiser.toFixed(1)} mm</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">Goings</span><span className="text-technical text-paper-200">{numGoings} × {going} = {totalGoing} mm</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">Stair pitch</span><span className="text-technical text-paper-200">≈ {pitchDeg.toFixed(1)}°</span></div>
        </>
      }
      answer={`${numRisers} risers @ ${actualRiser.toFixed(0)} mm`}
      explanation="Risers are always a whole number — the total rise is divided evenly across that many risers, which is why the actual riser height rarely matches the target exactly."
      why="Riser and going dimensions, and how many of each a flight needs, are governed by current regulatory requirements (including the NCC) and the specific project's drawings — this trainer builds the underlying concept, but always confirm real dimensions against those current, authoritative sources rather than this or any general tool."
    />
  )
}
