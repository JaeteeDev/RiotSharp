import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { CommandPalette } from './CommandPalette'
import { useKeyboardShortcuts } from '../../lib/useKeyboardShortcuts'

export function AppShell() {
  useKeyboardShortcuts()
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-ink-950">
      <Sidebar />
      <div className="drafting-field flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main id="buildr-scroll-root" className="relative min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <CommandPalette />
    </div>
  )
}
