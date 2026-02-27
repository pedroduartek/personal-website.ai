import { Link } from 'react-router-dom'
import PageSEO from '../../components/seo/PageSEO'
import { profile } from '../../content/profile'
import { projects } from '../../content/projects'
import TechIcon from '../../components/TechIcon'
import { getExperience } from '../../utils/experience'

export default function HomePage() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3)
  const experience = getExperience()

  return (
    <>
      <PageSEO
        title="Home"
        description={`${profile.name} - ${profile.role}. ${profile.bio}`}
      />
      <div className="container mx-auto px-4 py-8 lg:py-16 animate-slide-down">
        <section className="mb-12 lg:mb-16">
          <h1 className="mb-4 text-3xl lg:text-5xl font-bold text-white">
            {profile.name}
          </h1>
          <p className="mb-4 text-xl lg:text-2xl text-gray-300">
            {profile.role}
          </p>
          <div className="mb-8 max-w-4xl">
            <p className="mb-4 text-base lg:text-lg text-gray-300">
              Welcome! I'm a backend software engineer with {experience.text} of
              experience in C#/.NET, microservices, and event-driven systems.{' '}
              <Link
                to="/about"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Learn more about me
              </Link>
              .
            </p>
            <p className="mb-4 text-base lg:text-lg text-gray-300">
              This website itself is a learning project. As someone who knows
              close to nothing about frontend development, I'm using AI-assisted
              tools to build this site and learn React, TypeScript, and modern
              frontend practices along the way.{' '}
              <Link
                to="/projects"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                See the full project details
              </Link>
              .
            </p>
            <p className="mb-4 text-base lg:text-lg text-gray-300">
              It's an experiment in leveraging AI for developer productivity,
              using the same curiosity and automation mindset I apply to backend
              systems and my Home Assistant lab.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              to="/experience"
              className="rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/50"
            >
              Professional Experience
            </Link>
            <Link
              to="/projects"
              className="rounded-lg border border-gray-700 px-6 py-3 text-center font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-gray-800 hover:shadow-lg"
            >
              Personal Projects
            </Link>
            <Link
              to="/contact"
              className="rounded-lg border border-gray-700 px-6 py-3 text-center font-semibold text-white transition-all duration-200 hover:scale-105 hover:bg-gray-800 hover:shadow-lg"
            >
              Contact Me
            </Link>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-white lg:text-3xl">
            Featured Personal Projects
          </h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                className="group rounded-lg border border-gray-700 bg-card p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800 hover:shadow-lg flex flex-col"
              >
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {project.title}
                </h3>
                <p className="mb-4 text-gray-400">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.technologies.slice(0, 3).map((tech) => {
                    const displayTech = tech === 'SkyConnect Coordinator' ? 'IoT Automation' : tech
                    return (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-2 rounded bg-gray-800 px-2 py-1 text-xs text-gray-300"
                      >
                        <span className="flex-shrink-0">
                          <TechIcon tech={displayTech} className="w-6 h-6" />
                        </span>
                        <span className="leading-none">{displayTech}</span>
                      </span>
                    )
                  })}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
