import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { CommandPalette } from './CommandPalette'
import { useKeyboardShortcuts } from '../../lib/useKeyboardShortcuts'

export function AppShell() {
  useKeyboardShortcuts()
  const location = useLocation()
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-ink-950">
      <Sidebar />
      <div className="drafting-field flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main id="buildr-scroll-root" className="relative min-h-0 flex-1 overflow-y-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      <CommandPalette />
    </div>
  )
}
