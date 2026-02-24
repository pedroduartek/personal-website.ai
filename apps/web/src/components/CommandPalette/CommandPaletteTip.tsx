import { useEffect, useState } from 'react'

export default function CommandPaletteTip() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isMac, setIsMac] = useState(false)
  const [isFixed, setIsFixed] = useState(false)
  const [centerX, setCenterX] = useState<number | null>(null)

  useEffect(() => {
    setIsMac(
      typeof navigator !== 'undefined' && /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform),
    )

    let dismissed = false
    try {
      dismissed = typeof window !== 'undefined' && sessionStorage.getItem('commandPaletteTipDismissed') !== null
    } catch (e) {
      dismissed = false
    }
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1536

    if (dismissed || !isDesktop) return

    let showTimer: number | undefined
    const schedule = () => {
      // show 5s after full page load
      showTimer = window.setTimeout(() => {
        setMounted(true)
        // allow a frame for the element to mount before starting the transition
        requestAnimationFrame(() => setVisible(true))
      }, 5000)
    }

    if (typeof window !== 'undefined') {
      if (document.readyState === 'complete') {
        schedule()
      } else {
        const onLoad = () => schedule()
        window.addEventListener('load', onLoad)
        return () => window.removeEventListener('load', onLoad)
      }
    }

    return () => {
      if (showTimer) clearTimeout(showTimer)
    }
  }, [])

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
      const btn = typeof document !== 'undefined' && document.getElementById('command-palette-button')
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
      if (typeof window !== 'undefined') sessionStorage.setItem('commandPaletteTipDismissed', '1')
    } catch (e) {
      // ignore
    }
    setVisible(false)
    setTimeout(() => setMounted(false), 300)
  }

  if (!mounted) return null

  const baseClasses = 'max-w-xs rounded-lg border border-gray-700 bg-gray-900/95 px-3 py-2 text-sm text-gray-200 transition-opacity duration-500 ease-in-out cursor-pointer select-none'
  const visibleClass = visible ? 'opacity-100 shadow-2xl' : 'opacity-0'

  // fixed style when button scrolls away
  if (isFixed && centerX !== null) {
    const transformVisible = visible ? 'translateX(-50%) translateY(0px)' : 'translateX(-50%) translateY(-24px)'
    return (
      <div
        style={{ left: `${centerX}px`, top: '8px', transform: transformVisible }}
        className={`fixed z-50 hidden 2xl:block ${baseClasses} ${visibleClass}`}
        role="button"
        tabIndex={0}
        aria-label="Dismiss command palette tip"
        onClick={dismiss}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            dismiss()
          }
        }}
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
      </div>
    )
  }

  // default: positioned under the button container
  const transformVisible = visible ? 'translateY(0px)' : 'translateY(-24px)'
  return (
    <div className="absolute left-0 top-full mt-2 z-50 hidden 2xl:block">
      <div
        role="button"
        tabIndex={0}
        aria-label="Dismiss command palette tip"
        onClick={dismiss}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            dismiss()
          }
        }}
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
      </div>
    </div>
  )
}
