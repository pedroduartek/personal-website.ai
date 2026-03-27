import { act, fireEvent, render, screen, within } from '@testing-library/react'
import {
  MemoryRouter,
  RouterProvider,
  createMemoryRouter,
} from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AppLayout from '../app/layout/AppLayout'
import { THEME_STORAGE_KEY, ThemeProvider } from '../app/theme/ThemeProvider'
import HomeHeroCarousel from '../components/HomeHeroCarousel'
import type { Project } from '../content/types'
import HomePage from '../features/home/HomePage'
import { resetChatAvailabilityCache } from '../hooks/useChatAvailability'

async function settleChatAvailability() {
  await act(async () => {
    await Promise.resolve()
  })
}

function showCommandPaletteButton() {
  const button = document.createElement('button')
  button.id = 'command-palette-button'
  document.body.appendChild(button)
  return button
}

function renderHomePage(theme: 'light' | 'dark' = 'dark') {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)

  return render(
    <ThemeProvider>
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    </ThemeProvider>,
  )
}

function createHeroProject(
  slug: string,
  title: string,
  summary: string,
): Project {
  return {
    slug,
    title,
    description: summary,
    problem: `${title} problem`,
    approach: `${title} approach`,
    technologies: ['React 19'],
    featured: true,
    startDate: '2025-01',
    homeHero: {
      eyebrow: `${title} eyebrow`,
      summary,
      media: {
        src: '/test-preview.png',
        alt: `${title} preview`,
        fit: 'contain',
      },
    },
  }
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
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: (query: string) => ({
        matches: query === '(any-hover: hover) and (any-pointer: fine)',
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    })
  })

  afterEach(() => {
    resetChatAvailabilityCache()
    window.localStorage.removeItem(THEME_STORAGE_KEY)
    document.getElementById('command-palette-button')?.remove()
    act(() => {
      vi.runOnlyPendingTimers()
    })
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('renders the hero carousel with the first featured project', async () => {
    renderHomePage()

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    expect(
      within(carousel).getByRole('link', {
        name: /Ourivesaria Rinchoa Website/i,
      }),
    ).toHaveAttribute('href', '/projects/ourivesaria-rinchoa')
    expect(
      within(carousel).getByText(/Local business website/i),
    ).toBeInTheDocument()
  })

  it('auto-rotates to the next featured project', async () => {
    renderHomePage()

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    act(() => {
      vi.advanceTimersByTime(3600)
    })

    expect(
      within(carousel).getByRole('link', {
        name: /Home Assistant: Local-First Smart Home/i,
      }),
    ).toHaveAttribute('href', '/projects/home-assistant')
  })

  it('keeps auto-rotating across the featured project slides', async () => {
    renderHomePage()

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    act(() => {
      vi.advanceTimersByTime(3600)
    })

    expect(
      within(carousel).getByRole('link', {
        name: /Home Assistant: Local-First Smart Home/i,
      }),
    ).toHaveAttribute('href', '/projects/home-assistant')

    act(() => {
      vi.advanceTimersByTime(3600)
    })

    expect(
      within(carousel).getByRole('link', {
        name: /AI Chat API/i,
      }),
    ).toHaveAttribute('href', '/projects/ai-chat-api')
    expect(
      within(carousel).getByRole('img', {
        name: /Screenshot of the Ollama AI Chat API slide on the website/i,
      }),
    ).toBeInTheDocument()
  })

  it('pauses auto-rotation while hovered', async () => {
    renderHomePage()

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
        name: /Ourivesaria Rinchoa Website/i,
      }),
    ).toHaveAttribute('href', '/projects/ourivesaria-rinchoa')
  })

  it('supports arrow key navigation when the carousel is focused', async () => {
    renderHomePage()

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
        name: /Ourivesaria Rinchoa Website/i,
      }),
    ).toHaveAttribute('href', '/projects/ourivesaria-rinchoa')
  })

  it('includes a dedicated AI chat assistant slide', async () => {
    renderHomePage()

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
    expect(
      within(carousel).getByText(/Ask about Pedro's background/i),
    ).toBeInTheDocument()
    expect(
      within(carousel).getByText(/What skills does pedro have\?/i),
    ).toBeInTheDocument()
  })

  it('includes a dedicated command palette slide only when the button is visible', async () => {
    showCommandPaletteButton()
    renderHomePage()

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    fireEvent.keyDown(carousel, { key: 'End' })
    fireEvent.keyDown(carousel, { key: 'ArrowLeft' })

    expect(
      within(carousel).getByRole('button', {
        name: /Open Command Palette/i,
      }),
    ).toBeInTheDocument()
    expect(
      within(carousel).getByText(/Keyboard-first shortcut/i),
    ).toBeInTheDocument()
    expect(
      within(carousel).getByRole('img', {
        name: /Screenshot of the command palette open on the website/i,
      }),
    ).toBeInTheDocument()
  })

  it('does not include the command palette slide when the button is hidden', async () => {
    renderHomePage()

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    fireEvent.keyDown(carousel, { key: 'End' })

    expect(
      within(carousel).queryByRole('button', {
        name: /Open Command Palette/i,
      }),
    ).not.toBeInTheDocument()
  })

  it('hides the AI chat assistant slide when the widget is unavailable', async () => {
    showCommandPaletteButton()
    resetChatAvailabilityCache()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 503,
        }),
      ),
    )

    renderHomePage()

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    fireEvent.keyDown(carousel, { key: 'End' })

    expect(
      within(carousel).getByRole('button', {
        name: /Open Command Palette/i,
      }),
    ).toBeInTheDocument()
    expect(
      within(carousel).queryByRole('button', {
        name: /AI Chat Assistant/i,
      }),
    ).not.toBeInTheDocument()

    fireEvent.keyDown(carousel, { key: 'ArrowLeft' })

    expect(
      within(carousel).getByRole('link', {
        name: /AI Chat API/i,
      }),
    ).toHaveAttribute('href', '/projects/ai-chat-api')
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

  it('opens the command palette when the dedicated slide is clicked', async () => {
    showCommandPaletteButton()
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
    fireEvent.keyDown(carousel, { key: 'ArrowLeft' })

    await act(async () => {
      fireEvent.click(
        within(carousel).getByRole('button', {
          name: /Open Command Palette/i,
        }),
      )
      await Promise.resolve()
    })

    expect(
      screen.getByPlaceholderText(/Go to a page or run a command/i),
    ).toBeInTheDocument()
    expect(localStorage.getItem('commandPaletteUsed')).toBe('1')
  })

  it('adds a terminal slide on desktop only', async () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1600,
    })

    renderHomePage()

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    fireEvent.keyDown(carousel, { key: 'End' })

    expect(
      within(carousel).getByRole('button', {
        name: /Open Terminal Shell/i,
      }),
    ).toBeInTheDocument()
    expect(
      within(carousel).getByText(/Desktop-only experience/i),
    ).toBeInTheDocument()
  })

  it('opens the floating terminal window when the terminal slide is clicked', async () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1600,
    })

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
          name: /Open Terminal Shell/i,
        }),
      )
      await Promise.resolve()
    })

    expect(
      screen.getByLabelText('Floating terminal window'),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Terminal shell')).toBeInTheDocument()
  })

  it('does not include the terminal slide below the desktop breakpoint', async () => {
    renderHomePage()

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
      within(carousel).queryByRole('button', {
        name: /Open Terminal Shell/i,
      }),
    ).not.toBeInTheDocument()
  })

  it('does not include the command palette slide on touch-first devices', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }),
    })

    renderHomePage()

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    fireEvent.keyDown(carousel, { key: 'End' })
    fireEvent.keyDown(carousel, { key: 'ArrowLeft' })

    expect(
      within(carousel).getByRole('link', {
        name: /AI Chat API/i,
      }),
    ).toHaveAttribute('href', '/projects/ai-chat-api')
    expect(
      within(carousel).queryByRole('button', {
        name: /Open Command Palette/i,
      }),
    ).not.toBeInTheDocument()
  })

  it('keeps a consistent card height and hides the media panel on mobile chat slide', async () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 375,
    })

    renderHomePage()

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    expect(
      within(carousel).getByRole('link', {
        name: /Ourivesaria Rinchoa Website/i,
      }),
    ).toHaveClass('h-[31rem]')

    fireEvent.keyDown(carousel, { key: 'End' })

    expect(
      within(carousel).getByRole('button', {
        name: /Open AI Chat Assistant/i,
      }),
    ).toHaveClass('h-[31rem]')

    expect(within(carousel).getByTestId('carousel-media-panel')).toHaveClass(
      'hidden',
      'sm:flex',
    )
  })

  it('does not crash when the active slide index becomes out of range after slides shrink', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 503,
        }),
      ),
    )

    const firstSlide = createHeroProject(
      'first-project',
      'First Project',
      'First summary',
    )
    const secondSlide = createHeroProject(
      'second-project',
      'Second Project',
      'Second summary',
    )

    const { rerender } = render(
      <ThemeProvider>
        <MemoryRouter>
          <HomeHeroCarousel slides={[firstSlide, secondSlide]} />
        </MemoryRouter>
      </ThemeProvider>,
    )

    await settleChatAvailability()

    const carousel = screen.getByRole('region', {
      name: /featured project carousel/i,
    })

    fireEvent.keyDown(carousel, { key: 'ArrowRight' })

    expect(
      within(carousel).getByRole('link', {
        name: /Second Project/i,
      }),
    ).toHaveAttribute('href', '/projects/second-project')

    rerender(
      <ThemeProvider>
        <MemoryRouter>
          <HomeHeroCarousel slides={[firstSlide]} />
        </MemoryRouter>
      </ThemeProvider>,
    )

    expect(
      screen.getByRole('link', {
        name: /First Project/i,
      }),
    ).toHaveAttribute('href', '/projects/first-project')
  })
})
