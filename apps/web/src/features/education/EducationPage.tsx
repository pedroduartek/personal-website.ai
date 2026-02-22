import { Link } from 'react-router-dom'
import PageSEO from '../../components/seo/PageSEO'
import { conferences } from '../../content/conferences'
import { education } from '../../content/education'
import azureDevSummitLogo from '../../images/azure_dev_summit.png'
import formabaseLogo from '../../images/formabase.png'
import polytechnicLogo from '../../images/polytechnic_setubal.png'
import webSummitLogo from '../../images/web_summit.png'

export default function EducationPage() {
  const institutionLogos: Record<string, string> = {
    'Polytechnic Institute Of Setúbal': polytechnicLogo,
    Formabase: formabaseLogo,
  }

  const conferenceLogos: Record<string, string> = {
    'Azure Dev Summit': azureDevSummitLogo,
    'Web Summit': webSummitLogo,
  }

  return (
    <>
      <PageSEO
        title="Education & Conferences"
        description="Academic background, certifications, and conference participation"
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <h1 className="mb-8 text-3xl font-bold text-white md:text-4xl">
          Education
        </h1>
        <div className="space-y-6">
          {education.map((item) => (
            <article
              key={item.id}
              className="rounded-lg border border-gray-700 bg-card p-6"
            >
              <div className="flex gap-4">
                {institutionLogos[item.institution] && (
                  <img
                    src={institutionLogos[item.institution]}
                    alt={`${item.institution} logo`}
                    className="h-12 w-12 object-contain"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white md:text-2xl">
                    {item.degree} in {item.field}
                  </h2>
                  <p className="text-base text-gray-300 md:text-lg">
                    {item.institution}
                  </p>
                  <div className="mt-2 flex flex-col gap-1 text-sm text-gray-400 sm:flex-row sm:items-center sm:gap-4">
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
                    <ul className="mt-4 list-disc space-y-1 pl-5 text-gray-300">
                      {item.achievements.map((achievement) => (
                        <li key={achievement}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                  {item.certificateUrl && (
                    <a
                      href={item.certificateUrl}
                      download
                      className="mt-4 inline-flex items-center gap-2 rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-gray-700 hover:shadow-lg"
                    >
                      <svg
                        role="img"
                        aria-label="Download icon"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      View Certificate
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Conferences & Events Section */}
        <h2 className="mb-6 mt-12 text-2xl font-bold text-white md:text-3xl">
          Conferences & Events
        </h2>
        <div className="space-y-6">
          {conferences.map((item) => (
            <Link key={item.id} to="/conferences">
              <article className="rounded-lg border border-gray-700 bg-card p-6 transition-all duration-200 hover:scale-[1.02] hover:bg-gray-800 hover:shadow-lg cursor-pointer">
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
                    <h3 className="text-xl font-bold text-white md:text-2xl">
                      {item.name}
                    </h3>
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        item.type === 'presented'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : item.type === 'organized'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                  {item.title && (
                    <p className="mb-2 text-base font-semibold text-gray-300 md:text-lg">
                      {item.title}
                    </p>
                  )}
                  {item.description && (
                    <p className="mb-3 text-gray-400">{item.description}</p>
                  )}
                  <div className="flex flex-col gap-1 text-sm text-gray-400 sm:flex-row sm:items-center sm:gap-4">
                    <time>
                      {new Date(item.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </time>
                    <span>•</span>
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            </article>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
