import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  href?: string
  children?: React.ReactNode
  target?: string
  rel?: string
  bigger?: boolean
  ariaLabel?: string
}

export default function StyledLink({
  href = '',
  children,
  target,
  rel,
  bigger = false,
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
      className={(() => {
        const base =
          'inline-block text-sm px-2 py-0.5 rounded border transition-all duration-200 focus:outline-none'
        const defaults =
          'bg-gray-800 text-gray-100 border-gray-700 no-underline hover:translate-x-1 hover:bg-gray-700 hover:shadow-lg focus:ring-2 focus:ring-indigo-300'
        const sizeClass = bigger ? 'transform origin-left scale-110' : ''
        return `${base} ${defaults} ${sizeClass}`.trim()
      })()}
    >
      {children}
    </a>
  )
}
