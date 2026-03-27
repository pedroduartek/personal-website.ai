import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '../app/theme/ThemeProvider'
import { CommandPalette } from '../components/CommandPalette'
import CommandPaletteTip from '../components/CommandPalette/CommandPaletteTip'
import { useChatAvailability } from '../hooks/useChatAvailability'
import { useCommandPalette } from '../hooks/useCommandPalette'
import { openCommandPalette } from '../utils/commandPalette'

vi.mock('../hooks/useChatAvailability', () => ({
  useChatAvailability: vi.fn(),
}))

const mockUseChatAvailability = vi.mocked(useChatAvailability)

function TestUseCommandPalette() {
  const { isOpen, open, close } = useCommandPalette()
  return (
    <div>
      <div data-testid="open">{isOpen ? 'open' : 'closed'}</div>
      <button type="button" onClick={open}>
        open
      </button>
      <button type="button" onClick={close}>
        close
      </button>
    </div>
  )
}

describe('useCommandPalette', () => {
  beforeEach(() => {
    localStorage.clear()
    mockUseChatAvailability.mockReturnValue(true)
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

  it('records localStorage flag when opened via keyboard shortcut', () => {
    render(<TestUseCommandPalette />)
    expect(localStorage.getItem('commandPaletteUsed')).toBeNull()

    // simulate Ctrl+K
    act(() => {
      const e = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })
      window.dispatchEvent(e)
    })

    expect(localStorage.getItem('commandPaletteUsed')).toBe('1')
  })

  it('opens in response to the shared command palette event', () => {
    render(<TestUseCommandPalette />)

    act(() => {
      openCommandPalette()
    })

    expect(screen.getByTestId('open')).toHaveTextContent('open')
    expect(localStorage.getItem('commandPaletteUsed')).toBe('1')
  })
})

describe('CommandPalette', () => {
  beforeEach(() => {
    mockUseChatAvailability.mockReturnValue(true)
    Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
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
    if (!navigator.clipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: vi.fn(),
        },
      })
    } else {
      vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    }
  })

  it('shows the terminal command on keyboard-capable devices', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <CommandPalette isOpen={true} onClose={() => {}} />
        </MemoryRouter>
      </ThemeProvider>,
    )

    expect(
      screen.getByRole('button', { name: /terminal/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /toggle theme/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /copy email address/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /start ai assistant conversation/i }),
    ).toBeInTheDocument()
  })

  it('shows the keyboard shortcut hint in the footer', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <CommandPalette isOpen={true} onClose={() => {}} />
        </MemoryRouter>
      </ThemeProvider>,
    )

    expect(
      screen.getByText(
        (_content, element) => element?.textContent === 'Ctrl+K Open',
      ),
    ).toBeInTheDocument()
  })

  it('hides the terminal command on touch-only devices', () => {
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

    render(
      <ThemeProvider>
        <MemoryRouter>
          <CommandPalette isOpen={true} onClose={() => {}} />
        </MemoryRouter>
      </ThemeProvider>,
    )

    expect(
      screen.queryByRole('button', { name: /terminal/i }),
    ).not.toBeInTheDocument()
  })

  it('hides the ai assistant action when the widget is unavailable', () => {
    mockUseChatAvailability.mockReturnValue(false)

    render(
      <ThemeProvider>
        <MemoryRouter>
          <CommandPalette isOpen={true} onClose={() => {}} />
        </MemoryRouter>
      </ThemeProvider>,
    )

    expect(
      screen.queryByRole('button', {
        name: /start ai assistant conversation/i,
      }),
    ).not.toBeInTheDocument()
  })

  it('copies the email address and shows a success prompt', async () => {
    const user = userEvent.setup()
    const writeTextSpy = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue()
    const onClose = vi.fn()

    render(
      <ThemeProvider>
        <MemoryRouter>
          <CommandPalette isOpen={true} onClose={onClose} />
        </MemoryRouter>
      </ThemeProvider>,
    )

    await user.click(
      screen.getByRole('button', { name: /copy email address/i }),
    )

    expect(writeTextSpy).toHaveBeenCalledWith('pedroduartek@gmail.com')
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(
      await screen.findByText(
        'Email pedroduartek@gmail.com was copied to your clipboard.',
      ),
    ).toBeInTheDocument()
  })

  it('opens the ai assistant from the command palette', async () => {
    const user = userEvent.setup()
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent')

    render(
      <ThemeProvider>
        <MemoryRouter>
          <CommandPalette isOpen={true} onClose={() => {}} />
        </MemoryRouter>
      </ThemeProvider>,
    )

    await user.click(
      screen.getByRole('button', { name: /start ai assistant conversation/i }),
    )

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pedroduartek:open-chat-widget' }),
    )
  })

  it('opens the terminal window from the command palette', async () => {
    const user = userEvent.setup()
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent')

    render(
      <ThemeProvider>
        <MemoryRouter>
          <CommandPalette isOpen={true} onClose={() => {}} />
        </MemoryRouter>
      </ThemeProvider>,
    )

    await user.click(screen.getByRole('button', { name: /terminal/i }))

    expect(dispatchEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pedroduartek:open-terminal-window' }),
    )
  })
})

describe('CommandPaletteTip', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
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
    vi.useRealTimers()
  })

  it('does not show if user already used command palette', () => {
    localStorage.setItem('commandPaletteUsed', '1')
    const { queryByText } = render(
      <div style={{ width: '2000px' }}>
        <CommandPaletteTip />
      </div>,
    )
    // advance timers beyond initial schedule
    act(() => vi.advanceTimersByTime(6000))
    expect(queryByText(/Open commands fast/i)).toBeNull()
  })

  it('does not show when address bar is focused until user interacts', () => {
    const { queryByText } = render(
      <div>
        <CommandPaletteTip />
      </div>,
    )
    // Simulate page has focus but no interaction
    // Ensure no immediate show
    act(() => {
      // focus event
      window.dispatchEvent(new Event('focus'))
      vi.advanceTimersByTime(6000)
    })
    expect(queryByText(/Open commands fast/i)).toBeNull()

    // simulate a pointerdown interaction
    act(() => {
      window.dispatchEvent(new Event('pointerdown'))
      // advance timer
      vi.advanceTimersByTime(6000)
    })

    expect(queryByText(/Open commands fast/i)).not.toBeNull()
  })
})
