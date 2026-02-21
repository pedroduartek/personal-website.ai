import PageSEO from '../../components/seo/PageSEO'
import { profile } from '../../content/profile'

export default function ContactPage() {
  return (
    <>
      <PageSEO title="Contact" description="Get in touch with me" />
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-white">
          Contact
        </h1>
        <div className="max-w-2xl">
          <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
            I'm always interested in hearing about new opportunities,
            collaborations, or just connecting with fellow developers. Feel free
            to reach out!
          </p>

          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                Email
              </h2>
              <a
                href={`mailto:${profile.email}`}
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {profile.email}
              </a>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
              <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                LinkedIn
              </h2>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Connect on LinkedIn
              </a>
            </div>

            {profile.github && (
              <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
                <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  GitHub
                </h2>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  View GitHub Profile
                </a>
              </div>
            )}

            {profile.twitter && (
              <div className="rounded-lg border border-gray-200 p-6 dark:border-gray-800">
                <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  Twitter
                </h2>
                <a
                  href={profile.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Follow on Twitter
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
