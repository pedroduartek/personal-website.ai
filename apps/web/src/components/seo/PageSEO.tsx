import { useEffect } from 'react'
import { profile } from '../../content/profile'

interface PageSEOProps {
  title: string
  description: string
  image?: string
  url?: string
}

// Absolute URL of the shared social card. Must stay in sync with the static
// og:image in index.html: link-preview bots read the static tag, this component
// re-applies the same value at runtime. Relative /src/... paths do NOT survive
// the Vite build, so callers must pass an absolute URL or nothing at all.
const DEFAULT_OG_IMAGE = 'https://pedroduartek.com/og-image.png'

export default function PageSEO({
  title,
  description,
  image,
  url,
}: PageSEOProps) {
  useEffect(() => {
    const siteTitle = `${title} | PEDRODUARTEK`
    const resolvedImage = image ?? DEFAULT_OG_IMAGE
    document.title = siteTitle

    const ensureMeta = (
      selector: string,
      attrs: Record<string, string>,
    ): HTMLMetaElement => {
      const existing = document.querySelector(selector) as HTMLMetaElement
      if (existing) {
        for (const [k, v] of Object.entries(attrs)) existing.setAttribute(k, v)
        return existing
      }
      const m = document.createElement('meta')
      for (const [k, v] of Object.entries(attrs)) m.setAttribute(k, v)
      document.head.appendChild(m)
      return m
    }

    // description
    ensureMeta('meta[name="description"]', {
      name: 'description',
      content: description,
    })

    // canonical
    const canonicalHref = url || window.location.href
    let canonical = document.querySelector(
      'link[rel="canonical"]',
    ) as HTMLLinkElement
    if (canonical) canonical.href = canonicalHref
    else {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      canonical.href = canonicalHref
      document.head.appendChild(canonical)
    }

    // Open Graph
    ensureMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: siteTitle,
    })
    ensureMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    })
    ensureMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: 'website',
    })
    ensureMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonicalHref,
    })
    ensureMeta('meta[property="og:image"]', {
      property: 'og:image',
      content: resolvedImage,
    })

    // Twitter
    ensureMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    })
    ensureMeta('meta[name="twitter:creator"]', {
      name: 'twitter:creator',
      content: profile.github ?? '',
    })
    ensureMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: siteTitle,
    })
    ensureMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    })
    ensureMeta('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: resolvedImage,
    })

    // JSON-LD Person
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      url: url || window.location.origin,
      image: resolvedImage,
      sameAs: [profile.github, profile.linkedin].filter(Boolean),
    }

    const script = document.querySelector(
      'script[type="application/ld+json"]',
    ) as HTMLScriptElement | null
    if (script) script.textContent = JSON.stringify(ld)
    else {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.textContent = JSON.stringify(ld)
      document.head.appendChild(s)
    }
  }, [title, description, image, url])

  return null
}
