import { useState } from 'react'
import { Link } from 'react-router-dom'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import PageSEO from '../../components/seo/PageSEO'
import { projects } from '../../content/projects'
import duartekScreenshot from '../../images/duartek.webp'

const clientValueCards = [
  {
    title: 'One app for everything',
    description:
      'Lights, blinds, climate, TV, cameras, gates, and even the pool, brought into a single app whatever the brand, without replacing the hardware the client already owns.',
  },
  {
    title: 'Local and private',
    description:
      'The system runs on a server in the client’s home. It keeps working without internet and does not depend on any vendor’s cloud, so control and data stay with the client.',
  },
  {
    title: 'Grows room by room',
    description:
      'A low-risk fixed-price base package first, then budgeted expansions at the client’s pace. Land-and-expand instead of a large, all-at-once proprietary install.',
  },
  {
    title: 'Solar and energy optimization',
    description:
      'The signature vertical: run high-draw appliances on real solar surplus, tune battery and grid use, and report the savings. A capability most competitors cannot offer credibly.',
  },
  {
    title: 'Ongoing support',
    description:
      'A light remote retainer keeps the system updated, backed up, secured, and reachable from anywhere, with one included visit per month and warranty visits at no cost.',
  },
  {
    title: 'Boutique, one client at a time',
    description:
      'Concierge hardware sourcing and close follow-up, priced for the Portuguese market and well below what proprietary installers like Control4 or KNX charge.',
  },
]

const businessBuildCards = [
  {
    title: 'Brand and identity',
    description:
      'The DU•ARTEK wordmark, colour palette, favicon, and social/profile assets, all designed to read as a real, trustworthy small business.',
  },
  {
    title: 'Marketing website',
    description:
      'duartek.pt, a React single-page site with the offer, FAQ, pricing, and a wall of the brands I can integrate, so a visitor immediately sees their own devices supported.',
  },
  {
    title: 'Flyer, digital and print',
    description:
      'A door-to-door flyer produced both as a digital image and a print-ready A5 file with bleed and crop marks, kept in sync with the website copy.',
  },
  {
    title: 'Quote and contract',
    description:
      'A fill-in quote and a service-and-retainer contract template covering warranty, support packs, travel, remote access, data protection, and cancellation.',
  },
  {
    title: 'Quoting safeguard',
    description:
      'A living supported-integrations reference, checked against a client’s existing devices before any quote, so the “one app for everything” promise is never over-sold.',
  },
  {
    title: 'Repeatable install kit',
    description:
      'A documented Home Assistant OS install process so setting up each new client’s server is fast, consistent, and low-risk.',
  },
]

const learningCards = [
  {
    title: 'The product is more than the software',
    description:
      'Pricing, a clear warranty, and a contract someone can actually sign shape trust as much as the dashboards do. Designing the offer was as much work as the tech, and it mattered just as much.',
  },
  {
    title: 'Constraints make the offer',
    description:
      'A side business with limited evenings and weekends pushed every decision toward remote-first delivery and a base package that stays deliberately small, so quality and margin per client come before scale.',
  },
]

export default function DuartekProjectPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const project = projects.find((p) => p.slug === 'duartek')
  if (!project) return null
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

        <div className="mb-6 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {project.links?.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="theme-button-primary inline-flex items-center gap-2"
              aria-label="Visit the DUARTEK website"
            >
              Visit duartek.pt <span aria-hidden>→</span>
            </a>
          )}
          {project.links?.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="theme-button-secondary inline-flex items-center gap-2"
              aria-label="DUARTEK website source on GitHub"
            >
              View source
            </a>
          )}
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
              How It Works
            </h2>
            <p className="mb-4">{project.approach}</p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              What Clients Get
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {clientValueCards.map((card) => (
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
              Beyond the Code
            </h2>
            <p className="mb-4">
              DUARTEK is not just a Home Assistant install. To turn it into a
              real business I designed and built everything around the service
              too, keeping every surface consistent as decisions evolved.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {businessBuildCards.map((card) => (
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
              The Website
            </h2>
            <div className="theme-card p-6">
              <p className="mb-4 text-sm text-foreground-muted">
                The marketing site leads with the everyday frustration (an app
                per brand), then shows the single-app solution, the offer, and
                the brands I can integrate. Built as a fast React SPA and
                deployed on Vercel at duartek.pt.
              </p>
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="mt-2 w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <img
                  src={duartekScreenshot}
                  alt="DUARTEK marketing website homepage"
                  className="w-full cursor-pointer rounded-lg border border-border-strong transition-opacity hover:opacity-90"
                />
              </button>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              What I Learned
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {learningCards.map((card) => (
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

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={[{ src: duartekScreenshot }]}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
        carousel={{ finite: true }}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  )
}
