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
        <div className="mb-10 max-w-3xl">
          <p className="text-base text-gray-300 md:text-lg">
            A selection of projects that reflect how I learn, what I enjoy
            building, and the kinds of systems I like to own end to end.
          </p>
        </div>
        <div className="space-y-6">
          {projects.map((project) => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              className="group block rounded-lg border border-gray-700 bg-card p-6 transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800 hover:shadow-lg"
            >
              <div className="flex-1">
                <h2 className="mb-2 text-xl font-bold text-white md:text-2xl">
                  {project.title}
                </h2>
                <p className="mb-3 text-gray-400">{project.description}</p>
                <div className="mb-4 flex items-center gap-4 text-sm text-gray-400">
                  <time>
                    {new Date(project.startDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                    {project.endDate
                      ? ` - ${new Date(project.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}`
                      : ' - Present'}
                  </time>
                  {project.links?.github && (
                    <>
                      <span>•</span>
                      <span>Open Source</span>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.slice(0, 3).map((tech) => {
                    const displayTech =
                      tech === 'SkyConnect Coordinator'
                        ? 'IoT Automation'
                        : tech
                    return (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-2 rounded bg-gray-800 px-2 py-1 text-xs text-gray-300"
                      >
                        <span className="flex-shrink-0">
                          <TechIcon tech={displayTech} className="w-5 h-5" />
                        </span>
                        <span className="leading-normal">{displayTech}</span>
                      </span>
                    )
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
