import { describe, expect, it } from 'vitest'
import { getVercelObservabilityConfigString } from '../utils/vercelObservability'

describe('vercel observability config', () => {
  it('stays disabled outside production', () => {
    expect(getVercelObservabilityConfigString(false)).toBeUndefined()
  })

  it('uses neutral first-party relay paths in production', () => {
    expect(
      JSON.parse(getVercelObservabilityConfigString(true) ?? 'null'),
    ).toEqual({
      analytics: {
        scriptSrc: '/relay/insights/script.js',
        viewEndpoint: '/relay/insights/view',
        eventEndpoint: '/relay/insights/event',
      },
      speedInsights: {
        scriptSrc: '/relay/speed-insights/script.js',
        endpoint: '/relay/speed-insights/vitals',
      },
    })
  })
})
