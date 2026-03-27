// Use first-party, neutral routes in production so common blocker lists do not
// match Vercel's default observability endpoints.
export const vercelAnalyticsProps = import.meta.env.PROD
  ? {
      scriptSrc: '/relay/a.js',
      endpoint: '/relay/a',
    }
  : {}

export const vercelSpeedInsightsProps = import.meta.env.PROD
  ? {
      scriptSrc: '/relay/s.js',
      endpoint: '/relay/s',
    }
  : {}
