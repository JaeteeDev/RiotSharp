import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import type * as THREE from 'three'
import { RotateCcw, Ruler, Eye, Search, Boxes, Compass } from 'lucide-react'
import clsx from 'clsx'
import { ModelTree } from '../components/workshop/ModelTree'
import { ComponentInspector } from '../components/workshop/ComponentInspector'
import { BuildTimeline } from '../components/workshop/BuildTimeline'
import { IdentifyPanel } from '../components/workshop/IdentifyPanel'
import { FindMistakePanel } from '../components/workshop/FindMistakePanel'
import { TechRange } from '../components/ui/TechRange'
import { useBreadcrumb } from '../store/useUiStore'
import {
  wallComponents,
  mistakeScenarios,
  buildSequenceSteps,
  type WallComponentGroup,
} from '../data/wallFrame'

const WallFrameScene = lazy(() => import('../components/three/WallFrameScene').then((m) => ({ default: m.WallFrameScene })))

function ScenePlaceholder() {
  return (
    <div className="scan-loader flex h-full w-full items-center justify-center">
      <div className="text-technical text-[11px] uppercase tracking-wide text-mute-600">Initialising model…</div>
    </div>
  )
}

type WorkshopMode = 'model' | 'identify' | 'find-mistake'

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
}

function shuffledIds() {
  const ids = wallComponents.map((c) => c.id)
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[ids[i], ids[j]] = [ids[j], ids[i]]
  }
  return ids
}

