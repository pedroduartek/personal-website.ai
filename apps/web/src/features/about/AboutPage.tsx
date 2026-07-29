import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import PageSEO from '../../components/seo/PageSEO'
import { profile } from '../../content/profile'
import systemDesign from '../../images/system_design_enhesa.webp'
import { getExperience } from '../../utils/experience'

const quickFacts = [
  {
    label: 'Role',
    value: profile.role,
  },
  {
    label: 'Location',
    value: profile.location,
  },
  {
    label: 'Main Stack',
    value: 'C#/.NET, microservices, Kafka, PostgreSQL',
  },
]

export default function AboutPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const experience = getExperience()

  const narrativeSections = [
    {
      title: 'How I Work',
      body: [
        `Most of my professional work sits in the backend: service boundaries, data flows, production reliability, and the habits that help teams ship without creating avoidable operational risk. Over ${experience.text}, I have spent most of my time designing and evolving systems that need to stay understandable under change, not just function on a good day.`,
        'I enjoy turning messy technical problems into systems that are easier to reason about, easier to change, and easier to trust. That usually means asking uncomfortable questions early about ownership, failure modes, operational simplicity, and whether a solution will still make sense six months later.',
      ],
    },
    {
      title: 'What I Care About',
      body: [
        'I also spend time helping junior and mid-level engineers grow through technical sessions, code reviews, and day-to-day collaboration. Strong systems come from strong engineering habits shared across a team, not just from a few good individual decisions.',
        'I care about user experience more than people usually expect from a backend engineer. Even when I am working on APIs, platform concerns, or architecture, I want the result to be understandable and practical for the people using it. That is part of why I like being involved in product and UX discussions as well as systems design.',
      ],
    },
    {
      title: 'Outside Work',
      body: [
        'Personal projects are where I pressure-test that mindset. They give me room to learn outside my day job, explore AI-assisted development in a practical way, and build things that solve real problems instead of stopping at prototypes.',
        'Outside work, you will usually find me fishing, riding my motorcycle, or cooking. I also run a self-hosted Home Assistant setup as a long-running personal lab for automation, reliability, and real-world feedback loops.',
      ],
    },
  ]

  return (
    <>
      <PageSEO
        title="About"
        description={profile.bio}
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : 'https://www.pedroduartek.com/about'
        }
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
          <div className="space-y-6">
            <section className="pb-2">
              <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                About Me
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-foreground-muted md:text-xl">
                {profile.bio}
              </p>
            </section>

            {narrativeSections.map((section) => (
              <section key={section.title} className="theme-card p-6 md:p-7">
                <h2 className="mb-4 text-2xl font-semibold text-foreground">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-8 text-foreground-muted md:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="space-y-6 lg:sticky lg:top-8">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {quickFacts.map((fact) => (
                <div key={fact.label} className="theme-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-subtle">
                    {fact.label}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-foreground md:text-base">
                    {fact.value}
                  </p>
                </div>
              ))}
              <div className="theme-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-foreground-subtle">
                  Experience
                </p>
                <p className="mt-3 text-sm leading-6 text-foreground md:text-base">
                  {experience.text} building backend systems that have to stay
                  maintainable under real delivery pressure.
                </p>
              </div>
            </div>

            <div className="theme-card p-6">
              <h2 className="text-lg font-semibold text-foreground">
                Backend-first, product-aware
              </h2>
              <p className="mt-3 text-sm leading-6 text-foreground-muted">
                I care about the internals, but I also care about whether the
                final experience feels coherent, useful, and trustworthy.
              </p>
              <p className="mt-3 text-sm leading-6 text-foreground-muted">
                The work I enjoy most usually sits at the intersection of
                architecture, delivery, and product clarity: systems that hold
                up technically while still making sense to the people using
                them.
              </p>
            </div>

            <div className="theme-card p-4">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <img
                  src={systemDesign}
                  alt="System design work at Enhesa"
                  loading="lazy"
                  decoding="async"
                  className="w-full cursor-pointer rounded-lg object-cover transition-opacity hover:opacity-90"
                />
              </button>
              <div className="px-1 pt-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Systems thinking in practice
                </h2>
                <p className="mt-2 text-sm leading-6 text-foreground-muted">
                  A large part of my day-to-day work is making service
                  boundaries, dependencies, and operational tradeoffs easier to
                  understand before they become production problems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={[{ src: systemDesign }]}
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
