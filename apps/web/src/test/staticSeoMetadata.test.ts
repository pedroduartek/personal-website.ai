import { describe, expect, it } from 'vitest'
import rawHtml from '../../index.html?raw'

// Collapse the formatter's line breaks so attribute pairs can be matched as
// simple substrings regardless of how index.html happens to be wrapped.
const html = rawHtml.replace(/\s+/g, ' ')

/**
 * Link-preview bots (LinkedIn, WhatsApp, Slack, X) do not run JavaScript, so
 * the tags PageSEO.tsx rewrites at runtime must already exist in index.html.
 * These selectors are the same ones PageSEO queries, which is also what keeps
 * it from appending duplicates instead of updating in place.
 */
const requiredTags = [
  '<meta name="description"',
  '<link rel="canonical"',
  '<meta property="og:type"',
  '<meta property="og:site_name"',
  '<meta property="og:locale"',
  '<meta property="og:title"',
  '<meta property="og:description"',
  '<meta property="og:url"',
  '<meta property="og:image"',
  '<meta property="og:image:width"',
  '<meta property="og:image:height"',
  '<meta property="og:image:alt"',
  '<meta name="twitter:card"',
  '<meta name="twitter:title"',
  '<meta name="twitter:description"',
  '<meta name="twitter:image"',
]

describe('static SEO metadata in index.html', () => {
  it.each(requiredTags)('ships %s', (tag) => {
    expect(html).toContain(tag)
  })

  it('has a descriptive title under 60 characters', () => {
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
    expect(title).toContain('Pedro Duarte')
    expect(title.length).toBeLessThanOrEqual(60)
  })

  it('has a description of a reasonable length for search results', () => {
    const description = html.match(
      /<meta name="description" content="([^"]*)"/,
    )?.[1]
    expect(description).toBeDefined()
    expect(description?.length).toBeGreaterThan(80)
    expect(description?.length).toBeLessThanOrEqual(170)
  })

  it('declares each SEO tag exactly once so previews are unambiguous', () => {
    for (const tag of [...requiredTags, '<title>']) {
      const occurrences = html.split(tag).length - 1
      expect(occurrences, `${tag} should appear once`).toBe(1)
    }
  })

  it('uses absolute URLs for social images and the canonical link', () => {
    const urls = [
      ...html.matchAll(
        /(?:og:image"|twitter:image"|rel="canonical") (?:content|href)="([^"]*)"/g,
      ),
    ].map((match) => match[1])
    expect(urls.length).toBe(3)
    for (const url of urls) {
      expect(url.startsWith('https://www.pedroduartek.com/')).toBe(true)
    }
  })
})
