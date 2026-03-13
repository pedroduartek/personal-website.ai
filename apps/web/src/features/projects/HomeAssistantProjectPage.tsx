import { useState } from 'react'
import { Link } from 'react-router-dom'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import PageSEO from '../../components/seo/PageSEO'
import { projects } from '../../content/projects'
import haScreenshot from '../../images/ha.webp'

export default function HomeAssistantProjectPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const project = projects.find((p) => p.slug === 'home-assistant')
  if (!project) return null
  return (
    <>
      <PageSEO
        title={project.title}
        description={project.description}
        image="/src/images/ha.png"
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : `https://www.pedroduartek.com/projects/${project.slug}`
        }
      />
      <div className="container mx-auto px-4 py-16 animate-slide-down">
        <Link
          to="/projects"
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:scale-105 hover:bg-gray-800 hover:text-white hover:shadow-lg"
        >
          <span>←</span> Back to projects
        </Link>

        <h1 className="mb-2 text-4xl font-bold text-white">{project.title}</h1>

        {/* Date */}
        <div className="mb-6 flex items-center gap-3 text-sm text-gray-400">
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

        <p className="mb-8 text-xl text-gray-400">{project.description}</p>

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
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-gray-700 bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Local-first home automation
                </h3>
                <p className="text-sm text-gray-300">
                  Core routines are designed to keep working even if the
                  internet is unavailable. That matters because the system is
                  not a toy. It supports everyday household habits such as
                  lighting, blinds, comfort, and general home awareness.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Reliability through network design
                </h3>
                <p className="text-sm text-gray-300">
                  The setup now includes more than 50 Zigbee devices. A big part
                  of the work was not adding devices, but building a stable mesh
                  with enough routing coverage to make the automations
                  dependable.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Designed for daily use
                </h3>
                <p className="text-sm text-gray-300">
                  The user experience matters as much as the automation logic.
                  The dashboards are used every day, and my wife is the ultimate
                  tester. If something feels confusing or unreliable to a
                  non-technical user, it is not good enough yet.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Ongoing operations
                </h3>
                <p className="text-sm text-gray-300">
                  Backups, weekly updates, and continuous cleanup are part of
                  the project. Treating the setup like a living system keeps it
                  useful over time instead of letting it drift into brittle
                  hobby infrastructure.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Dashboard Snapshot
            </h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <p className="mb-4 text-sm text-gray-300">
                A simplified dashboard keeps the most important information and
                controls easy to reach. The goal is not to expose every device
                at once. It is to make the system practical for everyday use.
              </p>
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="mt-2 w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <img
                  src={haScreenshot}
                  alt="Home Assistant Dashboard"
                  className="w-full cursor-pointer rounded-lg border border-gray-600 transition-opacity hover:opacity-90"
                />
              </button>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              What I Learned
            </h2>
            <p className="mb-4">
              This project keeps reinforcing the same lesson: automation is only
              valuable when it is dependable and genuinely helpful. The most
              interesting work is often not adding one more device, but making
              the whole system calmer, clearer, and easier to trust.
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-gray-700 bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold text-white">
                  A home behaves like a production environment
                </h3>
                <p className="text-sm text-gray-300">
                  When an automation fails, it creates friction immediately.
                  That makes reliability, rollback thinking, and operational
                  discipline much more important than they might seem in a side
                  project.
                </p>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Hardware constraints are real product constraints
                </h3>
                <p className="text-sm text-gray-300">
                  An attempt to add local video analytics with Frigate pushed
                  the available hardware too far and nearly forced a reinstall.
                  It was a useful reminder to validate hardware assumptions
                  before treating an idea as ready to ship.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={[{ src: haScreenshot }]}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
        carousel={{
          finite: true,
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
      />
    </>
  )
}
