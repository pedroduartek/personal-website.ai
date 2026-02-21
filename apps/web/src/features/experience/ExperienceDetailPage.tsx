import { Link, useParams } from 'react-router-dom'
import PageSEO from '../../components/seo/PageSEO'
import { experience } from '../../content/experience'
import enhesaLogo from '../../images/enhesa.png'
import vortalLogo from '../../images/vortal.png'
import closerLogo from '../../images/closer_consulting.png'

const companyLogos: Record<string, string> = {
  Enhesa: enhesaLogo,
  VORTAL: vortalLogo,
  'Closer Consulting': closerLogo,
}

const createCompanySlug = (company: string) =>
  company.toLowerCase().replace(/\s+/g, '-')

export default function ExperienceDetailPage() {
  const { id } = useParams<{ id: string }>()

  // Find all roles for the company matching the slug
  const companyRoles = experience.filter(
    (e) => createCompanySlug(e.company) === id,
  )

  if (companyRoles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <h1 className="text-xl font-bold text-white md:text-2xl">Experience not found</h1>
        <Link
          to="/experience"
          className="mt-4 inline-block text-blue-600 transition-all duration-200 hover:translate-x-[-4px] hover:underline"
        >
          ← Back to experience
        </Link>
      </div>
    )
  }

  const company = companyRoles[0].company
  const location = companyRoles[0].location

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
              index < parseInt(key.split('-')[1]))
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
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <Link
          to="/experience"
          className="mb-6 inline-block text-blue-600 transition-all duration-200 hover:translate-x-[-4px] hover:underline dark:text-blue-400"
        >
          ← Back to experience
        </Link>

        <div className="mb-8 flex items-center gap-4">
          {companyLogos[company] && (
            <img
              src={companyLogos[company]}
              alt={`${company} logo`}
              className="h-16 w-16 rounded object-contain"
            />
          )}
          <div>
            <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">{company}</h1>
            <p className="text-base text-gray-400 md:text-lg">{location}</p>
          </div>
        </div>

        <div className="mb-8 rounded-lg border border-gray-700 bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
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
            <div
              key={role.id}
              className="rounded-lg border border-gray-700 bg-card p-6"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white md:text-2xl">{role.title}</h2>
                <div className="mt-2 flex items-center gap-4 text-gray-400">
                  <time>
                    {new Date(role.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}{' '}
                    -{' '}
                    {role.endDate
                      ? new Date(role.endDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })
                      : 'Present'}
                  </time>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-white">
                  Key Responsibilities & Achievements
                </h3>
                <ul className="space-y-2 text-gray-300">
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
      </div>
    </>
  )
}
