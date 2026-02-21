import { Link, useParams } from 'react-router-dom'
import PageSEO from '../../components/seo/PageSEO'
import { experience } from '../../content/experience'

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
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold text-white">Experience not found</h1>
        <Link
          to="/experience"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          ← Back to experience
        </Link>
      </div>
    )
  }

  const company = companyRoles[0].company
  const location = companyRoles[0].location

  return (
    <>
      <PageSEO
        title={`Experience at ${company}`}
        description={companyRoles[0].description[0]}
      />
      <div className="container mx-auto px-4 py-16">
        <Link
          to="/experience"
          className="mb-6 inline-block text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to experience
        </Link>

        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">{company}</h1>
          <p className="text-lg text-gray-400">{location}</p>
        </div>

        <div className="space-y-8">
          {companyRoles.map((role) => (
            <div
              key={role.id}
              className="rounded-lg border border-gray-700 bg-card p-6"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">{role.title}</h2>
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

              <div className="mb-6">
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

              <div>
                <h3 className="mb-3 text-lg font-semibold text-white">
                  Technologies & Tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {role.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
