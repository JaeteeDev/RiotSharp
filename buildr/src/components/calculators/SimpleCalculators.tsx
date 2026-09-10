import { useState } from 'react'
import { CalcLayout, NumberField } from './CalcLayout'

function Rect({ a, b, label }: { a: number; b: number; label?: string }) {
  const w = 280
  const h = 180
  const pad = 20
  const scale = Math.min((w - pad * 2) / Math.max(a, 1), (h - pad * 2) / Math.max(b, 1))
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <rect x={pad} y={pad} width={a * scale} height={b * scale} fill="var(--color-timber-500)" fillOpacity="0.12" stroke="var(--color-timber-400)" strokeWidth="2" />
      {label && <text x={pad + (a * scale) / 2} y={pad + (b * scale) / 2} textAnchor="middle" fontSize="11" className="text-technical" fill="var(--color-paper-300)">{label}</text>}
    </svg>
  )
}

export function StudQuantityCalculator() {
  const [wallLength, setWallLength] = useState(4200)
  const [spacing, setSpacing] = useState(600)
  const [openings, setOpenings] = useState(1)

  const spaces = Math.floor(wallLength / spacing)
  const baseStuds = spaces + 1
  const extraPerOpening = 4 // 2 jamb studs + ~2 cripple studs, indicative only
  const estimate = baseStuds + openings * extraPerOpening

  return (
    <CalcLayout
      diagram={<Rect a={wallLength / 100} b={24} label={`${wallLength} mm wall`} />}
      controls={
        <>
          <NumberField label="Wall length" value={wallLength} onChange={setWallLength} unit="mm" />
          <NumberField label="Stud spacing" value={spacing} onChange={setSpacing} unit="mm" />
          <NumberField label="Openings" value={openings} onChange={setOpenings} unit="qty" />
        </>
      }
      formula="Base studs ≈ (Wall Length ÷ Spacing) + 1  ·  + extra studs per opening (jambs + cripples)"
      working={
        <>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">Stud spaces</span><span className="text-technical text-paper-200">{wallLength} ÷ {spacing} = {spaces}</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">Base studs</span><span className="text-technical text-paper-200">{spaces} + 1 = {baseStuds}</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">Opening allowance</span><span className="text-technical text-paper-200">{openings} × {extraPerOpening} = {openings * extraPerOpening}</span></div>
        </>
      }
      answer={`≈ ${estimate} studs`}
      explanation="This is an indicative estimate for learning purposes only — every opening changes the exact stud count depending on its width and position relative to the regular layout."
      why="A rough stud count lets you sanity-check a materials order before it's finalised — the real cut list always comes from the actual set-out and framing plan for that wall."
    />
  )
}

export function SheetQuantityCalculator() {
  const [areaWidth, setAreaWidth] = useState(3600)
  const [areaHeight, setAreaHeight] = useState(2400)
  const [sheetWidth, setSheetWidth] = useState(1200)
  const [sheetHeight, setSheetHeight] = useState(2400)

  const areaM2 = (areaWidth * areaHeight) / 1_000_000
  const sheetM2 = (sheetWidth * sheetHeight) / 1_000_000
  const sheetsAcross = Math.ceil(areaWidth / sheetWidth)
  const sheetsUp = Math.ceil(areaHeight / sheetHeight)
  const total = sheetsAcross * sheetsUp

  return (
    <CalcLayout
      diagram={<Rect a={areaWidth / 100} b={areaHeight / 100} label={`${areaM2.toFixed(1)} m²`} />}
      controls={
        <>
          <NumberField label="Area width" value={areaWidth} onChange={setAreaWidth} unit="mm" />
          <NumberField label="Area height" value={areaHeight} onChange={setAreaHeight} unit="mm" />
          <NumberField label="Sheet width" value={sheetWidth} onChange={setSheetWidth} unit="mm" />
          <NumberField label="Sheet height" value={sheetHeight} onChange={setSheetHeight} unit="mm" />
        </>
      }
      formula="Sheets = ceil(Area Width ÷ Sheet Width) × ceil(Area Height ÷ Sheet Height)"
      working={
        <>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">Across</span><span className="text-technical text-paper-200">ceil({areaWidth} ÷ {sheetWidth}) = {sheetsAcross}</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">Up</span><span className="text-technical text-paper-200">ceil({areaHeight} ÷ {sheetHeight}) = {sheetsUp}</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">Sheet area</span><span className="text-technical text-paper-200">{sheetM2.toFixed(2)} m²</span></div>
        </>
      }
      answer={`${total} full sheets`}
      explanation="This assumes full sheets laid without offcuts reused — real sheet layout also considers stud/joist lines, waste, and manufacturer laying patterns."
      why="Getting a fast, rough sheet count helps with early material estimates — the actual layout plan should follow the framing centres and any bracing/fixing requirements for the job."
    />
  )
}

