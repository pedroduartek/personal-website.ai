import { Link } from 'react-router-dom'
import WebsitePeek from '../../components/WebsitePeek'
import PageSEO from '../../components/seo/PageSEO'
import { projects } from '../../content/projects'

const projectHighlights = [
  {
    title: 'Route-based customer journeys',
    description:
      'The site is organized around the store’s real entry points: the main storefront, watch repair and maintenance, weddings, and contact details. That keeps the structure aligned with how customers actually think about visiting the shop.',
  },
  {
    title: 'Centralized business content',
    description:
      'Store details, navigation, SEO metadata, contact methods, and reusable copy live in structured content files. That keeps changes localized and helps the wording stay consistent across pages.',
  },
  {
    title: 'Local-business SEO',
    description:
      'Each route sets canonical metadata, Open Graph data, and LocalBusiness JSON-LD so the site is easier to index correctly and easier to share without generic fallback previews.',
  },
  {
    title: 'Production-minded frontend',
    description:
      'The build uses lazy-loaded routes, an error boundary, responsive layouts, optimized WebP images, and automated checks for linting, tests, accessibility, bundle size, and Lighthouse budgets.',
  },
]

const projectPriorities = [
  {
    title: 'Translate a physical business into the web',
    description:
      'The job was not to make the store look like a startup landing page. It was to communicate trust, personal service, and in-store decision-making clearly enough that the website supports the real business instead of competing with it.',
  },
  {
    title: 'Keep maintenance simple',
    description:
      'For a small business website, maintainability matters as much as visuals. Centralizing business information and route metadata means future updates stay practical instead of turning into scattered copy edits.',
  },
]

export default function OurivesariaRinchoaProjectPage() {
  const project = projects.find((p) => p.slug === 'ourivesaria-rinchoa')
  if (!project) return null
  const liveSiteUrl = project.links?.demo

  return (
    <>
      <PageSEO
        title={project.title}
        description={project.description}
        image="https://ourivesariarinchoa.pt/images/social-share.webp"
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : `https://www.pedroduartek.com/projects/${project.slug}`
        }
      />

      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <Link
          to="/projects"
          className="theme-button-secondary mb-6 inline-flex items-center gap-2"
        >
          <span>←</span> Back to projects
        </Link>

        <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
          {project.title}
        </h1>

        <div className="mb-4 flex items-center gap-3 text-sm text-foreground-subtle">
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

        <p className="mb-4 text-lg text-foreground-subtle md:text-xl">
          {project.description}
        </p>

        <div className="mb-8 flex flex-wrap items-center gap-4">
          <a
            href={liveSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="theme-button-secondary-prominent inline-flex items-center gap-2"
            aria-label="Visit live site"
          >
            Visit live site
          </a>
          <p className="text-sm text-foreground-subtle">
            The repository stays private because this is a real business
            website.
          </p>
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

        <div className="theme-prose">
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              Why This Project Exists
            </h2>
            <p className="mb-4">{project.problem}</p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              How I Built It
            </h2>
            <p className="mb-4">{project.approach}</p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              Live Homepage Preview
            </h2>
            <p className="mb-4">
              This is a live embed of the production homepage. It is
              intentionally non-interactive inside the portfolio, so clicking
              anywhere on the preview opens the real site instead of interacting
              with the iframe.
            </p>
            {liveSiteUrl && (
              <WebsitePeek
                href={liveSiteUrl}
                domain="ourivesariarinchoa.pt"
                title="Ourivesaria Rinchoa homepage"
              />
            )}
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              What It Includes
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {projectHighlights.map((card) => (
                <div key={card.title} className="theme-card p-5">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-sm text-foreground-muted">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              What Mattered Most
            </h2>
            <p className="mb-4">
              The interesting part of this project was not technical novelty on
              its own. It was using modern frontend tools to build something
              that fits a small real-world business with specific constraints,
              tone, and customer expectations.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {projectPriorities.map((card) => (
                <div key={card.title} className="theme-card p-5">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-sm text-foreground-muted">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
