import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../hooks/useChatAvailability', () => ({
  useChatAvailability: () => true,
}))

vi.mock('../utils/apiClient', async () => {
  const actual = await vi.importActual('../utils/apiClient')

  return {
    ...actual,
    postJson: vi.fn(),
    readApiError: vi.fn(),
  }
})

import ChatWidget from '../components/ChatWidget'
import { postJson, readApiError } from '../utils/apiClient'

const originalScrollTo = Element.prototype.scrollTo

describe('ChatWidget behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Element.prototype.scrollTo = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    Element.prototype.scrollTo = originalScrollTo
  })

  it('opens the drawer and lets the visitor dismiss the note', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <ChatWidget />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /open chat/i }))

    expect(screen.getByText(/^Chat$/)).toBeInTheDocument()
    expect(screen.getByText(/This is a basic POC/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /dismiss note/i }))

    await waitFor(() => {
      expect(screen.queryByText(/This is a basic POC/i)).not.toBeInTheDocument()
    })
  })

  it('renders internal route replies as clickable links', async () => {
    const user = userEvent.setup()

    vi.mocked(postJson).mockResolvedValue(
      new Response(
        JSON.stringify({ answer: 'See /projects/ai-chat-api for details.' }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      ),
    )

    render(
      <MemoryRouter>
        <ChatWidget />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /open chat/i }))
    await user.type(
      screen.getByPlaceholderText(/type a message/i),
      'Where is the API project?',
    )
    await user.click(screen.getByRole('button', { name: /^send$/i }))

    expect(
      await screen.findByText('Where is the API project?'),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('link', { name: '/projects/ai-chat-api' }),
    ).toHaveAttribute('href', '/projects/ai-chat-api')
  })

  it('rejects replies that only contain external links', async () => {
    const user = userEvent.setup()

    vi.mocked(postJson).mockResolvedValue(
      new Response(JSON.stringify({ answer: 'Check https://example.com' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )

    render(
      <MemoryRouter>
        <ChatWidget />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /open chat/i }))
    await user.type(
      screen.getByPlaceholderText(/type a message/i),
      'Where can I learn more?',
    )
    await user.click(screen.getByRole('button', { name: /^send$/i }))

    expect(
      await screen.findByText('Unable to find a response to your question'),
    ).toBeInTheDocument()
  })

  it('shows parsed API errors when the backend rejects the request', async () => {
    const user = userEvent.setup()

    vi.mocked(postJson).mockResolvedValue(new Response(null, { status: 429 }))
    vi.mocked(readApiError).mockResolvedValue('The chat is busy right now.')

    render(
      <MemoryRouter>
        <ChatWidget />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /open chat/i }))
    await user.type(screen.getByPlaceholderText(/type a message/i), 'Say hello')
    await user.click(screen.getByRole('button', { name: /^send$/i }))

    expect(
      await screen.findByText('The chat is busy right now.'),
    ).toBeInTheDocument()
  })
})
