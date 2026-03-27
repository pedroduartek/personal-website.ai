import { useEffect, useState } from 'react'
import {
  OPEN_COMMAND_PALETTE_EVENT,
  markCommandPaletteUsed,
} from '../utils/commandPalette'
import { isKeyboardCapableDevice } from '../utils/headerLayout'

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isKeyboardCapableDevice()) return

      // Cmd+K on Mac, Ctrl+K on Windows/Linux
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => {
          const next = !prev
          if (!prev) {
            markCommandPaletteUsed()
          }
          return next
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    const handleOpenCommandPalette = () => {
      markCommandPaletteUsed()
      setIsOpen(true)
    }

    window.addEventListener(
      OPEN_COMMAND_PALETTE_EVENT,
      handleOpenCommandPalette,
    )

    return () => {
      window.removeEventListener(
        OPEN_COMMAND_PALETTE_EVENT,
        handleOpenCommandPalette,
      )
    }
  }, [])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  }
}
