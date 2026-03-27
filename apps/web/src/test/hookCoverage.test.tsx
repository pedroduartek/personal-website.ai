import { act, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  ensureChatAvailability,
  resetChatAvailabilityCache,
  useChatAvailability,
} from '../hooks/useChatAvailability'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import * as apiClient from '../utils/apiClient'

function ChatAvailabilityProbe() {
  const isAvailable = useChatAvailability()
  return (
    <div>
      {isAvailable === null
        ? 'pending'
        : isAvailable
          ? 'available'
          : 'unavailable'}
    </div>
  )
}

function ScrollAnimationProbe() {
  const { ref, isVisible } = useScrollAnimation(0.25)

  return (
    <div>
      <div ref={ref} data-testid="scroll-target" />
      <span>{isVisible ? 'visible' : 'hidden'}</span>
    </div>
  )
}

describe('hook coverage', () => {
  let intersectionCallback:
    | ((entries: Array<{ isIntersecting: boolean }>) => void)
    | undefined
  let unobserveMock: ReturnType<typeof vi.fn>
  const originalIntersectionObserver = globalThis.IntersectionObserver

  beforeEach(() => {
    resetChatAvailabilityCache()
    unobserveMock = vi.fn()
    intersectionCallback = undefined

    class IntersectionObserverMock {
      observe = vi.fn()
      unobserve = unobserveMock
      disconnect = vi.fn()

      constructor(callback: typeof intersectionCallback) {
        intersectionCallback = callback
      }
    }

    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: IntersectionObserverMock,
    })
  })

  afterEach(() => {
    resetChatAvailabilityCache()
    vi.restoreAllMocks()
    Object.defineProperty(globalThis, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: originalIntersectionObserver,
    })
  })

  it('reuses cached chat availability checks via the alias exports', async () => {
    const healthSpy = vi
      .spyOn(apiClient, 'checkApiHealth')
      .mockResolvedValue(true)

    await expect(ensureChatAvailability()).resolves.toBe(true)
    await expect(ensureChatAvailability()).resolves.toBe(true)

    expect(healthSpy).toHaveBeenCalledTimes(1)
  })

  it('updates the chat availability hook after the health check resolves', async () => {
    vi.spyOn(apiClient, 'checkApiHealth').mockResolvedValue(true)

    render(<ChatAvailabilityProbe />)

    expect(screen.getByText('pending')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('available')).toBeInTheDocument()
    })
  })

  it('marks scroll-animated content as visible after intersection', () => {
    render(<ScrollAnimationProbe />)

    expect(screen.getByText('hidden')).toBeInTheDocument()

    act(() => {
      intersectionCallback?.([{ isIntersecting: true }])
    })

    expect(screen.getByText('visible')).toBeInTheDocument()
    expect(unobserveMock).toHaveBeenCalledWith(
      screen.getByTestId('scroll-target'),
    )
  })
})
