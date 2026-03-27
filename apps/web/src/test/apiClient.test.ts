import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { checkApiHealth, postJson, readApiError } from '../utils/apiClient'

describe('apiClient', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    vi.useRealTimers()
    fetchMock.mockReset()
  })

  it('reports API health from the endpoint status', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }))
    await expect(checkApiHealth('/health')).resolves.toBe(true)

    fetchMock.mockResolvedValueOnce(new Response(null, { status: 503 }))
    await expect(checkApiHealth('/health')).resolves.toBe(false)
  })

  it('treats network failures as an unhealthy API', async () => {
    fetchMock.mockRejectedValueOnce(new Error('offline'))

    await expect(checkApiHealth('/health')).resolves.toBe(false)
  })

  it('retries retryable POST failures before succeeding', async () => {
    vi.useFakeTimers()
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        }),
      )

    const responsePromise = postJson('/chat', { message: 'hello' }, 2)

    await Promise.resolve()
    expect(fetchMock).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(250)

    const response = await responsePromise

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      '/chat',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'hello' }),
      }),
    )
    await expect(response.json()).resolves.toEqual({ ok: true })
  })

  it('does not retry non-retryable responses', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response('bad request', { status: 400 }),
    )

    const response = await postJson('/chat', { message: 'hello' }, 3)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(response.status).toBe(400)
  })

  it('throws the last network error after exhausting retries', async () => {
    vi.useFakeTimers()
    fetchMock.mockRejectedValue(new Error('timeout'))

    const responsePromise = postJson('/chat', { message: 'hello' }, 2)
    const rejection = expect(responsePromise).rejects.toThrow('timeout')

    await Promise.resolve()
    await vi.advanceTimersByTimeAsync(250)

    await rejection
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('prefers structured API errors from JSON payloads', async () => {
    const response = new Response(
      JSON.stringify({ error: 'Too many requests' }),
      {
        status: 429,
        headers: { 'content-type': 'application/json' },
      },
    )

    await expect(readApiError(response, 'Fallback')).resolves.toBe(
      'Too many requests',
    )
  })

  it('falls back to validation details and plain-text responses', async () => {
    const validationResponse = new Response(
      JSON.stringify({ errors: { email: ['Email is required'] } }),
      {
        status: 400,
        headers: { 'content-type': 'application/json' },
      },
    )

    await expect(readApiError(validationResponse, 'Fallback')).resolves.toBe(
      'Email is required',
    )

    const textResponse = new Response('Service unavailable', { status: 503 })
    await expect(readApiError(textResponse, 'Fallback')).resolves.toBe(
      'Service unavailable',
    )
  })

  it('returns the fallback message when the response body has no usable details', async () => {
    const response = new Response(null, { status: 500 })

    await expect(readApiError(response, 'Fallback message')).resolves.toBe(
      'Fallback message',
    )
  })
})
