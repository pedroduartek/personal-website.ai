export const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA'
export const TURNSTILE_TEST_TOKEN = 'XXXX.DUMMY.TOKEN.XXXX'
export const TURNSTILE_SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export function getTurnstileSiteKey() {
  const configuredSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim()
  if (configuredSiteKey) return configuredSiteKey

  return import.meta.env.MODE === 'production' ? '' : TURNSTILE_TEST_SITE_KEY
}

export function isTurnstileConfigured() {
  return getTurnstileSiteKey().length > 0
}
