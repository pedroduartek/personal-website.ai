import { act, fireEvent, render, screen, within } from '@testing-library/react'
import {
  MemoryRouter,
  RouterProvider,
  createMemoryRouter,
} from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AppLayout from '../app/layout/AppLayout'
import { ThemeProvider } from '../app/theme/ThemeProvider'
import HomePage from '../features/home/HomePage'
import { resetChatAvailabilityCache } from '../hooks/useChatAvailability'

async function settleChatAvailability() {
  await act(async () => {
    await Promise.resolve()
  })
}

describe('HomePage hero carousel', () => {
  beforeEach(() => {
    resetChatAvailabilityCache()
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 200,
        }),
      ),
    )
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1280,
    })
  })

  afterEach(() => {
    resetChatAvailabilityCache()
    act(() => {
      vi.runOnlyPendingTimers()
    })
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('renders the hero carousel with the first featured project', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    expect(
      within(carousel).getByRole('link', {
        name: /AI-Assisted Personal Website/i,
      }),
    ).toHaveAttribute('href', '/projects/personal-website')
    expect(
      within(carousel).getByText(/AI-assisted product build/i),
    ).toBeInTheDocument()
  })

  it('auto-rotates to the next featured project', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    act(() => {
      vi.advanceTimersByTime(4800)
    })

    expect(
      within(carousel).getByRole('link', {
        name: /Home Assistant: Local-First Smart Home|AI Chat Assistant/i,
      }),
    ).toBeInTheDocument()

    expect(
      within(carousel).getByRole('link', {
        name: /Home Assistant: Local-First Smart Home/i,
      }),
    ).toHaveAttribute('href', '/projects/home-assistant')
  })

  it('pauses auto-rotation while hovered', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    fireEvent.mouseEnter(carousel)

    act(() => {
      vi.advanceTimersByTime(9600)
    })

    expect(
      within(carousel).getByRole('link', {
        name: /AI-Assisted Personal Website/i,
      }),
    ).toHaveAttribute('href', '/projects/personal-website')
  })

  it('supports arrow key navigation when the carousel is focused', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    fireEvent.keyDown(carousel, { key: 'ArrowRight' })

    expect(
      within(carousel).getByRole('link', {
        name: /Home Assistant: Local-First Smart Home/i,
      }),
    ).toHaveAttribute('href', '/projects/home-assistant')

    fireEvent.keyDown(carousel, { key: 'ArrowLeft' })

    expect(
      within(carousel).getByRole('link', {
        name: /AI-Assisted Personal Website/i,
      }),
    ).toHaveAttribute('href', '/projects/personal-website')
  })

  it('includes a dedicated AI chat assistant slide', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    fireEvent.keyDown(carousel, { key: 'End' })

    expect(
      within(carousel).getByRole('button', {
        name: /Open AI Chat Assistant/i,
      }),
    ).toBeInTheDocument()
    expect(
      within(carousel).getByText(/Interactive site feature/i),
    ).toBeInTheDocument()
  })

  it('hides the AI chat assistant slide when the widget is unavailable', async () => {
    resetChatAvailabilityCache()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 503,
        }),
      ),
    )

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    fireEvent.keyDown(carousel, { key: 'End' })

    expect(
      within(carousel).getByRole('link', {
        name: /AI Chat API/i,
      }),
    ).toHaveAttribute('href', '/projects/ai-chat-api')
    expect(
      within(carousel).queryByRole('button', {
        name: /AI Chat Assistant/i,
      }),
    ).not.toBeInTheDocument()
  })

  it('opens the chat widget when the AI chat slide is clicked', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: (
            <ThemeProvider>
              <AppLayout />
            </ThemeProvider>
          ),
          children: [{ index: true, element: <HomePage /> }],
        },
      ],
      { initialEntries: ['/'] },
    )

    render(<RouterProvider router={router} />)

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    fireEvent.keyDown(carousel, { key: 'End' })

    await act(async () => {
      fireEvent.click(
        within(carousel).getByRole('button', {
          name: /Open AI Chat Assistant/i,
        }),
      )
      await Promise.resolve()
    })

    expect(
      screen.getByRole('button', {
        name: /Close chat/i,
      }),
    ).toBeInTheDocument()
  })

  it('adds a terminal slide on desktop only', async () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1600,
    })

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    fireEvent.keyDown(carousel, { key: 'End' })

    expect(
      within(carousel).getByRole('link', {
        name: /Terminal Shell/i,
      }),
    ).toHaveAttribute('href', '/terminal')
    expect(
      within(carousel).getByText(/Desktop-only experience/i),
    ).toBeInTheDocument()
  })

  it('does not include the terminal slide below the desktop breakpoint', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    fireEvent.keyDown(carousel, { key: 'End' })

    expect(
      within(carousel).getByRole('button', {
        name: /Open AI Chat Assistant/i,
      }),
    ).toBeInTheDocument()
    expect(
      within(carousel).queryByRole('link', {
        name: /Terminal Shell/i,
      }),
    ).not.toBeInTheDocument()
  })
})
