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
}: TurnstileWidgetProps) {
  const siteKey = getTurnstileSiteKey()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const lastResetSignalRef = useRef(resetSignal)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!siteKey) {
      onTokenChange(null)
      setErrorMessage('Spam verification is not configured right now.')
      return
    }

    if (import.meta.env.MODE === 'test') {
      setErrorMessage('')
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
            onTokenChange(token)
          },
          'expired-callback': () => {
            if (disposed) return
            onTokenChange(null)
            setErrorMessage(
              'Spam verification expired. Please complete it again.',
            )
          },
          'error-callback': () => {
            if (disposed) return
            onTokenChange(null)
            setErrorMessage(
              'Spam verification failed to load. Refresh and try again.',
            )
          },
        })
      })
      .catch(() => {
        if (disposed) return
        onTokenChange(null)
        setErrorMessage(
          'Spam verification failed to load. Refresh and try again.',
        )
      })

    return () => {
      disposed = true
      onTokenChange(null)
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
      onTokenChange(TURNSTILE_TEST_TOKEN)
      return
    }

    onTokenChange(null)
    setErrorMessage('')
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current)
    }
  }, [onTokenChange, resetSignal])

  return (
    <div className={className}>
      <div
        ref={containerRef}
        data-testid="turnstile-widget"
        className={siteKey ? '' : 'hidden'}
      />
      {errorMessage && (
        <p className="mt-2 text-xs text-red-300" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
