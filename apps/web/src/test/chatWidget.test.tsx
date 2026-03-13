import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ChatWidget from '../components/ChatWidget'

describe('ChatWidget entrance bounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
      }),
    )
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('plays the chat button bounce once when the widget becomes available', async () => {
    render(
      <MemoryRouter>
        <ChatWidget />
      </MemoryRouter>,
    )

    await act(async () => {
      await Promise.resolve()
    })

    const button = screen.getByRole('button', { name: 'Open chat' })

    expect(button).toHaveStyle({
      transform: 'translateY(calc(-100vh - 60px))',
      opacity: '0',
    })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(button.style.animation).toContain('dropBounce')

    fireEvent.animationEnd(button)

    await act(async () => {
      await Promise.resolve()
    })

    expect(button.style.animation).toBe('')
    expect(button).toHaveStyle({
      transform: 'translateY(0)',
      opacity: '1',
    })
  })
})
