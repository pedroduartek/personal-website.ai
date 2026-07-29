import { useEffect, useState } from 'react'
import PageSEO from '../../components/seo/PageSEO'
import { generateGuid } from '../../utils/guid'

type ClipboardStatus = 'copying' | 'copied' | 'blocked'

async function writeToClipboard(value: string) {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    throw new Error('Clipboard access is unavailable.')
  }

  await navigator.clipboard.writeText(value)
}

export default function NewGuidPage() {
  const [guid, setGuid] = useState(() => generateGuid())
  const [clipboardStatus, setClipboardStatus] =
    useState<ClipboardStatus>('copying')
  const [statusMessage, setStatusMessage] = useState(
    'Generating a fresh GUID and copying it to your clipboard...',
  )

  useEffect(() => {
    let cancelled = false

    async function syncClipboard() {
      setClipboardStatus('copying')
      setStatusMessage('Copying the fresh GUID to your clipboard...')

      try {
        await writeToClipboard(guid)

        if (cancelled) return

        setClipboardStatus('copied')
        setStatusMessage('Fresh GUID copied to your clipboard.')
      } catch {
        if (cancelled) return

        setClipboardStatus('blocked')
        setStatusMessage(
          'Automatic clipboard copy was blocked. Use the copy button below.',
        )
      }
    }

    void syncClipboard()

    return () => {
      cancelled = true
    }
  }, [guid])

  async function copyCurrentGuid() {
    setClipboardStatus('copying')
    setStatusMessage('Copying the current GUID to your clipboard...')

    try {
      await writeToClipboard(guid)
      setClipboardStatus('copied')
      setStatusMessage('GUID copied to your clipboard.')
    } catch {
      setClipboardStatus('blocked')
      setStatusMessage(
        'Clipboard access is still blocked. Copy the GUID manually from the field below.',
      )
    }
  }

  return (
    <>
      <PageSEO
        title="New GUID"
        description="Generate and copy a fresh GUID."
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : 'https://www.pedroduartek.com/newguid'
        }
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <div className="max-w-3xl">
          <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            New GUID
          </h1>
          <p className="mb-8 text-base text-foreground-muted md:text-lg">
            This page creates a fresh GUID on load and tries to copy it to your
            clipboard immediately.
          </p>

          <section className="theme-card p-6 md:p-8">
            <div
              role={clipboardStatus === 'blocked' ? 'alert' : 'status'}
              aria-live="polite"
              className={`rounded-lg border px-4 py-3 text-sm ${
                clipboardStatus === 'copied'
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200'
                  : clipboardStatus === 'blocked'
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-200'
                    : 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-200'
              }`}
            >
              {statusMessage}
            </div>

            <div className="mt-6">
              <div className="mb-2 text-sm font-medium text-foreground">
                Current GUID
              </div>
              <output
                aria-label="Generated GUID"
                className="block rounded-lg border border-border bg-surface-muted px-4 py-4 font-mono text-sm text-foreground break-all"
              >
                {guid}
              </output>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setGuid(generateGuid())}
                className="theme-button-primary"
              >
                Generate and copy another
              </button>
              <button
                type="button"
                onClick={() => void copyCurrentGuid()}
                className="theme-button-secondary inline-flex items-center justify-center"
              >
                Copy current GUID
              </button>
            </div>

            <p className="mt-4 text-xs text-foreground-subtle">
              Clipboard writes depend on browser permissions and secure context.
              If the automatic copy is blocked, the GUID is still ready here for
              manual copy.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
