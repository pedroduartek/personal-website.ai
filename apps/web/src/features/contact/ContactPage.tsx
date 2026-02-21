import PageSEO from '../../components/seo/PageSEO'
import { profile } from '../../content/profile'

export default function ContactPage() {
  return (
    <>
      <PageSEO title="Contact" description="Get in touch with me" />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <h1 className="mb-8 text-3xl font-bold text-white md:text-4xl">
          Contact
        </h1>
        <div className="max-w-2xl">
          <p className="mb-8 text-base text-gray-300 md:text-lg">
            I'm always interested in hearing about new opportunities,
            collaborations, or just connecting with fellow developers. Feel free
            to reach out!
          </p>

          <div className="space-y-6">
            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <h2 className="mb-2 text-xl font-semibold text-white">Email</h2>
              <a
                href={`mailto:${profile.email}`}
                className="text-blue-600 transition-all duration-200 hover:translate-x-1 hover:underline dark:text-blue-400"
              >
                {profile.email}
              </a>
            </div>

            <div className="rounded-lg border border-gray-700 bg-card p-6">
              <h2 className="mb-2 text-xl font-semibold text-white">
                LinkedIn
              </h2>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 transition-all duration-200 hover:translate-x-1 hover:underline dark:text-blue-400"
              >
                Connect on LinkedIn
              </a>
            </div>

            {profile.github && (
              <div className="rounded-lg border border-gray-700 bg-card p-6">
                <h2 className="mb-2 text-xl font-semibold text-white">
                  GitHub
                </h2>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 transition-all duration-200 hover:translate-x-1 hover:underline dark:text-blue-400"
                >
                  View GitHub Profile
                </a>
              </div>
            )}

            {profile.twitter && (
              <div className="rounded-lg border border-gray-700 bg-card p-6">
                <h2 className="mb-2 text-xl font-semibold text-white">
                  Twitter
                </h2>
                <a
                  href={profile.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 transition-all duration-200 hover:translate-x-1 hover:underline dark:text-blue-400"
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
