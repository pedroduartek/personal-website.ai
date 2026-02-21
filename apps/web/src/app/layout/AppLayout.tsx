import { Suspense } from 'react'
import { Link, Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
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
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header className="border-b border-gray-800 bg-header">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-white">
            Personal Website
          </Link>
          <div className="flex gap-6">
            <NavLink to="/about">About</NavLink>
            <NavLink to="/experience">Experience</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NavLink to="/blog">Blog</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>
        </div>
      </nav>
    </header>
  )
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-gray-300 hover:text-white">
      {children}
    </Link>
  )
}

function Footer() {
  return (
    <footer className="border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/cv" className="text-sm text-gray-400 hover:text-white">
              Download CV
            </Link>
            <Link
              to="/skills"
              className="text-sm text-gray-400 hover:text-white"
            >
              Skills
            </Link>
            <Link
              to="/conferences"
              className="text-sm text-gray-400 hover:text-white"
            >
              Conferences
            </Link>
            <Link
              to="/education"
              className="text-sm text-gray-400 hover:text-white"
            >
              Education
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
