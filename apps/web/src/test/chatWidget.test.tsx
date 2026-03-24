import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ChatWidget from '../components/ChatWidget'
import { resetChatAvailabilityCache } from '../hooks/useChatAvailability'

describe('ChatWidget entrance bounce', () => {
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
  })

  afterEach(() => {
    resetChatAvailabilityCache()
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

    expect(button).toHaveClass('translate-y-[calc(-100vh-60px)]', 'opacity-0')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(button).toHaveClass('animate-drop-bounce')

    fireEvent.animationEnd(button)

    await act(async () => {
      await Promise.resolve()
    })

    expect(button).not.toHaveClass('animate-drop-bounce')
    expect(button).toHaveClass('translate-y-0', 'opacity-100')
  })
})
