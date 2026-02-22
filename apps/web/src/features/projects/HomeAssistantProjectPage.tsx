import { Link } from 'react-router-dom'
import PageSEO from '../../components/seo/PageSEO'
import haScreenshot from '../../images/ha.png'

export default function HomeAssistantProjectPage() {
  return (
    <>
      <PageSEO
        title="Home Assistant: Local-First Smart Home"
        description="Self-hosted Home Assistant OS setup with 50+ Zigbee devices for automation, energy awareness, and comfort optimization"
      />
      <div className="container mx-auto px-4 py-16 animate-slide-down">
        <Link
          to="/projects"
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-200 hover:border-blue-500 hover:bg-gray-800 hover:text-white hover:shadow-md"
        >
          <span>←</span> Back to projects
        </Link>

        <h1 className="mb-4 text-4xl font-bold text-white">
          Home Assistant: Local-First Smart Home (HAOS + ZHA, 50+ Zigbee
          Devices)
        </h1>

        <p className="mb-8 text-xl text-gray-400">
          Personal smart home project • Started September 2023
        </p>

        <div className="mb-8 flex flex-wrap gap-2">
          {[
            'Home Assistant OS',
            'Zigbee (ZHA)',
            'SkyConnect Coordinator',
            'Nabu Casa',
            'Grafana',
            'IoT Automation',
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
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">Overview</h2>
            <p className="mb-4">
              I run a self-hosted Home Assistant setup to improve day-to-day
              comfort, reduce friction at home, and experiment with automation
              as an event-driven system in the real world.
            </p>

            <div className="mb-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-gray-700 bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold text-white">Goals</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <strong className="text-white">Comfort:</strong> routines
                    that reduce manual steps (arriving/leaving, sleep routine)
                  </li>
                  <li>
                    <strong className="text-white">Energy awareness:</strong>{' '}
                    use smart plugs and measurements to understand consumption
                    patterns
                  </li>
                  <li>
                    <strong className="text-white">Security:</strong> window
                    sensors + alarm state awareness (details intentionally
                    high-level)
                  </li>
                  <li>
                    <strong className="text-white">Learning:</strong> treat the
                    house like a living lab for automation reliability
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-gray-700 bg-card p-6">
                <h3 className="mb-3 text-xl font-semibold text-white">
                  Constraints
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <strong className="text-white">Local-first:</strong> core
                    functionality should keep working even if the internet is
                    down
                  </li>
                  <li>
                    <strong className="text-white">Simple UX:</strong> must be
                    usable by non-technical users (my wife is the primary tester
                    and quality gate)
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Stack Choices
            </h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <ul className="space-y-2">
                <li>
                  <strong className="text-white">
                    Home Assistant OS (HAOS)
                  </strong>{' '}
                  running on a used mini-PC
                </li>
                <li>
                  <strong className="text-white">Zigbee:</strong> ZHA with a
                  Home Assistant SkyConnect coordinator
                </li>
                <li>
                  <strong className="text-white">Remote access:</strong> Nabu
                  Casa (used only for access from anywhere)
                </li>
                <li>
                  <strong className="text-white">Observability/tools:</strong>{' '}
                  Grafana + VS Code add-on
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              High-Level Architecture
            </h2>
            <div className="mb-4 rounded-lg border border-gray-700 bg-card p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                Components
              </h3>
              <ul className="space-y-1">
                <li>Home Assistant OS (core runtime)</li>
                <li>ZHA (Zigbee network + device entities)</li>
                <li>Dashboards (Lovelace UI)</li>
                <li>Nabu Casa (remote access)</li>
                <li>Optional tooling: Grafana, VS Code add-on</li>
              </ul>
            </div>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                Typical Flow
              </h3>
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  A Zigbee device changes state (motion, temp, window, plug)
                </li>
                <li>Home Assistant updates entity state</li>
                <li>An automation evaluates triggers/conditions</li>
                <li>
                  Actions execute (lights, covers, routines, notifications)
                </li>
              </ol>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Zigbee Network Design
            </h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <p className="mb-4">
                <strong className="text-white">Device count:</strong> 53 Zigbee
                devices
              </p>
              <p className="mb-4">
                <strong className="text-white">Primary challenge:</strong> Range
                and network stability
              </p>
              <div>
                <p className="mb-2 font-semibold text-white">
                  Mitigation strategy:
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Add multiple Zigbee smart sockets around the house to act as
                    routers
                  </li>
                  <li>
                    Prefer relays with neutral where possible so they can
                    operate reliably as routers
                  </li>
                </ul>
                <p className="mt-4">
                  This produced a stronger mesh by increasing the number and
                  distribution of routing-capable devices.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              What's Connected
            </h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <p className="mb-3 text-sm text-gray-400">
                Ordered by "what I use most"
              </p>
              <ol className="list-decimal space-y-2 pl-5">
                <li>Temperature / humidity sensors</li>
                <li>Smart plugs</li>
                <li>Window sensors</li>
                <li>Window covers (blinds/shutters)</li>
                <li>Alarm integration (kept high-level)</li>
                <li>Watering system</li>
              </ol>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Dashboards & UX
            </h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <p className="mb-4">
                <strong className="text-white">Dashboards:</strong> One main
                dashboard built by me + multiple sub-views
              </p>
              <p className="mb-4">
                <strong className="text-white">Quality gate:</strong> My wife
                uses it daily and is the ultimate tester. If the UX is
                confusing, it doesn't ship.
              </p>
              <img
                src={haScreenshot}
                alt="Home Assistant Dashboard"
                className="mt-6 w-full rounded-lg border border-gray-600"
              />
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Backups, Updates & Operations
            </h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <ul className="space-y-2">
                <li>
                  <strong className="text-white">Backups:</strong> Handled by
                  Nabu Casa
                </li>
                <li>
                  <strong className="text-white">Update cadence:</strong> Weekly
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Security & Privacy
            </h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <p>
                I avoid sharing sensitive operational/security details publicly.
                The setup is local-first; remote access is via Nabu Casa.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">
              Incident Story (Learning Moment)
            </h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <p className="mb-4">
                I tried to install{' '}
                <strong className="text-white">Frigate</strong> for local video
                analytics, but the mini-PC did not have a sufficiently powerful
                GPU. The attempt led to enough system churn that I nearly had to
                reinstall HAOS from scratch.
              </p>
              <div>
                <p className="mb-2 font-semibold text-white">
                  What I took from it:
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Validate hardware requirements up front for compute-heavy
                    add-ons
                  </li>
                  <li>
                    Treat major add-on experiments like risky migrations:
                    snapshot/back up, test incrementally, and have a rollback
                    plan
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-white">Roadmap</h2>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Add a well-documented "automation catalog" (8–12 best
                  automations)
                </li>
                <li>
                  Explore local camera/NVR options that match the available
                  hardware
                </li>
                <li>
                  Improve observability dashboards (device health, availability
                  trends) without exposing sensitive details
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
