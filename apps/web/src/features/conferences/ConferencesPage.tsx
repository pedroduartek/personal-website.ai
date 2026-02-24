import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import PageSEO from '../../components/seo/PageSEO'
import { conferences } from '../../content/conferences'
import azureDevSummitLogo from '../../images/azure_dev_summit.png'
import azureNickChapsas from '../../images/photo_nickchapsas_azuresummit.jpeg'
import azureStage1 from '../../images/stage_azuresummit.jpeg'
import azureStage2 from '../../images/stage_azuresummit_2.jpeg'
import webSummitLogo from '../../images/web_summit.png'
import webSummitGroup from '../../images/websummit_groupphoto.jpeg'

const conferenceLogos: Record<string, string> = {
  'Azure Dev Summit': azureDevSummitLogo,
  'Web Summit': webSummitLogo,
}

const conferencePhotos: Record<string, string[]> = {
  'Azure Dev Summit': [azureStage1, azureStage2, azureNickChapsas],
  'Web Summit': [webSummitGroup],
}

export default function ConferencesPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [currentConference, setCurrentConference] = useState<string>('')

  const openLightbox = (conferenceName: string, index: number) => {
    setCurrentConference(conferenceName)
    setPhotoIndex(index)
    setLightboxOpen(true)
  }

  const currentPhotos = currentConference
    ? conferencePhotos[currentConference]?.map((src) => ({ src })) || []
    : []

  return (
    <>
      <PageSEO
        title="Conferences & Talks"
        description="Conference presentations, talks, and events"
      />
      <div className="container mx-auto px-4 py-16 animate-slide-down">
        <h1 className="mb-8 text-4xl font-bold text-white">
          Conferences & Talks
        </h1>
        <div className="space-y-6">
          {conferences.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-gray-700 bg-card p-6"
            >
              <div className="mb-4 flex items-start gap-4">
                {conferenceLogos[item.name] && (
                  <img
                    src={conferenceLogos[item.name]}
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
                        <a
                          href={item.links.slides}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                        >
                          View Slides
                        </a>
                      )}
                      {item.links.video && (
                        <a
                          href={item.links.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                        >
                          Watch Video
                        </a>
                      )}
                      {item.links.website && (
                        <a
                          href={item.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                        >
                          Event Website
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
              {conferencePhotos[item.name] && (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {conferencePhotos[item.name].map((photo, index) => (
                    <button
                      key={photo}
                      type="button"
                      onClick={() => openLightbox(item.name, index)}
                      className="rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <img
                        src={photo}
                        alt={`${item.name} ${index + 1}`}
                        className={`object-cover w-full h-48 hover:opacity-90 transition-opacity ${
                          item.name === 'Azure Dev Summit' && index === 2
                            ? 'object-[center_35%]'
                            : ''
                        }`}
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