export function Workshop() {
  useBreadcrumb(['Workshop', 'Wall Frame 01'])

  const [mode, setMode] = useState<WorkshopMode>('model')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set())
  const [isolatedId, setIsolatedId] = useState<string | null>(null)
  const [explodePct, setExplodePct] = useState(0)
  const [resetToken, setResetToken] = useState(0)
  const [measureMode, setMeasureMode] = useState(false)
  const [measurePoints, setMeasurePoints] = useState<THREE.Vector3[]>([])
  const [buildStepIndex, setBuildStepIndex] = useState<number | null>(null)

  // identify mode state
  const [identifyQueue, setIdentifyQueue] = useState<string[]>(() => shuffledIds())
  const [identifyIndex, setIdentifyIndex] = useState(0)
  const [identifyMode, setIdentifyMode] = useState<'training' | 'test'>('training')
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)
  const [streak, setStreak] = useState(0)
  const [lastResult, setLastResult] = useState<'correct' | 'incorrect' | null>(null)

  // find-the-mistake state
  const [foundIds, setFoundIds] = useState<Set<string>>(new Set())

  const targetId = identifyQueue[identifyIndex % identifyQueue.length]
  const targetComp = wallComponents.find((c) => c.id === targetId)

  const visibleGroups: Set<WallComponentGroup> | null = buildStepIndex !== null ? new Set(buildSequenceSteps[buildStepIndex].groups) : null

  const positionOverrides = useMemo(() => {
    if (mode !== 'find-mistake') return undefined
    const map: Record<string, [number, number, number]> = {}
    mistakeScenarios.forEach((m) => {
      if (m.positionOverride) map[m.componentId] = m.positionOverride
    })
    return map
  }, [mode])

  const sizeOverrides = useMemo(() => {
    if (mode !== 'find-mistake') return undefined
    const map: Record<string, [number, number, number]> = {}
    mistakeScenarios.forEach((m) => {
      if (m.sizeOverride) map[m.componentId] = m.sizeOverride
    })
    return map
  }, [mode])

  function resetIdentify(nextMode?: 'training' | 'test') {
    setIdentifyQueue(shuffledIds())
    setIdentifyIndex(0)
    setScore(0)
    setAttempts(0)
    setStreak(0)
    setLastResult(null)
    if (nextMode) setIdentifyMode(nextMode)
  }

  function handleSelect(id: string) {
    const cleaned = id === '' ? null : id
    if (mode === 'identify') {
      if (!cleaned) return
      const correct = cleaned === targetId
      setAttempts((a) => a + 1)
      if (correct) {
        setScore((s) => s + 1)
        setStreak((s) => s + 1)
        setLastResult('correct')
        setTimeout(() => {
          setLastResult(null)
          setIdentifyIndex((i) => i + 1)
        }, 650)
      } else {
        setStreak(0)
        setLastResult('incorrect')
        setTimeout(() => setLastResult(null), 650)
      }
      return
    }
    if (mode === 'find-mistake') {
      if (cleaned && mistakeScenarios.some((m) => m.componentId === cleaned)) {
        setFoundIds((prev) => new Set(prev).add(cleaned))
      }
      setSelectedId(cleaned)
      return
    }
    setSelectedId(cleaned)
  }

  function handleMeasurePoint(point: THREE.Vector3) {
    setMeasurePoints((prev) => {
      if (prev.length >= 2) return [point]
      return [...prev, point]
    })
  }

  function toggleHide(id: string) {
    setHiddenIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isTyping(e.target) || mode !== 'model') return
      if (e.ctrlKey || e.metaKey || e.altKey) return
      switch (e.key.toLowerCase()) {
        case 'f':
          if (selectedId) setIsolatedId((cur) => (cur === selectedId ? null : selectedId))
          break
        case 'h':
          if (e.shiftKey) setHiddenIds(new Set())
          else if (selectedId) toggleHide(selectedId)
          break
        case 'e':
          setExplodePct((p) => (p > 0 ? 0 : 60))
          break
        case 'r':
          setResetToken((t) => t + 1)
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedId, mode])

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-ink-700 bg-ink-900/60 px-5 py-2.5">
        <div className="flex rounded-[3px] border border-ink-600 bg-ink-850 p-1">
          <ModeTab active={mode === 'model'} onClick={() => setMode('model')} icon={<Boxes className="h-3.5 w-3.5" />} label="Explore & Build" />
          <ModeTab
            active={mode === 'identify'}
            onClick={() => {
              setMode('identify')
              setSelectedId(null)
              resetIdentify()
            }}
            icon={<Compass className="h-3.5 w-3.5" />}
            label="Identify"
          />
          <ModeTab
            active={mode === 'find-mistake'}
            onClick={() => {
              setMode('find-mistake')
              setSelectedId(null)
              setFoundIds(new Set())
            }}
            icon={<Search className="h-3.5 w-3.5" />}
            label="Find the Mistake"
          />
        </div>

        {mode === 'model' && (
          <>
            <div className="hairline mx-1 h-5 w-px" />
            <div className="flex items-center gap-2.5">
              <span className="text-technical text-[10px] uppercase text-mute-500">Explode</span>
              <TechRange min={0} max={100} value={explodePct} onChange={setExplodePct} className="w-32" />
              <span className="text-technical w-10 rounded-[3px] border border-ink-700 bg-ink-900 px-1.5 py-0.5 text-center text-[10.5px] text-paper-300">{explodePct}%</span>
            </div>
            <div className="hairline mx-1 h-5 w-px" />
            <button
              onClick={() => setMeasureMode((m) => !m)}
              className={clsx(
                'flex items-center gap-1.5 rounded-[3px] border px-2.5 py-1.5 text-[11.5px] transition-colors',
                measureMode ? 'border-blue-400 bg-blue-500/15 text-blue-300' : 'border-ink-600 text-mute-400 hover:text-paper-200',
              )}
            >
              <Ruler className="h-3.5 w-3.5" />
              Measure
            </button>
            <button onClick={() => setHiddenIds(new Set())} className="flex items-center gap-1.5 rounded-[3px] border border-ink-600 px-2.5 py-1.5 text-[11.5px] text-mute-400 hover:text-paper-200">
              <Eye className="h-3.5 w-3.5" />
              Show All
            </button>
          </>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setResetToken((t) => t + 1)} className="flex items-center gap-1.5 rounded-[3px] border border-ink-600 px-2.5 py-1.5 text-[11.5px] text-mute-400 hover:text-paper-200">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Camera
          </button>
        </div>
      </div>

      <div className="grid h-full min-h-0 flex-1 grid-cols-[236px_1fr_300px]">
        <div className="h-full min-h-0 overflow-y-auto border-r border-ink-700 bg-ink-900/50">
          {mode === 'model' || mode === 'find-mistake' || identifyModeShowsTree(mode, identifyMode) ? (
            <ModelTree selectedId={selectedId} hoveredId={hoveredId} hiddenIds={hiddenIds} onSelect={setSelectedId} onHover={setHoveredId} onToggleHide={toggleHide} />
          ) : (
            <div className="p-4 text-[12px] leading-relaxed text-mute-500">Model tree hidden in Test mode — identify components from the 3D view alone.</div>
          )}
        </div>

        <div className="flex h-full min-h-0 min-w-0 flex-col">
          <div className="relative min-h-0 flex-1">
            {mode === 'identify' && targetComp && (
              <IdentifyPanel
                targetName={targetComp.name.toUpperCase()}
                mode={identifyMode}
                onModeChange={(m) => resetIdentify(m)}
                score={score}
                attempts={attempts}
                streak={streak}
                lastResult={lastResult}
                onExit={() => setMode('model')}
              />
            )}
            {mode === 'find-mistake' && <FindMistakePanel foundIds={foundIds} onExit={() => setMode('model')} />}

            <Suspense fallback={<ScenePlaceholder />}>
              <WallFrameScene
                selectedId={mode === 'identify' ? null : selectedId}
                hoveredId={hoveredId}
                wrongIds={mode === 'find-mistake' ? foundIds : undefined}
                hiddenIds={mode === 'model' ? hiddenIds : new Set()}
                isolatedId={mode === 'model' ? isolatedId : null}
                explodePct={mode === 'model' ? explodePct : 0}
                visibleGroups={mode === 'model' ? visibleGroups : null}
                onSelect={handleSelect}
                onHover={setHoveredId}
                resetToken={resetToken}
                measureMode={measureMode && mode === 'model'}
                measurePoints={measurePoints}
                onMeasurePoint={handleMeasurePoint}
                positionOverrides={positionOverrides}
                sizeOverrides={sizeOverrides}
              />
            </Suspense>
          </div>

          {mode === 'model' && <BuildTimeline activeIndex={buildStepIndex} onSelect={setBuildStepIndex} />}
        </div>

        <div className="h-full min-h-0 overflow-y-auto border-l border-ink-700 bg-ink-900/50">
          {mode === 'model' ? (
            <ComponentInspector selectedId={selectedId} isolatedId={isolatedId} hiddenIds={hiddenIds} onIsolate={setIsolatedId} onToggleHide={toggleHide} />
          ) : (
            <div className="p-4">
              <div className="text-technical mb-2 text-[10px] uppercase tracking-wide text-mute-500">
                {mode === 'identify' ? 'Component ID Training' : 'Find the Mistake'}
              </div>
              <p className="text-[12.5px] leading-relaxed text-mute-500">
                {mode === 'identify'
                  ? 'Click the requested component directly in the 3D model. Training mode keeps the model tree visible as a hint — switch to Test mode to identify from the model alone.'
                  : 'Four framing errors have been deliberately introduced into this wall frame. Click through the model to find each one — every find explains exactly why it matters.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function identifyModeShowsTree(mode: WorkshopMode, identifyMode: 'training' | 'test') {
  return mode === 'identify' && identifyMode === 'training'
}

function ModeTab({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={clsx('flex items-center gap-1.5 rounded-[3px] px-3 py-1.5 text-[12px] font-medium transition-colors', active ? 'bg-ink-700 text-paper-100' : 'text-mute-500 hover:text-paper-200')}
    >
      {icon}
      {label}
    </button>
  )
}
