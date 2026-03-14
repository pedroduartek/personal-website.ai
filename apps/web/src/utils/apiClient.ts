const RETRYABLE_STATUS_CODES = new Set([408, 500, 502, 503, 504])

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function shouldRetry(response: Response) {
  return RETRYABLE_STATUS_CODES.has(response.status)
}

export async function postJson(
  url: string,
  payload: unknown,
  attempts = 1,
): Promise<Response> {
  let lastError: unknown = null
  let response: Response | null = null

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok || !shouldRetry(response) || attempt === attempts) {
        return response
      }

      lastError = new Error(`HTTP ${response.status}`)
    } catch (error) {
      lastError = error
      if (attempt === attempts) {
        throw error
      }
    }

    await sleep(250 * attempt)
  }

  if (response) return response
  throw lastError instanceof Error ? lastError : new Error('Request failed')
}

export async function readApiError(
  response: Response,
  fallbackMessage: string,
) {
  try {
    const contentType = response.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const payload = await response.json()
      if (payload && typeof payload === 'object') {
        const maybePayload = payload as {
          error?: unknown
          title?: unknown
          detail?: unknown
          errors?: Record<string, unknown>
        }

        if (
          typeof maybePayload.error === 'string' &&
          maybePayload.error.trim()
        ) {
          return maybePayload.error
        }

        if (
          typeof maybePayload.detail === 'string' &&
          maybePayload.detail.trim()
        ) {
          return maybePayload.detail
        }

        if (
          typeof maybePayload.title === 'string' &&
          maybePayload.title.trim()
        ) {
          return maybePayload.title
        }

        if (maybePayload.errors && typeof maybePayload.errors === 'object') {
          for (const value of Object.values(maybePayload.errors)) {
            if (
              Array.isArray(value) &&
              typeof value[0] === 'string' &&
              value[0].trim()
            ) {
              return value[0]
            }
          }
        }
      }
    }

    const text = await response.text()
    if (text.trim()) return text
  } catch {}

  return fallbackMessage
}
