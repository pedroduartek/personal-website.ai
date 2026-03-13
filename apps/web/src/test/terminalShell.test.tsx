import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TerminalShell from '../components/TerminalShell'
import { profile } from '../content/profile'
import { CONTACT_EMAIL_ENDPOINT } from '../utils/contactEmail'

describe('TerminalShell email command', () => {
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

  it('walks through composing and sending an email', async () => {
    const user = userEvent.setup()

    render(<TerminalShell onClose={() => {}} />)

    const input = screen.getByPlaceholderText('type a command (help)')

    await user.type(input, 'email{enter}')

    expect(
      screen.getByText('Email mode — type `cancel` at any prompt to stop.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/This message will be sent to/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: profile.email }),
    ).toBeInTheDocument()

    await user.type(input, 'Ada Lovelace{enter}')
    await user.type(input, 'ada@example.com{enter}')
    await user.type(input, 'Terminal hello{enter}')

    expect(
      screen.getByText(
        'Message: type your message. Press Enter on an empty line when finished.',
      ),
    ).toBeInTheDocument()

    await user.type(input, 'Let us talk about a staff role.{enter}')
    await user.keyboard('{Enter}')

    expect(screen.getByText('Send now? (y/n)')).toBeInTheDocument()

    await user.type(input, 'y{enter}')

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const [url, options] = vi.mocked(fetch).mock.calls[0]

    expect(url).toBe(CONTACT_EMAIL_ENDPOINT)
    const payload = JSON.parse(String(options?.body))
    expect(payload).toMatchObject({
      subject: 'Terminal hello',
      isHtml: true,
    })
    expect(payload.body).toContain('New message from pedroduartek.com terminal')
    expect(payload.body).toContain('Name: Ada Lovelace')
    expect(payload.body).toContain('Email: ada@example.com')
    expect(payload.body).toContain('Let us talk about a staff role.')
    expect(screen.getByText('Email sent successfully.')).toBeInTheDocument()
  })
})
