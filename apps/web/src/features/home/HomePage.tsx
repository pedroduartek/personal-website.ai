import { Link } from 'react-router-dom'
import PageSEO from '../../components/seo/PageSEO'
import { profile } from '../../content/profile'
import { projects } from '../../content/projects'

export default function HomePage() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3)

  return (
    <>
      <PageSEO
        title="Home"
        description={`${profile.name} - ${profile.role}. ${profile.bio}`}
      />
      <div className="container mx-auto px-4 py-8 md:py-16 animate-slide-down">
        <section className="mb-12 md:mb-16">
          <h1 className="mb-4 text-3xl md:text-5xl font-bold text-white">
            {profile.name}
          </h1>
          <p className="mb-4 text-xl md:text-2xl text-gray-300">
            {profile.role}
          </p>
          <div className="mb-8 max-w-3xl">
            <p className="mb-4 text-base md:text-lg text-gray-300">
              Welcome! I'm a backend software engineer with 6 years of
              experience in C#/.NET, microservices, and event-driven systems.
            </p>
            <p className="mb-4 text-base md:text-lg text-gray-300">
              This website itself is a learning project. As someone who knows
              close to nothing about frontend development, I'm using AI-assisted
              tools to build this site and learn React, TypeScript, and modern
              frontend practices along the way. You can find more details about
              this project in the Personal Projects section.
            </p>
            <p className="mb-4 text-base md:text-lg text-gray-300">
              It's an experiment in leveraging AI for developer
              productivity—using the same curiosity and automation mindset I
              apply to backend systems and my Home Assistant lab.
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
          <h2 className="mb-6 text-2xl font-bold text-white md:text-3xl">
            Featured Personal Projects
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                className="group rounded-lg border border-gray-700 bg-card p-6 transition-all duration-300 hover:scale-[1.02] hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {project.title}
                </h3>
                <p className="mb-4 text-gray-400">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
