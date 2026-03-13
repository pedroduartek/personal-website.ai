import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CommandPalette } from '../components/CommandPalette'
import CommandPaletteTip from '../components/CommandPalette/CommandPaletteTip'
import { useCommandPalette } from '../hooks/useCommandPalette'

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
  })

  it('records localStorage flag when opened via keyboard shortcut', () => {
    // ensure desktop breakpoint in test env
    // (the hook only activates for innerWidth >= 1536)
    // set before rendering so listener uses the right branch
    // jsdom allows setting innerWidth directly
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.innerWidth = 1600
    render(<TestUseCommandPalette />)
    expect(localStorage.getItem('commandPaletteUsed')).toBeNull()

    // simulate Ctrl+K
    act(() => {
      const e = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })
      window.dispatchEvent(e)
    })

    expect(localStorage.getItem('commandPaletteUsed')).toBe('1')
  })
})

describe('CommandPalette', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1600,
    })
    Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    })
  })

  it('shows the terminal command on desktop', () => {
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('button', { name: /terminal/i }),
    ).toBeInTheDocument()
  })

  it('hides the terminal command below the desktop breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1280,
    })

    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={() => {}} />
      </MemoryRouter>,
    )

    expect(
      screen.queryByRole('button', { name: /terminal/i }),
    ).not.toBeInTheDocument()
  })
})

describe('CommandPaletteTip', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: 1600,
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
    expect(queryByText(/Try the command palette/i)).toBeNull()
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
    expect(queryByText(/Try the command palette/i)).toBeNull()

    // simulate a pointerdown interaction
    act(() => {
      window.dispatchEvent(new Event('pointerdown'))
      // advance timer
      vi.advanceTimersByTime(6000)
    })

    expect(queryByText(/Try the command palette/i)).not.toBeNull()
  })
})
