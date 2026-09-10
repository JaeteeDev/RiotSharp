import type { ReactNode } from 'react'
import { Panel } from '../ui/Panel'

export function CalcLayout({ diagram, controls, working, formula, answer, explanation, why }: {
  diagram: ReactNode
  controls: ReactNode
  working: ReactNode
  formula: string
  answer: ReactNode
  explanation: string
  why?: string
}) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-5">
        <Panel className="p-5" title="Diagram">
          {diagram}
        </Panel>
        <Panel className="p-5" title="Inputs">
          {controls}
        </Panel>
      </div>
      <div className="flex flex-col gap-5">
        <Panel className="p-5" title="Formula">
          <div className="text-technical rounded-md bg-ink-900/60 px-3.5 py-3 text-[13.5px] text-timber-300">{formula}</div>
        </Panel>
        <Panel className="p-5" title="Working">
          <div className="flex flex-col gap-1.5">{working}</div>
        </Panel>
        <Panel className="p-5" title="Answer">
          <div className="font-display text-2xl font-semibold text-signal-300">{answer}</div>
        </Panel>
        <Panel className="p-5" title="Explanation">
          <p className="text-[12.5px] leading-relaxed text-mute-400">{explanation}</p>
          {why && (
            <div className="mt-3 rounded-md border border-blue-500/20 bg-blue-500/5 px-3 py-2.5">
              <div className="text-technical mb-1 text-[10px] uppercase tracking-wide text-blue-400">Why This Matters</div>
              <p className="text-[12px] leading-relaxed text-mute-400">{why}</p>
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}

export function NumberField({ label, value, onChange, unit }: { label: string; value: number; onChange: (v: number) => void; unit?: string }) {
  return (
    <label className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-[13px] text-mute-400">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={Number.isFinite(value) ? value : ''}
          onChange={(e) => onChange(Number(e.target.value))}
          className="text-technical w-28 rounded-md border border-ink-600 bg-ink-900 px-2.5 py-1.5 text-right text-[13.5px] text-paper-100 outline-none focus:border-signal-400"
        />
        {unit && <span className="text-technical w-8 text-[11px] text-mute-500">{unit}</span>}
      </div>
    </label>
  )
}
