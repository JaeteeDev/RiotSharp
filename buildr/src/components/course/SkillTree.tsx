import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { learningAreas } from '../../data/learningAreas'
import { useAppStore } from '../../store/useAppStore'
import { computeAllAreaStats } from '../../lib/progress'
import { lessonsForLearningArea } from '../../data/lessons'

const COL_W = 210
const ROW_H = 108
const NODE_W = 176
const NODE_H = 64

export function SkillTree() {
  const navigate = useNavigate()
  const lessonProgress = useAppStore((s) => s.lessonProgress)
  const questionAttempts = useAppStore((s) => s.questionAttempts)
  const [hovered, setHovered] = useState<string | null>(null)

  const stats = useMemo(() => computeAllAreaStats(lessonProgress, questionAttempts), [lessonProgress, questionAttempts])
  const statByArea = useMemo(() => Object.fromEntries(stats.map((s) => [s.areaId, s])), [stats])

  const levels = useMemo(() => {
    const memo = new Map<string, number>()
    function levelOf(id: string, seen = new Set<string>()): number {
      if (memo.has(id)) return memo.get(id)!
      if (seen.has(id)) return 0
      seen.add(id)
      const area = learningAreas.find((a) => a.id === id)!
      if (!area.prerequisites.length) {
        memo.set(id, 0)
        return 0
      }
      const lvl = 1 + Math.max(...area.prerequisites.map((p) => levelOf(p, seen)))
      memo.set(id, lvl)
      return lvl
    }
    learningAreas.forEach((a) => levelOf(a.id))
    return memo
  }, [])

  const columns = useMemo(() => {
    const cols: Record<number, string[]> = {}
    learningAreas.forEach((a) => {
      const lvl = levels.get(a.id) ?? 0
      cols[lvl] = cols[lvl] || []
      cols[lvl].push(a.id)
    })
    return cols
  }, [levels])

  const positions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {}
    Object.entries(columns).forEach(([lvlStr, ids]) => {
      const lvl = Number(lvlStr)
      ids.forEach((id, i) => {
        pos[id] = { x: lvl * COL_W + 24, y: i * ROW_H + 24 }
      })
    })
    return pos
  }, [columns])

  const maxCol = Math.max(...Object.values(levels))
  const maxRows = Math.max(...Object.values(columns).map((c) => c.length))
  const width = (maxCol + 1) * COL_W + NODE_W
  const height = maxRows * ROW_H + 48

  return (
    <div className="overflow-auto rounded-lg border border-ink-600 bg-ink-900/40 p-6">
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height} className="pointer-events-none absolute left-0 top-0">
          {learningAreas.map((area) =>
            area.prerequisites.map((prereqId) => {
              const from = positions[prereqId]
              const to = positions[area.id]
              if (!from || !to) return null
              const x1 = from.x + NODE_W
              const y1 = from.y + NODE_H / 2
              const x2 = to.x
              const y2 = to.y + NODE_H / 2
              const midX = (x1 + x2) / 2
              const active = hovered === area.id || hovered === prereqId
              return (
                <path
                  key={`${prereqId}-${area.id}`}
                  d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  stroke={active ? 'var(--color-signal-400)' : 'var(--color-ink-500)'}
                  strokeWidth={active ? 2 : 1.25}
                />
              )
            }),
          )}
        </svg>

        {learningAreas.map((area) => {
          const pos = positions[area.id]
          const stat = statByArea[area.id]
          const unlocked = area.prerequisites.every((p) => (statByArea[p]?.progressPct ?? 0) > 0) || area.prerequisites.length === 0
          const lessonCount = lessonsForLearningArea(area.id).length
          return (
            <button
              key={area.id}
              onMouseEnter={() => setHovered(area.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate(`/course#${area.id}`)}
              style={{ left: pos.x, top: pos.y, width: NODE_W, height: NODE_H }}
              className={clsx(
                'absolute flex flex-col justify-center rounded-md border px-3 py-2 text-left transition-all',
                stat.progressPct >= 100
                  ? 'border-good-400/50 bg-good-400/10'
                  : stat.progressPct > 0
                    ? 'border-signal-400/60 bg-signal-500/10'
                    : unlocked
                      ? 'border-ink-500 bg-ink-800 hover:border-ink-400'
                      : 'border-ink-700 bg-ink-850/50 opacity-60',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-technical text-[9px] text-mute-500">{area.number}</span>
                <span className="text-technical text-[9px] text-mute-500">{lessonCount} lsn</span>
              </div>
              <div className="truncate text-[12.5px] font-medium text-paper-200">{area.title}</div>
              <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-ink-700">
                <div className="h-full rounded-full bg-signal-400" style={{ width: `${stat.progressPct}%` }} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