export function ConcreteVolumeCalculator() {
  const [length, setLength] = useState(3000)
  const [width, setWidth] = useState(600)
  const [depth, setDepth] = useState(300)

  const volumeM3 = (length * width * depth) / 1_000_000_000

  return (
    <CalcLayout
      diagram={<Rect a={length / 30} b={width / 10} label={`${volumeM3.toFixed(2)} m³`} />}
      controls={
        <>
          <NumberField label="Length" value={length} onChange={setLength} unit="mm" />
          <NumberField label="Width" value={width} onChange={setWidth} unit="mm" />
          <NumberField label="Depth" value={depth} onChange={setDepth} unit="mm" />
        </>
      }
      formula="Volume (m³) = Length × Width × Depth ÷ 1,000,000,000 (mm³ → m³)"
      working={
        <>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">L × W × D</span><span className="text-technical text-paper-200">{length} × {width} × {depth} mm</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">In m</span><span className="text-technical text-paper-200">{(length / 1000).toFixed(2)} × {(width / 1000).toFixed(2)} × {(depth / 1000).toFixed(2)} m</span></div>
        </>
      }
      answer={`${volumeM3.toFixed(3)} m³`}
      explanation="This is the concept for a simple rectangular footing or slab section — real pours add a wastage allowance and account for reinforcement displacement."
      why="Ordering concrete by volume is one of the most common calculations on a residential site, from stump footings to slab edges — always confirm actual dimensions from the current structural drawing."
    />
  )
}

export function AreaVolumeCalculator() {
  const [length, setLength] = useState(3600)
  const [width, setWidth] = useState(2700)
  const [height, setHeight] = useState(2400)
  const [is3d, setIs3d] = useState(false)

  const areaM2 = (length * width) / 1_000_000
  const volumeM3 = (length * width * height) / 1_000_000_000

  return (
    <CalcLayout
      diagram={<Rect a={length / 100} b={width / 100} label={is3d ? `${volumeM3.toFixed(2)} m³` : `${areaM2.toFixed(2)} m²`} />}
      controls={
        <>
          <label className="mb-2 flex items-center gap-2 text-[12.5px] text-mute-400">
            <input type="checkbox" checked={is3d} onChange={(e) => setIs3d(e.target.checked)} className="accent-signal-500" />
            Include height (volume)
          </label>
          <NumberField label="Length" value={length} onChange={setLength} unit="mm" />
          <NumberField label="Width" value={width} onChange={setWidth} unit="mm" />
          {is3d && <NumberField label="Height" value={height} onChange={setHeight} unit="mm" />}
        </>
      }
      formula={is3d ? 'Volume = Length × Width × Height' : 'Area = Length × Width'}
      working={
        <>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">In metres</span><span className="text-technical text-paper-200">{(length / 1000).toFixed(2)} × {(width / 1000).toFixed(2)}{is3d ? ` × ${(height / 1000).toFixed(2)}` : ''} m</span></div>
        </>
      }
      answer={is3d ? `${volumeM3.toFixed(2)} m³` : `${areaM2.toFixed(2)} m²`}
      explanation="A general-purpose rectangular area/volume calculator — the same formula underlies floor area, lining area and simple volume takeoffs."
      why="Area and volume calculations sit underneath almost every material estimate in carpentry, from flooring sheets to concrete pours."
    />
  )
}

export function PercentageGradeCalculator() {
  const [rise, setRise] = useState(30)
  const [run, setRun] = useState(1000)
  const grade = (rise / run) * 100

  return (
    <CalcLayout
      diagram={<Rect a={run / 20} b={rise * 1.5} label={`${grade.toFixed(1)}%`} />}
      controls={
        <>
          <NumberField label="Rise" value={rise} onChange={setRise} unit="mm" />
          <NumberField label="Run" value={run} onChange={setRun} unit="mm" />
        </>
      }
      formula="Grade (%) = (Rise ÷ Run) × 100"
      working={
        <>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">Rise ÷ Run</span><span className="text-technical text-paper-200">{rise} ÷ {run} = {(rise / run).toFixed(4)}</span></div>
          <div className="flex justify-between text-[13px]"><span className="text-mute-500">× 100</span><span className="text-technical text-paper-200">{grade.toFixed(2)}%</span></div>
        </>
      }
      answer={`${grade.toFixed(2)}% grade`}
      explanation="Percentage grade expresses a fall or slope as rise per 100 units of run — commonly used for drainage falls and site grading."
      why="Falls for drainage, paths and site grading are usually specified as a percentage or a ratio — being able to convert between rise/run and a percentage grade quickly is a genuinely everyday skill."
    />
  )
}
