import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../app/theme/ThemeProvider'
import ContactPage from '../features/contact/ContactPage'
import { resetApiAvailabilityCache } from '../hooks/useApiAvailability'
import { CHAT_API_HEALTH_URL } from '../utils/apiClient'
import { CONTACT_EMAIL_ENDPOINT } from '../utils/contactEmail'

describe('ContactPage', () => {
  beforeEach(() => {
    resetApiAvailabilityCache()
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(null, {
            status: 200,
          }),
        )
        .mockResolvedValueOnce(
          new Response(null, {
            status: 200,
          }),
        ),
    )
  })

  afterEach(() => {
    resetApiAvailabilityCache()
    vi.unstubAllGlobals()
  })

  it('sends the contact form to the email endpoint', async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </ThemeProvider>,
    )

    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()

    await user.click(await screen.findByRole('button', { name: /open form/i }))

    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Subject'), 'Hello')
    await user.type(
      screen.getByLabelText('Message'),
      'I would like to talk about a backend role.',
    )
    await user.click(screen.getByRole('button', { name: 'Send email' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2)
    })

    const [healthUrl, healthOptions] = vi.mocked(fetch).mock.calls[0]
    const [url, options] = vi.mocked(fetch).mock.calls[1]

    expect(healthUrl).toBe(CHAT_API_HEALTH_URL)
    expect(healthOptions).toMatchObject({
      method: 'GET',
    })
    expect(url).toBe(CONTACT_EMAIL_ENDPOINT)
    expect(options).toMatchObject({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const payload = JSON.parse(String(options?.body))
    expect(payload).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      subject: 'Hello',
      source: 'contact form',
      turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX',
      company: '',
    })
    expect(payload.message).toBe('I would like to talk about a backend role.')
    expect(
      screen.getByText(
        'Your message has been sent. I will get back to you as soon as I can.',
      ),
    ).toBeInTheDocument()
  })

  it('explains rate limiting without blaming the spam check', async () => {
    const user = userEvent.setup()

    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(null, {
            status: 200,
          }),
        )
        .mockResolvedValueOnce(
          new Response(
            JSON.stringify({
              error: 'Too many requests',
            }),
            {
              status: 429,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          ),
        ),
    )

    render(
      <ThemeProvider>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </ThemeProvider>,
    )

    await user.click(await screen.findByRole('button', { name: /open form/i }))

    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Subject'), 'Hello')
    await user.type(
      screen.getByLabelText('Message'),
      'I would like to talk about a backend role.',
    )
    await user.click(screen.getByRole('button', { name: 'Send email' }))

    await waitFor(() => {
      expect(
        screen.getByText(
          'Too many requests Spam check already passed, so wait before retrying.',
        ),
      ).toBeInTheDocument()
    })
  })

  it('hides the direct message form when the API health check is not 200', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 503,
        }),
      ),
    )

    render(
      <ThemeProvider>
        <MemoryRouter>
          <ContactPage />
        </MemoryRouter>
      </ThemeProvider>,
    )

    await waitFor(() => {
      expect(screen.queryByText('Send a message')).not.toBeInTheDocument()
    })

    expect(
      screen.queryByRole('button', { name: /open form/i }),
    ).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()
    expect(
      screen.getByText(/use the direct contact options/i),
    ).toBeInTheDocument()
  })
})
