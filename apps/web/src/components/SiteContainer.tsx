import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
}

export default function SiteContainer({ children, className = '' }: Props) {
  // Provide a consistent responsive horizontal gutter across the site.
  // Use `mx-auto` so it remains centered when inner elements set max-widths.
  return (
    <div className={`mx-auto px-4 sm:px-6 md:px-8 ${className}`}>
      {children}
    </div>
  )
}
