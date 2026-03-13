import { Link } from 'react-router-dom'
import GithubButton from '../../components/GithubButton'
import PageSEO from '../../components/seo/PageSEO'
import { projects } from '../../content/projects'

export default function AiChatApiProjectPage() {
  const project = projects.find((p) => p.slug === 'ai-chat-api')
  if (!project) return null
  return (
    <>
      <PageSEO
        title={`${project.title} - Self-hosted Conversational AI`}
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
          <GithubButton
            href={project.links?.github}
            ariaLabel="View repository on GitHub"
          >
            View on GitHub
          </GithubButton>
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
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Why This Project Exists
            </h2>
            <p className="mb-4">{project.problem}</p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              How I Built It
            </h2>
            <p className="mb-4">{project.approach}</p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              What It Includes
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Grounded answers, not generic AI
                </h3>
                <p className="text-gray-300 text-sm">
                  Responses are based on a local knowledge base about my work,
                  background, and website content. The system is intentionally
                  designed to stay factual and to fall back cleanly when the
                  answer is not actually supported by that content.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Real-time chat for the website
                </h3>
                <p className="text-gray-300 text-sm">
                  The API powers the assistant on pedroduartek.com in both
                  standard and streaming modes, which helps the chat feel
                  responsive while still running on self-hosted infrastructure.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  More than a single chat endpoint
                </h3>
                <p className="text-gray-300 text-sm">
                  The same backend also handles email delivery for the
                  website&apos;s contact flows, which turns it into a compact
                  service layer for the portfolio rather than a one-feature AI
                  demo.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Lean self-hosted deployment
                </h3>
                <p className="text-gray-300 text-sm">
                  The production setup is intentionally small: the API, the
                  local model runtime, and the reverse proxy are containerized
                  together so the system stays understandable, portable, and
                  cost-conscious.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              How I Kept It Reliable
            </h2>
            <p className="mb-4">
              Because this service sits behind a public website, I treated
              predictable behavior as part of the product. The API includes rate
              limiting, prompt-injection filtering, health checks, structured
              logging, unit tests around the core chat pipeline, and a keep-warm
              background process that reduces the cold-start feel of a small
              local model after idle periods.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Prefer safe fallback over bluffing
                </h3>
                <p className="text-gray-300 text-sm">
                  If the model drifts into unsupported claims or the answer
                  cannot be grounded in the website content, the API normalizes
                  the reply back to a consistent fallback instead of letting a
                  shaky answer through.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Built as a service, not a lab experiment
                </h3>
                <p className="text-gray-300 text-sm">
                  Clear boundaries between controllers, application logic, model
                  integration, and knowledge-base loading make the API easier to
                  test, extend, and operate in production.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
