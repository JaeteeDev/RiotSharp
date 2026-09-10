import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronsLeft, ChevronsRight, Square } from 'lucide-react'
import { primaryNav, secondaryNav, type NavItem } from '../../lib/nav'
import { useAppStore } from '../../store/useAppStore'
import clsx from 'clsx'

function NavRow({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        clsx(
          'group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors',
          isActive ? 'text-paper-100' : 'text-mute-400 hover:text-paper-200',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active-indicator"
              className="absolute inset-0 rounded-md bg-ink-700"
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            />
          )}
          {isActive && (
            <motion.span
              layoutId="sidebar-active-bar"
              className="absolute left-0 top-1.5 bottom-1.5 w-[2.5px] rounded-full bg-signal-400"
              transition={{ type: 'spring', stiffness: 500, damping: 40 }}
            />
          )}
          <Icon className="relative z-10 h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
          {!collapsed && <span className="relative z-10 font-medium tracking-wide">{item.label}</span>}
          {collapsed && (
            <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md border border-ink-600 bg-ink-800 px-2.5 py-1.5 text-xs text-paper-200 opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 z-50">
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

export function Sidebar() {
  const collapsed = useAppStore((s) => s.settings.sidebarCollapsed)
  const updateSettings = useAppStore((s) => s.updateSettings)

  return (
    <aside
      className={clsx(
        'relative flex h-full shrink-0 flex-col border-r border-ink-700 bg-ink-900 transition-[width] duration-200 ease-out',
        collapsed ? 'w-[68px]' : 'w-[248px]',
      )}
    >
      <div className={clsx('flex items-center gap-2.5 px-4 pt-5 pb-4', collapsed && 'justify-center px-0')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-signal-500/40 bg-gradient-to-br from-signal-500/20 to-transparent">
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

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2.5 py-3">
        {primaryNav.map((item) => (
          <NavRow key={item.id} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <div className="hairline mx-3" />

      <div className="flex flex-col gap-0.5 px-2.5 py-3">
        {secondaryNav.map((item) => (
          <NavRow key={item.id} item={item} collapsed={collapsed} />
        ))}
        <button
          onClick={() => updateSettings({ sidebarCollapsed: !collapsed })}
          className="mt-1 flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-mute-500 transition-colors hover:text-paper-200"
        >
          {collapsed ? <ChevronsRight className="h-[18px] w-[18px]" strokeWidth={1.75} /> : <ChevronsLeft className="h-[18px] w-[18px]" strokeWidth={1.75} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
