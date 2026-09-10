import { useState } from 'react'
import { ChevronRight, Eye, EyeOff } from 'lucide-react'
import clsx from 'clsx'
import { wallComponents, wallGroupLabels, categoryColor, type WallComponentGroup } from '../../data/wallFrame'

const groupOrder: WallComponentGroup[] = ['plates', 'studs', 'door-opening', 'window-opening', 'noggings']

export function ModelTree({
  selectedId,
  hoveredId,
  hiddenIds,
  onSelect,
  onHover,
  onToggleHide,
}: {
  selectedId: string | null
  hoveredId: string | null
  hiddenIds: Set<string>
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
  onToggleHide: (id: string) => void
}) {
  const [collapsed, setCollapsed] = useState<Set<WallComponentGroup>>(new Set())

  return (
    <div className="flex flex-col overflow-y-auto py-2">
      <div className="text-technical flex items-center gap-1.5 px-3 pb-2.5 text-[10px] uppercase tracking-wide text-mute-500">
        <span className="h-1.5 w-1.5 rounded-full bg-signal-400" />
        Wall Frame 01
      </div>
      {groupOrder.map((group) => {
        const items = wallComponents.filter((c) => c.group === group)
        const isCollapsed = collapsed.has(group)
        return (
          <div key={group}>
            <button
              onClick={() =>
                setCollapsed((s) => {
                  const next = new Set(s)
                  next.has(group) ? next.delete(group) : next.add(group)
                  return next
                })
              }
              className="flex w-full items-center gap-1.5 px-3 py-[7px] text-left text-[12px] font-medium text-paper-300 hover:text-paper-100"
            >
              <TreeChevron collapsed={isCollapsed} />
              {wallGroupLabels[group]}
              <span className="text-technical ml-auto text-[9.5px] text-mute-600">{items.length}</span>
            </button>
            {!isCollapsed && (
              <div className="tree-guide ml-[15px]">
                {items.map((c) => (
                  <div
                    key={c.id}
                    onMouseEnter={() => onHover(c.id)}
                    onMouseLeave={() => onHover(null)}
                    className={clsx(
                      'group relative flex items-center gap-2 py-[5px] pl-4 pr-3 text-[12px] transition-colors',
                      selectedId === c.id ? 'bg-signal-500/15 text-signal-300' : hoveredId === c.id ? 'bg-ink-700/50 text-paper-100' : 'text-mute-400',
                    )}
                  >
                    <span className="absolute left-0 top-1/2 h-px w-2.5 bg-ink-600" />
                    <span className="h-1.5 w-1.5 shrink-0 rounded-[1px]" style={{ background: categoryColor[c.category] }} />
                    <button onClick={() => onSelect(c.id)} className="min-w-0 flex-1 truncate text-left">
                      {c.name}
                    </button>
                    <button
                      onClick={() => onToggleHide(c.id)}
                      className="shrink-0 text-mute-600 opacity-0 transition-opacity hover:text-paper-200 group-hover:opacity-100"
                    >
                      {hiddenIds.has(c.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function TreeChevron({ collapsed }: { collapsed: boolean }) {
  return <ChevronRight className={clsx('h-3 w-3 text-mute-600 transition-transform', !collapsed && 'rotate-90')} />
}
