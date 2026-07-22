import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

type StyledLinkVariant =
  | 'card'
  | 'inline-underline'
  | 'inline-accent'
  | 'inline-chip'

type Props = {
  href?: string
  children?: React.ReactNode
  target?: string
  rel?: string
  bigger?: boolean
  ariaLabel?: string
  variant?: StyledLinkVariant
}

const variantClasses: Record<StyledLinkVariant, string> = {
  card: 'inline-block rounded border border-border bg-surface-muted px-2 py-0.5 text-sm text-foreground no-underline transition-all duration-200 hover:translate-x-1 hover:border-border-strong hover:bg-surface-strong hover:shadow-lg',
  'inline-underline':
    'inline font-medium text-foreground underline decoration-brand/55 decoration-2 underline-offset-[0.24em] transition-colors duration-200 hover:text-brand hover:decoration-brand',
  'inline-accent':
    'inline rounded-[0.35rem] px-1 py-0.5 font-medium text-foreground underline decoration-transparent decoration-2 underline-offset-4 shadow-[inset_0_-0.58em_0_0_rgba(16,185,129,0.16)] transition-all duration-200 hover:text-foreground hover:shadow-[inset_0_-0.95em_0_0_rgba(16,185,129,0.24)]',
  'inline-chip':
    'inline rounded-md border border-border bg-surface-muted px-2 py-0.5 text-[0.92em] font-medium text-foreground no-underline transition-all duration-200 hover:border-border-strong hover:bg-surface hover:shadow-sm',
}

export default function StyledLink({
  href = '',
  children,
  target,
  rel,
  bigger = false,
  ariaLabel,
  variant = 'card',
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
        const base = 'focus:outline-none'
        const sizeClass =
          bigger && variant === 'card'
            ? 'transform origin-left scale-110'
            : bigger
              ? 'text-[1.05em]'
              : ''

        return `${base} ${variantClasses[variant]} ${sizeClass}`.trim()
      })()}
    >
      {children}
    </a>
  )
}
