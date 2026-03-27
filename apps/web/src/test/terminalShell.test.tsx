import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../app/theme/ThemeProvider'
import TerminalShell from '../components/TerminalShell'
import { profile } from '../content/profile'
import { resetApiAvailabilityCache } from '../hooks/useApiAvailability'
import { CONTACT_EMAIL_ENDPOINT } from '../utils/contactEmail'

function renderTerminalShell({
  onClose = () => {},
  onGoHome = () => {},
}: {
  onClose?: () => void
  onGoHome?: () => void
} = {}) {
  return render(
    <ThemeProvider>
      <TerminalShell onClose={onClose} onGoHome={onGoHome} />
    </ThemeProvider>,
  )
}

describe('TerminalShell email command', () => {
  beforeEach(() => {
    resetApiAvailabilityCache()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 200,
        }),
      ),
    )
  })

  afterEach(() => {
    vi.useRealTimers()
    resetApiAvailabilityCache()
    vi.unstubAllGlobals()
  })

  it('walks through composing and sending an email', async () => {
    const user = userEvent.setup()

    renderTerminalShell()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

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
      expect(fetch).toHaveBeenCalledTimes(2)
    })

    const [url, options] = vi.mocked(fetch).mock.calls[1]

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

    renderTerminalShell()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

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
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(null, {
            status: 200,
          }),
        )
        .mockImplementationOnce(
          () =>
            new Promise<Response>((resolve) => {
              resolveEmailRequest = resolve
            }),
        ),
    )

    renderTerminalShell()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const input = screen.getByPlaceholderText('type a command (help)')

    await user.type(input, 'email{enter}')
    await user.type(input, 'Ada Lovelace{enter}')
    await user.type(input, 'ada@example.com{enter}')
    await user.type(input, 'Terminal hello{enter}')
    await user.type(input, 'Let us talk about a staff role.{enter}')
    await user.type(input, 'y{enter}')

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2)
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
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(null, {
            status: 200,
          }),
        )
        .mockImplementationOnce(
          () =>
            new Promise<Response>((resolve) => {
              resolveChatRequest = resolve
            }),
        ),
    )

    renderTerminalShell()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const input = screen.getByPlaceholderText('type a command (help)')

    await user.type(input, 'chat{enter}')
    await user.type(input, 'Tell me about your projects{enter}')

    await waitFor(() => {
      expect(screen.getByText(/AI is thinking/i)).toBeInTheDocument()
    })
    expect(input).toBeDisabled()

    fireEvent.keyDown(document, { key: 'c', ctrlKey: true })
    fireEvent.keyDown(document, { key: 'c', ctrlKey: true })

    await waitFor(() => {
      expect(screen.queryByText(/AI is thinking/i)).not.toBeInTheDocument()
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

  it('does not enter chat mode when the chat API health check fails', async () => {
    const user = userEvent.setup()

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 503,
        }),
      ),
    )

    renderTerminalShell()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const input = screen.getByPlaceholderText('type a command (help)')

    await user.type(input, 'chat{enter}')

    await waitFor(() => {
      expect(
        screen.getByText(
          'Chat is not available right now. Please try again later.',
        ),
      ).toBeInTheDocument()
    })

    expect(
      screen.queryByText(
        'Chat mode — type your message. Type `exit` to leave.',
      ),
    ).not.toBeInTheDocument()
    expect(screen.getByPlaceholderText('type a command (help)')).toBeEnabled()
  })

  it('restores prompt focus after a command finishes streaming output', async () => {
    const user = userEvent.setup()

    renderTerminalShell()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const input = screen.getByPlaceholderText('type a command (help)')

    await user.type(input, 'about{enter}')

    await waitFor(() => {
      expect(
        screen.getByText(
          'Outside work: fishing, motorcycling, cooking, and running a self-hosted Home Assistant setup as a personal lab for automation and reliability.',
        ),
      ).toBeInTheDocument()
      expect(input).toBeEnabled()
      expect(input).toHaveFocus()
    })
  })

  it('keeps the current spam check when the email endpoint rate-limits the request', async () => {
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

    renderTerminalShell()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

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

  it('hides API-backed terminal commands from help when the health check is not 200', async () => {
    const user = userEvent.setup()

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 503,
        }),
      ),
    )

    renderTerminalShell()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const input = screen.getByPlaceholderText('type a command (help)')

    await user.type(input, 'help{enter}')

    expect(
      screen.queryByText(
        '  email               Compose and send an email from the terminal',
      ),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText(
        '  chat <message>      Ask the chat API and return a response',
      ),
    ).not.toBeInTheDocument()
  })

  it('blocks terminal email when the health check is not 200', async () => {
    const user = userEvent.setup()

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 503,
        }),
      ),
    )

    renderTerminalShell()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const input = screen.getByPlaceholderText('type a command (help)')
    await user.type(input, 'email{enter}')

    await waitFor(() => {
      expect(
        screen.getByText(
          'Email from the terminal is unavailable right now. Please use the direct email link instead.',
        ),
      ).toBeInTheDocument()
    })
  })

  it('autocompletes commands with tab', async () => {
    const user = userEvent.setup()

    renderTerminalShell()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const input = screen.getByPlaceholderText('type a command (help)')

    await user.type(input, 'hel')
    fireEvent.keyDown(input, { key: 'Tab' })

    expect(input).toHaveValue('help')

    await user.type(input, '{enter}')

    expect(screen.getByText('Available commands:')).toBeInTheDocument()
  })

  it('keeps focus on the terminal prompt when tab is pressed without a suggestion', async () => {
    const user = userEvent.setup()

    renderTerminalShell()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const input = screen.getByPlaceholderText('type a command (help)')
    const clearButton = screen.getByRole('button', { name: 'clear' })

    input.focus()
    expect(input).toHaveFocus()

    await user.type(input, 'help')
    await user.tab()

    expect(input).toHaveFocus()
    expect(clearButton).not.toHaveFocus()
  })

  it('shows suggestions before typing and lets arrow keys browse them', async () => {
    renderTerminalShell()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const input = screen.getByPlaceholderText('type a command (help)')

    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Tab' })

    expect(input).toHaveValue('cat')
  })

  it('autocompletes command arguments with the right arrow key', async () => {
    const user = userEvent.setup()

    renderTerminalShell()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const input = screen.getByPlaceholderText('type a command (help)')

    await user.type(input, 'project ai')
    fireEvent.keyDown(input, { key: 'ArrowRight' })

    expect(input).toHaveValue('project ai-chat-api')

    await user.type(input, '{enter}')

    await waitFor(() => {
      expect(screen.getByText(/AI Chat API/i)).toBeInTheDocument()
    })
  })

  it('autocompletes compound command sections with tab', async () => {
    const user = userEvent.setup()

    renderTerminalShell()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const input = screen.getByPlaceholderText('type a command (help)')

    await user.type(input, 'ls ab')
    fireEvent.keyDown(input, { key: 'Tab' })

    expect(input).toHaveValue('ls about')
  })

  it('filters suggestion choices as the user types', async () => {
    const user = userEvent.setup()

    renderTerminalShell()

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const input = screen.getByPlaceholderText('type a command (help)')

    await user.type(input, 'pro')
    fireEvent.keyDown(input, { key: 'Tab' })

    expect(input).toHaveValue('project')
  })

  it('counts down before the close command triggers homepage navigation', async () => {
    const user = userEvent.setup()
    const onGoHome = vi.fn()

    renderTerminalShell({ onGoHome })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const input = screen.getByPlaceholderText('type a command (help)')

    await user.type(input, 'close{enter}')

    expect(screen.getByText('Closing terminal in 3...')).toBeInTheDocument()
    expect(
      screen.getByText('Press Ctrl+C or Cmd+C twice to stay here.'),
    ).toBeInTheDocument()
    expect(onGoHome).not.toHaveBeenCalled()

    await waitFor(
      () => {
        expect(screen.getByText('Closing terminal in 2...')).toBeInTheDocument()
      },
      { timeout: 1500 },
    )

    await waitFor(
      () => {
        expect(screen.getByText('Closing terminal in 1...')).toBeInTheDocument()
      },
      { timeout: 1500 },
    )

    await waitFor(
      () => {
        expect(onGoHome).toHaveBeenCalledTimes(1)
      },
      { timeout: 1500 },
    )
  }, 10000)

  it('cancels the close countdown when ctrl+c is pressed twice', async () => {
    const user = userEvent.setup()
    const onGoHome = vi.fn()

    renderTerminalShell({ onGoHome })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    const input = screen.getByPlaceholderText('type a command (help)')

    await user.type(input, 'close{enter}')

    await waitFor(
      () => {
        expect(screen.getByText('Closing terminal in 2...')).toBeInTheDocument()
      },
      { timeout: 1500 },
    )

    fireEvent.keyDown(document, { key: 'c', ctrlKey: true })
    fireEvent.keyDown(document, { key: 'c', ctrlKey: true })

    expect(screen.getByText('Command interrupted.')).toBeInTheDocument()

    await new Promise((resolve) => {
      setTimeout(resolve, 3200)
    })

    expect(onGoHome).not.toHaveBeenCalled()
    expect(screen.getByPlaceholderText('type a command (help)')).toBeEnabled()
  }, 10000)
})
