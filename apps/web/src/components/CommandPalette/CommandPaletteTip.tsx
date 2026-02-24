import { useEffect, useRef, useState } from 'react'

export default function CommandPaletteTip() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isMac, setIsMac] = useState(false)
  const [isFixed, setIsFixed] = useState(false)
  const [centerX, setCenterX] = useState<number | null>(null)
  const mountedRef = useRef(mounted)

  useEffect(() => {
    setIsMac(
      typeof navigator !== 'undefined' &&
        /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform),
    )

    let dismissed = false
    let used = false
    try {
      dismissed =
        typeof window !== 'undefined' &&
        sessionStorage.getItem('commandPaletteTipDismissed') !== null
      used =
        typeof window !== 'undefined' &&
        sessionStorage.getItem('commandPaletteUsed') !== null
    } catch (e) {
      dismissed = false
      used = false
    }
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1536

    // Don't show if user dismissed tip earlier or already used the keyboard shortcut
    if (dismissed || used || !isDesktop) return

    // keep a ref of mounted so focus handler can check current state

    let showTimer: number | undefined

    const clearShowTimer = () => {
      if (showTimer) {
        clearTimeout(showTimer)
        showTimer = undefined
      }
    }

    const showNow = () => {
      setMounted(true)
      requestAnimationFrame(() => setVisible(true))
    }

    const startCounter = () => {
      // if user already dismissed in another tab/window, don't start
      try {
        if (
          typeof window !== 'undefined' &&
          (sessionStorage.getItem('commandPaletteTipDismissed') !== null ||
            sessionStorage.getItem('commandPaletteUsed') !== null)
        ) {
          clearShowTimer()
          return
        }
      } catch (e) {
        // ignore
      }
      // don't start another timer if one exists
      if (showTimer) return
      // don't start if already mounted
      if (mountedRef.current) return
      showTimer = window.setTimeout(() => {
        showNow()
        showTimer = undefined
      }, 5000)
    }

    const onFocus = () => {
      if (userInteracted) startCounter()
    }
    const onBlur = () => clearShowTimer()
    const onVisibility = () => {
      if (document.visibilityState === 'visible') startCounter()
      else clearShowTimer()
    }

    let userInteracted = false
    const markInteracted = () => {
      userInteracted = true
      startCounter()
    }

    const scheduleOnLoad = () => {
      // Do NOT start the counter immediately even if the document reports focus.
      // Instead, require either an explicit window 'focus' event or a user
      // interaction (pointerdown / keydown). This avoids false positives when
      // the browser URL bar is focused.
      if (
        typeof document !== 'undefined' &&
        document.hasFocus() &&
        document.visibilityState === 'visible' &&
        userInteracted
      ) {
        startCounter()
      }
      // otherwise wait for focus or user interaction listeners below
    }

    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        scheduleOnLoad()
      } else {
        const onLoad = () => scheduleOnLoad()
        window.addEventListener('load', onLoad)
        // ensure we remove this listener in cleanup below
      }

      window.addEventListener('focus', onFocus)
      window.addEventListener('blur', onBlur)
      document.addEventListener('visibilitychange', onVisibility)
      window.addEventListener('pointerdown', markInteracted, { passive: true })
      window.addEventListener('keydown', markInteracted)
    }

    return () => {
      clearShowTimer()
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', onFocus)
        window.removeEventListener('blur', onBlur)
        document.removeEventListener('visibilitychange', onVisibility)
        window.removeEventListener('pointerdown', markInteracted)
        window.removeEventListener('keydown', markInteracted)
      }
    }
  }, [])

  useEffect(() => {
    mountedRef.current = mounted
  }, [mounted])

  useEffect(() => {
    if (!visible) return
    const auto = window.setTimeout(() => {
      // start hide animation
      setVisible(false)
      // unmount after animation
      setTimeout(() => setMounted(false), 300)
    }, 8000)
    return () => clearTimeout(auto)
  }, [visible])

  // Track button position and switch to fixed when the button scrolls out of view
  useEffect(() => {
    let raf = 0
    function update() {
      const btn =
        typeof document !== 'undefined' &&
        document.getElementById('command-palette-button')
      if (!btn) return
      const rect = btn.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      setCenterX(center)
      // if the button's bottom is above the viewport, pin to top
      setIsFixed(rect.bottom < 0)
    }

    function onScrollOrResize() {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    // initial measure
    update()
    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [])

  function dismiss() {
    try {
      if (typeof window !== 'undefined')
        sessionStorage.setItem('commandPaletteTipDismissed', '1')
    } catch (e) {
      // ignore
    }
    setVisible(false)
    setTimeout(() => setMounted(false), 300)
  }

  if (!mounted) return null

  const baseClasses =
    'max-w-xs rounded-lg border border-gray-700 bg-gray-900/95 px-3 py-2 text-sm text-gray-200 transition-opacity duration-500 ease-in-out cursor-pointer select-none'
  const visibleClass = visible ? 'opacity-100 shadow-2xl' : 'opacity-0'

  // fixed style when button scrolls away
  if (isFixed && centerX !== null) {
    const transformVisible = visible
      ? 'translateX(-50%) translateY(0px)'
      : 'translateX(-50%) translateY(-24px)'
    return (
      <button
        type="button"
        style={{
          left: `${centerX}px`,
          top: '8px',
          transform: transformVisible,
        }}
        className={`fixed z-50 hidden 2xl:block ${baseClasses} ${visibleClass}`}
        aria-label="Dismiss command palette tip"
        onClick={dismiss}
      >
        <div className="flex items-start gap-3">
          <div>
            <div className="font-medium">Try the command palette</div>
            <div className="mt-1 text-sm text-gray-200">
              Press
              <span className="mx-2 inline-block rounded bg-gray-800 px-2 py-0.5 text-sm font-bold text-white">
                {isMac ? '⌘K' : 'Ctrl+K'}
              </span>
              to open it
            </div>
          </div>
        </div>
      </button>
    )
  }

  // default: positioned under the button container
  const transformVisible = visible ? 'translateY(0px)' : 'translateY(-24px)'
  return (
    <div className="absolute left-0 top-full mt-2 z-50 hidden 2xl:block">
      <button
        type="button"
        aria-label="Dismiss command palette tip"
        onClick={dismiss}
        className={`${baseClasses} ${visibleClass}`}
        style={{ transform: transformVisible }}
      >
        <div className="flex items-start gap-3">
          <div>
            <div className="font-medium">Try the command palette</div>
            <div className="mt-1 text-sm text-gray-200">
              Press
              <span className="mx-2 inline-block rounded bg-gray-800 px-2 py-0.5 text-sm font-bold text-white">
                {isMac ? '⌘K' : 'Ctrl+K'}
              </span>
              to open it
            </div>
          </div>
        </div>
      </button>
    </div>
  )
}
