import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ContactPage from '../features/contact/ContactPage'
import { CONTACT_EMAIL_ENDPOINT } from '../utils/contactEmail'

describe('ContactPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the contact form to the email endpoint', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    )

    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /open form/i }))

    await user.type(screen.getByLabelText('Name'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('Email'), 'ada@example.com')
    await user.type(screen.getByLabelText('Subject'), 'Hello')
    await user.type(
      screen.getByLabelText('Message'),
      'I would like to talk about a backend role.',
    )
    await user.click(screen.getByRole('button', { name: 'Send email' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const [url, options] = vi.mocked(fetch).mock.calls[0]

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
      company: '',
    })
    expect(payload.message).toBe('I would like to talk about a backend role.')
    expect(
      screen.getByText(
        'Your message has been sent. I will get back to you as soon as I can.',
      ),
    ).toBeInTheDocument()
  })
})
