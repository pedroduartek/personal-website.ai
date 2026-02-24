import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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
    sessionStorage.clear()
  })

  it('records sessionStorage flag when opened via keyboard shortcut', () => {
    // ensure desktop breakpoint in test env
    // (the hook only activates for innerWidth >= 1536)
    // set before rendering so listener uses the right branch
    // jsdom allows setting innerWidth directly
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.innerWidth = 1600
    render(<TestUseCommandPalette />)
    expect(sessionStorage.getItem('commandPaletteUsed')).toBeNull()

    // simulate Ctrl+K
    act(() => {
      const e = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })
      window.dispatchEvent(e)
    })

    expect(sessionStorage.getItem('commandPaletteUsed')).toBe('1')
  })
})

describe('CommandPaletteTip', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not show if user already used command palette', () => {
    sessionStorage.setItem('commandPaletteUsed', '1')
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
