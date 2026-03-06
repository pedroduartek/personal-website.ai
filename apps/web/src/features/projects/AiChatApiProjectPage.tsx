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
          {/* Motivation */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Motivation
            </h2>
            <p className="mb-4">
              Rather than relying on third-party AI services (and their costs,
              rate limits, and data-privacy trade-offs), I wanted full ownership
              of the inference pipeline. The goal was to ship a production-grade
              API that runs entirely on a single VPS, model included, while
              following the same engineering standards I apply to professional
              backend systems.
            </p>
          </section>

          {/* What It Does */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              What It Does
            </h2>
            <p className="mb-4">
              Every response is grounded in a local knowledge base that contains
              structured facts about my career, skills, projects, and contact
              info. If the model can't answer from the knowledge base, it says
              so explicitly instead of guessing.
            </p>

            <div className="space-y-3">
              <div className="rounded-lg border border-gray-700 bg-card p-4">
                <p>
                  <span className="inline-block rounded bg-gray-800 px-1.5 py-0.5 text-sm font-mono text-gray-200 border border-gray-700">
                    POST /chat
                  </span>{' '}
                  Accepts a user message, injects knowledge-base context into
                  the prompt, calls Llama 3 via Ollama, and returns a JSON
                  answer.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-4">
                <p>
                  <span className="inline-block rounded bg-gray-800 px-1.5 py-0.5 text-sm font-mono text-gray-200 border border-gray-700">
                    POST /chat/stream
                  </span>{' '}
                  Same flow but streams tokens back over Server-Sent Events for
                  a real-time typing experience.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-4">
                <p>
                  <span className="inline-block rounded bg-gray-800 px-1.5 py-0.5 text-sm font-mono text-gray-200 border border-gray-700">
                    GET /health
                  </span>{' '}
                  Readiness probe for the container orchestration layer.
                </p>
              </div>
            </div>
          </section>

          {/* Architecture Highlights */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Architecture Highlights
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Clean layered design
                </h3>
                <p className="text-gray-300 text-sm">
                  Controllers, Services, and Infrastructure layers with
                  dependency injection and interface-defined boundaries for easy
                  testing and extensibility.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Knowledge-base augmentation
                </h3>
                <p className="text-gray-300 text-sm">
                  The system prompt is dynamically composed at request time from a
                  small, file-backed knowledge base so the model receives targeted
                  context without fine-tuning.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Streaming support
                </h3>
                <p className="text-gray-300 text-sm">
                  The streaming endpoint re-emits Ollama tokens as SSE events,
                  keeping memory usage low and time-to-first-token fast.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Resilience
                </h3>
                <p className="text-gray-300 text-sm">
                  IP-based rate limiting (partitioned by `x-api-key` when present),
                  exponential-backoff retries via Polly, and structured logging
                  (Serilog) with optional Grafana/Loki integration.
                </p>
              </div>
            </div>
          </section>

          {/* Infrastructure */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Infrastructure
            </h2>
            <p className="mb-4">
              Ships with Docker Compose manifests for both development and
              production. The development compose is intended for local testing
              (and may expose Ollama for debugging), while the production compose
              runs a three-service stack (API, Ollama, Caddy) with Ollama kept on
              an internal network and automatic TLS via Caddy. Model weights are
              persisted via a Docker volume.
            </p>
          </section>

          {/* Testing */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">Testing</h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <p className="text-gray-300">
                Unit tests cover the service layer, response parser, and
                controller using in-memory fakes. No running model or HTTP
                server is required, keeping the test suite fast and
                deterministic.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
