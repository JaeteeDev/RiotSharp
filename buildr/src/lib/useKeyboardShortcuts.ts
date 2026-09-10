import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUiStore } from '../store/useUiStore'

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const toggleCommandPalette = useUiStore((s) => s.toggleCommandPalette)
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        toggleCommandPalette()
        return
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false)
        return
      }
      if (isTyping(e.target)) return
      if (e.ctrlKey || e.metaKey || e.altKey) return

      if (e.key.toLowerCase() === 'q') {
        navigate('/quiz/session/quick')
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigate, toggleCommandPalette, setCommandPaletteOpen])
}
