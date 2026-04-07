import { describe, expect, it } from 'vitest'
import {
  TURNSTILE_FLEXIBLE_MIN_WIDTH,
  getTurnstileWidgetSize,
} from '../utils/turnstile'

describe('turnstile helpers', () => {
  it('uses the compact widget when the available width is below the flexible minimum', () => {
    expect(getTurnstileWidgetSize(TURNSTILE_FLEXIBLE_MIN_WIDTH - 1)).toBe(
      'compact',
    )
  })

  it('keeps the flexible widget when the available width can support it', () => {
    expect(getTurnstileWidgetSize(TURNSTILE_FLEXIBLE_MIN_WIDTH)).toBe(
      'flexible',
    )
    expect(getTurnstileWidgetSize(TURNSTILE_FLEXIBLE_MIN_WIDTH + 24)).toBe(
      'flexible',
    )
  })

  it('falls back to the flexible widget when no measured width is available yet', () => {
    expect(getTurnstileWidgetSize()).toBe('flexible')
    expect(getTurnstileWidgetSize(null)).toBe('flexible')
  })
})
