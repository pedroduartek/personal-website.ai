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
    </div>
  )
}

function Header() {
  return (
    <header className="border-b border-gray-800 bg-header">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-white">
            PEDRODUARTEK
          </Link>
          <div className="flex gap-6">
            <NavLink to="/about">About</NavLink>
            <NavLink to="/experience">Professional Experience</NavLink>
            <NavLink to="/education">Education</NavLink>
            <NavLink to="/skills">Skills</NavLink>
            <NavLink to="/projects">Personal Projects</NavLink>
            <NavLink to="/cv">Download CV</NavLink>
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
