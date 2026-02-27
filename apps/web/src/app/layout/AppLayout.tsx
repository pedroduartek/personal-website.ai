import { Suspense, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import ChatWidget from '../../components/ChatWidget'
import { CommandPalette } from '../../components/CommandPalette'
import CommandPaletteTip from '../../components/CommandPalette/CommandPaletteTip'
import { useCommandPalette } from '../../hooks/useCommandPalette'
import logo from '../../images/pld_logo_header.png'

export default function AppLayout() {
  const { isOpen, close, open } = useCommandPalette()

  // Use build-time `VITE_LAST_UPDATED` only; do not fall back to runtime
  // (runtime fallback showed the current time, which is incorrect).
  const lastUpdated = import.meta.env.VITE_LAST_UPDATED ?? null
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header onOpenCommandPalette={open} />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-16">
              <div className="text-gray-300">Loading...</div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <footer className="border-t border-gray-800 bg-header py-4 text-center text-xs text-gray-400">
        {lastUpdated ? `Last updated: ${lastUpdated}` : null}
      </footer>
      <CommandPalette isOpen={isOpen} onClose={close} />
      <ChatWidget />
    </div>
  )
}

function Header({
  onOpenCommandPalette,
}: { onOpenCommandPalette: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isMac =
    typeof navigator !== 'undefined' &&
    /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)

  return (
    <header className="border-b border-gray-800 bg-header">
      <nav className="relative px-3 py-2 2xl:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-bold text-white"
          >
            <img src={logo} alt="PLD Logo" className="h-[70px] w-auto" />
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
                    sessionStorage.setItem('commandPaletteTipDismissed', '1')
                } catch (e) {
                  // ignore
                }
                onOpenCommandPalette()
              }}
              className="hidden 2xl:flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm text-gray-400 transition-colors hover:border-gray-600 hover:bg-gray-800 hover:text-gray-300 min-w-[200px] justify-between"
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
              <kbd className="ml-1 rounded bg-gray-700 px-1.5 py-0.5 text-xs text-gray-400">
                {isMac ? '⌘K' : 'Ctrl+K'}
              </kbd>
            </button>

            <CommandPaletteTip />
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="2xl:hidden rounded-lg border border-gray-700 p-2 text-gray-300 hover:bg-gray-800 hover:text-white"
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

            {/* Desktop navigation */}
            <div className="hidden 2xl:flex gap-3">
              <NavLink to="/about">About</NavLink>
              <NavLink to="/experience">Professional Experience</NavLink>
              <NavLink to="/education">Education</NavLink>
              <NavLink to="/conferences">Conferences</NavLink>
              <NavLink to="/skills">Skills</NavLink>
              <NavLink to="/projects">Personal Projects</NavLink>
              <NavLink to="/cv">Download CV</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="2xl:hidden mt-4 flex flex-col gap-2">
            <NavLink to="/about" onClick={() => setIsMenuOpen(false)}>
              About
            </NavLink>
            <NavLink to="/experience" onClick={() => setIsMenuOpen(false)}>
              Professional Experience
            </NavLink>
            <NavLink to="/education" onClick={() => setIsMenuOpen(false)}>
              Education
            </NavLink>
            <NavLink to="/skills" onClick={() => setIsMenuOpen(false)}>
              Skills
            </NavLink>
            <NavLink to="/projects" onClick={() => setIsMenuOpen(false)}>
              Personal Projects
            </NavLink>
            <NavLink to="/cv" onClick={() => setIsMenuOpen(false)}>
              Download CV
            </NavLink>
            <NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>
              Contact
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
    <Link
      to={to}
      onClick={onClick}
      className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:scale-105 hover:bg-gray-800 hover:text-white hover:shadow-lg"
    >
      {children}
    </Link>
  )
}
