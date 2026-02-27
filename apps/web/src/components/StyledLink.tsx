import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  href?: string
  children?: React.ReactNode
  className?: string
  target?: string
  rel?: string
  ariaLabel?: string
}

export default function StyledLink({
  href = '',
  children,
  className,
  target,
  rel,
  ariaLabel,
}: Props) {
  const navigate = useNavigate()

  const isInternal = href.startsWith('/')

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      if (!href) return
      if (isInternal) navigate(href)
      else if (target === '_blank') window.open(href, '_blank')
      else window.location.href = href
    },
    [href, isInternal, navigate, target],
  )

  return (
    <a
      href={href}
      rel={rel}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        // internal navigation should use client router
        if (isInternal) {
          e.preventDefault()
          handleClick(e)
        }
      }}
      target={target}
      aria-label={ariaLabel}
      className={`inline-block font-mono text-sm bg-gray-800 text-gray-100 px-2 py-0.5 rounded border border-gray-700 transition-all duration-200 hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-indigo-300${className ? ` ${className}` : ''}`}
    >
      {children}
    </a>
  )
}
