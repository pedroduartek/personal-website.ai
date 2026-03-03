import { Link } from 'react-router-dom'
import StyledLink from '../../components/StyledLink'
import PageSEO from '../../components/seo/PageSEO'
import { projects } from '../../content/projects'

export default function PersonalWebsiteProjectPage() {
  const project = projects.find((p) => p.slug === 'personal-website')
  if (!project) return null
  return (
    <>
      <PageSEO
        title={project.title}
        description={project.description}
        image="/src/images/pld_logo_header.png"
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : `https://www.pedroduartek.com/projects/${project.slug}`
        }
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <Link
          to="/projects"
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:scale-105 hover:bg-gray-800 hover:text-white hover:shadow-lg"
        >
          <span>←</span> Back to projects
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
          {project.title}
        </h1>

        {/* Date */}
        <div className="mb-4 flex items-center gap-3 text-sm text-gray-400">
          <time>
            {project.startDate &&
              new Date(project.startDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            {project.endDate &&
              ` — ${new Date(project.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`}
          </time>
        </div>

        <p className="mb-4 text-lg text-gray-400 md:text-xl">
          {project.description}
        </p>

        <div className="mb-8">
          <StyledLink
            href={project.links?.github}
            target="_blank"
            bigger
            className="inline-flex items-center gap-2 rounded-lg border border-brand-700 bg-brand px-4 py-2 text-center text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand/50"
            ariaLabel="View repository on GitHub"
          >
            <span className="font-mono mr-2">&lt;&gt;</span>
            View on GitHub
          </StyledLink>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="prose prose-lg max-w-none text-gray-300">
          {/* Overview */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Motivation
            </h2>
            <p className="mb-4">
              As a backend engineer with extensive C#/.NET experience but
              minimal frontend knowledge, I wanted to build a professional
              portfolio while learning React, TypeScript, and modern frontend
              development. Rather than spending months on tutorials, I used
              AI-assisted development to accelerate the process while
              maintaining full ownership of architectural decisions.
            </p>
            <p className="mb-4">
              The result: a production-ready portfolio site built in days
              instead of months, where AI acted as a productivity multiplier and
              I learned by building real features.
            </p>
          </section>

          {/* Key Features */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Key Features
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  AI Chat Assistant
                </h3>
                <p className="text-gray-300 text-sm">
                  Integrated chatbot powered by the{' '}
                  <StyledLink
                    href="/projects/ai-chat-api"
                    className="inline-block font-mono text-sm bg-gray-800 text-gray-100 px-2 py-0.5 rounded border border-gray-700 hover:translate-x-1 hover:bg-gray-700 hover:shadow-lg"
                  >
                    AI Chat API
                  </StyledLink>{' '}
                  project. It connects to a self-hosted Llama 3 model via a
                  C#/.NET backend, letting visitors ask questions about my
                  background and get grounded answers in real time.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Command Palette
                </h3>
                <p className="text-gray-300 text-sm">
                  Fuzzy search navigation (⌘K / Ctrl+K) inspired by modern IDEs,
                  with keyboard shortcuts and smooth animations for quick site
                  exploration.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Responsive design
                </h3>
                <p className="text-gray-300 text-sm">
                  Custom dark theme with consistent hover effects, animations,
                  and a mobile-first layout optimized for all screen sizes.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Production-ready
                </h3>
                <p className="text-gray-300 text-sm">
                  Live at pedroduartek.com via Vercel with automatic deployments
                  from GitHub, client-side routing with lazy loading, and full
                  source code available.
                </p>
              </div>
            </div>
          </section>

          {/* AI-Assisted Workflow */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              AI-Assisted Workflow
            </h2>
            <p className="mb-4">
              AI tools were used throughout the project for scaffolding,
              learning React patterns, real-time debugging, and rapid iteration.
              This approach accelerated development from months to days while
              ensuring I understood the underlying concepts rather than just
              copying code.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  AI amplifies, not replaces
                </h3>
                <p className="text-gray-300 text-sm">
                  AI accelerated development dramatically, but I made all
                  architectural decisions and owned the code.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Backend principles transfer
                </h3>
                <p className="text-gray-300 text-sm">
                  Type safety, testing, and clean architecture apply equally to
                  frontend. Building real features taught more than any
                  tutorial.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
