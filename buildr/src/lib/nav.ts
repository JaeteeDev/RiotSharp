import {
  LayoutDashboard,
  BookOpen,
  Hammer,
  FileText,
  Calculator,
  ListChecks,
  Layers,
  Library,
  TrendingUp,
  Settings,
  Info,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  path: string
  icon: LucideIcon
  shortcut?: string
}

export const primaryNav: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { id: 'course', label: 'Course', path: '/course', icon: BookOpen },
  { id: 'workshop', label: 'Workshop', path: '/workshop', icon: Hammer },
  { id: 'plans', label: 'Plans', path: '/plans', icon: FileText },
  { id: 'calculators', label: 'Calculators', path: '/calculators', icon: Calculator },
  { id: 'quiz', label: 'Quiz Centre', path: '/quiz', icon: ListChecks },
  { id: 'flashcards', label: 'Flashcards', path: '/flashcards', icon: Layers },
  { id: 'reference', label: 'Reference', path: '/reference', icon: Library },
  { id: 'progress', label: 'Progress', path: '/progress', icon: TrendingUp },
]

export const secondaryNav: NavItem[] = [
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
  { id: 'about', label: 'About', path: '/about', icon: Info },
]
