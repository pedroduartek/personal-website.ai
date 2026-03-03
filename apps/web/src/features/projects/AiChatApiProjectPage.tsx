import { Link } from 'react-router-dom'
import StyledLink from '../../components/StyledLink'
import PageSEO from '../../components/seo/PageSEO'

export default function AiChatApiProjectPage() {
  return (
    <>
      <PageSEO
        title="AI Chat API - Self-hosted Conversational AI"
        description="A self-hosted conversational AI API built with C#/.NET 10 and ASP.NET Core that powers the chat assistant on pedroduartek.com using Llama 3 via Ollama."
        image="/src/images/pld_logo_header.png"
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : 'https://www.pedroduartek.com/projects/ai-chat-api'
        }
      />

      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <Link
          to="/projects"
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:scale-105 hover:bg-gray-800 hover:text-white hover:shadow-lg"
        >
          <span>←</span> Back to projects
        </Link>

        <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          AI Chat API
        </h1>

        <p className="mb-4 text-lg text-gray-400 md:text-xl">
          A self-hosted conversational AI API built with C#/.NET 10 and ASP.NET
          Core that powers the chat assistant on pedroduartek.com. February 2026
        </p>

        <div className="mb-8">
          <StyledLink
            href="https://github.com/pedroduartek/ai-chat-api"
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
          {[
            'C#',
            '.NET 10',
            'ASP.NET Core',
            'Llama 3.2',
            'Ollama',
            'Docker',
            'Caddy',
            'Polly',
            'Serilog',
            'xUnit',
            'Swagger',
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
                  The system prompt is dynamically composed at request time by
                  appending KB content, so the model always has up-to-date
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
                  IP-based rate limiting, exponential-backoff retries via Polly,
                  and structured logging with Serilog for observability.
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
              Ships with Docker Compose manifests for both development (hot
              reload) and production (three-service stack: API, Ollama, Caddy on
              a single VPS with automatic TLS). Ollama runs on an internal
              network with no public port, and model weights are persisted via a
              Docker volume.
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
