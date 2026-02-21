import PageSEO from '../../components/seo/PageSEO'
import { education } from '../../content/education'

export default function EducationPage() {
  return (
    <>
      <PageSEO
        title="Education"
        description="Academic background and certifications"
      />
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">
          Education
        </h1>
        <div className="space-y-6">
          {education.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-gray-200 p-6 dark:border-gray-800"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {item.degree} in {item.field}
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                {item.institution}
              </p>
              <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <time>
                  {new Date(item.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                  })}{' '}
                  -{' '}
                  {item.endDate
                    ? new Date(item.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                      })
                    : 'Present'}
                </time>
                <span>•</span>
                <span>{item.location}</span>
                {item.gpa && (
                  <>
                    <span>•</span>
                    <span>GPA: {item.gpa}</span>
                  </>
                )}
              </div>
              {item.achievements && item.achievements.length > 0 && (
                <ul className="mt-4 list-disc space-y-1 pl-5 text-gray-700 dark:text-gray-300">
                  {item.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
