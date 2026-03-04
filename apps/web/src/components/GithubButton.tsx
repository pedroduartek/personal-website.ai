import type React from 'react'

type Props = {
  href: string
  children?: React.ReactNode
  ariaLabel?: string
  className?: string
  target?: string
}

export default function GithubButton({
  href,
  children,
  ariaLabel,
  className,
  target = '_blank',
}: Props) {
  const base =
    'inline-flex items-center gap-2 rounded-lg border border-brand-700 bg-brand px-4 py-2 text-center text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand/50 transform origin-left scale-110'

  return (
    <a
      href={href}
      target={target}
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`${base} ${className ?? ''}`.trim()}
    >
      <span className="font-mono mr-2">&lt;&gt;</span>
      {children}
    </a>
  )
}
