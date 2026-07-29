import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import PageSEO from '../../components/seo/PageSEO'
import { experience } from '../../content/experience'
import enhesaCardSession from '../../images/enhesa-team-card-session.webp'
import enhesaCelebration from '../../images/enhesa-team-celebration.webp'
import enhesaKickoff from '../../images/enhesa-team-kickoff.webp'
import enhesaRooftop from '../../images/enhesa-team-rooftop.webp'

const createCompanySlug = (company: string) =>
  company.toLowerCase().replace(/\s+/g, '-')

export default function ExperienceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Find all roles for the company matching the slug
  const companyRoles = experience.filter(
    (e) => createCompanySlug(e.company) === id,
  )

  if (companyRoles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <h1 className="text-xl font-bold text-foreground md:text-2xl">
          Experience not found
        </h1>
        <Link
          to="/experience"
          className="theme-button-secondary mt-4 inline-flex items-center gap-2"
        >
          <span>←</span> Back to experience
        </Link>
      </div>
    )
  }

  const company = companyRoles[0].company
  const location = companyRoles[0].location
  const logo = companyRoles[0].logo
  const companySlug = createCompanySlug(company)

  const enhesaGallery =
    companySlug === 'enhesa'
      ? [
          {
            src: enhesaKickoff,
            alt: 'Enhesa team event around a large collaborative construction challenge',
            title: 'Hands-on team kickoff',
            description:
              'A good reminder that the strongest engineering teams are built through trust, not just process.',
            className: 'md:col-span-2',
          },
          {
            src: enhesaCelebration,
            alt: 'Enhesa colleagues celebrating together indoors during a team gathering',
            title: 'Bingo Day',
            description:
              'A healthy  culture also means taking time to have some fun!',
            className: 'md:row-span-2',
          },
          {
            src: enhesaCardSession,
            alt: 'Small group playing cards together during an Enhesa social event',
            title: 'Communication & connection',
            description:
              'Ever tried to play a simple card game without knowing the rules and without being able to talk? It’s a great exercise to build empathy for how communication challenges can impact collaboration.',
          },
          {
            src: enhesaRooftop,
            alt: 'Enhesa team rooftop group photo with the Lisbon bridge in the background',
            title: 'Lisbon team rooftop day',
            description:
              'International collaboration was the norm, but the local team still had a strong identity.',
          },
        ]
      : []

  // Get unique technologies for the company, keeping most specific versions
  const getUniqueTechnologies = () => {
    // Flatten all technologies with their role index (0 is most recent)
    const techsWithIndex = companyRoles.flatMap((role, index) =>
      role.technologies.map((tech) => ({ tech, index })),
    )

    const uniqueTechs = new Map<string, string>()

    for (const { tech, index } of techsWithIndex) {
      const normalized = tech.toLowerCase()

      // Check if we already have a similar technology
      let foundSimilar = false
      for (const [key, value] of uniqueTechs.entries()) {
        const existingNormalized = value.toLowerCase()

        // Check if technologies are similar (one contains the other)
        if (
          normalized.includes(existingNormalized) ||
          existingNormalized.includes(normalized)
        ) {
          // Keep the more specific one (longer) or the one from a more recent role
          if (
            tech.length > value.length ||
            (tech.length === value.length &&
              index < Number.parseInt(key.split('-')[1]))
          ) {
            uniqueTechs.delete(key)
            uniqueTechs.set(`${tech}-${index}`, tech)
          }
          foundSimilar = true
          break
        }
      }

      if (!foundSimilar) {
        uniqueTechs.set(`${tech}-${index}`, tech)
      }
    }

    return Array.from(uniqueTechs.values())
  }

  const companyTechnologies = getUniqueTechnologies()

  return (
    <>
      <PageSEO
        title={`Experience at ${company}`}
        description={companyRoles[0].description[0]}
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : `https://www.pedroduartek.com/experience/${id}`
        }
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <Link
          to="/experience"
          className="theme-button-secondary mb-6 inline-flex items-center gap-2"
        >
          <span>←</span> Back to experience
        </Link>

        <div className="mb-8 flex items-center gap-4">
          {logo && (
            <img
              src={logo}
              alt={`${company} logo`}
              className="h-16 w-16 rounded object-contain"
            />
          )}
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
              {company}
            </h1>
            <p className="text-base text-foreground-subtle md:text-lg">
              {location}
            </p>
          </div>
        </div>

        <div className="theme-card mb-8 p-6">
          <h2 className="mb-4 text-xl font-semibold text-foreground">
            Technologies & Tools
          </h2>
          <div className="flex flex-wrap gap-2">
            {companyTechnologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8 space-y-8">
          {companyRoles.map((role) => (
            <div key={role.id} className="theme-card p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-foreground md:text-2xl">
                  {role.title}
                </h2>
                <div className="mt-2 flex items-center gap-4 text-foreground-subtle">
                  <time>
                    {new Date(role.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}{' '}
                    -{' '}
                    {role.endDate
                      ? new Date(role.endDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })
                      : 'Present'}
                  </time>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">
                  Key Responsibilities & Achievements
                </h3>
                <ul className="space-y-2 text-foreground-muted">
                  {role.description.map((desc) => (
                    <li key={desc} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {enhesaGallery.length > 0 && (
          <section className="mb-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Team Building At Enhesa
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-foreground-muted md:text-base">
                  These photos are all from team-building events. They add some
                  of the human context behind the platform work, delivery
                  pressure, and cross-team collaboration that shaped my time at
                  Enhesa.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {enhesaGallery.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => {
                    setLightboxIndex(index)
                    setLightboxOpen(true)
                  }}
                  className={`theme-card group flex h-full flex-col overflow-hidden p-0 text-left ${photo.className ?? ''}`}
                >
                  <div className="min-h-0 flex-1 overflow-hidden">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full min-h-64 w-full object-cover transition duration-300 group-hover:scale-[1.02] group-hover:opacity-95 md:min-h-72"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      {photo.title}
                    </h3>
                    <p className="mt-2 text-sm text-foreground-muted">
                      {photo.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      <Lightbox
        open={lightboxOpen}
        index={lightboxIndex}
        close={() => setLightboxOpen(false)}
        slides={enhesaGallery}
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
