import PageSEO from '../../components/seo/PageSEO'
import { profile } from '../../content/profile'

export default function AboutPage() {
  return (
    <>
      <PageSEO title="About" description={profile.bio} />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <h1 className="mb-8 text-3xl font-bold text-white md:text-4xl">
          About Me
        </h1>
        <div className="max-w-3xl">
          <p className="mb-4 text-base text-gray-300 md:text-lg">
            Senior Software Engineer with <strong className="text-white">6 years of experience</strong> building scalable platforms in{' '}
            <strong className="text-white">C#/.NET (8+)</strong>, microservices, and event-driven architectures with Kafka. Proven track record as a{' '}
            <strong className="text-white">Tech Lead</strong>, owning system design, delivery, and{' '}
            <strong className="text-white">production reliability</strong> across SQL and NoSQL data stores. Passionate about developer productivity and automation, including running a self-hosted Home Assistant environment with 50+ Zigbee devices and custom automations.
          </p>
          <p className="mb-4 text-base text-gray-300 md:text-base">
            I'm passionate about building <strong className="text-white">reliable, scalable systems</strong> that solve
            real problems. I believe in writing clean, maintainable code and
            treating production reliability as a first-class concern.
          </p>
          <p className="mb-6 text-base text-gray-300 md:text-base">
            Outside of work, you'll find me out fishing or riding my motorcycle.
            I also run a self-hosted <strong className="text-white">Home Assistant setup with 50+ Zigbee
            devices</strong> as a personal lab where I experiment with automation
            reliability and apply event-driven thinking to real-world scenarios.
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
