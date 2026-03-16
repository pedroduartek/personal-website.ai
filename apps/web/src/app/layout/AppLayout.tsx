import { Suspense, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import ChatWidget from '../../components/ChatWidget'
import { CommandPalette } from '../../components/CommandPalette'
import CommandPaletteTip from '../../components/CommandPalette/CommandPaletteTip'
import SiteContainer from '../../components/SiteContainer'
import ThemeToggle from '../../components/ThemeToggle'
import { useCommandPalette } from '../../hooks/useCommandPalette'
import { useTheme } from '../theme/ThemeProvider'
const logo = '/pld_logo_header.webp'

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
  const { theme } = useTheme()
  const isMac =
    typeof navigator !== 'undefined' &&
    /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)

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
              <kbd className="theme-kbd ml-1">{isMac ? '⌘K' : 'Ctrl+K'}</kbd>
            </button>

            <CommandPaletteTip />
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop navigation */}
            <div className="hidden 2xl:flex gap-3">
              <NavLink to="/about">About Me</NavLink>
              <NavLink to="/experience">Experience</NavLink>
              <NavLink to="/projects">Projects</NavLink>
              <NavLink to="/education">Education</NavLink>
              <NavLink to="/conferences">Conferences</NavLink>
              <NavLink to="/skills">Skills</NavLink>
              <NavLink to="/cv">Download CV</NavLink>
              <NavLink to="/contact">Contacts</NavLink>
            </div>

            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="theme-button-secondary p-2 2xl:hidden"
              aria-label="Toggle menu"
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
          <div className="2xl:hidden mt-4 flex flex-col gap-2">
            <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>
              About Me
            </NavLink>
            <NavLink to="/experience" onClick={() => setIsMenuOpen(false)}>
              Professional Experience
            </NavLink>
            <NavLink to="/projects" onClick={() => setIsMenuOpen(false)}>
              Personal Projects
            </NavLink>
            <NavLink to="/education" onClick={() => setIsMenuOpen(false)}>
              Education
            </NavLink>
            <NavLink to="/conferences" onClick={() => setIsMenuOpen(false)}>
              Conferences
            </NavLink>
            <NavLink to="/skills" onClick={() => setIsMenuOpen(false)}>
              Skills
            </NavLink>
            <NavLink to="/cv" onClick={() => setIsMenuOpen(false)}>
              Download CV
            </NavLink>
            <NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>
              Contacts
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  )
}

function NavLink({
  to,
  children,
  onClick,
}: { to: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="theme-button-secondary">
      {children}
    </Link>
  )
}
