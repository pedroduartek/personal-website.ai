import { Link } from 'react-router-dom'
import TechIcon from '../../components/TechIcon'
import PageSEO from '../../components/seo/PageSEO'
import { projects } from '../../content/projects'

export default function ProjectsPage() {
  return (
    <>
      <PageSEO
        title="Projects"
        description="Portfolio of software projects and side projects"
        image="/src/images/pld_logo_header.png"
        url={
          typeof window !== 'undefined'
            ? window.location.href
            : 'https://www.pedroduartek.com/projects'
        }
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <h1 className="mb-8 text-3xl font-bold text-white md:text-4xl">
          Projects
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              className="group rounded-lg border border-gray-700 bg-card p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800 hover:shadow-lg flex flex-col"
            >
              <h2 className="mb-2 text-xl font-semibold text-white">
                {project.title}
              </h2>
              <p className="mb-4 text-gray-400">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.technologies.slice(0, 3).map((tech) => {
                  const displayTech =
                    tech === 'SkyConnect Coordinator' ? 'IoT Automation' : tech
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
      </div>
    </>
  )
}
