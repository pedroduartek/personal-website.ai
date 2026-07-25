import { Link } from 'react-router-dom'
import GithubButton from '../../components/GithubButton'
import PageSEO from '../../components/seo/PageSEO'
import { projects } from '../../content/projects'

export default function ProdMonitorProjectPage() {
  const project = projects.find((p) => p.slug === 'prod-monitor')
  if (!project) return null
  return (
    <>
      <PageSEO
        title={`${project.title} - Daily Synthetic Monitoring`}
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
          </time>
        </div>

        <p className="mb-4 text-lg text-foreground-subtle md:text-xl">
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

        <div className="theme-prose">
          {/* Motivation */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              Motivation
            </h2>
            <p className="mb-4">{project.problem}</p>
          </section>

          {/* What It Checks */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              What It Checks
            </h2>
            <p className="mb-4">
              Every check runs against real production endpoints, so a green run
              means what a visitor would actually experience is working.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="theme-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Sites actually render
                </h3>
                <p className="text-sm text-foreground-muted">
                  Each site is opened in a real headless browser and must return
                  a page (HTTP under 400), carry a title, and render meaningful
                  content, not just answer a shallow ping.
                </p>
              </div>

              <div className="theme-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Open Graph images resolve
                </h3>
                <p className="text-sm text-foreground-muted">
                  The social-share image referenced by each page is fetched and
                  must return 200, so link previews never break silently.
                </p>
              </div>

              <div className="theme-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  TLS certificates stay valid
                </h3>
                <p className="text-sm text-foreground-muted">
                  A raw TLS connection to each host reads the certificate and
                  fails if it expires within two weeks, turning a silent outage
                  into an early warning.
                </p>
              </div>

              <div className="theme-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  API health, through the UI
                </h3>
                <p className="text-sm text-foreground-muted">
                  The AI chat launcher only appears once the browser reaches the
                  API health endpoint, so a visible launcher is a reliable proxy
                  for the backend being alive.
                </p>
              </div>
            </div>
          </section>

          {/* Alerting */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              Alerting That Stays Quiet
            </h2>
            <p className="mb-4">
              Good monitoring should be silent until it matters. A reporter
              reads the run results and decides whether to send anything at all,
              so my inbox only lights up when it should.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="theme-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Fail: instantly
                </h3>
                <p className="text-sm text-foreground-muted">
                  Any failing check emails a red report on that run and marks
                  the pipeline red.
                </p>
              </div>
              <div className="theme-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Pass: weekly
                </h3>
                <p className="text-sm text-foreground-muted">
                  When everything is healthy it sends a single green digest once
                  a week, as a heartbeat rather than daily noise.
                </p>
              </div>
              <div className="theme-card p-5">
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  On demand
                </h3>
                <p className="text-sm text-foreground-muted">
                  A manual run can force the digest, which is handy for
                  verifying the whole delivery path end to end.
                </p>
              </div>
            </div>
          </section>

          {/* Interesting problem */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              An Interesting Problem: Bot Protection vs. Monitoring
            </h2>
            <p className="mb-4">
              The API sits behind Cloudflare, whose Bot Fight Mode challenges
              requests from datacenter IP ranges, exactly where CI runners live.
              A direct call to the health endpoint from the pipeline was
              answered with a managed challenge (403), even though the service
              was perfectly healthy for real visitors.
            </p>
            <p className="mb-4">
              Rather than weaken protection by disabling the feature or poking a
              hole through the firewall, I let a real browser do the work. The
              site's chat widget performs its own health check and only mounts
              its launcher when the API responds, and a genuine browser passes
              the challenge that a plain request could not. So the monitor
              checks for the launcher instead: same signal, no security
              trade-off.
            </p>
          </section>

          {/* How it runs */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-semibold text-foreground">
              How It Runs
            </h2>
            <div className="theme-card p-6">
              <p className="text-foreground-muted">
                GitHub Actions runs the .NET 10 console app on a daily cron,
                with no servers to maintain. Targets live in one file, retries
                absorb transient network blips so alerts stay trustworthy, and
                the process exits non-zero on any failure so the pipeline itself
                turns red.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
