import { Link } from 'react-router-dom'
import PageSEO from '../../components/seo/PageSEO'
import { projects } from '../../content/projects'

export default function ProjectsPage() {
  return (
    <>
      <PageSEO
        title="Projects"
        description="Portfolio of software projects and side projects"
      />
      <div className="container mx-auto px-4 py-8 animate-slide-down md:py-16">
        <h1 className="mb-8 text-3xl font-bold text-white md:text-4xl">Projects</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              to={`/projects/${project.slug}`}
              className="group rounded-lg border border-gray-700 bg-card p-6 transition-all duration-300 hover:scale-[1.02] hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10"
            >
              {project.featured && (
                <span className="mb-2 inline-block rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                  Featured
                </span>
              )}
              <h2 className="mb-2 text-xl font-semibold text-white">
                {project.title}
              </h2>
              <p className="mb-4 text-gray-400">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 4).map((tech) => (
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
      </div>
    </>
  )
}
