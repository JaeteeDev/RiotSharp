import { useRef, useState } from 'react'
import { Download, Upload, AlertTriangle } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { useBreadcrumb } from '../store/useUiStore'
import { Panel } from '../components/ui/Panel'

const shortcuts = [
  { keys: 'Ctrl K', desc: 'Open command palette' },
  { keys: 'Esc', desc: 'Close command palette / dialogs' },
  { keys: 'Q', desc: 'Start a quick quiz' },
  { keys: 'F', desc: 'Isolate the selected Workshop component' },
  { keys: 'H', desc: 'Hide the selected Workshop component' },
  { keys: 'Shift H', desc: 'Show all hidden Workshop components' },
  { keys: 'E', desc: 'Toggle exploded view in the Workshop' },
  { keys: 'R', desc: 'Reset the Workshop camera' },
  { keys: 'Space', desc: 'Flip the current flashcard' },
  { keys: '←  →', desc: 'Mark a flashcard incorrect / correct' },
]

export function Settings() {
  useBreadcrumb(['Settings'])
  const settings = useAppStore((s) => s.settings)
  const updateSettings = useAppStore((s) => s.updateSettings)
  const resetTrainingData = useAppStore((s) => s.resetTrainingData)
  const importState = useAppStore((s) => s.importState)
  const [confirmReset, setConfirmReset] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function exportData() {
    const state = useAppStore.getState()
    const { lessonProgress, questionAttempts, flashcardRecords, settings: s, unlockedAchievementIds, streakDays, competencyRecorded } = state
    const blob = new Blob(
      [JSON.stringify({ lessonProgress, questionAttempts, flashcardRecords, settings: s, unlockedAchievementIds, streakDays, competencyRecorded }, null, 2)],
      { type: 'application/json' },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `buildr-training-data-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function importData(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string)
        importState(data)
      } catch {
        alert('That file could not be read as BUILDR training data.')
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="mx-auto max-w-[820px] px-8 py-8">
      <h1 className="font-display text-2xl font-semibold text-paper-100">Settings</h1>

      <Panel className="mt-6 p-6" title="Appearance & Motion">
        <ToggleRow label="Interface Animations" checked={settings.animations} onChange={(v) => updateSettings({ animations: v })} />
        <ToggleRow label="Reduced Motion" checked={settings.reducedMotion} onChange={(v) => updateSettings({ reducedMotion: v })} description="Minimises motion across the app, independent of your OS setting." />
        <div className="mt-4 flex items-center justify-between py-2">
          <span className="text-[13.5px] text-paper-200">3D Model Quality</span>
          <div className="flex rounded-md border border-ink-600 bg-ink-900 p-1">
            {(['standard', 'high'] as const).map((q) => (
              <button
                key={q}
                onClick={() => updateSettings({ modelQuality: q })}
                className={`rounded px-3 py-1 text-[12px] capitalize transition-colors ${settings.modelQuality === q ? 'bg-ink-700 text-paper-100' : 'text-mute-500'}`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between py-2">
          <span className="text-[13.5px] text-paper-200">UI Scale</span>
          <div className="flex rounded-md border border-ink-600 bg-ink-900 p-1">
            {(['compact', 'comfortable', 'spacious'] as const).map((scale) => (
              <button
                key={scale}
                onClick={() => updateSettings({ uiScale: scale })}
                className={`rounded px-3 py-1 text-[12px] capitalize transition-colors ${settings.uiScale === scale ? 'bg-ink-700 text-paper-100' : 'text-mute-500'}`}
              >
                {scale}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between py-2">
          <span className="text-[13.5px] text-paper-200">Units</span>
          <span className="text-technical rounded-md border border-ink-700 px-3 py-1 text-[12px] text-mute-500">Metric (mm) — locked</span>
        </div>
      </Panel>

      <Panel className="mt-6 p-6" title="Keyboard Shortcuts">
        <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
          {shortcuts.map((s) => (
            <div key={s.keys} className="flex items-center justify-between py-1">
              <span className="text-[12.5px] text-mute-400">{s.desc}</span>
              <kbd className="text-technical rounded border border-ink-600 bg-ink-900 px-2 py-0.5 text-[11px] text-paper-300">{s.keys}</kbd>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="mt-6 p-6" title="Your Data">
        <p className="text-[12.5px] leading-relaxed text-mute-500">
          All training data is stored locally in this browser — no account or server required. Export it as a backup, or import a previous export.
        </p>
        <div className="mt-4 flex gap-3">
          <button onClick={exportData} className="flex items-center gap-1.5 rounded-md border border-ink-500 px-4 py-2 text-[12.5px] text-paper-200 hover:border-ink-400">
            <Download className="h-3.5 w-3.5" />
            Export Data
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 rounded-md border border-ink-500 px-4 py-2 text-[12.5px] text-paper-200 hover:border-ink-400">
            <Upload className="h-3.5 w-3.5" />
            Import Data
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])} />
        </div>
      </Panel>

      <Panel className="mt-6 p-6" tone="danger" title="Danger Zone">
        <p className="text-[12.5px] leading-relaxed text-mute-500">Permanently clear all lesson progress, quiz history, flashcard history and settings from this browser.</p>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} className="mt-4 flex items-center gap-1.5 rounded-md border border-bad-400/40 px-4 py-2 text-[12.5px] text-bad-400 hover:bg-bad-400/10">
            <AlertTriangle className="h-3.5 w-3.5" />
            Reset Training Data
          </button>
        ) : (
          <div className="mt-4 flex items-center gap-3 rounded-md border border-bad-400/40 bg-bad-400/5 px-4 py-3">
            <span className="text-[12.5px] text-paper-200">Are you sure? This cannot be undone.</span>
            <button
              onClick={() => {
                resetTrainingData()
                setConfirmReset(false)
              }}
              className="rounded-md bg-bad-400 px-3 py-1.5 text-[12px] font-semibold text-ink-950"
            >
              Yes, reset everything
            </button>
            <button onClick={() => setConfirmReset(false)} className="text-[12px] text-mute-400">
              Cancel
            </button>
          </div>
        )}
      </Panel>
    </div>
  )
}

function ToggleRow({ label, checked, onChange, description }: { label: string; checked: boolean; onChange: (v: boolean) => void; description?: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <span className="text-[13.5px] text-paper-200">{label}</span>
        {description && <p className="text-[11.5px] text-mute-500">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? 'bg-signal-500' : 'bg-ink-600'}`}
      >
        <span className={`block h-4.5 w-4.5 rounded-full bg-white transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-1'}`} style={{ height: 18, width: 18 }} />
      </button>
    </div>
  )
}
