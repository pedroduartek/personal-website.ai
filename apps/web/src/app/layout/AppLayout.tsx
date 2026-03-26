import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  Link,
  Outlet,
  NavLink as RouterNavLink,
  useLocation,
} from 'react-router-dom'
import ChatWidget from '../../components/ChatWidget'
import { CommandPalette } from '../../components/CommandPalette'
import CommandPaletteTip from '../../components/CommandPalette/CommandPaletteTip'
import SiteContainer from '../../components/SiteContainer'
import ThemeToggle from '../../components/ThemeToggle'
import { useCommandPalette } from '../../hooks/useCommandPalette'
import { useTheme } from '../theme/ThemeProvider'

const logo = '/pld_logo_header.webp'

const desktopHeaderLinks = [
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/projects', label: 'Projects' },
  { to: '/education', label: 'Education' },
  { to: '/skills', label: 'Skills' },
  { to: '/contact', label: 'Contact' },
] as const

const mobileHeaderLinks = [
  { to: '/about', label: 'About Me' },
  { to: '/experience', label: 'Professional Experience' },
  { to: '/projects', label: 'Personal Projects' },
  { to: '/education', label: 'Education' },
  { to: '/skills', label: 'Skills' },
  { to: '/contact', label: 'Contacts' },
] as const

export default function AppLayout() {
  const { isOpen, close, open } = useCommandPalette()
  const location = useLocation()
  const isTerminalRoute = location.pathname === '/terminal'

  const lastUpdated = import.meta.env.VITE_LAST_UPDATED ?? null
  return (
    <div
      className={`flex flex-col bg-background ${
        isTerminalRoute ? 'h-screen overflow-hidden' : 'min-h-screen'
      }`}
    >
      <Header isTerminalRoute={isTerminalRoute} onOpenCommandPalette={open} />
      <main
        className={`flex flex-1 min-h-0 ${isTerminalRoute ? 'overflow-hidden' : ''}`}
      >
        {isTerminalRoute ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <Suspense
              fallback={
                <div className="flex flex-1 items-center justify-center py-16">
                  <div className="text-foreground-muted">Loading...</div>
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </div>
        ) : (
          <SiteContainer className="flex-1">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-16">
                  <div className="text-foreground-muted">Loading...</div>
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </SiteContainer>
        )}
      </main>
      <footer className="bg-header py-4 text-center text-xs text-foreground-subtle">
        {lastUpdated ? `Last updated: ${lastUpdated}` : null}
      </footer>
      <CommandPalette isOpen={isOpen} onClose={close} />
      {!isTerminalRoute && <ChatWidget />}
    </div>
  )
}

