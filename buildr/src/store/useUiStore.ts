import { useEffect } from 'react'
import { create } from 'zustand'

interface UiState {
  breadcrumb: string[]
  commandPaletteOpen: boolean
  setBreadcrumb: (trail: string[]) => void
  setCommandPaletteOpen: (open: boolean) => void
  toggleCommandPalette: () => void
}

export const useUiStore = create<UiState>((set) => ({
  breadcrumb: ['Dashboard'],
  commandPaletteOpen: false,
  setBreadcrumb: (trail) => set({ breadcrumb: trail }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
}))

export function useBreadcrumb(trail: string[]) {
  const setBreadcrumb = useUiStore((s) => s.setBreadcrumb)
  const key = trail.join('>')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setBreadcrumb(trail)
  }, [key])
}
