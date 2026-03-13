import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import StyledLink from '../../components/StyledLink'
import PageSEO from '../../components/seo/PageSEO'
import { conferences } from '../../content/conferences'

export default function ConferencesPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [currentConference, setCurrentConference] = useState<string>('')

  const openLightbox = (conferenceName: string, index: number) => {
    setCurrentConference(conferenceName)
    setPhotoIndex(index)
    setLightboxOpen(true)
  }

  const currentPhotos =
    conferences
      .find((conference) => conference.name === currentConference)
      ?.photos?.map((photo) => ({ src: photo.src })) ?? []

  return (
    <>
      <PageSEO
        title="Conferences & Events"
        description="Conferences, events, and community experiences"
        image="/src/images/azure_dev_summit.png"
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : 'https://www.pedroduartek.com/conferences'
        }
      />
      <div className="container mx-auto px-4 py-16 animate-slide-down">
        <h1 className="mb-6 text-4xl font-bold text-white">
          Conferences & Events
        </h1>
        <div className="mb-10 max-w-3xl">
          <p className="text-base text-gray-300 md:text-lg">
            A few moments where I invested in learning, community, and exposure
            to how other teams think about technology and software delivery.
          </p>
        </div>
        <div className="space-y-6">
          {conferences.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-gray-700 bg-card p-6"
            >
              <div className="mb-4 flex items-start gap-4">
                {item.logo && (
                  <img
                    src={item.logo}
                    alt={`${item.name} logo`}
                    className="h-16 w-16 rounded object-contain"
                  />
                )}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">
                      {item.name}
                    </h2>
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        item.type === 'Presented'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : item.type === 'Volunteer'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                  {item.title && (
                    <p className="mb-2 text-lg font-semibold text-gray-300">
                      {item.title}
                    </p>
                  )}
                  {item.description && (
                    <p className="mb-3 text-gray-400">{item.description}</p>
                  )}
                  <div className="mb-3 flex items-center gap-4 text-sm text-gray-400">
                    <time>
                      {new Date(item.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })}
                    </time>
                    <span>•</span>
                    <span>{item.location}</span>
                  </div>
                  {item.links && (
                    <div className="flex gap-3">
                      {item.links.slides && (
                        <StyledLink
                          href={item.links.slides}
                          target="_blank"
                          rel="noopener noreferrer"
                          ariaLabel="View slides"
                        >
                          View Slides
                        </StyledLink>
                      )}
                      {item.links.video && (
                        <StyledLink
                          href={item.links.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          ariaLabel="Watch video"
                        >
                          Watch Video
                        </StyledLink>
                      )}
                      {item.links.website && (
                        <StyledLink
                          href={item.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          ariaLabel="Event website"
                        >
                          Event Website
                        </StyledLink>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {item.photos && item.photos.length > 0 && (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {item.photos.map((photo, index) => (
                    <button
                      key={photo.src}
                      type="button"
                      onClick={() => openLightbox(item.name, index)}
                      className="rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="h-48 w-full object-cover transition-opacity hover:opacity-90"
                        style={
                          photo.objectPosition
                            ? { objectPosition: photo.objectPosition }
                            : undefined
                        }
                      />
                    </button>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={currentPhotos}
        index={photoIndex}
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
