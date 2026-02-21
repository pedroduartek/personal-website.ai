import { Link } from 'react-router-dom'
import PageSEO from '../../components/seo/PageSEO'
import { experience } from '../../content/experience'

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
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white">{item.title}</h2>
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
              </div>
              <ul className="mb-4 list-disc space-y-2 pl-5 text-gray-300">
                {item.description.map((desc) => (
                  <li key={desc}>{desc}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {item.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
