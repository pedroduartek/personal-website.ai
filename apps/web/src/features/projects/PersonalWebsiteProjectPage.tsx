import { Link } from 'react-router-dom'
import PageSEO from '../../components/seo/PageSEO'
import { getExperience } from '../../utils/experience'

export default function PersonalWebsiteProjectPage() {
  const experience = getExperience()

  return (
    <>
      <PageSEO
        title="AI-Assisted Personal Website"
        description="Modern portfolio website built using AI-assisted development as a backend engineer learning frontend technologies"
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <Link
          to="/projects"
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:scale-105 hover:bg-gray-800 hover:text-white hover:shadow-lg"
        >
          <span>←</span> Back to projects
        </Link>

        <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          AI-Assisted Personal Website
        </h1>

        <p className="mb-4 text-lg text-gray-400 md:text-xl">
          A Backend Engineer's Frontend Learning Journey • February 2026
        </p>

        <div className="mb-8">
          <a
            href="https://github.com/pedroduartek/personal-website.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-brand-700 bg-brand px-4 py-2 text-center text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            <span className="font-mono mr-2">&lt;&gt;</span>
            View on GitHub
          </a>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {[
            'React 18',
            'TypeScript 5',
            'Vite',
            'Tailwind CSS',
            'React Router',
            'AI-Assisted',
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="prose prose-lg max-w-none text-gray-300">
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">Overview</h2>
            <p className="mb-4">
              This website is an experiment in using AI-assisted development to
              learn frontend technologies. As a backend engineer with{' '}
              {experience.text} of C#/.NET experience but minimal frontend
              knowledge, I wanted to build a professional portfolio while
              learning React, TypeScript, and modern frontend development
              without spending months in tutorials.
            </p>
            <p className="mb-4">
              The result: A production-ready portfolio site built in days
              instead of months, where AI acted as a productivity multiplier
              while I maintained full ownership of architectural decisions and
              learned by building real features.
            </p>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-gray-700 bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Project Goals
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    Learn React and TypeScript through hands-on development
                  </li>
                  <li>
                    Test AI tools as a learning accelerator for experienced
                    engineers
                  </li>
                  <li>
                    Build a production-ready portfolio showcasing backend
                    experience
                  </li>
                  <li>
                    Create meta-documentation: the website itself demonstrates
                    the approach
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Core Principles
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>AI assists, but I make all architectural decisions</li>
                  <li>Learn by building real features, not tutorials</li>
                  <li>
                    Apply backend standards: type safety, testing, clean code
                  </li>
                  <li>Iterate based on real usage and feedback</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Tech Stack
            </h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <ul className="space-y-2">
                <li>
                  <strong className="text-white">
                    React 18 + TypeScript 5:
                  </strong>{' '}
                  Modern hooks-based components with full type safety
                </li>
                <li>
                  <strong className="text-white">Vite:</strong> Fast development
                  and optimized production builds
                </li>
                <li>
                  <strong className="text-white">Tailwind CSS:</strong> Custom
                  dark theme (#212830 background, #262C36 cards)
                </li>
                <li>
                  <strong className="text-white">React Router:</strong>{' '}
                  Client-side routing with lazy loading for performance
                </li>
                <li>
                  <strong className="text-white">Biome + Vitest:</strong>{' '}
                  Linting, formatting, and unit testing
                </li>
                <li>
                  <strong className="text-white">pnpm monorepo:</strong>{' '}
                  Efficient package management with workspace support
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Key Features
            </h2>
            <div className="space-y-3">
              <div className="rounded-lg border border-gray-700 bg-card p-4">
                <p>
                  <strong className="text-white">
                    Command Palette (⌘K / Ctrl+K):
                  </strong>{' '}
                  Fuzzy search navigation inspired by modern IDEs, with keyboard
                  shortcuts and smooth animations for quick site exploration
                </p>
              </div>
              <div className="rounded-lg border border-gray-700 bg-card p-4">
                <p>
                  <strong className="text-white">
                    Professional experience showcase:
                  </strong>{' '}
                  Dynamic pages with clickable articles, detailed role
                  descriptions, and real CV data
                </p>
              </div>
              <div className="rounded-lg border border-gray-700 bg-card p-4">
                <p>
                  <strong className="text-white">
                    Personal projects gallery:
                  </strong>{' '}
                  Custom detail pages for major projects (Home Assistant, this
                  website) with comprehensive documentation
                </p>
              </div>
              <div className="rounded-lg border border-gray-700 bg-card p-4">
                <p>
                  <strong className="text-white">AI chat integration:</strong>{' '}
                  This site includes an "ai-chat" feature that calls a backend
                  API for conversational responses — see the{' '}
                  <Link
                    to="/projects/ai-chat-api"
                    className="text-blue-300 underline"
                  >
                    AI Chat API
                  </Link>{' '}
                  project for details.
                </p>
              </div>
              <div className="rounded-lg border border-gray-700 bg-card p-4">
                <p>
                  <strong className="text-white">
                    Consistent design system:
                  </strong>{' '}
                  Custom dark theme with unified hover effects, animations, and
                  carefully designed color palette for professional polish
                </p>
              </div>
              <div className="rounded-lg border border-gray-700 bg-card p-4">
                <p>
                  <strong className="text-white">Mobile responsive:</strong>{' '}
                  Hamburger menu, responsive typography with Tailwind
                  breakpoints, optimized for all screen sizes
                </p>
              </div>
              <div className="rounded-lg border border-gray-700 bg-card p-4">
                <p>
                  <strong className="text-white">Production-ready:</strong> Live
                  at www.pedroduartek.com via Vercel with automatic deployments
                  from GitHub and full source code available
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              AI-Assisted Workflow
            </h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <p className="mb-4">
                AI tools were integral to rapid development and learning:
              </p>
              <ul className="mb-4 space-y-2">
                <li>
                  <strong className="text-white">Scaffolding:</strong> Initial
                  project setup and structure
                </li>
                <li>
                  <strong className="text-white">Pattern learning:</strong>{' '}
                  React hooks, component composition, frontend best practices
                </li>
                <li>
                  <strong className="text-white">Problem solving:</strong>{' '}
                  Real-time debugging and configuration issues
                </li>
                <li>
                  <strong className="text-white">Rapid iteration:</strong>{' '}
                  Multi-file edits and quick feature implementation
                </li>
              </ul>
              <p>
                This approach accelerated development from months to days while
                ensuring I learned underlying concepts rather than just copying
                code.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Key Takeaways
            </h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <ul className="space-y-3">
                <li>
                  <strong className="text-white">AI amplifies:</strong> AI
                  accelerated development dramatically, but I still made
                  architectural decisions and owned the code
                </li>
                <li>
                  <strong className="text-white">Learning by building:</strong>{' '}
                  Real projects teach more than tutorials. Each feature brought
                  new concepts in context
                </li>
                <li>
                  <strong className="text-white">
                    Backend principles transfer:
                  </strong>{' '}
                  Type safety, testing, and clean architecture apply equally to
                  frontend
                </li>
                <li>
                  <strong className="text-white">Iterate constantly:</strong>{' '}
                  Start simple, improve based on real usage
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              What's Next
            </h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <ul className="space-y-2">
                <li>
                  Add privacy-friendly analytics to track visitor engagement
                </li>
                <li>
                  Activate blog with posts on backend engineering, C#/.NET
                  patterns, and AI-assisted productivity
                </li>
                <li>Continue adding projects as they're completed</li>
                <li>
                  Performance optimization and lighthouse score improvements
                </li>
                <li>SEO enhancements for better discoverability</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