function Header({
  isTerminalRoute,
  onOpenCommandPalette,
}: {
  isTerminalRoute: boolean
  onOpenCommandPalette: () => void
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeUnderline, setActiveUnderline] = useState<{
    left: number
    width: number
    visible: boolean
  }>({ left: 0, width: 0, visible: false })
  const desktopNavRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const desktopNavContainerRef = useRef<HTMLDivElement | null>(null)
  const location = useLocation()
  const { theme } = useTheme()
  const isMac =
    typeof navigator !== 'undefined' &&
    /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)

  useLayoutEffect(() => {
    const activeLink = desktopHeaderLinks.find(
      (link) =>
        location.pathname === link.to ||
        location.pathname.startsWith(`${link.to}/`),
    )

    if (!activeLink) {
      setActiveUnderline((current) =>
        current.visible ? { ...current, visible: false } : current,
      )
      return
    }

    const activeElement = desktopNavRefs.current[activeLink.to]
    const containerElement = desktopNavContainerRef.current

    if (!activeElement || !containerElement) {
      return
    }

    const nextUnderline = {
      left: activeElement.offsetLeft,
      width: activeElement.offsetWidth,
      visible: true,
    }

    setActiveUnderline((current) => {
      if (
        current.left === nextUnderline.left &&
        current.width === nextUnderline.width &&
        current.visible === nextUnderline.visible
      ) {
        return current
      }

      return nextUnderline
    })
  }, [location.pathname])

  useEffect(() => {
    const syncUnderline = () => {
      const activeLink = desktopHeaderLinks.find(
        (link) =>
          location.pathname === link.to ||
          location.pathname.startsWith(`${link.to}/`),
      )

      if (!activeLink) {
        return
      }

      const activeElement = desktopNavRefs.current[activeLink.to]
      const containerElement = desktopNavContainerRef.current

      if (!activeElement || !containerElement) {
        return
      }

      setActiveUnderline({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
        visible: true,
      })
    }

    syncUnderline()
    window.addEventListener('resize', syncUnderline)

    return () => {
      window.removeEventListener('resize', syncUnderline)
    }
  }, [location.pathname])

  if (isTerminalRoute) {
    return (
      <header className="bg-header">
        <nav className="flex items-center justify-between gap-4 px-3 py-2 2xl:px-6">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-bold text-foreground"
          >
            <img
              src={logo}
              alt="PLD Logo"
              className={`h-[70px] w-auto transition-[filter] ${
                theme === 'light' ? 'brightness-0' : ''
              }`}
              width={70}
              height={70}
              fetchPriority="high"
              decoding="sync"
            />
            PEDRODUARTEK
          </Link>
          <ThemeToggle />
        </nav>
      </header>
    )
  }

  return (
    <header className="bg-header">
      <nav className="relative px-3 py-2 2xl:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-bold text-foreground"
          >
            <img
              src={logo}
              alt="PLD Logo"
              className={`h-[70px] w-auto transition-[filter] ${
                theme === 'light' ? 'brightness-0' : ''
              }`}
              width={70}
              height={70}
              fetchPriority="high"
              decoding="sync"
            />
            PEDRODUARTEK
          </Link>

          {/* Command Palette Button - Desktop only, centered */}
          <div className="relative">
            <button
              type="button"
              id="command-palette-button"
              onClick={() => {
                try {
                  if (typeof window !== 'undefined')
                    localStorage.setItem('commandPaletteTipDismissed', '1')
                } catch (e) {
                  // ignore
                }
                onOpenCommandPalette()
              }}
              className="hidden min-w-[200px] items-center justify-between gap-2 rounded-lg border border-border bg-surface-muted/80 px-4 py-2 text-sm text-foreground-subtle transition-colors hover:border-border-strong hover:bg-surface-muted hover:text-foreground-muted 2xl:flex"
              aria-label="Open command palette"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Search icon"
              >
                <title>Search</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Search</span>
              <kbd className="theme-kbd ml-1 border-0 bg-surface px-1.5 py-0.5">
                {isMac ? '⌘K' : 'Ctrl+K'}
              </kbd>
            </button>

            <CommandPaletteTip />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden 2xl:flex items-center gap-6">
              <div
                ref={desktopNavContainerRef}
                className="relative flex items-center gap-5"
              >
                {desktopHeaderLinks.map((link) => (
                  <HeaderNavLink
                    key={link.to}
                    to={link.to}
                    navRef={(element) => {
                      desktopNavRefs.current[link.to] = element
                    }}
                  >
                    {link.label}
                  </HeaderNavLink>
                ))}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 block h-0.5 rounded-full bg-foreground transition-[transform,width,opacity] duration-300 ease-out"
                  style={{
                    width: `${activeUnderline.width}px`,
                    transform: `translateX(${activeUnderline.left}px)`,
                    opacity: activeUnderline.visible ? 1 : 0,
                  }}
                />
              </div>

              <Link
                to="/cv"
                className="inline-flex items-center rounded-md px-2 py-2 text-sm font-semibold text-chat transition-colors duration-200 hover:text-blue-700"
              >
                Download CV
              </Link>
            </div>

            <ThemeToggle className="rounded-full border-border/80 bg-surface-muted/70 hover:bg-surface" />

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center rounded-full border border-border bg-surface-muted/80 p-2 text-foreground-muted transition-all duration-200 hover:border-border-strong hover:bg-surface hover:text-foreground 2xl:hidden"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                role="img"
                aria-label="Menu icon"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="mt-4 rounded-[1.5rem] border border-border bg-surface p-3 shadow-lg shadow-slate-950/5 2xl:hidden">
            <Link
              to="/cv"
              onClick={() => setIsMenuOpen(false)}
              className="mb-2 inline-flex w-full items-center justify-start rounded-md px-2 py-2 text-sm font-semibold text-chat transition-colors duration-200 hover:text-blue-700"
            >
              Download CV
            </Link>

            <div className="flex flex-col gap-1">
              {mobileHeaderLinks.map((link) => (
                <MobileNavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </MobileNavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

function HeaderNavLink({
  to,
  children,
  navRef,
}: {
  to: string
  children: React.ReactNode
  navRef?: (element: HTMLAnchorElement | null) => void
}) {
  return (
    <RouterNavLink
      to={to}
      ref={navRef}
      className={({ isActive }) =>
        `inline-flex items-center px-1 py-2 text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'text-foreground'
            : 'border-transparent text-foreground-muted hover:text-foreground'
        }`
      }
    >
      {children}
    </RouterNavLink>
  )
}

function MobileNavLink({
  to,
  children,
  onClick,
}: { to: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <RouterNavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `inline-flex items-center border-b border-transparent px-2 py-2.5 text-sm font-medium transition-colors duration-200 ${
          isActive
            ? 'border-border text-foreground'
            : 'text-foreground-muted hover:text-foreground'
        }`
      }
    >
      {children}
    </RouterNavLink>
  )
}
