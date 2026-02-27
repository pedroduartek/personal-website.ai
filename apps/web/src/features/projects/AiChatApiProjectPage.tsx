import { Link } from 'react-router-dom'
import StyledLink from '../../components/StyledLink'
import PageSEO from '../../components/seo/PageSEO'

export default function AiChatApiProjectPage() {
  return (
    <>
      <PageSEO
        title="AI Chat API (this repo) — POC (site-internal)"
        description="AI Chat API — proof-of-concept C#/.NET backend powering a local LLaMA-based model for the website UI only"
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
          A lightweight C#/.NET 10 API for conversational AI integrations •
          February 2026
        </p>

        <div className="mb-8">
          <StyledLink
            href="https://github.com/pedroduartek/ai-chat-api"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border border-brand-700 bg-brand px-4 py-2 text-center text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand/50"
            ariaLabel="View repository on GitHub"
          >
            <span className="font-mono mr-2">&lt;&gt;</span>
            View repository
          </StyledLink>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {['C#', '.NET 10', 'Llama 3', 'Docker', 'REST API'].map((tech) => (
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
              This repository provides a focused C#/.NET proof-of-concept
              backend that powers conversational features by running a
              LLaMA-family model locally. It keeps the HTTP surface small and
              the internals testable so the website UI can call a single{' '}
              <span className="inline-block rounded bg-gray-800 px-1.5 py-0.5 text-sm font-mono text-gray-200 border border-gray-700">
                POST /api/chat
              </span>{' '}
              endpoint and receive model replies.
            </p>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-gray-700 bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold text-white">
                  What you'll find
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    ASP.NET Core controllers for chat and health endpoints
                  </li>
                  <li>
                    Service abstraction for model providers:{' '}
                    <span className="inline-block rounded bg-gray-800 px-1.5 py-0.5 text-sm font-mono text-gray-200 border border-gray-700">
                      IChatService
                    </span>
                  </li>
                  <li>Unit tests covering controller and service behaviors</li>
                  <li>Dockerfile and compose files for local development</li>
                </ul>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Design goals
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>Keep the HTTP API small and well-documented</li>
                  <li>
                    Make the chat service pluggable (swap model providers)
                  </li>
                  <li>
                    Fast local iteration with Docker and sensible defaults
                  </li>
                  <li>Deliver reliable behavior with unit tests</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              LLaMA Integration
            </h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <p className="mb-4 text-gray-300">
                This API is designed to run a LLaMA-family model locally (eg.
                via llama.cpp / ggml or a local model server). The service calls
                the local model process over a loopback/internal endpoint,
                keeping public exposure limited to the API layer.
              </p>

              <p className="text-gray-300">
                Example internal call:{' '}
                <span className="inline-block rounded bg-gray-800 px-1.5 py-0.5 text-sm font-mono text-gray-200 border border-gray-700">
                  POST /v1/generate
                </span>{' '}
                (internal-only).
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Technical Overview
            </h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <p className="mb-3 text-gray-300">
                The API acts as a thin, HTTP-based façade in front of a local
                model runtime. It accepts client messages, performs lightweight
                request validation and authorization, and forwards prompts to a
                colocated LLM process or model-serving endpoint. Responses are
                normalized and returned to clients over a single, consistent
                chat endpoint.
              </p>

              <h3 className="mb-2 text-lg font-semibold text-white">
                Runtime & communication
              </h3>
              <ul className="mb-3 space-y-2 text-gray-300">
                <li>
                  Run a local model process (eg. an optimized LLaMA runtime) on
                  the same host or private network for low latency.
                </li>
                <li>
                  Communicate via an internal HTTP/gRPC endpoint or an IPC
                  mechanism; keep model ports bound to localhost or private
                  interfaces only.
                </li>
                <li>
                  Keep the public API surface minimal—primarily the website UI
                  should call the chat endpoint.
                </li>
              </ul>

              <h3 className="mb-2 text-lg font-semibold text-white">
                Performance & resource planning
              </h3>
              <ul className="mb-3 space-y-2 text-gray-300">
                <li>
                  Model memory and CPU requirements dominate capacity planning;
                  size hosts by the largest model you intend to load.
                </li>
                <li>
                  Use lightweight batching at the API layer to aggregate short
                  requests into fewer model calls when latency/throughput
                  trade-offs allow.
                </li>
                <li>
                  Consider response streaming for perceived latency improvements
                  and backpressure control for heavy clients.
                </li>
              </ul>

              <h3 className="mb-2 text-lg font-semibold text-white">
                Reliability & scaling
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  Isolate model-serving and API processes so the API can return
                  graceful failures when the model is unavailable.
                </li>
                <li>
                  For scale, separate inference nodes from the API and add a
                  queuing/batching tier and rate limiting at the API edge.
                </li>
                <li>
                  Use restart policies and health checks to ensure the model
                  process is restarted or drained safely on failure.
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Key Endpoints
            </h2>
            <div className="space-y-3">
              <div className="rounded-lg border border-gray-700 bg-card p-4">
                <p>
                  <strong className="text-white">POST /api/chat:</strong> Send a
                  chat request with messages and receive a model-generated
                  reply.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-4">
                <p>
                  <strong className="text-white">GET /health:</strong> Basic
                  health check used for readiness and liveness probes.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Development & Integration Notes
            </h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <ul className="space-y-2 text-gray-300">
                <li>
                  Keep business logic small and testable; unit tests should
                  cover request/response behavior and model integration
                  boundaries.
                </li>
                <li>
                  Use containerization for reproducible local environments and
                  to mirror production runtime characteristics when possible.
                </li>
                <li>
                  Abstract the model provider behind a service interface so
                  different runtimes (local, remote, GPU-backed) are
                  interchangeable at runtime.
                </li>
                <li>
                  Integrate health checks, readiness probes, and lightweight
                  metrics (latency, request counts, model load) for
                  observability and autoscaling decisions.
                </li>
                <li>
                  The website integrates with the API via the chat endpoint; the
                  frontend should treat the API as an untrusted intermediary and
                  respect rate limits and retries.
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Next Steps
            </h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <ul className="space-y-2">
                <li>Add OpenAPI/Swagger documentation for the endpoints</li>
                <li>
                  Integrate authentication and request quotas if exposing
                  publicly
                </li>
                <li>
                  Add optional streaming responses for lower-latency clients
                </li>
                <li>Improve CI to run tests and build Docker images on push</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
