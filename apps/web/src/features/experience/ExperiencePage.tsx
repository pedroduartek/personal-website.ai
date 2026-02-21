import { Link } from 'react-router-dom'
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

export default function ExperiencePage() {
  // Group experiences by company
  const groupedExperiences = experience.reduce(
    (acc, item) => {
      if (!acc[item.company]) {
        acc[item.company] = []
      }
      acc[item.company].push(item)
      return acc
    },
    {} as Record<string, typeof experience>,
  )

  // Get unique technologies for each company, keeping most specific versions
  const getCompanyTechnologies = (roles: typeof experience) => {
    // Flatten all technologies with their role index (0 is most recent)
    const techsWithIndex = roles.flatMap((role, index) =>
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

  return (
    <>
      <PageSEO
        title="Experience"
        description="Professional experience and work history"
      />
      <div className="container mx-auto px-4 py-16 animate-slide-down">
        <h1 className="mb-8 text-4xl font-bold text-white">Experience</h1>
        <div className="space-y-8">
          {Object.entries(groupedExperiences).map(([company, roles]) => {
            const companyTechnologies = getCompanyTechnologies(roles)
            return (
              <Link
                key={company}
                to={`/experience/${createCompanySlug(company)}`}
                className="block rounded-lg border border-gray-700 bg-card p-6 transition-colors hover:border-blue-500"
              >
                <div className="mb-6 flex items-center gap-4">
                  {companyLogos[company] && (
                    <img
                      src={companyLogos[company]}
                      alt={`${company} logo`}
                      className="h-12 w-12 rounded object-contain"
                    />
                  )}
                  <h2 className="text-2xl font-bold text-white">{company}</h2>
                </div>
                <div className="mb-4 space-y-4">
                  {roles.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-gray-600 bg-gray-800/50 p-4"
                    >
                      <h3 className="text-xl font-bold text-white">
                        {item.title}
                      </h3>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                        <time>
                          {new Date(item.startDate).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                            },
                          )}{' '}
                          -{' '}
                          {item.endDate
                            ? new Date(item.endDate).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                },
                              )
                            : 'Present'}
                        </time>
                        <span>•</span>
                        <span>{item.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
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
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}
