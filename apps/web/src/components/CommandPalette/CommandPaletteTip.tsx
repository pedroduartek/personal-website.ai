import { useEffect, useState } from 'react'

export default function CommandPaletteTip() {
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isMac, setIsMac] = useState(false)

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
        className={`max-w-xs rounded-lg border border-gray-700 bg-gray-900/95 px-3 py-2 text-sm text-gray-200 transform transition-all duration-500 ease-in-out cursor-pointer select-none ${
          visible ? 'opacity-100 translate-y-0 shadow-2xl' : 'opacity-0 -translate-y-6'
        }`}
      >
        <div className="flex items-start justify-between gap-3">
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
