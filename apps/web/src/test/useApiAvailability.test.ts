import { describe, expect, it } from 'vitest'
import { shouldPreviewApiFeaturesLocally } from '../hooks/useApiAvailability'

describe('shouldPreviewApiFeaturesLocally', () => {
  it('enables API-backed UI on localhost during local development', () => {
    expect(
      shouldPreviewApiFeaturesLocally({
        hostname: 'localhost',
        isDev: true,
        mode: 'development',
      }),
    ).toBe(true)
  })

  it('stays off in test mode even on localhost', () => {
    expect(
      shouldPreviewApiFeaturesLocally({
        hostname: 'localhost',
        isDev: true,
        mode: 'test',
      }),
    ).toBe(false)
  })

  it('stays off for non-local hosts', () => {
    expect(
      shouldPreviewApiFeaturesLocally({
        hostname: 'pedroduartek.com',
        isDev: true,
        mode: 'development',
      }),
    ).toBe(false)
  })

  it('can be disabled explicitly on localhost', () => {
    expect(
      shouldPreviewApiFeaturesLocally({
        hostname: 'localhost',
        isDev: true,
        mode: 'development',
        showLocallyFlag: 'false',
      }),
    ).toBe(false)
  })
})
