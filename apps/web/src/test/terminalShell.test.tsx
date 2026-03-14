import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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
    expect(screen.queryByText('Message Verification')).not.toBeInTheDocument()

    await user.type(input, 'Ada Lovelace{enter}')
    await user.type(input, 'ada@example.com{enter}')
    await user.type(input, 'Terminal hello{enter}')

    expect(
      screen.getByText(
        'Message: type your message and press Enter to continue.',
      ),
    ).toBeInTheDocument()

    await user.type(input, 'Let us talk about a staff role.{enter}')

    expect(screen.getByText('Send now? (y/n)')).toBeInTheDocument()
    expect(screen.getByText('Message Verification')).toBeInTheDocument()

    await user.type(input, 'y{enter}')

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const [url, options] = vi.mocked(fetch).mock.calls[0]

    expect(url).toBe(CONTACT_EMAIL_ENDPOINT)
    const payload = JSON.parse(String(options?.body))
    expect(payload).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      subject: 'Terminal hello',
      source: 'terminal',
      turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX',
      company: '',
    })
    expect(payload.message).toBe('Let us talk about a staff role.')
    expect(screen.getByText('Email sent successfully.')).toBeInTheDocument()
  })

  it('double ctrl+c cancels the interactive email composer', async () => {
    const user = userEvent.setup()

    render(<TerminalShell onClose={() => {}} />)

    const input = screen.getByPlaceholderText('type a command (help)')

    await user.type(input, 'email{enter}')
    await user.type(input, 'Ada Lovelace{enter}')

    fireEvent.keyDown(document, { key: 'c', ctrlKey: true })
    fireEvent.keyDown(document, { key: 'c', ctrlKey: true })

    expect(screen.getByText('Command interrupted.')).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('type a command (help)'),
    ).toBeInTheDocument()

    await user.type(
      screen.getByPlaceholderText('type a command (help)'),
      'help{enter}',
    )

    expect(screen.getByText('Available commands:')).toBeInTheDocument()
  })

  it('double ctrl+c aborts a running chat command and restores the prompt', async () => {
    const user = userEvent.setup()
    const chatFetch = vi.fn(
      (_input: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          const signal = init?.signal
          signal?.addEventListener(
            'abort',
            () => {
              const error = new Error('Aborted')
              error.name = 'AbortError'
              reject(error)
            },
            { once: true },
          )
        }),
    )

    vi.stubGlobal('fetch', chatFetch)

    render(<TerminalShell onClose={() => {}} />)

    const input = screen.getByPlaceholderText('type a command (help)')

    await user.type(input, 'chat{enter}')
    await user.type(input, 'Tell me about your projects{enter}')

    await waitFor(() => {
      expect(screen.getByText('AI is thinking')).toBeInTheDocument()
    })
    expect(input).toBeDisabled()

    fireEvent.keyDown(document, { key: 'c', ctrlKey: true })
    fireEvent.keyDown(document, { key: 'c', ctrlKey: true })

    await waitFor(() => {
      expect(screen.queryByText('AI is thinking')).not.toBeInTheDocument()
      expect(screen.getByPlaceholderText('type a command (help)')).toBeEnabled()
    })

    expect(screen.getByText('Command interrupted.')).toBeInTheDocument()

    await user.type(
      screen.getByPlaceholderText('type a command (help)'),
      'help{enter}',
    )

    expect(screen.getByText('Available commands:')).toBeInTheDocument()
    expect(chatFetch).toHaveBeenCalledTimes(1)
  })
})
