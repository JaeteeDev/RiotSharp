import { useState } from 'react'
import clsx from 'clsx'
import { CalcLayout, NumberField } from './CalcLayout'
import { Panel } from '../ui/Panel'

function RoofCrossSection({ pitchDeg }: { pitchDeg: number }) {
  const w = 320
  const h = 220
  const baseY = 190
  const halfSpan = 130
  const cx = w / 2
  const rad = (pitchDeg * Math.PI) / 180
  const riseAtSpan = Math.tan(rad) * halfSpan
  const apexY = Math.max(30, baseY - riseAtSpan)

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      <line x1={cx - halfSpan} y1={baseY} x2={cx + halfSpan} y2={baseY} stroke="var(--color-ink-500)" strokeWidth="1.5" />
      <path
        d={`M ${cx - halfSpan} ${baseY} L ${cx} ${apexY} L ${cx + halfSpan} ${baseY}`}
        fill="none"
        stroke="var(--color-timber-400)"
        strokeWidth="2.5"
        style={{ transition: 'd 0.15s ease-out' }}
      />
      <line x1={cx} y1={baseY} x2={cx} y2={apexY} stroke="var(--color-blue-400)" strokeWidth="1" strokeDasharray="4 3" />
      <path d={`M ${cx - 30} ${baseY} A 30 30 0 0 0 ${cx - 30 + 30 * Math.cos(rad)} ${baseY - 30 * Math.sin(rad)}`} fill="none" stroke="var(--color-signal-400)" strokeWidth="1.5" />
      <text x={cx - 45} y={baseY - 10} fontSize="10" className="text-technical" fill="var(--color-signal-300)">{pitchDeg.toFixed(1)}°</text>
      <text x={cx} y={baseY + 16} textAnchor="middle" fontSize="10" className="text-technical" fill="var(--color-mute-400)">RUN</text>
      <text x={cx + 6} y={(apexY + baseY) / 2} fontSize="10" className="text-technical" fill="var(--color-blue-300)">RISE</text>
    </svg>
  )
}

export function RoofPitchCalculator() {
  const [tab, setTab] = useState<'learn' | 'practise' | 'calculate'>('calculate')
  const [pitchDeg, setPitchDeg] = useState(22.5)
  const [span, setSpan] = useState(7200)

  const run = span / 2
  const riseMm = run * Math.tan((pitchDeg * Math.PI) / 180)
  const rafterLength = Math.sqrt(run * run + riseMm * riseMm)

  return (
    <div>
      <div className="mb-5 flex rounded-md border border-ink-600 bg-ink-850 p-1 w-fit">
        {(['learn', 'practise', 'calculate'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx('rounded px-4 py-1.5 text-[12.5px] font-medium capitalize transition-colors', tab === t ? 'bg-ink-700 text-paper-100' : 'text-mute-500')}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'learn' && (
        <Panel className="p-6">
          <h3 className="font-display mb-3 text-[16px] font-semibold text-paper-100">Rise, Run & Pitch</h3>
          <p className="text-[13.5px] leading-relaxed text-paper-300">
            Roof pitch is the angle between the roof surface and the horizontal. It's calculated from two measurements: <strong className="text-timber-300">rise</strong> (vertical height gained)
            and <strong className="text-timber-300">run</strong> (horizontal distance covered) — the same rise/run relationship used in stair and drainage-grade calculations, just applied to a roof plane.
          </p>
          <div className="mt-4 rounded-md bg-ink-900/60 px-4 py-3">
            <span className="text-technical text-[13px] text-timber-300">Pitch (°) = arctan(Rise ÷ Run)</span>
          </div>
          <p className="mt-4 text-[13.5px] leading-relaxed text-paper-300">
            On a symmetrical gable roof, run is simply half the overall building span — the rafter only needs to cross from the wall to the centre ridge, not the full width of the building.
          </p>
        </Panel>
      )}

      {tab === 'practise' && (
        <Panel className="p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
            <RoofCrossSection pitchDeg={pitchDeg} />
            <div>
              <div className="text-technical mb-2 text-[10px] uppercase tracking-wide text-mute-500">Drag to change pitch</div>
              <input type="range" min={0} max={45} step={0.5} value={pitchDeg} onChange={(e) => setPitchDeg(Number(e.target.value))} className="w-full accent-signal-500" />
              <div className="font-display mt-2 text-3xl font-semibold text-signal-300">{pitchDeg.toFixed(1)}°</div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-mute-500">
                Watch how the roof rotates around the wall top-plate line as pitch changes — the run stays fixed while the rise (and therefore the rafter length) grows with a steeper pitch.
              </p>
            </div>
          </div>
        </Panel>
      )}

      {tab === 'calculate' && (
        <CalcLayout
          diagram={<RoofCrossSection pitchDeg={pitchDeg} />}
          controls={
            <>
              <NumberField label="Building span" value={span} onChange={setSpan} unit="mm" />
              <div className="flex items-center justify-between gap-3 py-1.5">
                <span className="text-[13px] text-mute-400">Pitch</span>
                <input type="range" min={0} max={45} step={0.5} value={pitchDeg} onChange={(e) => setPitchDeg(Number(e.target.value))} className="w-32 accent-signal-500" />
                <span className="text-technical w-12 text-right text-[13px] text-paper-200">{pitchDeg.toFixed(1)}°</span>
              </div>
            </>
          }
          formula="Run = Span ÷ 2   ·   Rise = Run × tan(Pitch)   ·   Rafter = √(Run² + Rise²)"
          working={
            <>
              <div className="flex justify-between text-[13px]"><span className="text-mute-500">Run</span><span className="text-technical text-paper-200">{span} ÷ 2 = {run.toFixed(0)} mm</span></div>
              <div className="flex justify-between text-[13px]"><span className="text-mute-500">Rise</span><span className="text-technical text-paper-200">{run.toFixed(0)} × tan({pitchDeg.toFixed(1)}°) = {riseMm.toFixed(0)} mm</span></div>
              <div className="flex justify-between text-[13px]"><span className="text-mute-500">Rafter length</span><span className="text-technical text-paper-200">√({run.toFixed(0)}² + {riseMm.toFixed(0)}²)</span></div>
            </>
          }
          answer={`${rafterLength.toFixed(0)} mm common rafter`}
          explanation="This gives the theoretical rafter length along the roof line from wall top-plate to ridge centre — real rafter length also needs birdsmouth and overhang allowances, which are covered in the Roof Lab."
          why="Rafter length, cut angles and the amount of roofing material all flow directly from this one rise/run/pitch relationship — get it right here and every downstream measurement follows."
        />
      )}
    </div>
  )
}
