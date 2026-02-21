import PageSEO from '../../components/seo/PageSEO'
import { profile } from '../../content/profile'

export default function AboutPage() {
  return (
    <>
      <PageSEO title="About" description={profile.bio} />
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-8 text-4xl font-bold text-white">About Me</h1>
        <div className="max-w-3xl">
          <p className="mb-4 text-lg text-gray-300">{profile.bio}</p>
          <p className="mb-4 text-gray-300">
            I'm passionate about building high-quality software that solves real
            problems. With experience across the full stack, I enjoy working on
            everything from user interfaces to backend systems.
          </p>
          <p className="mb-6 text-gray-300">
            When I'm not coding, you can find me attending tech conferences,
            contributing to open source, or sharing knowledge through technical
            writing.
          </p>
          <div className="rounded-lg border border-gray-700 bg-card p-6">
            <h2 className="mb-3 text-xl font-semibold text-white">Location</h2>
            <p className="text-gray-300">{profile.location}</p>
          </div>
        </div>
      </div>
    </>
  )
}
