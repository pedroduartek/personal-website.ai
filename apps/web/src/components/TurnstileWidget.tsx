import { useEffect, useRef, useState } from 'react'
import {
  TURNSTILE_SCRIPT_SRC,
  TURNSTILE_TEST_TOKEN,
  getTurnstileSiteKey,
} from '../utils/turnstile'

type TurnstileWidgetProps = {
  action: 'contact_form' | 'terminal_email'
  onTokenChange: (token: string | null) => void
  resetSignal?: number
  className?: string
  variant?: 'default' | 'terminal'
}

let turnstileScriptPromise: Promise<void> | null = null

function loadTurnstileScript() {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  if (window.turnstile) {
    return Promise.resolve()
  }

  if (turnstileScriptPromise) {
    return turnstileScriptPromise
  }

  turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${TURNSTILE_SCRIPT_SRC}"]`,
    )

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Failed to load Turnstile')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src = TURNSTILE_SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Turnstile'))
    document.head.appendChild(script)
  })

  return turnstileScriptPromise
}

export default function TurnstileWidget({
  action,
  onTokenChange,
  resetSignal = 0,
  className,
  variant = 'default',
}: TurnstileWidgetProps) {
  const siteKey = getTurnstileSiteKey()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const lastResetSignalRef = useRef(resetSignal)
  const [errorMessage, setErrorMessage] = useState('')
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    if (!siteKey) {
      onTokenChange(null)
      setErrorMessage('Spam verification is not configured right now.')
      setIsVerified(false)
      return
    }

    if (import.meta.env.MODE === 'test') {
      setErrorMessage('')
      setIsVerified(true)
      onTokenChange(TURNSTILE_TEST_TOKEN)
      return
    }

    let disposed = false

    void loadTurnstileScript()
      .then(() => {
        if (
          disposed ||
          !containerRef.current ||
          !window.turnstile ||
          widgetIdRef.current
        ) {
          return
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme: 'dark',
          size: 'flexible',
          callback: (token) => {
            if (disposed) return
            setErrorMessage('')
            setIsVerified(true)
            onTokenChange(token)
          },
          'expired-callback': () => {
            if (disposed) return
            onTokenChange(null)
            setIsVerified(false)
            setErrorMessage(
              'Spam verification expired. Please complete it again.',
            )
          },
          'error-callback': () => {
            if (disposed) return
            onTokenChange(null)
            setIsVerified(false)
            setErrorMessage(
              'Spam verification failed to load. Refresh and try again.',
            )
          },
        })
      })
      .catch(() => {
        if (disposed) return
        onTokenChange(null)
        setIsVerified(false)
        setErrorMessage(
          'Spam verification failed to load. Refresh and try again.',
        )
      })

    return () => {
      disposed = true
      onTokenChange(null)
      setIsVerified(false)
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [action, onTokenChange, siteKey])

  useEffect(() => {
    if (lastResetSignalRef.current === resetSignal) {
      return
    }

    lastResetSignalRef.current = resetSignal

    if (import.meta.env.MODE === 'test') {
      setIsVerified(true)
      onTokenChange(TURNSTILE_TEST_TOKEN)
      return
    }

    onTokenChange(null)
    setIsVerified(false)
    setErrorMessage('')
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current)
    }
  }, [onTokenChange, resetSignal])

  const successMessage =
    variant === 'terminal' ? (
      <div
        className="rounded-md border border-[#1f3f31] bg-[#091427] px-3 py-2 font-mono text-xs text-terminal-green shadow-[inset_0_1px_0_rgba(126,231,135,0.08)]"
        aria-live="polite"
      >
        <div className="flex items-center justify-between gap-3 uppercase tracking-[0.22em]">
          <span className="text-[10px] text-green-300/70">spam check</span>
          <span className="text-[10px] text-green-300/60">verified</span>
        </div>
        <div className="mt-1 text-[13px] text-terminal-green">
          Verification accepted. You can send the message now.
        </div>
      </div>
    ) : (
      <div
        className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
        aria-live="polite"
      >
        Spam check completed.
      </div>
    )

  const widgetFrameClassName =
    variant === 'terminal'
      ? 'overflow-hidden rounded-md border border-gray-800 bg-black/30 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]'
      : ''
  const errorClassName =
    variant === 'terminal'
      ? 'mt-2 font-mono text-xs text-red-300'
      : 'mt-2 text-xs text-red-300'

  return (
    <div className={className}>
      {isVerified && !errorMessage && successMessage}
      <div
        ref={containerRef}
        data-testid="turnstile-widget"
        className={
          siteKey && !isVerified
            ? widgetFrameClassName
            : `hidden ${widgetFrameClassName}`.trim()
        }
      />
      {errorMessage && (
        <p className={errorClassName} role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
