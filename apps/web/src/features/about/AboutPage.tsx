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
        <h1 className="mb-8 text-3xl font-bold text-white md:text-4xl">
          About Me
        </h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <p className="mb-4 text-base text-gray-300 md:text-lg">
              {profile.bio}
            </p>
            <p className="mb-4 text-base text-gray-300 md:text-lg">
              I'm passionate about building{' '}
              <strong className="text-white">reliable, scalable systems</strong>{' '}
              that solve real problems. I believe in writing clean, maintainable
              code and treating production reliability as a first-class concern.
            </p>
            <p className="mb-4 text-base text-gray-300 md:text-lg">
              Frontend development has not been the center of my career, but I
              care deeply about{' '}
              <strong className="text-white">user experience</strong>. I like
              being involved in product and UX discussions because good software
              is not only about solid backend architecture. It is also about
              making systems understandable, efficient, and pleasant to use.
            </p>
            <p className="mb-6 text-base text-gray-300 md:text-lg">
              Outside work, you will usually find me fishing, riding my
              motorcycle, or cooking. I also run a self-hosted{' '}
              <strong className="text-white">
                Home Assistant setup with 50+ Zigbee devices
              </strong>{' '}
              as a personal lab where I experiment with automation reliability
              and apply event-driven thinking to real-world scenarios.
            </p>
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <h2 className="mb-3 text-xl font-semibold text-white">
                Location
              </h2>
              <p className="text-gray-300">{profile.location}</p>
            </div>
          </div>
          <div className="md:w-1/3">
            <div className="rounded-lg border border-gray-700 bg-card p-4 sticky top-8">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <img
                  src={systemDesign}
                  alt="System design work at Enhesa"
                  loading="lazy"
                  decoding="async"
                  className="rounded-lg w-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
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
