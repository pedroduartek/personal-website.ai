import { Link, useParams } from 'react-router-dom'
import PageSEO from '../../components/seo/PageSEO'
import { experience } from '../../content/experience'

export default function ExperienceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const item = experience.find((e) => e.id === id)

  if (!item) {
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

  return (
    <>
      <PageSEO
        title={`${item.title} at ${item.company}`}
        description={item.description[0]}
      />
      <div className="container mx-auto px-4 py-16">
        <Link
          to="/experience"
          className="mb-6 inline-block text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Back to experience
        </Link>

        <div className="mb-6">
          <h1 className="mb-2 text-4xl font-bold text-white">{item.title}</h1>
          <p className="text-2xl text-gray-300">{item.company}</p>
          <div className="mt-3 flex items-center gap-4 text-gray-400">
            <time>
              {new Date(item.startDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}{' '}
              -{' '}
              {item.endDate
                ? new Date(item.endDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })
                : 'Present'}
            </time>
            <span>•</span>
            <span>{item.location}</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold text-white">
            Key Responsibilities & Achievements
          </h2>
          <ul className="space-y-3 text-gray-300">
            {item.description.map((desc) => (
              <li key={desc} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-gray-700 bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Technologies & Tools
          </h2>
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
        </div>
      </div>
    </>
  )
}
