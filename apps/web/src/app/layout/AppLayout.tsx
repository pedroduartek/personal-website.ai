import { Suspense, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { CommandPalette } from '../../components/CommandPalette'
import { useCommandPalette } from '../../hooks/useCommandPalette'
import logo from '../../images/pld_logo_header.png'

export default function AppLayout() {
  const { isOpen, close, open } = useCommandPalette()

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
      <CommandPalette isOpen={isOpen} onClose={close} />
    </div>
  )
}

function Header({
  onOpenCommandPalette,
}: { onOpenCommandPalette: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b border-gray-800 bg-header">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-bold text-white"
          >
            <img src={logo} alt="PLD Logo" className="h-8 w-8" />
            PEDRODUARTEK
          </Link>

          {/* Command Palette Button */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-3 py-1.5 text-sm text-gray-400 transition-colors hover:border-gray-600 hover:bg-gray-800 hover:text-gray-300"
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
              ⌘K
            </kbd>
          </button>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden rounded-lg border border-gray-700 p-2 text-gray-300 hover:bg-gray-800 hover:text-white"
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
          <div className="hidden md:flex gap-3">
            <NavLink to="/about">About</NavLink>
            <NavLink to="/experience">Professional Experience</NavLink>
            <NavLink to="/education">Education</NavLink>
            <NavLink to="/skills">Skills</NavLink>
            <NavLink to="/projects">Personal Projects</NavLink>
            <NavLink to="/cv">Download CV</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-2">
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
      className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-blue-500 hover:bg-gray-800 hover:text-white hover:shadow-md"
    >
      {children}
    </Link>
  )
}
