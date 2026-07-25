import { useState } from 'react'
import { Link } from 'react-router-dom'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import PageSEO from '../../components/seo/PageSEO'
import { projects } from '../../content/projects'
import haScreenshot from '../../images/ha.webp'

const capabilityCards = [
  {
    title: 'Reliable Zigbee foundation',
    description:
      'A large ZHA mesh underpins lights, covers, plugs, sensors, and buttons throughout the house. A meaningful part of the work was not adding devices, but making the network dependable enough that the automations could be trusted every day.',
  },
  {
    title: 'Room-first Lovelace UX',
    description:
      'The dashboard is organized around rooms and common actions instead of raw entity lists. That keeps the system understandable for non-technical users while still surfacing enough state to explain what the house is doing.',
  },
  {
    title: 'State abstractions for awkward hardware',
    description:
      'Some hardware does not map cleanly to a good user experience. Virtual states and sync automations smooth over momentary relays and other device quirks so the home behaves more like a coherent product than a collection of parts.',
  },
  {
    title: 'One system across many domains',
    description:
      'This setup is not just lights. The same Home Assistant instance coordinates gates, covers, climate, alarm, cameras, reminders, and a handful of background routines that make the house feel calmer without constantly demanding attention.',
  },
  {
    title: 'Solar and energy optimization',
    description:
      'A Deye inverter and battery drive a self-consumption layer. High-draw appliances switch on real solar surplus (derived from the inverter telemetry, since the raw cloud values are unreliable), the grid-charge window is tuned to the tariff, and a dashboard tracks production, consumption, and estimated savings.',
  },
  {
    title: 'Pool on solar surplus',
    description:
      'Pool filtration runs a daily minimum but prefers hours with solar surplus, and the heat pump is coordinated the same way, so the pool costs less to run without any manual scheduling.',
  },
  {
    title: 'AI cameras and security',
    description:
      'Reolink cameras add person and animal detection, floodlights, and sirens, integrated alongside a mailbox-open detector and the household alarm, all surfaced in the same room-based dashboard.',
  },
  {
    title: 'Secure remote access',
    description:
      'The home is reachable from anywhere over a Cloudflare Tunnel with no open ports, plus 2FA, a WAF geo-block, and rate limiting, instead of exposing the server to the internet.',
  },
]

const standoutAutomations = [
  {
    title: 'Solar-surplus load shifting',
    description:
      'High-draw loads (pool pump, car charger) only run when the battery is charging from genuine solar surplus, never by discharging it, using derived power sensors. An office bulb doubles as a live grid-use indicator, turning green, yellow, or red so the state of the house is readable at a glance.',
  },
  {
    title: 'Last-person-leaves routine',
    description:
      'Triggered when the last person leaves, not just when someone leaves. It combines presence checks with a staged shutdown routine that secures the house, closes covers, and powers down selected systems without firing prematurely.',
  },
  {
    title: 'Phone-charging sleep routine',
    description:
      'This routine uses charging state, presence, time of day, and alarm state to infer bedtime instead of requiring a manual scene trigger. It turns a few small signals into a dependable night routine that still adapts to whether one or two people are home.',
  },
  {
    title: 'Waste collection scheduler',
    description:
      'A single scheduler handles the recurring reminder logic for waste collection, including alternating pickup patterns that are easy to forget manually. It is a good example of using simple state and calendar logic to solve a real household annoyance.',
  },
]

const learningCards = [
  {
    title: 'State modeling matters more than device count',
    description:
      'The most reliable parts of the setup are not the flashiest ones. They are the explicit pieces of state that sit between messy hardware and a clean UI: virtual gates, mail counters, waste booleans, and presence checks that stop routines from firing at the wrong time.',
  },
  {
    title: 'Dashboards are part of the system',
    description:
      'The Lovelace UI is not decoration layered on top of automations. It is the control surface and the debugging surface. If someone at home cannot tell what the house thinks is happening, the automation model is not finished yet.',
  },
]

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

        {/* Date */}
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
              What It Includes
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {capabilityCards.map((card) => (
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
              Standout Automations
            </h2>
            <p className="mb-4">
              Among the live automations, these four best show the kind of state
              coordination that makes the system feel intentional rather than
              gimmicky.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {standoutAutomations.map((automation) => (
                <div key={automation.title} className="theme-card p-5">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {automation.title}
                  </h3>
                  <p className="text-sm text-foreground-muted">
                    {automation.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              Dashboard Snapshot
            </h2>
            <div className="theme-card p-6">
              <p className="mb-4 text-sm text-foreground-muted">
                The main dashboard is area-based on purpose: room entry points
                first, then just enough shared state to answer common questions
                at a glance. The goal is not to expose everything. It is to make
                the system understandable and usable in daily life.
              </p>
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="mt-2 block mx-auto w-full overflow-hidden rounded-lg md:max-w-[80%] focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <img
                  src={haScreenshot}
                  alt="Home Assistant Dashboard"
                  className="w-full cursor-pointer rounded-lg border border-border-strong transition-opacity hover:opacity-90"
                />
              </button>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              What I Learned
            </h2>
            <p className="mb-4">
              Building a smart home stopped feeling like gadget orchestration
              and started feeling like state management. The useful work is
              usually not adding one more device. It is making the house easier
              to reason about, both for automations and for humans.
            </p>
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
