import type React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import TerminalShell from './TerminalShell'

const WINDOW_MARGIN = 20
const MIN_WINDOW_WIDTH = 420
const MIN_WINDOW_HEIGHT = 280
const DEFAULT_WINDOW_WIDTH = 930
const DEFAULT_WINDOW_HEIGHT = 520
const WINDOWED_BREAKPOINT_WIDTH = 900

type WindowFrame = {
  left: number
  top: number
  width: number
  height: number
}

type ResizeHandle = 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

type DragState = {
  startLeft: number
  startTop: number
  startX: number
  startY: number
}

type ResizeState = {
  handle: ResizeHandle
  startFrame: WindowFrame
  startX: number
  startY: number
}

function getViewportSize() {
  if (typeof window === 'undefined') {
    return { width: 1440, height: 960 }
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

function isWindowedViewport(viewport: { width: number; height: number }) {
  return viewport.width >= WINDOWED_BREAKPOINT_WIDTH
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getInitialWindowFrame() {
  const viewport = getViewportSize()
  const width = Math.min(
    DEFAULT_WINDOW_WIDTH,
    viewport.width - WINDOW_MARGIN * 2,
  )
  const height = Math.min(
    DEFAULT_WINDOW_HEIGHT,
    viewport.height - WINDOW_MARGIN * 2,
  )

  return {
    left: Math.round((viewport.width - width) / 2),
    top: Math.round((viewport.height - height) / 2),
    width,
    height,
  }
}

function clampWindowFrame(frame: WindowFrame) {
  const viewport = getViewportSize()
  const minWidth = Math.min(
    MIN_WINDOW_WIDTH,
    viewport.width - WINDOW_MARGIN * 2,
  )
  const minHeight = Math.min(
    MIN_WINDOW_HEIGHT,
    viewport.height - WINDOW_MARGIN * 2,
  )
  const width = clamp(
    frame.width,
    Math.max(320, minWidth),
    viewport.width - WINDOW_MARGIN * 2,
  )
  const height = clamp(
    frame.height,
    Math.max(260, minHeight),
    viewport.height - WINDOW_MARGIN * 2,
  )
  const left = clamp(
    frame.left,
    WINDOW_MARGIN,
    viewport.width - WINDOW_MARGIN - width,
  )
  const top = clamp(
    frame.top,
    WINDOW_MARGIN,
    viewport.height - WINDOW_MARGIN - height,
  )

  return {
    left,
    top,
    width,
    height,
  }
}

function getFullViewportFrame() {
  const viewport = getViewportSize()
  const inset = 12

  return {
    left: inset,
    top: inset,
    width: Math.max(320, viewport.width - inset * 2),
    height: Math.max(280, viewport.height - inset * 2),
  }
}

function resizeWindowFrame(
  frame: WindowFrame,
  handle: ResizeHandle,
  deltaX: number,
  deltaY: number,
) {
  const viewport = getViewportSize()
  const minWidth = Math.min(
    MIN_WINDOW_WIDTH,
    viewport.width - WINDOW_MARGIN * 2,
  )
  const minHeight = Math.min(
    MIN_WINDOW_HEIGHT,
    viewport.height - WINDOW_MARGIN * 2,
  )
  let left = frame.left
  let top = frame.top
  let right = frame.left + frame.width
  let bottom = frame.top + frame.height

  if (handle.includes('e')) {
    right = clamp(
      frame.left + frame.width + deltaX,
      frame.left + minWidth,
      viewport.width - WINDOW_MARGIN,
    )
  }

  if (handle.includes('s')) {
    bottom = clamp(
      frame.top + frame.height + deltaY,
      frame.top + minHeight,
      viewport.height - WINDOW_MARGIN,
    )
  }

  if (handle.includes('w')) {
    left = clamp(
      frame.left + deltaX,
      WINDOW_MARGIN,
      frame.left + frame.width - minWidth,
    )
  }

  if (handle.includes('n')) {
    top = clamp(
      frame.top + deltaY,
      WINDOW_MARGIN,
      frame.top + frame.height - minHeight,
    )
  }

  return {
    left,
    top,
    width: right - left,
    height: bottom - top,
  }
}

interface TerminalWindowProps {
  onClose: () => void
}

export default function TerminalWindow({ onClose }: TerminalWindowProps) {
  const [frame, setFrame] = useState(() => getInitialWindowFrame())
  const dragStateRef = useRef<DragState | null>(null)
  const resizeStateRef = useRef<ResizeState | null>(null)
  const viewport = getViewportSize()
  const isWindowed = useMemo(() => isWindowedViewport(viewport), [viewport])

  useEffect(() => {
    setFrame((current) =>
      isWindowed ? clampWindowFrame(current) : getFullViewportFrame(),
    )
  }, [isWindowed])

  useEffect(() => {
    const handleResize = () => {
      setFrame((current) =>
        isWindowedViewport(getViewportSize())
          ? clampWindowFrame(current)
          : getFullViewportFrame(),
      )
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const clearPointerInteraction = useCallback(() => {
    dragStateRef.current = null
    resizeStateRef.current = null
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  }, [])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current
      if (dragState) {
        const deltaX = event.clientX - dragState.startX
        const deltaY = event.clientY - dragState.startY
        const viewportSize = getViewportSize()

        setFrame((current) => ({
          ...current,
          left: clamp(
            dragState.startLeft + deltaX,
            WINDOW_MARGIN,
            viewportSize.width - WINDOW_MARGIN - current.width,
          ),
          top: clamp(
            dragState.startTop + deltaY,
            WINDOW_MARGIN,
            viewportSize.height - WINDOW_MARGIN - current.height,
          ),
        }))
        return
      }

      const resizeState = resizeStateRef.current
      if (resizeState) {
        const deltaX = event.clientX - resizeState.startX
        const deltaY = event.clientY - resizeState.startY
        setFrame(
          resizeWindowFrame(
            resizeState.startFrame,
            resizeState.handle,
            deltaX,
            deltaY,
          ),
        )
      }
    }

    const handlePointerUp = () => {
      clearPointerInteraction()
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      clearPointerInteraction()
    }
  }, [clearPointerInteraction])

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDialogElement>) => {
      if (!isWindowed || event.button !== 0) {
        return
      }

      const target = event.target as HTMLElement
      const resizeHandleElement = target.closest<HTMLElement>(
        '[data-terminal-window-resize]',
      )

      if (resizeHandleElement) {
        const handle = resizeHandleElement.dataset.terminalWindowResize as
          | ResizeHandle
          | undefined

        if (!handle) {
          return
        }

        event.preventDefault()
        resizeStateRef.current = {
          handle,
          startFrame: frame,
          startX: event.clientX,
          startY: event.clientY,
        }
        document.body.style.userSelect = 'none'
        document.body.style.cursor = resizeHandleElement.style.cursor
        return
      }

      const withinDragHandle = target.closest(
        '[data-terminal-window-drag-handle]',
      )
      const dragBlocked = target.closest(
        '[data-terminal-window-no-drag],button,a,input,textarea,select',
      )

      if (!withinDragHandle || dragBlocked) {
        return
      }

      event.preventDefault()
      dragStateRef.current = {
        startLeft: frame.left,
        startTop: frame.top,
        startX: event.clientX,
        startY: event.clientY,
      }
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'move'
    },
    [frame, isWindowed],
  )

  const windowStyle = isWindowed
    ? {
        left: frame.left,
        top: frame.top,
        width: frame.width,
        height: frame.height,
      }
    : {
        left: 12,
        top: 12,
        width: 'calc(100vw - 24px)',
        height: 'calc(100vh - 24px)',
      }

  return (
    <div
      className="fixed inset-0 z-[55] bg-overlay/16 backdrop-blur-[1px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <dialog
        open
        aria-label="Floating terminal window"
        className="absolute m-0 overflow-hidden rounded-[1.35rem] border border-[#1b2534] bg-terminal-bg p-0 shadow-[0_30px_90px_rgba(2,6,23,0.55)]"
        style={windowStyle}
        onPointerDown={handlePointerDown}
      >
        {isWindowed ? (
          <>
            <div
              data-terminal-window-resize="n"
              className="absolute inset-x-4 top-0 z-20 h-2 cursor-ns-resize"
              style={{ cursor: 'ns-resize' }}
            />
            <div
              data-terminal-window-resize="e"
              className="absolute bottom-4 right-0 top-4 z-20 w-2 cursor-ew-resize"
              style={{ cursor: 'ew-resize' }}
            />
            <div
              data-terminal-window-resize="s"
              className="absolute inset-x-4 bottom-0 z-20 h-2 cursor-ns-resize"
              style={{ cursor: 'ns-resize' }}
            />
            <div
              data-terminal-window-resize="w"
              className="absolute bottom-4 left-0 top-4 z-20 w-2 cursor-ew-resize"
              style={{ cursor: 'ew-resize' }}
            />
            <div
              data-terminal-window-resize="ne"
              className="absolute right-0 top-0 z-20 h-4 w-4 cursor-nesw-resize"
              style={{ cursor: 'nesw-resize' }}
            />
            <div
              data-terminal-window-resize="se"
              className="absolute bottom-0 right-0 z-20 h-4 w-4 cursor-nwse-resize"
              style={{ cursor: 'nwse-resize' }}
            />
            <div
              data-terminal-window-resize="sw"
              className="absolute bottom-0 left-0 z-20 h-4 w-4 cursor-nesw-resize"
              style={{ cursor: 'nesw-resize' }}
            />
            <div
              data-terminal-window-resize="nw"
              className="absolute left-0 top-0 z-20 h-4 w-4 cursor-nwse-resize"
              style={{ cursor: 'nwse-resize' }}
            />
          </>
        ) : null}

        <div className="flex h-full min-h-0">
          <TerminalShell onClose={onClose} />
        </div>
      </dialog>
    </div>
  )
}
