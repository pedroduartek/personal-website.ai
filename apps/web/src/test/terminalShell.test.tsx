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
    expect(JSON.parse(String(options?.body))).toEqual({
      to: [profile.email],
      subject: 'Terminal hello',
      body: [
        'New message from pedroduartek.com terminal',
        '',
        'Name: Ada Lovelace',
        'Email: ada@example.com',
        'Subject: Terminal hello',
        '',
        'Message:',
        'Let us talk about a staff role.',
      ].join('\n'),
      isHtml: false,
    })
    expect(screen.getByText('Email sent successfully.')).toBeInTheDocument()
  })
})
