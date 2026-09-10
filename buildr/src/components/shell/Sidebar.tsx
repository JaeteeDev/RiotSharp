import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronsLeft, ChevronsRight, Square } from 'lucide-react'
import { primaryNav, secondaryNav, type NavItem } from '../../lib/nav'
import { useAppStore } from '../../store/useAppStore'
import { computeOverallProgress } from '../../lib/progress'
import clsx from 'clsx'

function NavRow({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        clsx(
          'group relative flex items-center gap-3 rounded-[3px] px-3 py-[9px] text-[13px] transition-colors',
          isActive ? 'text-paper-100' : 'text-mute-400 hover:text-paper-200',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active-indicator"
              className="absolute inset-0 rounded-[3px] bg-ink-700"
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            />
          )}
          {isActive && (
            <motion.span
              layoutId="sidebar-active-bar"
              className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-signal-400"
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            />
          )}
          <Icon className="relative z-10 h-[17px] w-[17px] shrink-0" strokeWidth={1.75} />
          {!collapsed && <span className="relative z-10 font-medium tracking-wide">{item.label}</span>}
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-[3px] border border-ink-600 bg-ink-800 px-2.5 py-1.5 text-xs text-paper-200 opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 z-50">
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

function SectionLabel({ children, collapsed }: { children: string; collapsed: boolean }) {
  if (collapsed) return <div className="mx-2.5 mt-1 mb-1.5 h-px bg-ink-700" />
  return <div className="text-technical px-3 pb-1.5 pt-1 text-[9px] uppercase tracking-[0.18em] text-mute-600">{children}</div>
}

export function Sidebar() {
  const collapsed = useAppStore((s) => s.settings.sidebarCollapsed)
  const updateSettings = useAppStore((s) => s.updateSettings)
  const lessonProgress = useAppStore((s) => s.lessonProgress)
  const overall = computeOverallProgress(lessonProgress)

  return (
    <aside
      className={clsx(
        'relative flex h-full shrink-0 flex-col border-r border-ink-700 bg-ink-900 transition-[width] duration-200 ease-out',
        collapsed ? 'w-[64px]' : 'w-[236px]',
      )}
    >
      <div className={clsx('flex items-center gap-2.5 px-4 pt-5 pb-4', collapsed && 'justify-center px-0')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[3px] border border-signal-500/40 bg-signal-500/10">
          <Square className="h-4 w-4 text-signal-400" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <div className="font-display text-[15px] font-semibold tracking-[0.08em] text-paper-100">BUILDR</div>
            <div className="text-technical text-[9px] uppercase tracking-[0.16em] text-mute-500">CPC30220 · Apprentice</div>
          </div>
        )}
      </div>

      <div className="hairline mx-3" />

      <nav className="flex flex-1 flex-col overflow-y-auto px-2.5 py-3">
        <SectionLabel collapsed={collapsed}>Workspace</SectionLabel>
        <div className="flex flex-col gap-0.5">
          {primaryNav.map((item) => (
            <NavRow key={item.id} item={item} collapsed={collapsed} />
          ))}
        </div>

        <div className="mt-auto pt-4">
          {collapsed ? (
            <div className="mx-auto flex flex-col items-center gap-1 py-2 text-mute-600">
              <span className="text-technical text-[9px]">{overall.pct}%</span>
            </div>
          ) : (
            <div className="rounded-[3px] border border-ink-700 bg-ink-850/50 px-3 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-technical text-[9px] uppercase tracking-[0.14em] text-mute-600">Qualification</span>
                <span className="text-technical text-[11px] text-paper-300">{overall.pct}%</span>
              </div>
              <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-ink-700">
                <motion.div
                  className="h-full bg-signal-400"
                  animate={{ width: `${overall.pct}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <div className="text-technical mt-1.5 text-[9.5px] text-mute-600">{overall.completed} / {overall.total} lessons</div>
            </div>
          )}
        </div>
      </nav>

      <div className="hairline mx-3" />

      <div className="flex flex-col gap-0.5 px-2.5 py-3">
        {secondaryNav.map((item) => (
          <NavRow key={item.id} item={item} collapsed={collapsed} />
        ))}
        <button
          onClick={() => updateSettings({ sidebarCollapsed: !collapsed })}
          className="mt-1 flex items-center gap-3 rounded-[3px] px-3 py-[9px] text-[13px] text-mute-500 transition-colors hover:text-paper-200"
        >
          {collapsed ? <ChevronsRight className="h-[17px] w-[17px]" strokeWidth={1.75} /> : <ChevronsLeft className="h-[17px] w-[17px]" strokeWidth={1.75} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
