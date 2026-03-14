import { Link } from 'react-router-dom'
import GithubButton from '../../components/GithubButton'
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
                  Structured portfolio content
                </h3>
                <p className="text-gray-300 text-sm">
                  Core information about my background, projects, education, and
                  conferences is managed in a structured way so the site stays
                  consistent as it evolves. That makes it easier to keep the
                  story accurate without turning every page into duplicated
                  maintenance work.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  AI chat assistant
                </h3>
                <p className="text-gray-300 text-sm">
                  Visitors can ask natural-language questions about my
                  experience, skills, and projects through an integrated chat
                  assistant powered by the{' '}
                  <StyledLink href="/projects/ai-chat-api">
                    AI Chat API
                  </StyledLink>
                  . It gives the site a more conversational way to explore the
                  same information shown in the portfolio itself.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Fast, memorable navigation
                </h3>
                <p className="text-gray-300 text-sm">
                  The site works like a traditional portfolio, but it also
                  offers a command palette and a terminal-style route for people
                  who enjoy a more interactive experience. Those touches are
                  optional, but they help the site feel more distinctive than a
                  standard portfolio template.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Low-friction contact flow
                </h3>
                <p className="text-gray-300 text-sm">
                  Recruiters and hiring managers can reach out through standard
                  contact links, a direct message form, or even from inside the
                  terminal experience. Cloudflare Turnstile protects the form
                  submission path so the inbox stays usable without turning the
                  contact flow into an account-based experience.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              What AI Changed
            </h2>
            <p className="mb-4">
              The value of this project is not that it was "built by AI." The
              value is that it shows how I use AI as an engineering tool:
              rapidly exploring options, shortening feedback loops, and learning
              unfamiliar frontend concepts while still taking responsibility for
              the final product.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Faster learning through a real product
                </h3>
                <p className="text-gray-300 text-sm">
                  Instead of learning frontend development through isolated
                  exercises, I used a public-facing product with real users and
                  real constraints. That made the learning process more
                  demanding, but also far more valuable.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-white">
                  Human judgment stayed central
                </h3>
                <p className="text-gray-300 text-sm">
                  AI accelerated execution, but the decisions about user
                  experience, tone, structure, trade-offs, and final quality
                  were still mine. That balance is the part of AI-assisted
                  development that interests me most.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
