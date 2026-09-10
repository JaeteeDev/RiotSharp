import { useMemo, useState } from 'react'
import clsx from 'clsx'

export function StudSpacingInteractive({ defaultLength = 2400, defaultCentres = 600 }: { defaultLength?: number; defaultCentres?: 450 | 600 }) {
  const [length, setLength] = useState(defaultLength)
  const [centres, setCentres] = useState<450 | 600>(defaultCentres)

  const { spaces, positions, remainder } = useMemo(() => {
    const spaces = Math.floor(length / centres)
    const positions = Array.from({ length: spaces + 1 }, (_, i) => Math.min(i * centres, length))
    const remainder = length - spaces * centres
    return { spaces, positions, remainder }
  }, [length, centres])

  const w = 640
  const pad = 28
  const scale = (w - pad * 2) / Math.max(length, 1)

  return (
    <div className="rounded-[3px] border border-signal-500/25 bg-signal-500/[0.04] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-technical rounded-full border border-signal-400/40 bg-signal-500/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-signal-300">
          Training Example
        </span>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-[12px] text-mute-400">
            Wall length
            <input
              type="number"
              min={600}
              max={12000}
              step={100}
              value={length}
              onChange={(e) => setLength(Math.max(600, Math.min(12000, Number(e.target.value) || 0)))}
              className="text-technical w-24 rounded-[3px] border border-ink-600 bg-ink-900 px-2 py-1 text-right text-[12.5px] text-paper-100 outline-none focus:border-signal-400"
            />
            <span className="text-mute-500">mm</span>
          </label>
          <div className="flex rounded-[3px] border border-ink-600 bg-ink-900 p-0.5">
            {([450, 600] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCentres(c)}
                className={clsx('rounded-sm px-2.5 py-1 text-[12px] transition-colors', centres === c ? 'bg-ink-700 text-paper-100' : 'text-mute-500')}
              >
                {c} CTRS
              </button>
            ))}
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${w} 150`} className="w-full">
        <rect x={pad} y={20} width={length * scale} height={70} fill="none" stroke="var(--color-timber-500)" strokeWidth="2.5" />
        {positions.map((p, i) => (
          <line key={i} x1={pad + p * scale} y1={20} x2={pad + p * scale} y2={90} stroke="var(--color-timber-400)" strokeWidth={i === 0 || i === positions.length - 1 ? 2.5 : 1.75} />
        ))}
        {remainder > 0 && <line x1={pad + length * scale} y1={20} x2={pad + length * scale} y2={90} stroke="var(--color-blue-400)" strokeWidth="1.75" strokeDasharray="3 2" />}
        {/* dimension line */}
        <line x1={pad} y1={112} x2={pad + length * scale} y2={112} stroke="var(--color-mute-500)" strokeWidth="1" />
        <line x1={pad} y1={106} x2={pad} y2={118} stroke="var(--color-mute-500)" strokeWidth="1" />
        <line x1={pad + length * scale} y1={106} x2={pad + length * scale} y2={118} stroke="var(--color-mute-500)" strokeWidth="1" />
        <text x={pad + (length * scale) / 2} y={132} textAnchor="middle" fontSize="10" className="text-technical" fill="var(--color-mute-400)">
          {length.toLocaleString()} mm
        </text>
      </svg>

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 border-t border-ink-700/70 pt-3 text-[12.5px]">
        <span className="text-mute-400">
          <span className="text-technical text-paper-200">{spaces}</span> full {centres} mm spaces
        </span>
        <span className="text-mute-400">
          <span className="text-technical text-paper-200">{positions.length}</span> stud centre-lines
        </span>
        {remainder > 0 && (
          <span className="text-mute-400">
            <span className="text-technical text-blue-300">{remainder} mm</span> remainder at the end — an extra stud is added here in a real layout
          </span>
        )}
      </div>
      <p className="mt-3 text-[11.5px] leading-relaxed text-mute-500">
        This is a simplified training example only — it does not include end studs, opening framing or the effect of any doors/windows.
        Actual stud spacing must always follow the project drawings and relevant requirements, never this diagram.
      </p>
    </div>
  )
}
