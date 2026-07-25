import { Link } from 'react-router-dom'
import WebsitePeek from '../../components/WebsitePeek'
import PageSEO from '../../components/seo/PageSEO'
import { projects } from '../../content/projects'

const projectHighlights = [
  {
    title: 'Content-driven architecture',
    description:
      'The copy, pricing, FAQ, and the list of integrable brands live in structured content files. That keeps the wording consistent across the site and makes future updates a data edit instead of a hunt through components.',
  },
  {
    title: 'Performance-tuned brand wall',
    description:
      'Dozens of brand logos are served as resized WebP, lazy-loaded and deliberately kept out of the JS bundle via a Vite inline-limit rule, so the payload stays small and below-the-fold assets only load when scrolled into view.',
  },
  {
    title: 'SEO and social sharing',
    description:
      'Each page sets Open Graph and Twitter metadata pointing at a generated 1200x630 share image, with canonical URLs resolved to the correct host so link previews render cleanly without a redirect.',
  },
  {
    title: 'Full CI/CD pipeline',
    description:
      'Every push runs automated checks: linting and formatting, unit tests, a dependency audit that blocks on high/critical advisories, a bundle-size budget, and Lighthouse budgets for desktop and mobile.',
  },
]

const projectPriorities = [
  {
    title: 'Make a different idea obvious',
    description:
      'A local-first smart home is an unfamiliar concept for most homeowners. The site had to lead with the everyday frustration, an app per brand, and land the single-app solution in seconds, without feeling like a tech demo.',
  },
  {
    title: 'Reliability over novelty',
    description:
      'I favoured a small, fast, maintainable stack (React and Vite, content-driven, fully CI-gated) so the site stays easy to evolve and every change ships behind the same quality checks.',
  },
]

export default function DuartekProjectPage() {
  const project = projects.find((p) => p.slug === 'duartek')
  if (!project) return null
  const liveSiteUrl = project.links?.demo

  return (
    <>
      <PageSEO
        title={project.title}
        description={project.description}
        image="https://www.duartek.pt/og-image.png"
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
            {' - Present'}
          </time>
        </div>

        <p className="mb-4 text-lg text-foreground-subtle md:text-xl">
          {project.description}
        </p>

        <div className="mb-8 flex flex-wrap items-center gap-4">
          {liveSiteUrl && (
            <a
              href={liveSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mr-5 inline-flex items-center gap-2 rounded-lg border border-brand-700 bg-brand px-4 py-2 text-center text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand/50 transform origin-left scale-110"
              aria-label="Visit live site"
            >
              Visit live site
            </a>
          )}
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
                domain="duartek.pt"
                title="DUARTEK homepage"
                className="mx-auto w-full md:max-w-[80%]"
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
              The interesting part was not technical novelty on its own. It was
              using modern frontend tools to present a real service with a
              specific tone and audience, and keeping the whole thing fast,
              consistent, and easy to maintain.
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
