import { useState } from 'react'
import { Link } from 'react-router-dom'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import PageSEO from '../../components/seo/PageSEO'
import { projects } from '../../content/projects'
import duartekScreenshot from '../../images/duartek.webp'

const engineeringCards = [
  {
    title: 'Local-first automation platform',
    description:
      'Home Assistant OS with a ZHA Zigbee mesh coordinating lights, covers, climate, cameras, and gates. It runs on a server in the home and keeps working without internet, with vendor cloud used only where a device leaves no local option.',
  },
  {
    title: 'Secure remote access',
    description:
      'Remote access is served over a Cloudflare Tunnel with no open ports, plus 2FA, a WAF geo-block, and rate limiting. One dedicated subdomain per install, so the home is reachable from anywhere without exposing it to the internet.',
  },
  {
    title: 'Solar-driven energy automations',
    description:
      'High-draw appliances (water heater, pool pump, car charger) switch on real solar surplus using sensors derived from the inverter telemetry, since the raw cloud values are unreliable. The goal is measurable savings, not just monitoring.',
  },
  {
    title: 'Performance-tuned website',
    description:
      'duartek.pt is a React 19 + TypeScript + Vite SPA. The brand wall serves resized WebP logos, lazy-loaded and deliberately kept out of the JS bundle via a Vite inline-limit rule, so payload stays small and below-the-fold assets load on demand.',
  },
  {
    title: 'SEO and social sharing',
    description:
      'Open Graph and Twitter metadata point at a generated 1200x630 share image, with canonical URLs resolved to the correct host so link previews render without a redirect.',
  },
  {
    title: 'Asset and document tooling',
    description:
      'Python scripts drive headless Chrome and Pillow to generate the brand, favicon, profile and social images, and print-ready flyers (A5 with 3mm bleed and crop marks) straight from source, so every surface stays consistent.',
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
              How It's Built
            </h2>
            <p className="mb-4">{project.approach}</p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              Engineering Highlights
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {engineeringCards.map((card) => (
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
                duartek.pt is a React 19 + TypeScript + Vite single-page app on
                Vercel. It is content-driven and fully responsive, and tuned for
                performance: the brand wall serves optimized WebP logos, lazy
                loaded and kept out of the JS bundle, alongside Open Graph
                metadata and a generated social image.
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
