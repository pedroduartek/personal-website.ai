import { useEffect, useState } from 'react'

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only enable on desktop (2xl breakpoint is 1536px)
      const isDesktop = window.innerWidth >= 1536
      if (!isDesktop) return

      // Cmd+K on Mac, Ctrl+K on Windows/Linux
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => {
          const next = !prev
          // if opening via keyboard, record that the user used the shortcut
          if (!prev) {
            try {
              sessionStorage.setItem('commandPaletteUsed', '1')
            } catch (e) {
              // ignore
            }
          }
          return next
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  }
}
