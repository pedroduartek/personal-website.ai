import { useCallback, useEffect, useState } from 'react'
import { OPEN_TERMINAL_WINDOW_EVENT } from '../utils/terminalWindow'

export function useTerminalWindow() {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    const handleOpenTerminalWindow = () => {
      setIsOpen(true)
    }

    window.addEventListener(
      OPEN_TERMINAL_WINDOW_EVENT,
      handleOpenTerminalWindow,
    )

    return () => {
      window.removeEventListener(
        OPEN_TERMINAL_WINDOW_EVENT,
        handleOpenTerminalWindow,
      )
    }
  }, [])

  return {
    isOpen,
    open,
    close,
  }
}
