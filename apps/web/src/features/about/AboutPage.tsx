import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import PageSEO from '../../components/seo/PageSEO'
import { profile } from '../../content/profile'
import systemDesign from '../../images/system_design_enhesa.webp'

export default function AboutPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <>
      <PageSEO
        title="About"
        description={profile.bio}
        image="/src/images/pld_logo_header.png"
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : 'https://www.pedroduartek.com/about'
        }
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <h1 className="mb-8 text-3xl font-bold text-foreground md:text-4xl">
          About Me
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <p className="mb-4 text-base text-foreground-muted md:text-lg">
              {profile.bio}
            </p>
            <p className="mb-4 text-base text-foreground-muted md:text-lg">
              Most of my professional work sits in the backend: service
              boundaries, data flows, production reliability, and the habits
              that help teams ship without creating avoidable operational risk.
              I enjoy turning messy technical problems into systems that are
              easier to reason about, easier to change, and easier to trust.
            </p>
            <p className="mb-4 text-base text-foreground-muted md:text-lg">
              I also spend time helping junior and mid-level engineers grow
              through technical sessions, code reviews, and day-to-day
              collaboration. That part of the job matters to me because strong
              systems come from strong engineering habits shared across a team,
              not just from a few good individual decisions.
            </p>
            <p className="mb-4 text-base text-foreground-muted md:text-lg">
              I care about user experience more than people usually expect from
              a backend engineer. Even when I am working on APIs, platform
              concerns, or architecture, I want the result to be understandable
              and practical for the people using it. That is part of why I like
              being involved in product and UX discussions as well as systems
              design.
            </p>
            <p className="mb-4 text-base text-foreground-muted md:text-lg">
              Personal projects are where I pressure-test that mindset. They
              give me room to learn outside my day job, explore AI-assisted
              development in a practical way, and build things that solve real
              problems instead of stopping at prototypes.
            </p>
            <p className="mb-6 text-base text-foreground-muted md:text-lg">
              Outside work, you will usually find me fishing, riding my
              motorcycle, or cooking. I also run a self-hosted Home Assistant
              setup as a long-running personal lab for automation, reliability,
              and real-world feedback loops.
            </p>
            <div className="theme-card p-6">
              <h2 className="mb-3 text-xl font-semibold text-foreground">
                Based In
              </h2>
              <p className="text-foreground-muted">{profile.location}</p>
            </div>
          </div>
          <div className="md:w-1/3">
            <div className="theme-card sticky top-8 p-4">
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
