interface WebsitePeekProps {
  href: string
  title: string
  domain?: string
  className?: string
}

export default function WebsitePeek({
  href,
  title,
  domain,
  className,
}: WebsitePeekProps) {
  const displayDomain = domain ?? new URL(href).host
  const scrollbarCompensation = 18

  return (
    <div className={`theme-card overflow-hidden ${className ?? ''}`.trim()}>
      <div className="border-b border-border bg-surface-muted/80 px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-3 w-3 rounded-full bg-rose-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </div>
          <div className="min-w-0 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-foreground-subtle">
            <span className="block truncate">{displayDomain}</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden bg-white">
        <div className="pointer-events-none overflow-hidden bg-white">
          <iframe
            src={href}
            title={`${title} live preview`}
            loading="lazy"
            tabIndex={-1}
            aria-hidden="true"
            sandbox="allow-scripts allow-same-origin"
            referrerPolicy="strict-origin-when-cross-origin"
            scrolling="no"
            className="block h-[440px] border-0 bg-white"
            style={{
              width: `calc(100% + ${scrollbarCompensation}px)`,
              marginRight: `-${scrollbarCompensation}px`,
            }}
          />
        </div>

        <a
          href={href}
          aria-label={`Open ${title}`}
          className="absolute inset-0 z-10 flex items-end p-4"
        >
          <span className="pointer-events-none inline-flex rounded-full bg-slate-950/82 px-3 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur">
            Live preview. Click to open the site.
          </span>
        </a>
      </div>
    </div>
  )
}
