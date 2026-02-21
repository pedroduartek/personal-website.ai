import { useEffect } from 'react'

interface PageSEOProps {
  title: string
  description: string
}

export default function PageSEO({ title, description }: PageSEOProps) {
  useEffect(() => {
    document.title = `${title} | Personal Website`

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    } else {
      const meta = document.createElement('meta')
      meta.name = 'description'
      meta.content = description
      document.head.appendChild(meta)
    }

    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', title)
    } else {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:title')
      meta.content = title
      document.head.appendChild(meta)
    }

    const ogDescription = document.querySelector(
      'meta[property="og:description"]',
    )
    if (ogDescription) {
      ogDescription.setAttribute('content', description)
    } else {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:description')
      meta.content = description
      document.head.appendChild(meta)
    }
  }, [title, description])

  return null
}
