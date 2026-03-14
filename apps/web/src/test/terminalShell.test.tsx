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

  it('double ctrl+c lets an in-flight email finish while restoring the prompt', async () => {
    const user = userEvent.setup()
    let resolveEmailRequest: ((value: Response) => void) | null = null

    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            resolveEmailRequest = resolve
          }),
      ),
    )

    render(<TerminalShell onClose={() => {}} />)

    const input = screen.getByPlaceholderText('type a command (help)')

    await user.type(input, 'email{enter}')
    await user.type(input, 'Ada Lovelace{enter}')
    await user.type(input, 'ada@example.com{enter}')
    await user.type(input, 'Terminal hello{enter}')
    await user.type(input, 'Let us talk about a staff role.{enter}')
    await user.type(input, 'y{enter}')

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })
    expect(input).toBeDisabled()

    fireEvent.keyDown(document, { key: 'c', ctrlKey: true })
    fireEvent.keyDown(document, { key: 'c', ctrlKey: true })

    await waitFor(() => {
      expect(screen.getByPlaceholderText('type a command (help)')).toBeEnabled()
    })

    expect(screen.getByText('Command interrupted.')).toBeInTheDocument()

    await user.type(
      screen.getByPlaceholderText('type a command (help)'),
      'help{enter}',
    )

    expect(screen.getByText('Available commands:')).toBeInTheDocument()

    const completeEmailRequest =
      resolveEmailRequest ??
      ((_value: Response) => {
        throw new Error('Email request resolver was not assigned.')
      })
    completeEmailRequest(
      new Response(null, {
        status: 200,
      }),
    )

    await waitFor(() => {
      expect(screen.getByText('Email sent successfully.')).toBeInTheDocument()
    })
  })

  it('double ctrl+c hides a late chat response and restores the prompt', async () => {
    const user = userEvent.setup()
    let resolveChatRequest: ((value: Response) => void) | null = null
    const chatReply = 'Late chat reply that should stay hidden.'

    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            resolveChatRequest = resolve
          }),
      ),
    )

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

    const completeChatRequest =
      resolveChatRequest ??
      ((_value: Response) => {
        throw new Error('Chat request resolver was not assigned.')
      })
    completeChatRequest(
      new Response(JSON.stringify({ answer: chatReply }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    await waitFor(() => {
      expect(screen.queryByText(chatReply)).not.toBeInTheDocument()
    })
  })

  it('keeps the current spam check when the email endpoint rate-limits the request', async () => {
    const user = userEvent.setup()

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
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

    render(<TerminalShell onClose={() => {}} />)

    const input = screen.getByPlaceholderText('type a command (help)')

    await user.type(input, 'email{enter}')
    await user.type(input, 'Ada Lovelace{enter}')
    await user.type(input, 'ada@example.com{enter}')
    await user.type(input, 'Terminal hello{enter}')
    await user.type(input, 'Let us talk about a staff role.{enter}')
    await user.type(input, 'y{enter}')

    await waitFor(() => {
      expect(screen.getByText('Too many requests')).toBeInTheDocument()
    })

    expect(
      screen.getByText(
        'Spam check already passed. Wait before retrying or type n to cancel.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('Message Verification')).toBeInTheDocument()
    expect(
      screen.queryByText('Type y to try again or n to cancel.'),
    ).not.toBeInTheDocument()
  })
})
