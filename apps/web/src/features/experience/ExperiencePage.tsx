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

export default function ExperiencePage() {
  return (
    <>
      <PageSEO
        title="Experience"
        description="Professional experience and work history"
      />
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold text-white">Experience</h1>
        <div className="space-y-8">
          {experience.map((item) => (
            <Link
              key={item.id}
              to={`/experience/${item.id}`}
              className="block rounded-lg border border-gray-700 bg-card p-6 transition-colors hover:border-blue-500"
            >
              <div className="flex items-start gap-4">
                {companyLogos[item.company] && (
                  <img
                    src={companyLogos[item.company]}
                    alt={`${item.company} logo`}
                    className="h-12 w-12 rounded object-contain"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white">
                    {item.title}
                  </h2>
                  <p className="text-lg text-gray-300">{item.company}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                    <time>
                      {new Date(item.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })}{' '}
                      -{' '}
                      {item.endDate
                        ? new Date(item.endDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                          })
                        : 'Present'}
                    </time>
                    <span>•</span>
                    <span>{item.location}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-gray-400">
                    Click to view details →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
