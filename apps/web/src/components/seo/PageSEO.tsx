import { useEffect } from 'react'
import { profile } from '../../content/profile'

interface PageSEOProps {
  title: string
  description: string
  image?: string
  url?: string
}

export default function PageSEO({
  title,
  description,
  image,
  url,
}: PageSEOProps) {
  useEffect(() => {
    const siteTitle = `${title} | PEDRODUARTEK`
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
    if (image) {
      ensureMeta('meta[property="og:image"]', {
        property: 'og:image',
        content: image,
      })
    }

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
    if (image)
      ensureMeta('meta[name="twitter:image"]', {
        name: 'twitter:image',
        content: image,
      })

    // JSON-LD Person
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      url: url || window.location.origin,
      image:
        image || `${window.location.origin}/src/images/pld_logo_header.png`,
      sameAs: [profile.github, profile.linkedin].filter(Boolean),
    }

    let script = document.querySelector(
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
